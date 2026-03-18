"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { useState, use } from "react";
import { getMapById, getNadesByMapAndType, filterNades, NADE_TYPE_CONFIG, cn } from "@/lib/utils";
import { FilterState, NadeType } from "@/lib/types";
import NadeCard from "@/components/NadeCard";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";

interface Props {
  params: Promise<{ mapId: string; typeId: string }>;
}

const DEFAULT_FILTERS: FilterState = {
  type: "all",
  side: "all",
  difficulty: "all",
  tickrate: "all",
  search: "",
  pro_only: false,
};

export default function TypePage({ params }: Props) {
  const { mapId, typeId } = use(params);
  const map = getMapById(mapId);
  if (!map) notFound();

  const isAllTypes = typeId === "all";
  const validTypes = ["all", "smoke", "flash", "molotov", "he"];
  if (!validTypes.includes(typeId)) notFound();

  const baseNades = getNadesByMapAndType(mapId, isAllTypes ? "all" : (typeId as NadeType));
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    type: isAllTypes ? "all" : (typeId as NadeType),
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredNades = filterNades(baseNades, filters);
  const typeCfg = !isAllTypes ? NADE_TYPE_CONFIG[typeId as NadeType] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-white/40 mb-6 flex-wrap">
        <Link href="/" className="hover:text-white transition-colors">Mapas</Link>
        <span>/</span>
        <Link href={`/map/${mapId}`} className="hover:text-white transition-colors">{map.display_name}</Link>
        <span>/</span>
        <span className="text-white">
          {typeCfg ? `${typeCfg.icon} ${typeCfg.label}s` : "🎯 Todas"}
        </span>
      </nav>

      {/* Page header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {typeCfg ? (
              <span className={typeCfg.color}>{typeCfg.icon} {typeCfg.label}s</span>
            ) : "🎯 Todas as Granadas"} — {map.display_name}
          </h1>
          <p className="text-white/50 mt-1">
            {filteredNades.length} {filteredNades.length === 1 ? "granada encontrada" : "granadas encontradas"}
            {filters.search && ` para "${filters.search}"`}
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            showFilters ? "bg-orange-500 text-white" : "bg-zinc-800 text-white/60 border border-white/10 hover:text-white"
          )}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtros
          {(filters.side !== "all" || filters.difficulty !== "all" || filters.pro_only) && (
            <span className="w-2 h-2 bg-orange-400 rounded-full" />
          )}
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <SearchBar
          value={filters.search}
          onChange={(v) => setFilters({ ...filters, search: v })}
          placeholder={`Buscar em ${map.display_name}... (ex: janela, mid, banana)`}
        />
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-zinc-900 border border-white/10 rounded-xl">
          <FilterBar
            filters={filters}
            onChange={setFilters}
            showTypeFilter={isAllTypes}
          />
          <button
            onClick={() => setFilters({ ...DEFAULT_FILTERS, type: isAllTypes ? "all" : (typeId as NadeType) })}
            className="mt-4 text-xs text-white/40 hover:text-orange-400 transition-colors"
          >
            Limpar filtros
          </button>
        </div>
      )}

      {/* CLICK 3 — Nades grid */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-white/80 font-semibold text-sm uppercase tracking-widest">
          Escolha o Spot
        </h2>
        <span className="text-white/30 text-xs">Clique 3 de 3</span>
      </div>

      {filteredNades.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg font-medium">Nenhuma granada encontrada</p>
          <p className="text-sm mt-1">Tente ajustar os filtros ou a busca</p>
          <button
            onClick={() => setFilters({ ...DEFAULT_FILTERS, type: isAllTypes ? "all" : (typeId as NadeType) })}
            className="mt-4 text-orange-400 hover:text-orange-300 text-sm underline"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredNades.map((nade) => (
            <NadeCard key={nade.id} nade={nade} mapId={mapId} />
          ))}
        </div>
      )}
    </div>
  );
}
