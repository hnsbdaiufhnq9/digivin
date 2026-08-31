import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { computeVinylRarity } from "@/lib/rarity/compute-rarity";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: credits } = await supabase
    .from("user_credits")
    .select("balance")
    .eq("user_id", user.id)
    .single();

  const { data: pack } = await supabase
    .from("packs")
    .select("*, pool:pack_pool(*, album:albums(*))")
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!pack || !credits || credits.balance < pack.price_credits) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 400 });
  }

  // Selección ponderada del pool
  const pool = pack.pool as Array<{ album_id: string; weight: number; album: unknown }>;
  const totalWeight = pool.reduce((sum, p) => sum + p.weight, 0);
  let roll = Math.random() * totalWeight;
  let selected = pool[0];

  for (const entry of pool) {
    roll -= entry.weight;
    if (roll <= 0) {
      selected = entry;
      break;
    }
  }

  const { data: packOpen } = await supabase
    .from("pack_opens")
    .insert({ user_id: user.id, pack_id: pack.id })
    .select()
    .single();

  const { rarity, finish } = computeVinylRarity({
    hasStreaming: true,
    hasVerifiedPurchase: false,
  });

  const { data: vinyl } = await supabase
    .from("user_vinyls")
    .upsert({
      user_id: user.id,
      album_id: selected.album_id,
      rarity,
      finish,
      unlocked_via: "pack",
      pack_open_id: packOpen?.id,
    })
    .select("*, album:albums(*)")
    .single();

  await supabase
    .from("user_credits")
    .update({ balance: credits.balance - pack.price_credits })
    .eq("user_id", user.id);

  await supabase
    .from("pack_opens")
    .update({ user_vinyl_id: vinyl?.id })
    .eq("id", packOpen?.id);

  return NextResponse.json({ vinyl, packOpen });
}
