# Configuración de Google OAuth para Digivin

## Estado Actual
✅ **Google OAuth ya está implementado en el código**
- El botón "Continuar con Google" ya existe en la página de login
- El flujo de autenticación está configurado en `src/app/auth/callback/route.ts`
- Supabase maneja la autenticación de Google nativamente

## Pasos para Activar Google OAuth

### 1. Configurar Google Console
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a "APIs & Services" > "Credentials"
4. Crea credenciales OAuth 2.0:
   - **Application type**: Web application
   - **Name**: Digivin
   - **Authorized redirect URIs**: 
     ```
     https://TU_PROJECT_ID.supabase.co/auth/v1/callback
     ```
5. Copia el **Client ID** y **Client Secret**

### 2. Configurar en Supabase
1. Ve a tu [Dashboard de Supabase](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Authentication** > **Providers**
4. Habilita **Google**
5. Pega el **Client ID** y **Client Secret** de Google Console
6. Guarda los cambios

### 3. Probar la configuración
1. Ve a `http://127.0.0.1:3000/login`
2. Haz clic en "Continuar con Google"
3. Debería redirigirte a Google para autenticarte
4. Después de autenticarte, volverás a la aplicación

## Notas Importantes
- No necesitas variables de entorno adicionales para Google OAuth
- Supabase maneja toda la configuración OAuth
- El redirect URI debe coincidir exactamente entre Google Console y Supabase
- Google OAuth está preconfigurado para dar admin a `arnauvqv@gmail.com` según el trigger en la base de datos

## Solución de Problemas
- **Error de redirect URI**: Verifica que coincida exactamente en Google Console y Supabase
- **Error de credenciales**: Verifica que el Client ID y Secret sean correctos
- **Usuario no creado**: El trigger `handle_new_user` debería crear el perfil automáticamente
