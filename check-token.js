const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");
for (const l of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const i = l.indexOf("=");
  if (i > 0) process.env[l.slice(0, i).trim()] = l.slice(i + 1).trim();
}
const c = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const REAL_ALBUM = "2QVvlMjlbV445e9a5y2obD"; // pa ti toa <3
const SAVED_ALBUM = "0114ZglPWBvLZwdNxuByrJ"; // NAVE DRAGÓN (ya en su librería)

(async () => {
  const r = await c
    .from("streaming_connections")
    .select("access_token")
    .eq("provider", "spotify")
    .single();
  const t = r.data?.access_token;
  if (!t) return console.log("NO ROW");
  const H = { Authorization: `Bearer ${t}` };
  const show = (lbl, res, body) =>
    console.log(lbl, "->", res.status, (body || "").slice(0, 90));

  let res, body;
  res = await fetch("https://api.spotify.com/v1/me/albums?limit=1", { headers: H });
  show("GET list", res);

  res = await fetch(`https://api.spotify.com/v1/me/albums/contains?ids=${REAL_ALBUM}`, { headers: H });
  show("GET contains (pa ti toa)", res, await res.text());

  res = await fetch(`https://api.spotify.com/v1/me/albums/contains?ids=${SAVED_ALBUM}`, { headers: H });
  show("GET contains (NAVE DRAGON)", res, await res.text());

  res = await fetch(`https://api.spotify.com/v1/me/albums?ids=${SAVED_ALBUM}`, { headers: H });
  show("GET several albums (metadata)", res, await res.text());

  res = await fetch(`https://api.spotify.com/v1/me/albums?ids=${SAVED_ALBUM}`, {
    method: "PUT", headers: H,
  });
  body = await res.text();
  show("PUT save (NAVE DRAGON)", res, body);

  res = await fetch(`https://api.spotify.com/v1/me/tracks?ids=${REAL_ALBUM}`, {
    method: "PUT", headers: { ...H, "Content-Type": "application/json" },
    body: JSON.stringify({ ids: [REAL_ALBUM] }),
  });
  show("PUT track (bogus id as track)", res, await res.text());

  // ¿El token puede escribir NADA? Prueba borrar un álbum guardado y re-guardarlo.
  res = await fetch(`https://api.spotify.com/v1/me/albums?ids=${SAVED_ALBUM}`, {
    method: "DELETE", headers: H,
  });
  body = await res.text();
  show("DELETE album (NAVE DRAGON)", res, body);
  if (res.status === 200 || res.status === 204) {
    // restaurar
    await fetch(`https://api.spotify.com/v1/me/albums?ids=${SAVED_ALBUM}`, {
      method: "PUT", headers: H,
    });
    console.log("(restored try PUT after DELETE)");
  }
})();