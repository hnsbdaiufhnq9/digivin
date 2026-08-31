import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { VinylShelf } from "@/components/collection/VinylShelf";
import { StreamingConnect } from "@/components/auth/StreamingConnect";
import type { UserVinyl } from "@/types/vinyl";

// Datos demo hasta conectar Supabase
const DEMO_VINYLS: UserVinyl[] = [
  {
    id: "1",
    user_id: "demo",
    album_id: "a1",
    rarity: "common",
    finish: "standard_black",
    unlocked_via: "streaming",
    acquired_at: new Date().toISOString(),
    album: {
      id: "a1",
      title: "Random Access Memories",
      artist_name: "Daft Punk",
      release_year: 2013,
      cover_url: "https://i.scdn.co/image/ab67616d0000b273ec063ec225471ef777279209",
      spotify_album_id: null,
      apple_music_album_id: null,
      genre: "Electronic",
    },
  },
  {
    id: "2",
    user_id: "demo",
    album_id: "a2",
    rarity: "rare",
    finish: "translucent",
    unlocked_via: "purchase",
    acquired_at: new Date().toISOString(),
    album: {
      id: "a2",
      title: "Blonde",
      artist_name: "Frank Ocean",
      release_year: 2016,
      cover_url: "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526",
      spotify_album_id: null,
      apple_music_album_id: null,
      genre: "R&B",
    },
  },
  {
    id: "3",
    user_id: "demo",
    album_id: "a3",
    rarity: "legendary",
    finish: "gold",
    unlocked_via: "purchase",
    acquired_at: new Date().toISOString(),
    album: {
      id: "a3",
      title: "To Pimp a Butterfly",
      artist_name: "Kendrick Lamar",
      release_year: 2015,
      cover_url: "https://i.scdn.co/image/ab67616d0000b2738b52f5f9a8e56396c4b2b0c",
      spotify_album_id: null,
      apple_music_album_id: null,
      genre: "Hip-Hop",
    },
  },
];

export default function HomePage() {
  return (
    <div className="space-y-8 py-6">
      <Header
        title="Digivin"
        subtitle="Tu estantería analógica digital"
      />

      <StreamingConnect />

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-display text-lg font-semibold tracking-wide text-zinc-200">
            Mi Colección
          </h2>
          <Link
            href="/collection"
            className="text-sm text-crate-accent hover:underline"
          >
            Ver todo
          </Link>
        </div>
        <VinylShelf vinyls={DEMO_VINYLS} />
      </section>

      <section className="rounded-2xl border border-crate-border bg-crate-surface p-5 shelf-glow">
        <h2 className="text-display mb-2 text-lg font-semibold">Crate Dig</h2>
        <p className="mb-4 text-sm text-zinc-400">
          Abre un sobre misterioso y descubre vinilos nuevos. Conecta tu
          streaming para desbloquear ediciones especiales.
        </p>
        <Link
          href="/packs"
          className="inline-flex w-full items-center justify-center rounded-xl bg-crate-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-600"
        >
          Abrir un sobre
        </Link>
      </section>
    </div>
  );
}
