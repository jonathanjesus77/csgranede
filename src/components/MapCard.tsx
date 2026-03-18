"use client";

import Link from "next/link";
import Image from "next/image";
import { cn, NADE_TYPE_CONFIG, getNadeCountByType } from "@/lib/utils";

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

  return (
    <Link href={`/map/${map.id}`}>
      <div
        className={cn(
          "relative group rounded-xl overflow-hidden cursor-pointer",
          "border border-white/10 hover:border-orange-500/60",
          "transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/20",
          "aspect-[4/3] bg-zinc-900"
        )}
      >
        {/* Map image */}
        <Image
          src={map.image}
          alt={map.display_name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          unoptimized
        />

        {/* Dark gradient overlay bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Top badge */}
        <div className="absolute top-3 right-3">
          <span className="text-xs font-medium text-orange-400 bg-black/60 border border-orange-400/30 rounded-full px-2 py-0.5 backdrop-blur-sm">
            Active Duty
          </span>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-black text-white tracking-wide drop-shadow">
            {map.display_name}
          </h3>
          <p className="text-white/60 text-xs mb-3">{total} granadas</p>

          {/* Nade counters */}
          <div className="grid grid-cols-4 gap-1.5">
            {(
              Object.entries(NADE_TYPE_CONFIG) as [
                string,
                (typeof NADE_TYPE_CONFIG)[keyof typeof NADE_TYPE_CONFIG]
              ][]
            ).map(([type, cfg]) => (
              <div
                key={type}
                className="flex flex-col items-center bg-black/50 backdrop-blur-sm rounded-lg py-1.5"
              >
                <span className="text-base">{cfg.icon}</span>
                <span className="text-white font-bold text-xs">
                  {counts[type] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hover arrow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-orange-500/90 backdrop-blur-sm rounded-full p-3">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
