import type { Metadata, Viewport } from "next";
import { BottomNav } from "@/components/layout/BottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digivin — Colección de Vinilos Digitales",
  description:
    "Colecciona vinilos digitales. Conecta tu streaming, verifica tus compras y abre sobres sorpresa.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="pb-20">
        <main className="mx-auto min-h-dvh max-w-lg px-4 pt-safe">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
