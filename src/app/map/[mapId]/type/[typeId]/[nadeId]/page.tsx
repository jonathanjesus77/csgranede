import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllNades, getMapById, NADE_TYPE_CONFIG, DIFFICULTY_CONFIG, cn } from "@/lib/utils";

interface Props {
  params: Promise<{ mapId: string; typeId: string; nadeId: string }>;
}

const THROW_LABELS: Record<string, { label: string; color: string }> = {
  left_click: { label: "Clique Esquerdo", color: "text-blue-400" },
  right_click: { label: "Clique Direito", color: "text-purple-400" },
  jump_throw: { label: "Jump Throw", color: "text-yellow-400" },
  run_throw: { label: "Run Throw", color: "text-green-400" },
  crouch_throw: { label: "Agachado", color: "text-orange-400" },
};

export default async function NadeDetailPage({ params }: Props) {
  const { mapId, typeId, nadeId } = await params;
  const map = getMapById(mapId);
  if (!map) notFound();

  const allNades = getAllNades();
  const nade = allNades.find((n) => n.id === nadeId);
  if (!nade) notFound();

  const typeCfg = NADE_TYPE_CONFIG[nade.type];
  const diffCfg = DIFFICULTY_CONFIG[nade.difficulty];
  const throwCfg = THROW_LABELS[nade.lineup.throw_type];

  const relatedNades = allNades
    .filter((n) => n.map === mapId && n.type === nade.type && n.id !== nadeId)
    .slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-white/40 mb-6 flex-wrap">
        <Link href="/" className="hover:text-white transition-colors">Mapas</Link>
        <span>/</span>
        <Link href={`/map/${mapId}`} className="hover:text-white transition-colors">{map.display_name}</Link>
        <span>/</span>
        <Link href={`/map/${mapId}/type/${typeId}`} className="hover:text-white transition-colors">
          {typeCfg.icon} {typeCfg.label}s
        </Link>
        <span>/</span>
        <span className="text-white">{nade.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={cn("flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-md", typeCfg.bgColor, typeCfg.color)}>
              {typeCfg.icon} {typeCfg.label}
            </span>
            {nade.verified && (
              <span className="flex items-center gap-1 text-green-400 text-xs bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verificado
              </span>
            )}
            {nade.pro_usage && (
              <span className="text-yellow-400 text-xs bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded-full font-bold">
                ⭐ Pro Usage
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">{nade.name}</h1>
          <p className="text-white/50 mt-2 text-sm max-w-xl">{nade.description}</p>
        </div>
        <div className="flex items-center gap-2 text-white/40 text-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
          {nade.likes?.toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Media / Preview */}
        <div>
          <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden mb-4">
            <div className="h-64 bg-gradient-to-br from-zinc-800 to-zinc-700 flex items-center justify-center relative">
              <span className="text-8xl opacity-20">{typeCfg.icon}</span>
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 rounded-lg p-3 text-xs text-white/60 text-center">
                {nade.media.length > 0 ? "Demonstração disponível" : "Adicione o vídeo/GIF do lineup"}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {nade.tags.map((tag) => (
              <span key={tag} className="text-xs bg-zinc-800 border border-white/10 text-white/50 px-2 py-0.5 rounded">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Lineup Guide */}
        <div className="space-y-4">
          {/* Meta badges */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-900 border border-white/10 rounded-lg p-3">
              <p className="text-white/40 text-xs mb-1">Dificuldade</p>
              <div className="flex items-center gap-2">
                <span className={cn("w-2.5 h-2.5 rounded-full", diffCfg.dot)} />
                <span className={cn("font-bold text-sm", diffCfg.color)}>{diffCfg.label}</span>
              </div>
            </div>
            <div className="bg-zinc-900 border border-white/10 rounded-lg p-3">
              <p className="text-white/40 text-xs mb-1">Tipo de Throw</p>
              <span className={cn("font-bold text-sm", throwCfg?.color || "text-white")}>
                {throwCfg?.label || nade.lineup.throw_type}
              </span>
            </div>
            <div className="bg-zinc-900 border border-white/10 rounded-lg p-3">
              <p className="text-white/40 text-xs mb-1">Lado</p>
              <div className="flex gap-1">
                {(nade.side === "both" ? ["CT", "TR"] : [nade.side]).map((s) => (
                  <span key={s} className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded",
                    s === "CT" ? "bg-blue-900/60 text-blue-300" : "bg-red-900/60 text-red-300"
                  )}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-zinc-900 border border-white/10 rounded-lg p-3">
              <p className="text-white/40 text-xs mb-1">Tickrate</p>
              <span className="text-white font-bold text-sm capitalize">
                {nade.tickrate === "all" ? "Sub-Tick / All" : nade.tickrate}
              </span>
            </div>
          </div>

          {/* Step by step lineup */}
          <div className="bg-zinc-900 border border-white/10 rounded-xl p-4 space-y-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest">Passo a Passo</h3>

            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="text-white/80 text-xs font-semibold mb-0.5">Posição</p>
                  <p className="text-white/50 text-sm">{nade.lineup.position}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="text-white/80 text-xs font-semibold mb-0.5">Mira</p>
                  <p className="text-white/50 text-sm">{nade.lineup.aim}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="text-white/80 text-xs font-semibold mb-0.5">Arremesso</p>
                  <p className={cn("font-bold text-sm", throwCfg?.color || "text-white")}>
                    {throwCfg?.label || nade.lineup.throw_type}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5">
              <p className="text-white/60 text-xs leading-relaxed">{nade.lineup.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related nades */}
      {relatedNades.length > 0 && (
        <div className="mt-10">
          <h3 className="text-white/60 text-sm uppercase tracking-widest mb-4">
            Mais {typeCfg.label}s em {map.display_name}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedNades.map((related) => (
              <Link key={related.id} href={`/map/${mapId}/type/${related.type}/${related.id}`}>
                <div className="bg-zinc-900 border border-white/10 hover:border-orange-500/40 rounded-xl p-4 transition-all hover:scale-[1.02]">
                  <div className="flex items-start gap-2">
                    <span className="text-2xl">{NADE_TYPE_CONFIG[related.type].icon}</span>
                    <div>
                      <p className="text-white font-semibold text-sm">{related.name}</p>
                      <p className={cn("text-xs mt-0.5", DIFFICULTY_CONFIG[related.difficulty].color)}>
                        {DIFFICULTY_CONFIG[related.difficulty].label}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
