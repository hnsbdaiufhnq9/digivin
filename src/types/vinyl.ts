export type StreamingProvider = "spotify" | "apple_music";
export type VerificationSource = "qobuz" | "bandcamp" | "download_code";
export type VinylRarity = "common" | "rare" | "legendary";
export type VinylFinish =
  | "standard_black"
  | "translucent"
  | "marble"
  | "gold"
  | "splatter";
export type PackType = "standard" | "premium" | "artist";
export type UnlockVia = "streaming" | "purchase" | "pack" | "code";

export interface Album {
  id: string;
  title: string;
  artist_name: string;
  release_year: number | null;
  cover_url: string | null;
  spotify_album_id: string | null;
  apple_music_album_id: string | null;
  genre: string | null;
}

export interface UserVinyl {
  id: string;
  user_id: string;
  album_id: string;
  rarity: VinylRarity;
  finish: VinylFinish;
  unlocked_via: UnlockVia;
  acquired_at: string;
  album?: Album;
}

export interface StreamingConnection {
  id: string;
  user_id: string;
  provider: StreamingProvider;
  provider_user_id: string;
  connected_at: string;
}

export interface Pack {
  id: string;
  name: string;
  description: string | null;
  pack_type: PackType;
  cover_art_url: string | null;
  price_credits: number;
}

export interface PackOpenResult {
  vinyl: UserVinyl;
  isNew: boolean;
  upgraded: boolean;
}

export interface RarityConfig {
  rarity: VinylRarity;
  finish: VinylFinish;
  label: string;
  glowClass: string;
}

export const RARITY_CONFIG: Record<VinylRarity, Omit<RarityConfig, "finish">> = {
  common: {
    rarity: "common",
    label: "Edición Estándar",
    glowClass: "shadow-none",
  },
  rare: {
    rarity: "rare",
    label: "Edición Coleccionista",
    glowClass: "shadow-[0_0_24px_rgba(168,85,247,0.5)]",
  },
  legendary: {
    rarity: "legendary",
    label: "Edición Limitada",
    glowClass: "shadow-[0_0_32px_rgba(250,204,21,0.6)]",
  },
};

export const FINISH_CONFIG: Record<
  VinylFinish,
  { label: string; gradient: string; ringColor: string }
> = {
  standard_black: {
    label: "Negro Estándar",
    gradient: "from-zinc-900 via-zinc-800 to-black",
    ringColor: "ring-zinc-700",
  },
  translucent: {
    label: "Translúcido",
    gradient: "from-violet-500/40 via-fuchsia-400/30 to-transparent",
    ringColor: "ring-violet-400/60",
  },
  marble: {
    label: "Marmoleado",
    gradient: "from-stone-300 via-zinc-500 to-stone-800",
    ringColor: "ring-stone-400",
  },
  gold: {
    label: "Dorado",
    gradient: "from-amber-300 via-yellow-500 to-amber-700",
    ringColor: "ring-yellow-400",
  },
  splatter: {
    label: "Splatter",
    gradient: "from-rose-500 via-fuchsia-600 to-indigo-900",
    ringColor: "ring-rose-400",
  },
};
