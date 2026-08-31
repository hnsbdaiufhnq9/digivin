import { NextResponse } from "next/server";

export async function GET() {
  // MusicKit JS inicia OAuth en cliente; este endpoint recibe el user token
  return NextResponse.redirect(
    new URL("/connect?info=apple_music_client_flow", process.env.NEXT_PUBLIC_APP_URL!)
  );
}
