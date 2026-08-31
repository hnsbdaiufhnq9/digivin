-- Digivin: esquema inicial
-- Ejecutar con: supabase db push (o aplicar en el SQL Editor de Supabase)

-- ─── Extensiones ───────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Enums ───────────────────────────────────────────────────────────────────
CREATE TYPE streaming_provider AS ENUM ('spotify', 'apple_music');
CREATE TYPE verification_source AS ENUM ('qobuz', 'bandcamp', 'download_code');
CREATE TYPE vinyl_rarity AS ENUM ('common', 'rare', 'legendary');
CREATE TYPE vinyl_finish AS ENUM (
  'standard_black',
  'translucent',
  'marble',
  'gold',
  'splatter'
);
CREATE TYPE pack_type AS ENUM ('standard', 'premium', 'artist');

-- ─── Perfiles (extiende auth.users) ──────────────────────────────────────────
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Conexiones de streaming ─────────────────────────────────────────────────
CREATE TABLE public.streaming_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider streaming_provider NOT NULL,
  provider_user_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  scopes TEXT[] DEFAULT '{}',
  connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, provider)
);

-- ─── Catálogo maestro de álbumes ───────────────────────────────────────────────
CREATE TABLE public.albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  release_year INT,
  cover_url TEXT,
  spotify_album_id TEXT UNIQUE,
  apple_music_album_id TEXT UNIQUE,
  isrc TEXT,
  upc TEXT,
  genre TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_albums_spotify ON public.albums(spotify_album_id);
CREATE INDEX idx_albums_apple ON public.albums(apple_music_album_id);

-- ─── Biblioteca de streaming del usuario ─────────────────────────────────────
CREATE TABLE public.streaming_library_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  album_id UUID NOT NULL REFERENCES public.albums(id) ON DELETE CASCADE,
  provider streaming_provider NOT NULL,
  provider_item_id TEXT NOT NULL,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, provider, provider_item_id)
);

-- ─── Verificaciones de compra / propiedad ────────────────────────────────────
CREATE TABLE public.purchase_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  album_id UUID NOT NULL REFERENCES public.albums(id) ON DELETE CASCADE,
  source verification_source NOT NULL,
  external_transaction_id TEXT NOT NULL,
  verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  UNIQUE (source, external_transaction_id)
);

-- ─── Códigos de descarga únicos ──────────────────────────────────────────────
CREATE TABLE public.download_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  album_id UUID NOT NULL REFERENCES public.albums(id) ON DELETE CASCADE,
  rarity_boost vinyl_rarity DEFAULT 'rare',
  redeemed_by UUID REFERENCES public.profiles(id),
  redeemed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Colección de vinilos del usuario ────────────────────────────────────────
CREATE TABLE public.user_vinyls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  album_id UUID NOT NULL REFERENCES public.albums(id) ON DELETE CASCADE,
  rarity vinyl_rarity NOT NULL DEFAULT 'common',
  finish vinyl_finish NOT NULL DEFAULT 'standard_black',
  -- Origen del desbloqueo
  unlocked_via TEXT NOT NULL CHECK (unlocked_via IN ('streaming', 'purchase', 'pack', 'code')),
  streaming_item_id UUID REFERENCES public.streaming_library_items(id),
  verification_id UUID REFERENCES public.purchase_verifications(id),
  pack_open_id UUID,
  acquired_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, album_id)
);

CREATE INDEX idx_user_vinyls_user ON public.user_vinyls(user_id);
CREATE INDEX idx_user_vinyls_rarity ON public.user_vinyls(rarity);

-- ─── Sobres / packs ──────────────────────────────────────────────────────────
CREATE TABLE public.packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  pack_type pack_type NOT NULL DEFAULT 'standard',
  cover_art_url TEXT,
  price_credits INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.pack_pool (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id UUID NOT NULL REFERENCES public.packs(id) ON DELETE CASCADE,
  album_id UUID NOT NULL REFERENCES public.albums(id) ON DELETE CASCADE,
  weight INT NOT NULL DEFAULT 100,
  guaranteed_rarity vinyl_rarity,
  UNIQUE (pack_id, album_id)
);

CREATE TABLE public.pack_opens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pack_id UUID NOT NULL REFERENCES public.packs(id),
  user_vinyl_id UUID REFERENCES public.user_vinyls(id),
  opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_vinyls
  ADD CONSTRAINT fk_user_vinyls_pack_open
  FOREIGN KEY (pack_open_id) REFERENCES public.pack_opens(id);

-- ─── Créditos del usuario (moneda in-app) ────────────────────────────────────
CREATE TABLE public.user_credits (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  balance INT NOT NULL DEFAULT 0 CHECK (balance >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Trigger: crear perfil al registrarse ────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO public.user_credits (user_id, balance) VALUES (NEW.id, 3);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Función: calcular rareza y acabado ──────────────────────────────────────
CREATE OR REPLACE FUNCTION public.compute_vinyl_rarity(
  p_has_streaming BOOLEAN,
  p_has_verified_purchase BOOLEAN,
  p_is_limited_edition BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (rarity vinyl_rarity, finish vinyl_finish) AS $$
BEGIN
  IF p_has_verified_purchase THEN
    IF p_is_limited_edition THEN
      RETURN QUERY SELECT 'legendary'::vinyl_rarity,
        (ARRAY['translucent','marble','gold','splatter'])[floor(random()*4)+1]::vinyl_finish;
    ELSE
      RETURN QUERY SELECT 'rare'::vinyl_rarity,
        (ARRAY['translucent','marble','gold'])[floor(random()*3)+1]::vinyl_finish;
    END IF;
  ELSIF p_has_streaming THEN
    RETURN QUERY SELECT 'common'::vinyl_rarity, 'standard_black'::vinyl_finish;
  ELSE
    RETURN QUERY SELECT 'common'::vinyl_rarity, 'standard_black'::vinyl_finish;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ─── Row Level Security ──────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaming_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaming_library_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_vinyls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pack_opens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Perfiles visibles públicamente" ON public.profiles
  FOR SELECT USING (true);
CREATE POLICY "Usuarios editan su perfil" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Usuarios ven sus conexiones" ON public.streaming_connections
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Usuarios ven su biblioteca streaming" ON public.streaming_library_items
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Usuarios ven sus verificaciones" ON public.purchase_verifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios ven su colección" ON public.user_vinyls
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Usuarios ven sus aperturas" ON public.pack_opens
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Usuarios ven sus créditos" ON public.user_credits
  FOR SELECT USING (auth.uid() = user_id);

-- Catálogo y packs son públicos (solo lectura)
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pack_pool ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Álbumes públicos" ON public.albums FOR SELECT USING (true);
CREATE POLICY "Packs públicos" ON public.packs FOR SELECT USING (is_active = true);
CREATE POLICY "Pool de packs público" ON public.pack_pool FOR SELECT USING (true);

-- ─── Datos semilla: pack inicial ─────────────────────────────────────────────
INSERT INTO public.packs (name, description, pack_type, price_credits)
VALUES (
  'Crate Dig Vol. 1',
  'Un sobre misterioso con vinilos de descubrimiento. Conecta tu streaming para mejores odds.',
  'standard',
  1
);
