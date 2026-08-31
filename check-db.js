const fs = require('fs');
for (const l of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const i = l.indexOf('=');
  if (i > 0) process.env[l.slice(0, i).trim()] = l.slice(i + 1).trim();
}
const { createClient } = require('@supabase/supabase-js');
const c = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
(async () => {
  const a = await c.from('albums').select('id,title,artist_name,spotify_album_id,release_year');
  console.log('albums:', JSON.stringify(a.data, null, 1), a.error?.message ?? '');
  const v = await c.from('user_vinyls').select('*, album:albums(title,artist_name)').limit(10);
  console.log('user_vinyls:', JSON.stringify(v.data, null, 1), v.error?.message ?? '');
})();