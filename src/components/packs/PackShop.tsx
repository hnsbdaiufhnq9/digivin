"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { AlbumPickerModal } from "./AlbumPickerModal";
import type { Album } from "@/types/vinyl";

const PACKS = [
  {
    id: "standard" as const,
    name: "Pack Estandar",
    price: 1,
    icon: "📦",
    color: "border-zinc-700 bg-zinc-900",
    accentColor: "bg-zinc-700",
    description: "Un vinilo negro para un album de tu biblioteca.",
    badge: null,
  },
  {
    id: "premium" as const,
    name: "Pack Premium",
    price: 3,
    icon: "🎁",
    color: "border-purple-700/50 bg-purple-950/30",
    accentColor: "bg-crate-accent",
    description: "Un vinilo negro de calidad coleccionista para el album que elijas.",
    badge: "Popular",
  },
  {
    id: "artist" as const,
    name: "Pack Artista",
    price: 5,
    icon: "⭐",
    color: "border-yellow-600/50 bg-yellow-950/20",
    accentColor: "bg-yellow-500",
    description: "Un vinilo negro edicion artista para el album que elijas. Edicion muy limitada.",
    badge: "Exclusivo",
  },
];

type PackId = "standard" | "premium" | "artist";

export function PackShop() {
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [pendingPack, setPendingPack] = useState<PackId | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ type: "ok" | "error"; message: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    
    // Obtener usuario actual
    supabase.auth.getUser().then(({ data }) => {
      console.log("[PackShop] Usuario actual:", data.user?.email || "no autenticado");
      setUser(data.user);
    });
    
    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("[PackShop] Cambio de auth:", session?.user?.email || "no autenticado");
      setUser(session?.user ?? null);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setCredits(null);
      return;
    }
    
    const supabase = createClient();
    (supabase as any)
      .from("user_credits")
      .select("balance")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data: c }: { data: { balance: number } | null }) => {
        setCredits(c?.balance ?? 0);
      });
  }, [user, result]);

  const handleBuy = (packId: PackId) => {
    setPendingPack(packId);
    setResult(null);
    setPickerOpen(true);
  };

  const handleAlbumPicked = async (album: Album) => {
    if (!pendingPack) return;
    setBusy(true);
    setResult(null);

    try {
      const res = await fetch("/api/packs/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId: pendingPack, albumId: album.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msgs: Record<string, string> = {
          insufficient_credits: `Creditos insuficientes. Tienes ${data.balance}, necesitas ${data.required}.`,
          album_not_found: "Album no encontrado en el catalogo.",
          auth_required: "Inicia sesion para comprar packs.",
        };
        setResult({ type: "error", message: msgs[data.error] ?? "Error al comprar el pack." });
      } else {
        // Guardar vinilo en sessionStorage para la animación
        if (data.vinyl) {
          sessionStorage.setItem("pendingVinyl", JSON.stringify(data.vinyl));
        }
        
        // Redirigir a la animación de apertura
        window.location.href = "/packs/opening";
        return; // No actualizar el estado local porque vamos a redirigir
      }
    } catch {
      setResult({ type: "error", message: "Error de red. Intentalo de nuevo." });
    }

    setBusy(false);
    setPendingPack(null);
  };

  return (
    <>
      {/* Alerta de autenticación */}
      {!user && (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
          <p className="font-semibold">Inicia sesión para comprar packs</p>
          <p className="text-xs text-yellow-400/80 mt-1">Necesitas una cuenta para gestionar créditos y colección.</p>
        </div>
      )}

      {/* Creditos */}
      <div className="flex items-center justify-between rounded-xl border border-crate-border bg-crate-surface px-4 py-3">
        <span className="text-sm text-zinc-400">Tus creditos</span>
        <span className="text-lg font-bold text-zinc-100">
          {credits === null ? "..." : credits === -1 ? "∞" : credits} crds
        </span>
      </div>

      {/* Alerta de resultado */}
      {result && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            result.type === "ok"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {result.message}
        </div>
      )}

      {/* Lista de packs */}
      <div className="space-y-4">
        {PACKS.map((pack) => (
          <div
            key={pack.id}
            className={`relative rounded-2xl border p-5 ${pack.color}`}
          >
            {pack.badge && (
              <span className="absolute right-4 top-4 rounded-full bg-crate-accent px-2.5 py-0.5 text-[10px] font-semibold text-white">
                {pack.badge}
              </span>
            )}

            <div className="mb-3 flex items-center gap-3">
              <span className="text-3xl">{pack.icon}</span>
              <div>
                <h3 className="font-semibold text-zinc-100">{pack.name}</h3>
                <p className="text-xs text-zinc-500">{pack.description}</p>
              </div>
            </div>

            {/* Vinilo preview */}
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-950 ring-2 ring-zinc-800 shadow-inner">
                <div className="h-4 w-4 rounded-full bg-zinc-800 ring-1 ring-zinc-700" />
              </div>
              <div className="text-xs text-zinc-500">
                <p>1x vinilo negro</p>
                <p>El album que elijas de tu biblioteca</p>
              </div>
            </div>

            <button
              disabled={busy || !user || credits === null || (credits !== -1 && credits < pack.price)}
              onClick={() => {
                if (!user) {
                  window.location.href = '/login';
                  return;
                }
                handleBuy(pack.id);
              }}
              className={`w-full rounded-xl py-2.5 text-sm font-semibold text-white transition
                ${busy || !user || credits === null || (credits !== -1 && credits < pack.price)
                  ? "opacity-40 cursor-not-allowed bg-zinc-700"
                  : `${pack.accentColor} hover:opacity-90`
                }`}
            >
              {!user
                ? "Inicia sesión"
                : busy && pendingPack === pack.id
                  ? "Comprando..."
                  : `Comprar por ${pack.price} crd${pack.price > 1 ? "s" : ""}`}
            </button>
          </div>
        ))}
      </div>

      <AlbumPickerModal
        open={pickerOpen}
        onClose={() => { setPickerOpen(false); setPendingPack(null); }}
        onPick={handleAlbumPicked}
      />
    </>
  );
}
