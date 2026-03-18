import { notFound } from "next/navigation";
import Link from "next/link";
import { getMapById, getNadesByMap, NADE_TYPE_CONFIG, MAP_COLORS, cn } from "@/lib/utils";
import { NadeType } from "@/lib/types";

interface Props {
  params: Promise<{ mapId: string }>;
}

export default async function MapPage({ params }: Props) {
  const { mapId } = await params;
  const map = getMapById(mapId);
  if (!map) notFound();

  const nades = getNadesByMap(mapId);
  const gradient = MAP_COLORS[mapId] || "from-gray-800 to-gray-700";

  const typeCounts = (Object.keys(NADE_TYPE_CONFIG) as NadeType[]).map((type) => ({
    type,
    count: nades.filter((n) => n.type === type).length,
    cfg: NADE_TYPE_CONFIG[type],
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-white/40 mb-6">
        <Link href="/" className="hover:text-white transition-colors">Mapas</Link>
        <span>/</span>
        <span className="text-white">{map.display_name}</span>
      </nav>

      {/* Map Hero */}
      <div className={cn(
        "relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-br border border-white/10",
        gradient
      )}>
        <div className="px-8 py-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <span className="text-white/50 text-sm uppercase tracking-widest">Mapa</span>
              <h1 className="text-4xl sm:text-5xl font-black text-white mt-1">{map.display_name}</h1>
              <p className="text-white/60 mt-2">{nades.length} granadas disponíveis</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold px-3 py-1.5 rounded-full">
                Active Duty
              </span>
              <span className="bg-white/5 border border-white/10 text-white/60 text-xs font-medium px-3 py-1.5 rounded-full">
                Sub-Tick Ready
              </span>
            </div>
          </div>

          {/* Type summary */}
          <div className="mt-6 flex flex-wrap gap-3">
            {typeCounts.map(({ type, count, cfg }) => (
              <div key={type} className="flex items-center gap-2 bg-black/30 rounded-lg px-3 py-2">
                <span className="text-xl">{cfg.icon}</span>
                <div>
                  <p className="text-white font-bold text-sm">{count}</p>
                  <p className="text-white/40 text-xs">{cfg.label}s</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CLICK 2 — Grenade Type Selection */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-white/80 font-semibold text-sm uppercase tracking-widest">
          Tipo de Granada
        </h2>
        <span className="text-white/30 text-xs">Clique 2 de 3</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* All types */}
        <Link href={`/map/${mapId}/type/all`}>
          <div className="group relative bg-zinc-900 border border-white/10 hover:border-orange-500/50 rounded-xl p-6 text-center cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/10">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-white font-bold text-lg">Todas</h3>
            <p className="text-white/50 text-sm mt-1">{nades.length} granadas</p>
            <div className="mt-3 flex flex-wrap gap-1 justify-center">
              {typeCounts.map(({ type, cfg }) => (
                <span key={type} className={cn("text-xs px-1.5 py-0.5 rounded", cfg.bgColor, cfg.color)}>
                  {cfg.icon}
                </span>
              ))}
            </div>
          </div>
        </Link>

        {typeCounts.map(({ type, count, cfg }) => (
          <Link key={type} href={`/map/${mapId}/type/${type}`}>
            <div className={cn(
              "group relative rounded-xl p-6 text-center cursor-pointer transition-all",
              "border hover:scale-[1.02]",
              count > 0
                ? cn("hover:border-current/40", cfg.bgColor, "border-white/10 hover:shadow-lg")
                : "bg-zinc-900 border-white/5 opacity-50 pointer-events-none"
            )}>
              <div className="text-4xl mb-3">{cfg.icon}</div>
              <h3 className={cn("font-bold text-lg", cfg.color)}>{cfg.label}</h3>
              <p className="text-white/50 text-sm mt-1">{count} {count === 1 ? "granada" : "granadas"}</p>
              <p className="text-white/30 text-xs mt-2">{cfg.description}</p>
              {count === 0 && (
                <p className="text-white/20 text-xs mt-2">Em breve</p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Pro tip */}
      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 flex gap-3">
        <span className="text-yellow-400 text-xl flex-shrink-0">💡</span>
        <div>
          <p className="text-yellow-400 font-semibold text-sm">Dica Pro</p>
          <p className="text-white/50 text-sm mt-1">
            Todas as granadas são compatíveis com o novo sistema Sub-Tick do CS2. Lineups
            específicos para 64 e 128 tick também estão disponíveis onde aplicável.
          </p>
        </div>
      </div>
    </div>
  );
}
