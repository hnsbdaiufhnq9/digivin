import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  verifyBandcampPurchase,
  verifyQobuzPurchase,
} from "@/lib/verification";
import { computeVinylRarity, shouldUpgradeRarity } from "@/lib/rarity/compute-rarity";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { source, token, albumUrl, albumId } = body;

  let result = null;

  switch (source) {
    case "qobuz":
      result = await verifyQobuzPurchase(user.id, token);
      break;
    case "bandcamp":
      result = await verifyBandcampPurchase(token, albumUrl);
      break;
    case "download_code":
      // Validación en DB
      const { data: codeRow } = await supabase
        .from("download_codes")
        .select("*")
        .eq("code", token)
        .is("redeemed_by", null)
        .single();

      if (!codeRow) {
        return NextResponse.json({ error: "Invalid code" }, { status: 400 });
      }

      await supabase
        .from("download_codes")
        .update({ redeemed_by: user.id, redeemed_at: new Date().toISOString() })
        .eq("id", codeRow.id);

      result = {
        valid: true,
        albumExternalId: codeRow.album_id,
        transactionId: `code_${codeRow.code}`,
        source: "download_code" as const,
        isLimitedEdition: codeRow.rarity_boost === "legendary",
      };
      break;
    default:
      return NextResponse.json({ error: "Unknown source" }, { status: 400 });
  }

  if (!result?.valid) {
    return NextResponse.json({ error: "Verification failed" }, { status: 422 });
  }

  const targetAlbumId = albumId ?? result.albumExternalId;

  const { data: verification } = await supabase
    .from("purchase_verifications")
    .insert({
      user_id: user.id,
      album_id: targetAlbumId,
      source: result.source,
      external_transaction_id: result.transactionId,
      metadata: result.metadata ?? {},
    })
    .select()
    .single();

  const { rarity, finish } = computeVinylRarity({
    hasStreaming: true,
    hasVerifiedPurchase: true,
    isLimitedEdition: result.isLimitedEdition,
  });

  const { data: existing } = await supabase
    .from("user_vinyls")
    .select("*")
    .eq("user_id", user.id)
    .eq("album_id", targetAlbumId)
    .single();

  if (existing && !shouldUpgradeRarity(existing.rarity, rarity)) {
    return NextResponse.json({ vinyl: existing, upgraded: false });
  }

  const { data: vinyl } = await supabase
    .from("user_vinyls")
    .upsert({
      user_id: user.id,
      album_id: targetAlbumId,
      rarity,
      finish,
      unlocked_via: "purchase",
      verification_id: verification?.id,
    })
    .select("*, album:albums(*)")
    .single();

  return NextResponse.json({ vinyl, upgraded: true });
}
