"use client";

import { FilterState, NadeType, Side, Difficulty } from "@/lib/types";
import { NADE_TYPE_CONFIG, cn } from "@/lib/utils";

interface FilterBarProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  showTypeFilter?: boolean;
}

const SIDES: { value: Side | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "CT", label: "CT" },
  { value: "TR", label: "TR" },
];

const DIFFICULTIES: { value: Difficulty | "all"; label: string; color: string }[] = [
  { value: "all", label: "Todas", color: "" },
  { value: "easy", label: "Fácil", color: "text-green-400" },
  { value: "medium", label: "Médio", color: "text-yellow-400" },
  { value: "hard", label: "Difícil", color: "text-red-400" },
];

export default function FilterBar({ filters, onChange, showTypeFilter = true }: FilterBarProps) {
  const set = <K extends keyof FilterState>(key: K, val: FilterState[K]) =>
    onChange({ ...filters, [key]: val });

  return (
    <div className="flex flex-col gap-3">
      {/* Nade Type */}
      {showTypeFilter && (
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Tipo</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => set("type", "all")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                filters.type === "all"
                  ? "bg-orange-500 text-white"
                  : "bg-zinc-800 text-white/60 hover:text-white border border-white/10"
              )}
            >
              Todos
            </button>
            {(Object.entries(NADE_TYPE_CONFIG) as [NadeType, typeof NADE_TYPE_CONFIG[NadeType]][]).map(([type, cfg]) => (
              <button
                key={type}
                onClick={() => set("type", type)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                  filters.type === type
                    ? `${cfg.bgColor} ${cfg.color} border border-current/30`
                    : "bg-zinc-800 text-white/60 hover:text-white border border-white/10"
                )}
              >
                <span>{cfg.icon}</span>
                <span>{cfg.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Side + Difficulty row */}
      <div className="flex flex-wrap gap-4">
        {/* Side */}
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Lado</p>
          <div className="flex gap-1.5">
            {SIDES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => set("side", value)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  filters.side === value
                    ? value === "CT"
                      ? "bg-blue-700 text-white"
                      : value === "TR"
                      ? "bg-red-700 text-white"
                      : "bg-orange-500 text-white"
                    : "bg-zinc-800 text-white/60 hover:text-white border border-white/10"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Dificuldade</p>
          <div className="flex gap-1.5">
            {DIFFICULTIES.map(({ value, label, color }) => (
              <button
                key={value}
                onClick={() => set("difficulty", value)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  filters.difficulty === value
                    ? "bg-orange-500 text-white"
                    : cn("bg-zinc-800 border border-white/10 hover:text-white", color || "text-white/60")
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Pro Only */}
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Pro</p>
          <button
            onClick={() => set("pro_only", !filters.pro_only)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
              filters.pro_only
                ? "bg-yellow-500 text-black"
                : "bg-zinc-800 text-white/60 hover:text-white border border-white/10"
            )}
          >
            <span>⭐</span>
            <span>Pro Only</span>
          </button>
        </div>
      </div>
    </div>
  );
}
