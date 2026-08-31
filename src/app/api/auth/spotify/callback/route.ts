import { NextRequest, NextResponse } from "next/server";
import { exchangeSpotifyCode } from "@/lib/spotify/client";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const storedState = request.cookies.get("spotify_oauth_state")?.value;

  if (!code || !state || state !== storedState) {
    return NextResponse.redirect(
      new URL("/connect?error=spotify_auth_failed", request.url)
    );
  }

  try {
    const tokens = await exchangeSpotifyCode(code);
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("streaming_connections").upsert({
        user_id: user.id,
        provider: "spotify",
        provider_user_id: user.id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: new Date(
          Date.now() + tokens.expires_in * 1000
        ).toISOString(),
      });
    }

    return NextResponse.redirect(new URL("/connect?connected=spotify", request.url));
  } catch {
    return NextResponse.redirect(
      new URL("/connect?error=spotify_token_failed", request.url)
    );
  }
}
