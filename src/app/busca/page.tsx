"use client";

import { useState } from "react";
import Link from "next/link";
import { getAllNades, getAllMaps, filterNades, NADE_TYPE_CONFIG, DIFFICULTY_CONFIG, cn } from "@/lib/utils";
import { FilterState, NadeType } from "@/lib/types";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";

const DEFAULT_FILTERS: FilterState = {
  type: "all",
  side: "all",
  difficulty: "all",
  tickrate: "all",
  search: "",
  pro_only: false,
};

export default function BuscaPage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const allNades = getAllNades();
  const maps = getAllMaps();
  const filtered = filterNades(allNades, filters);

  const hasActiveFilters = filters.type !== "all" || filters.side !== "all" || filters.difficulty !== "all" || filters.pro_only || filters.search;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Busca Global</h1>
        <p className="text-white/50 text-sm">Pesquise em todos os mapas e tipos de granada</p>
      </div>

      {/* Search + Filters */}
      <div className="mb-6 space-y-4">
        <SearchBar
          value={filters.search}
          onChange={(v) => setFilters({ ...filters, search: v })}
          placeholder="Buscar qualquer granada... (ex: smoke janela, flash b site, molotov banana)"
        />
        <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
          <FilterBar filters={filters} onChange={setFilters} showTypeFilter />
          {hasActiveFilters && (
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="mt-4 text-xs text-orange-400 hover:text-orange-300 transition-colors"
            >
              ← Limpar todos os filtros
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-white/50 text-sm">
          {filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}
          {filters.search && ` para "${filters.search}"`}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg font-medium">Nenhuma granada encontrada</p>
          <button onClick={() => setFilters(DEFAULT_FILTERS)} className="mt-4 text-orange-400 text-sm underline">
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((nade) => {
            const map = maps.find((m) => m.id === nade.map);
            const typeCfg = NADE_TYPE_CONFIG[nade.type];
            const diffCfg = DIFFICULTY_CONFIG[nade.difficulty];
            return (
              <Link key={nade.id} href={`/map/${nade.map}/type/${nade.type}/${nade.id}`}>
                <div className="flex items-center gap-4 bg-zinc-900 border border-white/10 hover:border-orange-500/40 rounded-xl px-4 py-3 transition-all group">
                  {/* Type icon */}
                  <span className="text-2xl flex-shrink-0">{typeCfg.icon}</span>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-semibold text-sm group-hover:text-orange-400 transition-colors">
                        {nade.name}
                      </h3>
                      {nade.pro_usage && (
                        <span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded">PRO</span>
                      )}
                    </div>
                    <p className="text-white/40 text-xs mt-0.5 line-clamp-1">{nade.description}</p>
                  </div>

                  {/* Badges */}
                  <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded">
                      {map?.display_name}
                    </span>
                    <span className={cn("text-xs px-2 py-0.5 rounded font-medium", typeCfg.bgColor, typeCfg.color)}>
                      {typeCfg.label}
                    </span>
                    <span className={cn("text-xs font-medium", diffCfg.color)}>
                      {diffCfg.label}
                    </span>
                  </div>

                  {/* Arrow */}
                  <svg className="w-4 h-4 text-white/20 group-hover:text-orange-400 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
