import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function Header({ title, subtitle, className }: HeaderProps) {
  return (
    <header className={cn("space-y-1", className)}>
      <h1 className="text-display text-2xl font-bold tracking-tight text-white">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-zinc-400">{subtitle}</p>
      )}
    </header>
  );
}
