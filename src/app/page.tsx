"use client";

import { Portal as C } from "@/constants/colors";
import { CITIES as CITIES_FALLBACK } from "@/data";
import type { City } from "@/types";
import { useApiData } from "@/hooks/useApiData";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Icon } from "@/components/ui/Icon";

const CITY_IMAGES: Record<string, string> = {
  capitolio: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
  tiradentes: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&h=400&fit=crop",
  gramado: "https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=600&h=400&fit=crop",
  bonito: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=400&fit=crop",
};

const CITY_DESCRIPTIONS: Record<string, string> = {
  capitolio: "Cânions de Furnas, cachoeiras e paisagens deslumbrantes",
  tiradentes: "Cidade histórica, gastronomia e charme colonial",
  gramado: "Serra gaúcha, fondue, chocolate e inverno encantador",
  bonito: "Rios cristalinos, grutas e ecoturismo de aventura",
};

export default function HomePage() {
  const { data: cities } = useApiData<City[]>("/api/cities", CITIES_FALLBACK);
  const allCities = cities ?? CITIES_FALLBACK;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* HERO */}
      <section className="relative" style={{ background: `linear-gradient(165deg, ${C.dark} 0%, ${C.navy} 50%, ${C.blue} 100%)` }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          <div className="absolute -top-10 right-1/4 w-80 h-80 rounded-full" style={{ backgroundColor: C.yellow, filter: "blur(80px)" }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full" style={{ backgroundColor: C.lightBlue, filter: "blur(60px)" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4">
            Encontre a hospedagem perfeita no <span style={{ color: C.yellow }}>Brasil</span>
          </h1>
          <p className="text-blue-200 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Pousadas, hotéis e chalés nas melhores cidades turísticas. Reserve direto e ganhe Giftback.
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-2xl p-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-4 py-3">
                <div className="w-5 h-5 text-gray-400"><Icon.search /></div>
                <span className="text-gray-400 text-sm">Escolha uma cidade abaixo</span>
              </div>
            </div>
          </div>
        </div>

        <svg viewBox="0 0 1440 28" fill="none" className="w-full block" style={{ marginBottom: "-2px" }}>
          <path d="M0 28L480 10C720 2 960 2 1440 10V28H0Z" fill="#F9FAFB" />
        </svg>
      </section>

      {/* CIDADES */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Destinos Populares</h2>
          <p className="text-gray-500">Explore hospedagens nas cidades mais procuradas</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allCities.map(c => (
            <a
              key={c.id}
              href={`/${c.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={CITY_IMAGES[c.id] || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <h3 className="text-white font-black text-xl">{c.name}</h3>
                  <p className="text-white/80 text-sm">{c.state}</p>
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-xs font-bold" style={{ color: C.navy }}>{c.count} hospedagens</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-gray-500 text-sm mb-3">
                  {CITY_DESCRIPTIONS[c.id] || "Descubra as melhores hospedagens"}
                </p>
                <div className="flex items-center gap-1 font-bold text-sm" style={{ color: C.navy }}>
                  <span>Explorar</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* BANNER GIFTBACK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-3xl p-8 md:p-12 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${C.dark}, ${C.navy}, ${C.blue})` }}>
          <div className="absolute right-0 top-0 w-64 h-64 opacity-10 pointer-events-none" style={{ background: `radial-gradient(circle, ${C.yellow}, transparent)`, filter: "blur(30px)" }} />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white flex-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 text-yellow-400">{Icon.gift()}</div>
                <span className="text-xs font-black bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full uppercase tracking-wide">Exclusivo Hospeda Bem</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-2">Reserve direto, ganhe <span style={{ color: C.yellow }}>Giftback</span></h2>
              <p className="text-blue-200 text-sm max-w-md">Créditos automáticos a cada reserva. Use na próxima estadia. Só aqui.</p>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0">
              <button className="font-black px-8 py-3.5 rounded-xl text-sm hover:opacity-90 transition-all" style={{ backgroundColor: C.yellow, color: C.navy }}>Como funciona &rarr;</button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
