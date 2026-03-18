import { type ClassValue, clsx } from "clsx";
import { Nade, NadeType, FilterState } from "./types";
import nadesData from "@/data/nades.json";
import mapsData from "@/data/maps.json";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getAllNades(): Nade[] {
  return nadesData as Nade[];
}

export function getNadesByMap(mapId: string): Nade[] {
  return (nadesData as Nade[]).filter((n) => n.map === mapId);
}

export function getNadesByMapAndType(mapId: string, type: NadeType | "all"): Nade[] {
  const mapNades = getNadesByMap(mapId);
  if (type === "all") return mapNades;
  return mapNades.filter((n) => n.type === type);
}

export function filterNades(nades: Nade[], filters: FilterState): Nade[] {
  return nades.filter((nade) => {
    if (filters.type !== "all" && nade.type !== filters.type) return false;
    if (filters.side !== "all" && nade.side !== filters.side && nade.side !== "both") return false;
    if (filters.difficulty !== "all" && nade.difficulty !== filters.difficulty) return false;
    if (filters.tickrate !== "all" && nade.tickrate !== filters.tickrate && nade.tickrate !== "all") return false;
    if (filters.pro_only && !nade.pro_usage) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      return (
        nade.name.toLowerCase().includes(q) ||
        nade.description.toLowerCase().includes(q) ||
        nade.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });
}

export function getAllMaps() {
  return mapsData;
}

export function getMapById(id: string) {
  return mapsData.find((m) => m.id === id);
}

export function getNadeCountByType(mapId: string) {
  const nades = getNadesByMap(mapId);
  const counts: Record<string, number> = { smoke: 0, flash: 0, molotov: 0, he: 0 };
  nades.forEach((n) => { counts[n.type] = (counts[n.type] || 0) + 1; });
  return counts;
}

export const NADE_TYPE_CONFIG: Record<NadeType, { label: string; color: string; bgColor: string; icon: string; description: string }> = {
  smoke: {
    label: "Smoke",
    color: "text-slate-300",
    bgColor: "bg-slate-700",
    icon: "💨",
    description: "Bloqueio de visão",
  },
  flash: {
    label: "Flash",
    color: "text-yellow-300",
    bgColor: "bg-yellow-700",
    icon: "⚡",
    description: "Cegar inimigos",
  },
  molotov: {
    label: "Molotov",
    color: "text-orange-300",
    bgColor: "bg-orange-800",
    icon: "🔥",
    description: "Dano por área",
  },
  he: {
    label: "HE Grenade",
    color: "text-red-300",
    bgColor: "bg-red-800",
    icon: "💥",
    description: "Dano explosivo",
  },
};

export const DIFFICULTY_CONFIG = {
  easy: { label: "Fácil", color: "text-green-400", dot: "bg-green-400" },
  medium: { label: "Médio", color: "text-yellow-400", dot: "bg-yellow-400" },
  hard: { label: "Difícil", color: "text-red-400", dot: "bg-red-400" },
};

export const MAP_COLORS: Record<string, string> = {
  mirage: "from-amber-900 to-yellow-800",
  inferno: "from-orange-900 to-red-800",
  nuke: "from-gray-800 to-zinc-700",
  ancient: "from-stone-800 to-amber-900",
  anubis: "from-yellow-900 to-amber-700",
  vertigo: "from-sky-900 to-blue-800",
  dust2: "from-yellow-800 to-amber-700",
};
