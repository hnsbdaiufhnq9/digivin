"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Inicio", icon: "🏠" },
  { href: "/collection", label: "Colección", icon: "💿" },
  { href: "/packs", label: "Sobres", icon: "📦" },
  { href: "/connect", label: "Conectar", icon: "🔗" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-crate-border bg-crate-bg/90 backdrop-blur-lg">
      <ul className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-xs transition",
                  active
                    ? "text-crate-accent"
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <span className="text-lg" aria-hidden>
                  {icon}
                </span>
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
