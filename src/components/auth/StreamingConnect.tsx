"use client";

import { cn } from "@/lib/utils";

interface StreamingConnectProps {
  expanded?: boolean;
}

const PROVIDERS = [
  {
    id: "spotify",
    name: "Spotify",
    description: "Sincroniza álbumes guardados → vinilos Comunes",
    color: "bg-[#1DB954]",
    authPath: "/api/auth/spotify",
  },
  {
    id: "apple_music",
    name: "Apple Music",
    description: "Sincroniza tu biblioteca → vinilos Comunes",
    color: "bg-gradient-to-r from-[#FA233B] to-[#FB5C74]",
    authPath: "/api/auth/apple-music",
  },
] as const;

const VERIFICATION = [
  {
    id: "qobuz",
    name: "Qobuz",
    description: "Compras Hi-Res verificadas → Rara / Legendaria",
  },
  {
    id: "bandcamp",
    name: "Bandcamp",
    description: "Colección digital verificada → Rara / Legendaria",
  },
  {
    id: "code",
    name: "Código de descarga",
    description: "Canjea códigos únicos de artistas y sellos",
  },
] as const;

export function StreamingConnect({ expanded = false }: StreamingConnectProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Bibliotecas de streaming
        </h3>
        {PROVIDERS.map((p) => (
          <a
            key={p.id}
            href={p.authPath}
            className="flex items-center gap-3 rounded-xl border border-crate-border bg-crate-elevated p-4 transition hover:border-zinc-600"
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white",
                p.color
              )}
            >
              {p.name[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-zinc-200">{p.name}</p>
              <p className="text-xs text-zinc-500">{p.description}</p>
            </div>
            <span className="text-zinc-600">→</span>
          </a>
        ))}
      </div>

      {expanded && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Verificación de propiedad
          </h3>
          {VERIFICATION.map((v) => (
            <div
              key={v.id}
              className="rounded-xl border border-crate-border bg-crate-surface p-4"
            >
              <p className="font-medium text-zinc-200">{v.name}</p>
              <p className="text-xs text-zinc-500">{v.description}</p>
            </div>
          ))}

          <div className="rounded-xl border border-dashed border-crate-border p-4">
            <label className="mb-2 block text-xs font-medium text-zinc-400">
              Canjear código de descarga
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="DIGIVIN-XXXX-XXXX"
                className="flex-1 rounded-lg border border-crate-border bg-crate-bg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-crate-accent focus:outline-none"
              />
              <button
                type="button"
                className="rounded-lg bg-crate-elevated px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700"
              >
                Canjear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
