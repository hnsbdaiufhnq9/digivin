import { SignJWT, importPKCS8 } from "jose";

const APPLE_MUSIC_API = "https://api.music.apple.com/v1";

async function createDeveloperToken(): Promise<string> {
  const privateKey = await importPKCS8(
    process.env.APPLE_MUSIC_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    "ES256"
  );

  return new SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: process.env.APPLE_MUSIC_KEY_ID })
    .setIssuer(process.env.APPLE_MUSIC_TEAM_ID!)
    .setIssuedAt()
    .setExpirationTime("180d")
    .sign(privateKey);
}

export async function getAppleMusicAuthUrl(state: string): Promise<string> {
  // MusicKit JS maneja OAuth en cliente; esta URL es para redirect post-auth
  const params = new URLSearchParams({ state });
  return `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/apple-music/callback?${params}`;
}

export async function getAppleMusicLibraryAlbums(
  userToken: string,
  limit = 50
) {
  const devToken = await createDeveloperToken();
  const res = await fetch(
    `${APPLE_MUSIC_API}/me/library/albums?limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${devToken}`,
        "Music-User-Token": userToken,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch Apple Music library");
  return res.json();
}

export async function checkAppleMusicAlbumInLibrary(
  userToken: string,
  catalogAlbumId: string
): Promise<boolean> {
  const devToken = await createDeveloperToken();
  const res = await fetch(
    `${APPLE_MUSIC_API}/me/library/albums/${catalogAlbumId}`,
    {
      headers: {
        Authorization: `Bearer ${devToken}`,
        "Music-User-Token": userToken,
      },
    }
  );
  return res.ok;
}
