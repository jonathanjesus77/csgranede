"use client";

import Link from "next/link";
import { Nade } from "@/lib/types";
import { NADE_TYPE_CONFIG, DIFFICULTY_CONFIG, cn } from "@/lib/utils";

interface NadeCardProps {
  nade: Nade;
  mapId: string;
}

const THROW_LABELS: Record<string, string> = {
  left_click: "Clique Esq.",
  right_click: "Clique Dir.",
  jump_throw: "Jump Throw",
  run_throw: "Run Throw",
  crouch_throw: "Agachado",
};

export default function NadeCard({ nade, mapId }: NadeCardProps) {
  const typeCfg = NADE_TYPE_CONFIG[nade.type];
  const diffCfg = DIFFICULTY_CONFIG[nade.difficulty];

  return (
    <Link href={`/map/${mapId}/type/${nade.type}/${nade.id}`}>
      <div className={cn(
        "group relative bg-zinc-900 border border-white/10 rounded-xl overflow-hidden",
        "hover:border-orange-500/50 hover:shadow-md hover:shadow-orange-500/10",
        "transition-all duration-200 cursor-pointer"
      )}>
        {/* Thumbnail area */}
        <div className="relative h-36 bg-zinc-800 overflow-hidden flex items-center justify-center">
          {nade.media[0] ? (
            <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-700 flex items-center justify-center">
              <span className="text-5xl opacity-30">{typeCfg.icon}</span>
            </div>
          ) : (
            <span className="text-5xl opacity-20">{typeCfg.icon}</span>
          )}

          {/* Type badge */}
          <div className={cn(
            "absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold",
            typeCfg.bgColor, typeCfg.color
          )}>
            <span>{typeCfg.icon}</span>
            <span>{typeCfg.label}</span>
          </div>

          {/* Pro badge */}
          {nade.pro_usage && (
            <div className="absolute top-2 right-2 bg-yellow-500/90 text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
              PRO
            </div>
          )}

          {/* Verified badge */}
          {nade.verified && (
            <div className="absolute bottom-2 right-2 text-green-400" title="Verificado">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="text-white font-semibold text-sm leading-tight mb-1 group-hover:text-orange-400 transition-colors line-clamp-1">
            {nade.name}
          </h3>
          <p className="text-white/50 text-xs line-clamp-2 mb-2">{nade.description}</p>

          {/* Meta row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <span className={cn("w-2 h-2 rounded-full", diffCfg.dot)} />
              <span className={cn("text-xs", diffCfg.color)}>{diffCfg.label}</span>
            </div>

            <span className="text-xs text-white/40 bg-white/5 rounded px-1.5 py-0.5">
              {THROW_LABELS[nade.lineup.throw_type]}
            </span>

            <div className="flex items-center gap-0.5 text-white/40 text-xs">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <span>{nade.likes?.toLocaleString()}</span>
            </div>
          </div>

          {/* Side badge */}
          <div className="mt-2 flex items-center gap-1">
            {(nade.side === "both" ? ["CT", "TR"] : [nade.side]).map((s) => (
              <span key={s} className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded",
                s === "CT" ? "bg-blue-900/60 text-blue-300" : "bg-red-900/60 text-red-300"
              )}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
