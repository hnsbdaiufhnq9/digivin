/**
 * Script para verificar la configuración de Spotify
 * Ejecutar con: node check-spotify-config.js
 */

require('dotenv').config({ path: '.env.local' });

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

console.log('=== Verificación de configuración de Spotify ===\n');

if (!SPOTIFY_CLIENT_ID) {
  console.error('❌ SPOTIFY_CLIENT_ID no está configurado');
  process.exit(1);
}

if (!SPOTIFY_CLIENT_SECRET) {
  console.error('❌ SPOTIFY_CLIENT_SECRET no está configurado');
  process.exit(1);
}

if (!SPOTIFY_REDIRECT_URI) {
  console.error('❌ SPOTIFY_REDIRECT_URI no está configurado');
  process.exit(1);
}

console.log('✅ SPOTIFY_CLIENT_ID:', SPOTIFY_CLIENT_ID.substring(0, 10) + '...');
console.log('✅ SPOTIFY_CLIENT_SECRET:', SPOTIFY_CLIENT_SECRET.substring(0, 10) + '...');
console.log('✅ SPOTIFY_REDIRECT_URI:', SPOTIFY_REDIRECT_URI);

// Verificar formato del redirect URI
if (!SPOTIFY_REDIRECT_URI.includes('127.0.0.1')) {
  console.warn('⚠️  ADVERTENCIA: SPOTIFY_REDIRECT_URI debería usar 127.0.0.1, no localhost');
}

console.log('\n=== Instrucciones para solucionar el error 403 ===');
console.log('1. Ve a https://developer.spotify.com/dashboard');
console.log('2. Selecciona tu aplicación');
console.log('3. En "Redirect URIs", asegúrate de tener:', SPOTIFY_REDIRECT_URI);
console.log('4. Verifica que la app tenga el tier "Web Playback" o superior');
console.log('5. Los scopes solicitados incluyen user-library-modify');
console.log('6. Si el problema persiste, elimina la app y crea una nueva con el tier correcto');
console.log('\nEl error 403 suele ocurrir porque la app no tiene permisos para modificar bibliotecas.');
