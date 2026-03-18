import MapCard from "@/components/MapCard";
import { getAllMaps } from "@/lib/utils";

export default function HomePage() {
  const maps = getAllMaps();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1 text-orange-400 text-xs font-medium mb-4">
          <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
          CS2 — Rotação Ativa 2025
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
          Granadas como um{" "}
          <span className="text-orange-500">Profissional</span>
        </h1>
        <p className="mt-3 text-white/50 text-base max-w-xl">
          Guia completo de smokes, flashes, molotovs e HEs para os 7 mapas da
          Rotação Ativa. Encontre qualquer lineup em menos de 3 cliques.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 p-4 bg-zinc-900/50 border border-white/5 rounded-xl">
        {[
          { icon: "💨", label: "Smokes", value: "40+" },
          { icon: "⚡", label: "Flashes", value: "30+" },
          { icon: "🔥", label: "Molotovs", value: "25+" },
          { icon: "💥", label: "HE Grenades", value: "15+" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3 px-2">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="text-white font-bold text-lg leading-none">{s.value}</p>
              <p className="text-white/40 text-xs">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Map grid — CLICK 1 */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-white/80 font-semibold text-sm uppercase tracking-widest">
          Escolha o Mapa
        </h2>
        <span className="text-white/30 text-xs">Clique 1 de 3</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {maps.map((map) => (
          <MapCard key={map.id} map={map} />
        ))}
      </div>

      {/* How to use */}
      <div className="mt-12 p-6 bg-zinc-900/40 border border-white/5 rounded-xl">
        <h3 className="text-white font-bold mb-4">Como usar em 3 cliques</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: "1", title: "Escolha o Mapa", desc: "Selecione o mapa da partida da lista acima." },
            { step: "2", title: "Tipo de Granada", desc: "Filtre por Smoke, Flash, Molotov ou HE." },
            { step: "3", title: "Veja o Lineup", desc: "Posição, mira e vídeo demonstrativo do throw." },
          ].map((s) => (
            <div key={s.step} className="flex gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                {s.step}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{s.title}</p>
                <p className="text-white/40 text-xs mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
