import type {
  Album,
  Pack,
  StreamingConnection,
  StreamingProvider,
  UnlockVia,
  UserVinyl,
  VerificationSource,
  VinylFinish,
  VinylRarity,
} from "./vinyl";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      albums: {
        Row: Album & { created_at: string; isrc: string | null; upc: string | null };
        Insert: Omit<Album, "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["albums"]["Insert"]>;
      };
      streaming_connections: {
        Row: StreamingConnection & {
          access_token: string;
          refresh_token: string | null;
          token_expires_at: string | null;
          scopes: string[];
          updated_at: string;
        };
        Insert: {
          user_id: string;
          provider: StreamingProvider;
          provider_user_id: string;
          access_token: string;
          refresh_token?: string | null;
          token_expires_at?: string | null;
          scopes?: string[];
        };
        Update: Partial<Database["public"]["Tables"]["streaming_connections"]["Insert"]>;
      };
      streaming_library_items: {
        Row: {
          id: string;
          user_id: string;
          album_id: string;
          provider: StreamingProvider;
          provider_item_id: string;
          saved_at: string;
          last_synced_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["streaming_library_items"]["Row"],
          "id" | "saved_at" | "last_synced_at"
        >;
        Update: Partial<Database["public"]["Tables"]["streaming_library_items"]["Insert"]>;
      };
      purchase_verifications: {
        Row: {
          id: string;
          user_id: string;
          album_id: string;
          source: VerificationSource;
          external_transaction_id: string;
          verified_at: string;
          metadata: Record<string, unknown>;
        };
        Insert: Omit<
          Database["public"]["Tables"]["purchase_verifications"]["Row"],
          "id" | "verified_at"
        >;
        Update: Partial<Database["public"]["Tables"]["purchase_verifications"]["Insert"]>;
      };
      user_vinyls: {
        Row: UserVinyl & {
          streaming_item_id: string | null;
          verification_id: string | null;
          pack_open_id: string | null;
        };
        Insert: {
          user_id: string;
          album_id: string;
          rarity?: VinylRarity;
          finish?: VinylFinish;
          unlocked_via: UnlockVia;
          streaming_item_id?: string | null;
          verification_id?: string | null;
          pack_open_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["user_vinyls"]["Insert"]>;
      };
      packs: {
        Row: Pack & { is_active: boolean; created_at: string };
        Insert: Omit<Pack, "id"> & { id?: string; is_active?: boolean };
        Update: Partial<Database["public"]["Tables"]["packs"]["Insert"]>;
      };
      pack_opens: {
        Row: {
          id: string;
          user_id: string;
          pack_id: string;
          user_vinyl_id: string | null;
          opened_at: string;
        };
        Insert: {
          user_id: string;
          pack_id: string;
          user_vinyl_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["pack_opens"]["Insert"]>;
      };
      user_credits: {
        Row: { user_id: string; balance: number; updated_at: string };
        Insert: { user_id: string; balance?: number };
        Update: { balance?: number };
      };
      download_codes: {
        Row: {
          id: string;
          code: string;
          album_id: string;
          rarity_boost: VinylRarity;
          redeemed_by: string | null;
          redeemed_at: string | null;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          code: string;
          album_id: string;
          rarity_boost?: VinylRarity;
          expires_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["download_codes"]["Insert"]>;
      };
    };
  };
}
