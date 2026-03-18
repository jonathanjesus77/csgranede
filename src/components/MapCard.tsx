"use client";

import Link from "next/link";
import { cn, MAP_COLORS, NADE_TYPE_CONFIG, getNadeCountByType } from "@/lib/utils";

interface MapCardProps {
  map: {
    id: string;
    display_name: string;
    image: string;
  };
}

export default function MapCard({ map }: MapCardProps) {
  const counts = getNadeCountByType(map.id);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const gradient = MAP_COLORS[map.id] || "from-gray-800 to-gray-700";

  return (
    <Link href={`/map/${map.id}`}>
      <div
        className={cn(
          "relative group rounded-xl overflow-hidden cursor-pointer",
          "border border-white/10 hover:border-orange-500/60",
          "transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/20",
          "bg-gradient-to-br",
          gradient
        )}
      >
        {/* Map header */}
        <div className="p-5 pb-3">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-xl font-bold text-white tracking-wide">{map.display_name}</h3>
            <span className="text-xs font-medium text-orange-400 bg-orange-400/10 border border-orange-400/30 rounded-full px-2 py-0.5">
              Active Duty
            </span>
          </div>
          <p className="text-white/50 text-sm">{total} granadas</p>
        </div>

        {/* Nade type counters */}
        <div className="px-5 pb-5 grid grid-cols-4 gap-2">
          {(Object.entries(NADE_TYPE_CONFIG) as [string, typeof NADE_TYPE_CONFIG[keyof typeof NADE_TYPE_CONFIG]][]).map(([type, cfg]) => (
            <div
              key={type}
              className="flex flex-col items-center bg-black/30 rounded-lg p-2"
            >
              <span className="text-lg mb-0.5">{cfg.icon}</span>
              <span className="text-white font-bold text-sm">{counts[type] || 0}</span>
              <span className="text-white/40 text-[10px]">{cfg.label}</span>
            </div>
          ))}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/5 transition-all duration-300 pointer-events-none" />

        {/* Arrow indicator */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
