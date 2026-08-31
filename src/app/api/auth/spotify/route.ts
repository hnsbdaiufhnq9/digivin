import { NextResponse } from "next/server";
import { getSpotifyAuthUrl } from "@/lib/spotify/client";

export async function GET() {
  const state = crypto.randomUUID();
  const url = getSpotifyAuthUrl(state);
  const response = NextResponse.redirect(url);
  response.cookies.set("spotify_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
  });
  return response;
}
