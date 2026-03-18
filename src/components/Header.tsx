"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-black text-sm">
            CS2
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-white font-bold text-sm tracking-wide">Nades</span>
            <span className="text-orange-400 font-black text-xs tracking-widest uppercase">Pro</span>
          </div>
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          <Link
            href="/"
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm transition-all",
              pathname === "/"
                ? "bg-orange-500/20 text-orange-400"
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            Mapas
          </Link>
          <Link
            href="/busca"
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm transition-all",
              pathname === "/busca"
                ? "bg-orange-500/20 text-orange-400"
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            Busca Global
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1 text-xs text-white/40 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            CS2 Sub-Tick
          </span>
        </div>
      </div>
    </header>
  );
}
