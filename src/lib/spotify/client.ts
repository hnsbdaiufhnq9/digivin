const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API = "https://api.spotify.com/v1";

const SCOPES = [
  "user-library-read",
  "user-read-email",
  "user-read-private",
].join(" ");

export function getSpotifyAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    response_type: "code",
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    scope: SCOPES,
    state,
  });
  return `${SPOTIFY_AUTH_URL}?${params}`;
}

export async function exchangeSpotifyCode(code: string) {
  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    }),
  });

  if (!res.ok) throw new Error("Spotify token exchange failed");
  return res.json() as Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }>;
}

export async function getSpotifySavedAlbums(accessToken: string, limit = 50) {
  const res = await fetch(
    `${SPOTIFY_API}/me/albums?limit=${limit}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) throw new Error("Failed to fetch Spotify library");
  return res.json();
}

export async function checkSpotifyAlbumSaved(
  accessToken: string,
  albumId: string
): Promise<boolean> {
  const res = await fetch(
    `${SPOTIFY_API}/me/albums/contains?ids=${albumId}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) return false;
  const data = (await res.json()) as boolean[];
  return data[0] ?? false;
}
