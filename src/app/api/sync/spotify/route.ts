import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSpotifySavedAlbums } from "@/lib/spotify/client";
import { computeVinylRarity } from "@/lib/rarity/compute-rarity";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: connection } = await supabase
    .from("streaming_connections")
    .select("*")
    .eq("user_id", user.id)
    .eq("provider", "spotify")
    .single();

  if (!connection) {
    return NextResponse.json({ error: "Spotify not connected" }, { status: 400 });
  }

  const library = await getSpotifySavedAlbums(connection.access_token);
  let synced = 0;

  for (const item of library.items ?? []) {
    const spotifyAlbum = item.album;
    const { data: album } = await supabase
      .from("albums")
      .upsert(
        {
          title: spotifyAlbum.name,
          artist_name: spotifyAlbum.artists[0]?.name ?? "Unknown",
          cover_url: spotifyAlbum.images[0]?.url,
          spotify_album_id: spotifyAlbum.id,
          release_year: parseInt(spotifyAlbum.release_date?.slice(0, 4) ?? "0") || null,
        },
        { onConflict: "spotify_album_id" }
      )
      .select()
      .single();

    if (!album) continue;

    await supabase.from("streaming_library_items").upsert({
      user_id: user.id,
      album_id: album.id,
      provider: "spotify",
      provider_item_id: spotifyAlbum.id,
    });

    const { rarity, finish } = computeVinylRarity({ hasStreaming: true, hasVerifiedPurchase: false });

    await supabase.from("user_vinyls").upsert(
      {
        user_id: user.id,
        album_id: album.id,
        rarity,
        finish,
        unlocked_via: "streaming",
      },
      { onConflict: "user_id,album_id", ignoreDuplicates: false }
    );

    synced++;
  }

  return NextResponse.json({ synced });
}
