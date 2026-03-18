import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

export const metadata: Metadata = {
  title: "CS2 Nades Pro – Guia de Granadas",
  description:
    "O guia mais completo de granadas do CS2. Smokes, Flashes, Molotovs e HEs para todos os mapas da Rotação Ativa.",
  keywords: ["CS2", "grenades", "smokes", "lineups", "nades", "counter-strike", "guia"],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "CS2 Nades Pro",
    description: "Guia completo de granadas para CS2",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="font-sans bg-zinc-950 text-white min-h-screen antialiased">
        <ServiceWorkerRegistration />
        <Header />
        <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
        <footer className="border-t border-white/5 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-white/30 text-xs">
            <p>CS2 Nades Pro — Guia de Granadas para Counter-Strike 2</p>
            <p className="mt-1">Não afiliado à Valve Corporation</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
