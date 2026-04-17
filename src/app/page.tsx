"use client";

// ─── DATA & CONSTANTS ─────────────────────────────────────────────────────────
import { Portal as C } from "@/constants/colors";
import { CITIES as CITIES_FALLBACK, properties as propertiesFallback, restaurantes as restaurantesFallback, atrativosTuristicos as atrativosFallback, passeiosParceiros as passeiosFallback } from "@/data";
import type { Property, City, Restaurant, Attraction, Tour, SortBy } from "@/types";

// ─── HOOKS ───────────────────────────────────────────────────────────────────
import { useApiData } from "@/hooks/useApiData";

// ─── STORES ──────────────────────────────────────────────────────────────────
import { useFavoritesStore, useSearchStore, useFilterStore, useUIStore } from "@/stores";

// ─── UI COMPONENTS ────────────────────────────────────────────────────────────
import { Icon } from "@/components/ui/Icon";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

// ─── SEARCH COMPONENTS ────────────────────────────────────────────────────────
import { DateRangePicker } from "@/components/search/DateRangePicker";
import { GuestsPicker } from "@/components/search/GuestsPicker";

// ─── CARD COMPONENTS ──────────────────────────────────────────────────────────
import { RestauranteCard } from "@/components/cards/RestauranteCard";
import { AtrativoCard } from "@/components/cards/AtrativoCard";
import { ParceiroCard } from "@/components/cards/ParceiroCard";

// ─── SECTION COMPONENTS ───────────────────────────────────────────────────────
import { Section } from "@/components/sections/Section";

// ─── LAYOUT COMPONENTS ────────────────────────────────────────────────────────
import { Navbar } from "@/components/layout/Navbar";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import { FilterPanel } from "@/components/layout/FilterPanel";
import { Footer } from "@/components/layout/Footer";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const FILTERS = ["Todos", "Pousada", "Hotel", "Chalé", "Suíte", "Resort"];

const TAGS = [
  { label: "Piscina", icon: "pool" },
  { label: "Vista para o lago", icon: "waves" },
  { label: "Café da manhã", icon: "coffee" },
  { label: "Pet-friendly", icon: "paw" },
  { label: "Piscina Aquecida", icon: "pool" },
  { label: "Banheira", icon: "bath" },
  { label: "Estacionamento", icon: "parking" },
];

// ─── FILTER & SORT HELPERS ────────────────────────────────────────────────────
function applyFilters(
  props: Property[],
  activeFilter: string,
  priceRange: [number, number],
  selectedAmenities: string[],
  onlySuperhost: boolean,
  onlyVerified: boolean,
): Property[] {
  let filtered = props;
  if (activeFilter !== "Todos") {
    filtered = filtered.filter(p => p.type === activeFilter);
  }
  filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
  if (selectedAmenities.length > 0) {
    filtered = filtered.filter(p =>
      selectedAmenities.every(amenity => p.amenities.includes(amenity))
    );
  }
  if (onlySuperhost) filtered = filtered.filter(p => p.superhost);
  if (onlyVerified) filtered = filtered.filter(p => p.verified);
  return filtered;
}

function sortProperties(props: Property[], sortBy: SortBy): Property[] {
  const sorted = [...props];
  switch (sortBy) {
    case 'price_asc': return sorted.sort((a, b) => a.price - b.price);
    case 'price_desc': return sorted.sort((a, b) => b.price - a.price);
    case 'score_desc':
    default: return sorted.sort((a, b) => b.score - a.score);
  }
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Home() {
  // ─── STORES ──────────────────────────────────────────────────────────────────
  const { favorites, toggleFavorite, isFavorite } = useFavoritesStore();
  const { selectedCity, setSelectedCity, checkIn, checkOut, setDates, rooms, showCityPicker, setShowCityPicker, totalGuests, addRoom, removeRoom, updateRoom } = useSearchStore();
  const { activeFilter, setActiveFilter, priceRange, setPriceRange, selectedAmenities, setSelectedAmenities, onlySuperhost, setOnlySuperhost, onlyVerified, setOnlyVerified, sortBy, setSortBy, toggleAmenity, clearFilters, activeFiltersCount } = useFilterStore();
  const { showFilters, setShowFilters, showMobileMenu, setShowMobileMenu } = useUIStore();

  // ─── API DATA (fallback = static data for instant render) ───────────────────
  const { data: cities } = useApiData<City[]>("/api/cities", CITIES_FALLBACK);
  const { data: properties } = useApiData<Property[]>("/api/properties", propertiesFallback);
  const { data: restaurantes } = useApiData<Restaurant[]>("/api/restaurants", restaurantesFallback);
  const { data: atrativosTuristicos } = useApiData<Attraction[]>("/api/attractions", atrativosFallback);
  const { data: passeiosParceiros } = useApiData<Tour[]>("/api/tours", passeiosFallback);

  const city = (cities ?? CITIES_FALLBACK).find(c => c.id === selectedCity) ?? CITIES_FALLBACK[0];

  const filteredAndSortedProperties = sortProperties(
    applyFilters(properties ?? [], activeFilter, priceRange, selectedAmenities, onlySuperhost, onlyVerified),
    sortBy,
  );

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');*{font-family:'Inter',sans-serif}`}</style>

      {/* Acessibilidade */}
      <style>{`
        *:focus-visible { outline: 2px solid #003580 !important; outline-offset: 2px; border-radius: 4px; }
        *:focus:not(:focus-visible) { outline: none; }
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
        .sr-only:focus { position: fixed; top: 1rem; left: 1rem; width: auto; height: auto; padding: 1rem 1.5rem; margin: 0; overflow: visible; clip: auto; white-space: normal; z-index: 100; background-color: #003580; color: white; border-radius: 0.5rem; font-weight: 600; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3); }
        details summary { list-style: none; }
        details summary::-webkit-details-marker { display: none; }
        details summary svg { transition: transform 0.3s ease; }
        details[open] summary svg { transform: rotate(180deg); }
        details[open] ul { animation: slideDown 0.3s ease-out; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <a href="#main-content" className="sr-only">Pular para o conteúdo principal</a>

      {/* ── NAVBAR ─── */}
      <Navbar />

      {/* ── BREADCRUMBS ─── */}
      <Breadcrumbs />

      {/* ── MOBILE DRAWER ─── */}
      <MobileDrawer show={showMobileMenu} onClose={() => setShowMobileMenu(false)} />

      {/* ── HERO + BUSCA ─── */}
      <section className="relative" style={{ background: `linear-gradient(165deg, ${C.dark} 0%, ${C.navy} 50%, ${C.blue} 100%)` }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          <div className="absolute -top-10 right-1/4 w-80 h-80 rounded-full" style={{ backgroundColor: C.yellow, filter: "blur(80px)" }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full" style={{ backgroundColor: C.lightBlue, filter: "blur(60px)" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-0">
          <div className="flex items-center gap-1.5 text-xs text-blue-300 mb-4">
            <a href="#" className="hover:text-white transition-colors">hospedabem.com</a>
            <span>&rsaquo;</span>
            <span className="text-white font-semibold">Capitólio, MG</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-1">Hospedagens em <span style={{ color: C.yellow }}>Capitólio</span></h1>
          <p className="text-blue-200 text-sm mb-6">32 opções disponíveis · Cânions de Furnas · Reserve direto e ganhe Giftback</p>

          {/* BARRA DE BUSCA */}
          <div className="bg-white rounded-2xl shadow-2xl">
            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
              {/* Destino */}
              <div className="relative">
                <button onClick={() => setShowCityPicker(!showCityPicker)} className="w-full flex items-center gap-2 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left border border-gray-100">
                  <div className="w-4 h-4 flex-shrink-0" style={{ color: C.navy }}><Icon.pin /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">DESTINO</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{city.name}, {city.state}</p>
                  </div>
                  <div className={`w-4 h-4 text-gray-400 transition-transform ${showCityPicker ? "rotate-180" : ""}`}>{Icon.chevronDown()}</div>
                </button>
                {showCityPicker && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowCityPicker(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-64 overflow-y-auto">
                      {(cities ?? CITIES_FALLBACK).map(c => (
                        <button key={c.id} onClick={() => { setSelectedCity(c.id); setShowCityPicker(false); }}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${c.id === selectedCity ? "bg-blue-50" : ""}`}>
                          <p className="font-bold text-sm text-gray-900">{c.name}, {c.state}</p>
                          <p className="text-xs text-gray-400">{c.count} hospedagens</p>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Datas */}
              <DateRangePicker checkIn={checkIn} checkOut={checkOut} onChange={(i, o) => setDates(i, o)} />

              {/* Hóspedes */}
              <GuestsPicker
                rooms={rooms}
                totalGuests={totalGuests()}
                onAddRoom={addRoom}
                onRemoveRoom={removeRoom}
                onUpdateRoom={updateRoom}
              />

              {/* Buscar */}
              <div className="flex items-center p-2 flex-shrink-0">
                <button className="flex items-center gap-2 text-white font-black px-6 py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all w-full lg:w-auto justify-center text-sm" style={{ backgroundColor: C.navy }}>
                  <div className="w-4 h-4"><Icon.search /></div>
                  Buscar
                </button>
              </div>
            </div>
          </div>

          {/* Tags de comodidades */}
          <div className="py-5">
            <div className="md:hidden -mx-4 px-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="flex gap-2">
                {TAGS.map(tag => (
                  <button
                    key={tag.label}
                    onClick={() => toggleAmenity(tag.label)}
                    className={`flex items-center gap-1.5 text-base md:text-sm px-5 py-2.5 md:px-4 md:py-2 rounded-full font-semibold transition-all whitespace-nowrap backdrop-blur-sm flex-shrink-0 min-h-[44px] ${
                      selectedAmenities.includes(tag.label)
                        ? "bg-white text-blue-900 border-2 border-white shadow-lg"
                        : "text-white bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}>
                    <div className="w-4 h-4">{Icon[tag.icon as keyof typeof Icon]()}</div>
                    <span>{tag.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="hidden md:flex gap-2 flex-wrap">
              {TAGS.map(tag => (
                <button
                  key={tag.label}
                  onClick={() => toggleAmenity(tag.label)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold transition-all backdrop-blur-sm ${
                    selectedAmenities.includes(tag.label)
                      ? "bg-white text-blue-900 border-2 border-white shadow-lg"
                      : "text-white/80 bg-white/10 hover:bg-white/20 border border-white/20"
                  }`}>
                  <div className="w-3.5 h-3.5">{Icon[tag.icon as keyof typeof Icon]()}</div>
                  <span>{tag.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <svg viewBox="0 0 1440 28" fill="none" className="w-full block" style={{ marginBottom: "-2px" }}>
          <path d="M0 28L480 10C720 2 960 2 1440 10V28H0Z" fill="#F9FAFB" />
        </svg>
      </section>

      {/* ── SEÇÕES DA HOME ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-14">
        {/* Filtros */}
        <div className="space-y-3">
          {/* Mobile chips */}
          <div className="md:hidden">
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-black border-2 transition-all flex-shrink-0 ${
                    activeFilter === f ? "border-transparent text-white shadow-md" : "bg-white text-gray-700 border-gray-300"
                  }`}
                  style={activeFilter === f ? { backgroundColor: "#003580" } : {}}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile sort + filters */}
          <div className="md:hidden flex items-center gap-2 -mx-4 px-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white border-2 rounded-xl px-4 py-2.5 text-sm font-bold hover:border-gray-400 relative shadow-sm flex-1"
              style={{ borderColor: showFilters ? "#003580" : "#d1d5db", color: showFilters ? "#003580" : "#374151" }}>
              <div className="w-4 h-4">{Icon.filter()}</div>
              <span>Filtros</span>
              {activeFiltersCount() > 0 && (
                <div className="ml-auto w-6 h-6 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center">
                  {activeFiltersCount()}
                </div>
              )}
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="bg-white border-2 border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 cursor-pointer shadow-sm flex-1">
              <option value="score_desc">Maior avaliação</option>
              <option value="price_asc">Menor preço</option>
              <option value="price_desc">Maior preço</option>
            </select>
          </div>

          {/* Desktop filters */}
          <div className="hidden md:flex items-center justify-between gap-3">
            <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
              {FILTERS.map(f => (
                <button key={f} onClick={() => setActiveFilter(f)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-black border transition-all flex-shrink-0 ${activeFilter === f ? "text-white border-transparent" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}
                  style={activeFilter === f ? { backgroundColor: "#003580" } : {}}>
                  {f}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-2 text-xs font-bold text-gray-600 hover:border-gray-400 cursor-pointer">
                <option value="score_desc">Maior avaliação</option>
                <option value="price_asc">Menor preço</option>
                <option value="price_desc">Maior preço</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 bg-white border-2 rounded-full px-3 py-2 text-xs font-bold hover:border-gray-400 relative"
                style={{ borderColor: showFilters ? "#003580" : "#e5e7eb", color: showFilters ? "#003580" : "#4b5563" }}>
                <div className="w-3.5 h-3.5">{Icon.filter()}</div>
                Filtros
                {activeFiltersCount() > 0 && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center">
                    {activeFiltersCount()}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* PAINEL DE FILTROS */}
        <FilterPanel
          show={showFilters}
          onClose={() => setShowFilters(false)}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedAmenities={selectedAmenities}
          setSelectedAmenities={setSelectedAmenities}
          onlySuperhost={onlySuperhost}
          setOnlySuperhost={setOnlySuperhost}
          onlyVerified={onlyVerified}
          setOnlyVerified={setOnlyVerified}
          clearFilters={clearFilters}
          resultCount={filteredAndSortedProperties.length}
        />

        {/* ── SEÇÃO 1: Ofertas Incríveis ── */}
        <Section
          title="Ofertas incríveis"
          subtitle="Os melhores preços disponíveis agora em Capitólio"
          icon=""
          items={filteredAndSortedProperties.filter(p => p.oldPrice).slice(0, 4)}
          filtered={activeFilter}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />

        {/* ── SEÇÃO 2: Recomendadas ── */}
        <Section
          title="Estadias recomendadas para você"
          subtitle="Escolhas baseadas nas avaliações mais altas"
          icon=""
          items={filteredAndSortedProperties.filter(p => p.score >= 9.0).slice(0, 4)}
          filtered={activeFilter}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />

        {/* ── SEÇÃO 3: Última Hora ── */}
        <Section
          title="Ofertas de última hora"
          subtitle="Reserve agora com desconto especial"
          icon=""
          items={filteredAndSortedProperties.filter(p => p.oldPrice).reverse().slice(0, 4)}
          filtered={activeFilter}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />

        {/* ── ATRATIVOS TURÍSTICOS ── */}
        <div>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">Atrativos Turísticos</h2>
              <p className="text-sm text-gray-500">O que não pode faltar na sua visita a Capitólio</p>
            </div>
            <a href="#todos-atrativos" className="text-sm md:text-base font-semibold transition-all hover:underline min-h-[44px] flex items-center gap-1" style={{ color: "#003580" }}>
              Ver todos os atrativos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {(atrativosTuristicos ?? []).map(atrativo => (
              <AtrativoCard key={atrativo.id} atrativo={atrativo} favorites={favorites} toggleFavorite={toggleFavorite} isFavorite={isFavorite} />
            ))}
          </div>
        </div>

        {/* ── ONDE COMER ── */}
        <div>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">Onde Comer</h2>
              <p className="text-sm text-gray-500">Os melhores restaurantes e bares de Capitólio</p>
            </div>
            <a href="#todos-restaurantes" className="text-sm md:text-base font-semibold transition-all hover:underline min-h-[44px] flex items-center gap-1" style={{ color: "#003580" }}>
              Ver todos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {(restaurantes ?? []).map(restaurante => (
              <RestauranteCard key={restaurante.id} restaurante={restaurante} favorites={favorites} toggleFavorite={toggleFavorite} isFavorite={isFavorite} />
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTEÚDO PRINCIPAL ─── */}
      <main id="main-content">
        {/* ── BANNER GIFTBACK ─── */}
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
                <button className="font-semibold px-8 py-3 rounded-xl border border-white/30 text-white text-sm hover:bg-white/10 transition-all">Ver com maior Giftback</button>
              </div>
            </div>
          </div>
        </section>

        {/* ── PARCEIROS DE PASSEIOS ─── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">Passeios e Aventuras</h2>
              <p className="text-sm text-gray-500">Parceiros oficiais para tornar sua estadia inesquecível</p>
            </div>
            <a href="#todos-parceiros" className="hidden md:flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl border-2 transition-all hover:bg-blue-50" style={{ borderColor: "#003580", color: "#003580" }}>
              Ver todos os parceiros
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {(passeiosParceiros ?? []).map(parceiro => (
              <ParceiroCard key={parceiro.id} parceiro={parceiro} favorites={favorites} toggleFavorite={toggleFavorite} isFavorite={isFavorite} />
            ))}
          </div>
        </section>
      </main>

      {/* ── FOOTER ─── */}
      <Footer />
    </div>
  );
}
