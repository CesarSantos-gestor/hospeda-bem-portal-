"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

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

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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

// ─── PROPS ──────────────────────────────────────────────────────────────────
interface CityPageClientProps {
  citySlug: string;
  cityName: string;
  cityState: string;
  cityHighlights: string;
}

export function CityPageClient({ citySlug, cityName, cityState, cityHighlights }: CityPageClientProps) {
  const router = useRouter();

  // ─── STORES ──────────────────────────────────────────────────────────────────
  const { favorites, toggleFavorite, isFavorite } = useFavoritesStore();
  const { selectedCity, setSelectedCity, checkIn, checkOut, setDates, rooms, showCityPicker, setShowCityPicker, totalGuests, addRoom, removeRoom, updateRoom } = useSearchStore();
  const { activeFilter, setActiveFilter, priceRange, setPriceRange, selectedAmenities, setSelectedAmenities, onlySuperhost, setOnlySuperhost, onlyVerified, setOnlyVerified, sortBy, setSortBy, toggleAmenity, clearFilters, activeFiltersCount } = useFilterStore();
  const { showFilters, setShowFilters, showMobileMenu, setShowMobileMenu } = useUIStore();

  // Sync URL city param with store
  useEffect(() => {
    if (citySlug && citySlug !== selectedCity) setSelectedCity(citySlug);
  }, [citySlug, selectedCity, setSelectedCity]);

  // ─── API DATA (fallback = static data for instant render) ───────────────────
  const { data: cities } = useApiData<City[]>("/api/cities", CITIES_FALLBACK);
  const { data: properties } = useApiData<Property[]>(`/api/properties?city=${citySlug}`, propertiesFallback);
  const { data: restaurantes } = useApiData<Restaurant[]>(`/api/restaurants?city=${citySlug}`, restaurantesFallback);
  const { data: atrativosTuristicos } = useApiData<Attraction[]>(`/api/attractions?city=${citySlug}`, atrativosFallback);
  const { data: passeiosParceiros } = useApiData<Tour[]>(`/api/tours?city=${citySlug}`, passeiosFallback);

  const filteredAndSortedProperties = sortProperties(
    applyFilters(properties ?? [], activeFilter, priceRange, selectedAmenities, onlySuperhost, onlyVerified),
    sortBy,
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const shuffledProperties = useMemo(() => shuffle(filteredAndSortedProperties), [filteredAndSortedProperties.length, activeFilter, sortBy, priceRange, selectedAmenities.length, onlySuperhost, onlyVerified]);

  const propertyCount = properties?.length ?? 0;

  function handleCityChange(newSlug: string) {
    setSelectedCity(newSlug);
    setShowCityPicker(false);
    router.push(`/${newSlug}`);
  }

  function handleSearch() {
    // Scroll to results
    document.getElementById("resultados")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Acessibilidade */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-blue-900 focus:text-white focus:px-6 focus:py-3 focus:rounded-lg focus:font-semibold focus:shadow-xl">
        Pular para o conteúdo principal
      </a>

      {/* ── NAVBAR ─── */}
      <Navbar />

      {/* ── BREADCRUMBS ─── */}
      <nav aria-label="Breadcrumb" className="hidden md:block bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-2 text-sm" itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center gap-2">
              <a href="/" itemProp="item" className="text-gray-600 hover:text-gray-900 transition-colors hover:underline">
                <span itemProp="name">Home</span>
              </a>
              <meta itemProp="position" content="1" />
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center gap-2">
              <a href={`/${citySlug}`} itemProp="item" className="text-gray-600 hover:text-gray-900 transition-colors hover:underline">
                <span itemProp="name">{cityName}</span>
              </a>
              <meta itemProp="position" content="2" />
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span itemProp="name" className="font-semibold text-gray-900" aria-current="page">Hospedagens</span>
              <meta itemProp="position" content="3" />
            </li>
          </ol>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ─── */}
      <MobileDrawer show={showMobileMenu} onClose={() => setShowMobileMenu(false)} />

      {/* ── HERO + BUSCA ─── */}
      <section className="relative" style={{ background: `linear-gradient(165deg, ${C.dark} 0%, ${C.navy} 50%, ${C.blue} 100%)` }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          <div className="absolute -top-10 right-1/4 w-80 h-80 rounded-full" style={{ backgroundColor: C.yellow, filter: "blur(80px)" }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full" style={{ backgroundColor: C.lightBlue, filter: "blur(60px)" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-10 pb-0">
          <h1 className="text-2xl md:text-4xl font-black text-white mb-1">
            Hospedagens em <span style={{ color: C.yellow }}>{cityName}</span>
          </h1>
          <p className="text-blue-100 text-sm mb-6">
            {propertyCount > 0 ? `${propertyCount} opções disponíveis` : "Carregando opções"} · {cityHighlights} · Reserve direto e ganhe Giftback
          </p>

          {/* BARRA DE BUSCA */}
          <div className="bg-white rounded-2xl shadow-2xl">
            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
              {/* Destino */}
              <div className="relative">
                <button onClick={() => setShowCityPicker(!showCityPicker)} className="w-full flex items-center gap-2 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left border border-gray-100">
                  <div className="w-4 h-4 flex-shrink-0" style={{ color: C.navy }}><Icon.pin /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">DESTINO</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{cityName}, {cityState}</p>
                  </div>
                  <div className={`w-4 h-4 text-gray-400 transition-transform ${showCityPicker ? "rotate-180" : ""}`}>{Icon.chevronDown()}</div>
                </button>
                {showCityPicker && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowCityPicker(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-64 overflow-y-auto">
                      {(cities ?? CITIES_FALLBACK).map(c => (
                        <button key={c.id} onClick={() => handleCityChange(c.id)}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${c.id === citySlug ? "bg-blue-50" : ""}`}>
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
                <button
                  onClick={handleSearch}
                  className="flex items-center gap-2 text-white font-black px-6 py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all w-full lg:w-auto justify-center text-sm"
                  style={{ backgroundColor: C.navy }}
                >
                  <div className="w-4 h-4"><Icon.search /></div>
                  Buscar
                </button>
              </div>
            </div>
          </div>

          {/* Tags de comodidades */}
          <div className="py-5">
            <div className="md:hidden -mx-4 px-4 overflow-x-auto pb-2 relative" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-12 z-10 bg-gradient-to-l from-[#003580]/80 to-transparent md:hidden" />
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

      {/* ── CONTEÚDO PRINCIPAL ─── */}
      <main id="main-content">
        <div id="resultados" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 md:space-y-14">
          {/* Filtros */}
          <div className="space-y-3">
            {/* Mobile chips + sort/filters - sticky */}
            <div className="md:hidden sticky top-[104px] z-30 bg-gray-50 -mx-4 px-4 py-2 space-y-2">
              <div className="flex gap-2 overflow-x-auto pb-1 relative" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <div className="pointer-events-none absolute right-0 top-0 bottom-1 w-10 z-10 bg-gradient-to-l from-gray-50 to-transparent" />
                {FILTERS.map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-black border-2 transition-all flex-shrink-0 ${
                      activeFilter === f ? "border-transparent text-white shadow-md" : "bg-white text-gray-700 border-gray-300"
                    }`}
                    style={activeFilter === f ? { backgroundColor: C.navy } : {}}>
                    {f}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-white border-2 rounded-xl px-4 py-2.5 text-sm font-bold hover:border-gray-400 relative shadow-sm flex-1"
                style={{ borderColor: showFilters ? C.navy : "#d1d5db", color: showFilters ? C.navy : "#374151" }}>
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
            </div>

            {/* Desktop filters */}
            <div className="hidden md:flex items-center justify-between gap-3">
              <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
                {FILTERS.map(f => (
                  <button key={f} onClick={() => setActiveFilter(f)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-black border transition-all flex-shrink-0 ${activeFilter === f ? "text-white border-transparent" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}
                    style={activeFilter === f ? { backgroundColor: C.navy } : {}}>
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
                  style={{ borderColor: showFilters ? C.navy : "#e5e7eb", color: showFilters ? C.navy : "#4b5563" }}>
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

          {/* ── OFERTAS INCRÍVEIS (todas as propriedades em ordem aleatória) ── */}
          <Section
            title="Ofertas incríveis"
            subtitle={`Os melhores preços disponíveis agora em ${cityName}`}
            icon=""
            items={shuffledProperties}
            filtered={activeFilter}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            cityName={cityName}
            cityState={cityState}
          />

          {/* ── ATRATIVOS TURÍSTICOS ── */}
          {(atrativosTuristicos ?? []).length > 0 && (
            <section>
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">Atrativos Turísticos</h2>
                  <p className="text-sm text-gray-500">O que não pode faltar na sua visita a {cityName}</p>
                </div>
              </div>
              <div className="relative -mx-4 md:mx-0">
                <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-12 z-10 bg-gradient-to-l from-gray-50 to-transparent md:hidden" />
                <div className="overflow-x-auto pb-4 px-4 md:px-0 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <div className="flex gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-5">
                    {(atrativosTuristicos ?? []).map(atrativo => (
                      <div key={atrativo.id} className="flex-shrink-0 snap-start w-[85%] sm:w-[45%] md:w-auto">
                        <AtrativoCard atrativo={atrativo} favorites={favorites} toggleFavorite={toggleFavorite} isFavorite={isFavorite} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── RESTAURANTES ── */}
          {(restaurantes ?? []).length > 0 && (
            <section>
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">Restaurantes</h2>
                  <p className="text-sm text-gray-500">Os melhores restaurantes e bares de {cityName}</p>
                </div>
              </div>
              <div className="relative -mx-4 md:mx-0">
                <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-12 z-10 bg-gradient-to-l from-gray-50 to-transparent md:hidden" />
                <div className="overflow-x-auto pb-4 px-4 md:px-0 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <div className="flex gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-5">
                    {(restaurantes ?? []).map(restaurante => (
                      <div key={restaurante.id} className="flex-shrink-0 snap-start w-[85%] sm:w-[45%] md:w-auto">
                        <RestauranteCard restaurante={restaurante} favorites={favorites} toggleFavorite={toggleFavorite} isFavorite={isFavorite} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* ── ATRATIVOS ─── */}
        {(passeiosParceiros ?? []).length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">Atrativos</h2>
                <p className="text-sm text-gray-500">Descubra o melhor de {cityName}</p>
              </div>
            </div>
            <div className="relative -mx-4 md:mx-0">
              <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-12 z-10 bg-gradient-to-l from-gray-50 to-transparent md:hidden" />
              <div className="overflow-x-auto pb-4 px-4 md:px-0 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <div className="flex gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-5">
                  {(passeiosParceiros ?? []).map(parceiro => (
                    <div key={parceiro.id} className="flex-shrink-0 snap-start w-[85%] sm:w-[45%] md:w-auto">
                      <ParceiroCard parceiro={parceiro} favorites={favorites} toggleFavorite={toggleFavorite} isFavorite={isFavorite} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── BANNER GIFTBACK ─── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-3xl p-5 md:p-8 lg:p-12 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${C.dark}, ${C.navy}, ${C.blue})` }}>
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
                <button className="font-semibold px-8 py-3 rounded-xl border border-white/50 text-white text-sm hover:bg-white/10 transition-all">Ver com maior Giftback</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ─── */}
      <Footer />
    </div>
  );
}
