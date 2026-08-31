import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "is1-ssl.mzstatic.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "f4.bcbits.com" },
      { protocol: "https", hostname: "*.scdn.co" },
      { protocol: "https", hostname: "*.mzstatic.com" },
      { protocol: "https", hostname: "*.bcbits.com" },
    ],
    // Fallback para permitir imágenes externas durante desarrollo
    unoptimized: false,
  },
  eslint: {
    // Ignorar errores de ESLint durante el build en producción
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignorar errores de TypeScript durante el build en producción
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
