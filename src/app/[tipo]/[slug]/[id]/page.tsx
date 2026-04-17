"use client";
import { useState, useEffect, useCallback, use } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import { useFavoritesStore, useSearchStore } from "@/stores";
import { useApiData } from "@/hooks/useApiData";
import type { PropertyDetail, InventoryEntry, LengthDiscount } from "@/types";
import { getRoomPriceForDate, buildInventoryMap, applyLengthDiscount, type InventoryMap } from "@/lib/rate-calculator";
import { Portal as C } from "@/constants/colors";

// Calendar helpers
interface CalendarDay { price: number | null; available: boolean; minStay: number; }
function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function toDateStr(d: Date) { return d.toISOString().slice(0, 10); }
function fmtShort(v: number) { return v.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 }); }
function fmt(v: number) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const WKDAYS = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

// ═══════════════════════════════════════════════════════════════════════
// ÍCONES SVG (mesmos da home)
// ═══════════════════════════════════════════════════════════════════════

const Icon = {
  // Logo
  pin: () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" opacity="0.3"/></svg>,

  // Navegação
  back: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
  menu: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  user: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,

  // Ações
  heart: (filled: boolean) => <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  share: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>,

  // Menu items
  hotel: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  utensils: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"/></svg>,
  camera: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  ticket: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 0 0-2 2v3a2 2 0 1 1 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 1 1 0-4V7a2 2 0 0 0-2-2H5z"/></svg>,
  megaphone: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 11v3a1 1 0 0 0 1 1h2l4.3 4.3c.4.4 1.1.1 1.1-.5V5.2c0-.6-.7-.9-1.1-.5L6 9H4a1 1 0 0 0-1 1zM13 8.5v7M17 9.5v5"/></svg>,

  // Property
  shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  verified: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  star: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  locationPin: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  x: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  grid: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,

  // Comodidades
  wifi: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg>,
  poolIcon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 15c1.67-2.33 4.67-2.33 6.34 0 1.66 2.33 4.66 2.33 6.33 0 1.67-2.33 4.67-2.33 6.34 0M2 19c1.67-2.33 4.67-2.33 6.34 0 1.66 2.33 4.66 2.33 6.33 0 1.67-2.33 4.67-2.33 6.34 0"/><path d="M20 4v10"/><path d="M4 7v3"/></svg>,
  coffee: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  aircon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2v4m8-4v4M3 9h18M3 13h18M3 17h18M12 9v12m-4-8l4-4 4 4"/></svg>,
  parking: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a4 4 0 0 1 0 8h-4"/></svg>,
  tv: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>,
  bed: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4v16m20-16v16M6 8h12M6 12h12M6 16h12"/></svg>,
  users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  ruler: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.3 8.7L8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4z"/><path d="M7.5 10.5L9 9M11 15l1.5-1.5M14.5 18.5L16 17"/></svg>,
  check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  xCircle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  mapPin: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  navigation: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>,
  info: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  bathtub: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6a3 3 0 0 1 3-3 3 3 0 0 1 3 3"/><path d="M22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6"/><path d="M2 12h20"/><path d="M5 16v2M19 16v2"/></svg>,
  eye: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  phone: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  mail: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  globe: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  whatsapp: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>,
};

// ═══════════════════════════════════════════════════════════════════════
// COMPONENTE LOGO (EXATAMENTE IGUAL DA HOME)
// ═══════════════════════════════════════════════════════════════════════

function Logo() {
  return (
    <a href="/" className="flex items-center gap-2.5 h-9 group cursor-pointer">
      {/* SVG exato do arquivo original - "h" estilizado */}
      <svg viewBox="0 0 777 777" className="h-full w-auto" fill="none">
        <path fill="#003580" fillRule="nonzero"
          d="M0 777l0 -777 124 0 0 280c0,0 93,-124 264,-124 171,0 264,124 264,124l0 -280 124 0 0 777 -124 0 0 -326c0,-124 -93,-186 -264,-186 -171,0 -264,62 -264,186l0 326 -124 0z"/>
        <circle cx="388" cy="93" r="43" fill="#FBBF23"/>
      </svg>
      <span className="font-black leading-none" style={{ fontFamily: "Inter, sans-serif", fontSize: "1.35rem" }}>
        <span style={{ color: "#003580" }}>hospeda</span><span style={{ color: "#FBBF23" }}>bem</span>
      </span>
    </a>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// NAV ITEMS (mesmos da home)
// ═══════════════════════════════════════════════════════════════════════

const NAV_ITEMS = [
  { icon: <Icon.hotel />, label: "Hospedagens", active: false },
  { icon: <Icon.utensils />, label: "Restaurantes", active: false },
  { icon: <Icon.camera />, label: "Atrativos", active: false },
  { icon: <Icon.ticket />, label: "Passeios", active: false },
];

// ═══════════════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════════════

interface PropertyPageProps {
  params: Promise<{
    tipo: string;
    slug: string;
    id: string;
  }>;
}

// ═══════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════

export default function PropertyPage({ params }: PropertyPageProps) {
  const { tipo, slug, id } = use(params);
  const { data: property, loading } = useApiData<PropertyDetail>(`/api/properties/${id}`);

  // ─── SHARED STORES ──────────────────────────────────────────────────────────
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { checkIn, checkOut, setDates } = useSearchStore();

  // ─── LOCAL UI STATE ────────────────────────────────────────────────────────
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [guests, setGuests] = useState({ adults: 2, children: 0 });
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [selectedRoomPolicy, setSelectedRoomPolicy] = useState<{[key: number]: string}>({});
  const [currentRoomImage, setCurrentRoomImage] = useState<{[key: number]: number}>({});
  const [inventoryData, setInventoryData] = useState<InventoryMap>({});
  const [ratePlansMap, setRatePlansMap] = useState<Record<number, { basePrice: number }>>({});
  const [lengthDiscounts, setLengthDiscounts] = useState<LengthDiscount[]>([]);

  // Calendar state
  const router = useRouter();
  const [calCheckIn, setCalCheckIn] = useState<string | null>(null);
  const [calCheckOut, setCalCheckOut] = useState<string | null>(null);
  const [calendarData, setCalendarData] = useState<Record<string, CalendarDay>>({});
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [isMobile, setIsMobile] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  useEffect(() => {
    const c = () => setIsMobile(window.innerWidth < 768);
    c(); window.addEventListener("resize", c);
    return () => window.removeEventListener("resize", c);
  }, []);

  // Calendar data - portal doesn't have booking API, so calendar is view-only
  const fetchCalendar = useCallback(async (_year: number, _month: number) => {
    // No booking API in portal - calendar is informational only
  }, []);

  const handleCalendarDayClick = (ds: string) => {
    const today = toDateStr(new Date());
    if (ds < today) return;
    const day = calendarData[ds];
    if (day && !day.available) return;
    if (!calCheckIn || (calCheckIn && calCheckOut)) { setCalCheckIn(ds); setCalCheckOut(null); }
    else if (ds <= calCheckIn) { setCalCheckIn(ds); setCalCheckOut(null); }
    else { setCalCheckOut(ds); }
  };

  const handleSearchBooking = () => {
    if (!calCheckIn || !calCheckOut) return;
    const params = new URLSearchParams({
      checkIn: calCheckIn,
      checkOut: calCheckOut,
      adults: String(guests.adults),
      children: String(guests.children),
    });
    // Portal doesn't have booking engine - placeholder for future
    window.alert("Reserva em breve!");
  };

  const totalNights = calCheckIn && calCheckOut
    ? Math.round((new Date(calCheckOut).getTime() - new Date(calCheckIn).getTime()) / 86400000) : 0;

  // Portal uses room base prices directly (no PMS rate plans/inventory)

  // Helper: get effective price for a room (today or average over stay)
  const getRoomEffectivePrice = (room: { id: number; price: number; ratePlanId?: number | null; rateTotal?: number | null }) => {
    const rpBase = room.ratePlanId ? ratePlansMap[room.ratePlanId] : undefined;
    const rpInfo = rpBase ? { basePrice: rpBase.basePrice, rateTotal: room.rateTotal ?? null } : undefined;

    if (checkIn && checkOut) {
      // Average price over stay
      let total = 0;
      let nights = 0;
      const current = new Date(checkIn);
      while (current < checkOut) {
        const dateStr = current.toISOString().slice(0, 10);
        total += getRoomPriceForDate(room.id, dateStr, room.price, rpInfo, inventoryData);
        nights++;
        current.setDate(current.getDate() + 1);
      }
      return { perNight: nights > 0 ? Math.round(total / nights) : room.price, total, nights: nights || 1 };
    }

    // No dates: show today's price
    const todayStr = new Date().toISOString().slice(0, 10);
    const price = getRoomPriceForDate(room.id, todayStr, room.price, rpInfo, inventoryData);
    return { perNight: price, total: price, nights: 1 };
  };

  // ─── LOADING STATE ────────────────────────────────────────────────────────
  if (loading || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: `${C.navy}20`, borderTopColor: C.navy }} />
          <p className="text-gray-600 font-semibold">Carregando...</p>
        </div>
      </div>
    );
  }

  // ─── VALIDAÇÃO DE URL ────────────────────────────────────────────────────────
  if (property.type?.toLowerCase() !== tipo) notFound();
  if (property.slug && property.slug !== slug) notFound();

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');*{font-family:'Inter',sans-serif}`}</style>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* NAVBAR - IGUAL DA HOME */}
      {/* ═══════════════════════════════════════════════════════════ */}

      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-6">
            <Logo />

            {/* Menu regional - desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.label}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${item.active ? "text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}`}
                  style={item.active ? { backgroundColor: C.navy } : {}}>
                  <div className="w-4 h-4">{item.icon}</div>
                  {item.label}
                </button>
              ))}
            </div>

            {/* Direita */}
            <div className="flex items-center gap-2">
              <button
                className="hidden md:flex items-center gap-2 text-sm font-black px-4 py-2 rounded-full border-2 transition-all hover:text-white"
                style={{ borderColor: C.navy, color: C.navy }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = C.navy; (e.currentTarget as HTMLElement).style.color = "white"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = C.navy; }}>
                <div className="w-4 h-4"><Icon.megaphone /></div>
                Anuncie seu Hotel
              </button>
              <button className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-2 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-4 h-4 text-gray-600"><Icon.menu /></div>
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: C.navy }}>
                  <div className="w-4 h-4 text-white"><Icon.user /></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        <div className="lg:hidden overflow-x-auto border-t border-gray-100">
          <div className="flex gap-1 px-4 py-2 w-max">
            {[...NAV_ITEMS, { icon: <Icon.megaphone />, label: "Anunciar", active: false }].map(item => (
              <button
                key={item.label}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${item.active ? "text-white" : "text-gray-600 bg-gray-100"}`}
                style={item.active ? { backgroundColor: C.navy } : {}}>
                <div className="w-3.5 h-3.5">{item.icon}</div>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* AÇÕES RÁPIDAS */}
      {/* ═══════════════════════════════════════════════════════════ */}

      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition-colors">
              <div className="w-5 h-5">{Icon.back()}</div>
              <span className="hidden sm:inline">Voltar</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(property.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors">
                <div className={`w-5 h-5 transition-colors ${isFavorite(property.id) ? "text-red-500" : "text-gray-600"}`}>
                  {Icon.heart(isFavorite(property.id))}
                </div>
                <span className="hidden sm:inline font-semibold text-gray-700">
                  {isFavorite(property.id) ? "Salvo" : "Salvar"}
                </span>
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors">
                <div className="w-5 h-5 text-gray-600">{Icon.share()}</div>
                <span className="hidden sm:inline font-semibold text-gray-700">Compartilhar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* GALERIA */}
      {/* ═══════════════════════════════════════════════════════════ */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-8">
        <div className="hidden md:grid md:grid-cols-4 md:grid-rows-2 gap-2 rounded-2xl overflow-hidden h-[500px]">
          <div className="col-span-2 row-span-2 relative cursor-pointer group" onClick={() => setShowAllPhotos(true)}>
            <Image src={property.images[0]} alt={`${property.name} - Principal`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority/>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"/>
          </div>
          {property.images.slice(1, 5).map((img, idx) => (
            <div key={idx} className="relative cursor-pointer group" onClick={() => setShowAllPhotos(true)}>
              <Image src={img} alt={`${property.name} - ${idx + 2}`} fill sizes="25vw" className="object-cover"/>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"/>
            </div>
          ))}
        </div>

        <div className="md:hidden rounded-2xl overflow-hidden">
          <div className="overflow-x-auto snap-x snap-mandatory scrollbar-hide">
            <div className="flex">
              {property.images.slice(0, 5).map((img, idx) => (
                <div key={idx} className="flex-shrink-0 w-full snap-start">
                  <Image src={img} alt={`${property.name} - ${idx + 1}`} width={800} height={256} sizes="100vw" className="w-full h-64 object-cover" priority={idx === 0}/>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button onClick={() => setShowAllPhotos(true)} className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors font-semibold text-gray-700">
          <div className="w-4 h-4">{Icon.grid()}</div>
          <span>Ver todas as {property.images.length} fotos</span>
        </button>
      </div>

      {/* MODAL GALERIA */}
      {showAllPhotos && (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="absolute top-0 left-0 right-0 bg-black/80 backdrop-blur-sm z-10">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <h2 className="text-white font-bold text-lg">Fotos de {property.name}</h2>
              <button onClick={() => setShowAllPhotos(false)} className="text-white hover:bg-white/10 p-2 rounded-full transition-colors">
                <div className="w-6 h-6">{Icon.x()}</div>
              </button>
            </div>
          </div>
          <div className="h-full overflow-y-auto pt-20 pb-8">
            <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.images.map((img, idx) => (
                <div key={idx} className="bg-gray-900">
                  <Image src={img} alt={`${property.name} - ${idx + 1}`} width={800} height={600} sizes="(max-width: 768px) 100vw, 50vw" className="w-full h-auto"/>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* CALENDÁRIO MOBILE - Visível só em telas menores */}
      {/* ═══════════════════════════════════════════════════════════ */}

      <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 pb-4">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-5">
          <h3 className="font-bold text-gray-900 mb-3" style={{ fontSize: 16 }}>Selecione suas datas</h3>

          {/* Datas selecionadas */}
          <div className="border border-gray-200 rounded-lg mb-3 overflow-hidden">
            <div className="grid grid-cols-2 divide-x divide-gray-200">
              <div className="p-2.5">
                <div style={{ fontSize: 9 }} className="font-bold text-gray-400 uppercase mb-0.5">CHECK-IN</div>
                <div className="text-sm font-semibold" style={{ color: calCheckIn ? C.navy : '#9CA3AF' }}>
                  {calCheckIn ? new Date(calCheckIn + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) : "Selecione"}
                </div>
              </div>
              <div className="p-2.5">
                <div style={{ fontSize: 9 }} className="font-bold text-gray-400 uppercase mb-0.5">CHECK-OUT</div>
                <div className="text-sm font-semibold" style={{ color: calCheckOut ? C.navy : '#9CA3AF' }}>
                  {calCheckOut ? new Date(calCheckOut + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) : "Selecione"}
                </div>
              </div>
            </div>
          </div>

          {/* Calendar mobile - 1 month */}
          {(() => {
            const today = toDateStr(new Date());
            const renderMobileMonth = (year: number, month: number) => {
              const days = getDaysInMonth(year, month);
              const first = new Date(year, month, 1).getDay();
              const cells: React.ReactNode[] = [];
              for (let i = 0; i < first; i++) cells.push(<div key={`e${i}`} />);
              for (let d = 1; d <= days; d++) {
                const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                const past = ds < today;
                const dayData = calendarData[ds];
                const isCi = ds === calCheckIn, isCo = ds === calCheckOut;
                const inRange = calCheckIn && calCheckOut && ds > calCheckIn && ds < calCheckOut;
                const sel = isCi || isCo;
                const unavailable = dayData && !dayData.available;
                const price = dayData?.price;
                const minStay = dayData?.minStay || 1;
                cells.push(
                  <button key={d} type="button" disabled={past || (unavailable ?? false)}
                    onClick={() => handleCalendarDayClick(ds)}
                    style={{
                      width: "100%", aspectRatio: "1", border: "none", borderRadius: sel ? 8 : 4,
                      cursor: past || unavailable ? "default" : "pointer",
                      backgroundColor: sel ? C.navy : inRange ? C.navy + "15" : "transparent",
                      color: past ? "#C5CBD8" : unavailable ? "#C5CBD8" : sel ? "#fff" : "#1A2138",
                      fontWeight: sel ? 700 : 500, fontSize: 12,
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      gap: 1, padding: 2, position: "relative", transition: "all 0.12s",
                    }}>
                    <span style={{ fontSize: 13, lineHeight: 1 }}>{d}</span>
                    {unavailable ? (
                      <span style={{ color: "#EF4444", fontSize: 10, fontWeight: 800, lineHeight: 1 }}>✕</span>
                    ) : price != null && !past ? (
                      <span style={{ fontSize: 8, lineHeight: 1, fontWeight: 600, opacity: sel ? 0.9 : 0.7, color: sel ? "#fff" : C.navy }}>
                        {fmtShort(price)}
                      </span>
                    ) : null}
                    {minStay > 1 && !past && !unavailable && (
                      <span style={{ position: "absolute", top: 1, right: 2, fontSize: 7, color: sel ? "rgba(255,255,255,0.7)" : "#8C95A8", fontWeight: 700 }}>{minStay}n</span>
                    )}
                  </button>
                );
              }
              return (
                <div>
                  <div style={{ textAlign: "center", fontWeight: 700, marginBottom: 8, color: "#1A2138", fontSize: 14 }}>{MONTHS[month]} {year}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, textAlign: "center" }}>
                    {WKDAYS.map(w => <div key={w} style={{ fontSize: 10, color: "#8C95A8", fontWeight: 700, padding: "3px 0", textTransform: "uppercase" }}>{w}</div>)}
                    {cells}
                  </div>
                </div>
              );
            };
            return (
              <div className="mb-3">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <button type="button" onClick={() => {
                    let m = calendarMonth.month - 1, y = calendarMonth.year;
                    if (m < 0) { m = 11; y--; }
                    setCalendarMonth({ year: y, month: m });
                  }} style={{ background: "none", border: "1px solid #DFE3EB", borderRadius: 8, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                    <span style={{ fontSize: 14 }}>‹</span>
                  </button>
                  {loadingCalendar && <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: `${C.navy}20`, borderTopColor: C.navy }} />}
                  <button type="button" onClick={() => {
                    let m = calendarMonth.month + 1, y = calendarMonth.year;
                    if (m > 11) { m = 0; y++; }
                    setCalendarMonth({ year: y, month: m });
                  }} style={{ background: "none", border: "1px solid #DFE3EB", borderRadius: 8, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                    <span style={{ fontSize: 14 }}>›</span>
                  </button>
                </div>
                {renderMobileMonth(calendarMonth.year, calendarMonth.month)}
              </div>
            );
          })()}

          {/* Hóspedes mobile */}
          <button
            onClick={() => setShowGuestPicker(!showGuestPicker)}
            className="w-full border border-gray-200 rounded-lg p-2.5 text-left hover:bg-gray-50 transition-colors flex items-center justify-between mb-3">
            <div>
              <div style={{ fontSize: 9 }} className="font-bold text-gray-400 uppercase mb-0.5">HÓSPEDES</div>
              <div className="text-sm font-semibold text-gray-900">
                {guests.adults} {guests.adults === 1 ? "adulto" : "adultos"}
                {guests.children > 0 && `, ${guests.children} ${guests.children === 1 ? "criança" : "crianças"}`}
              </div>
            </div>
            <span style={{ fontSize: 14, color: "#8C95A8", transform: showGuestPicker ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
          </button>
          {showGuestPicker && (
            <div className="border border-gray-200 rounded-lg p-3 space-y-2 mb-3">
              <div className="flex items-center justify-between">
                <div><div className="text-sm font-semibold">Adultos</div></div>
                <div className="flex items-center gap-3">
                  <button type="button" disabled={guests.adults <= 1} onClick={() => setGuests(g => ({ ...g, adults: g.adults - 1 }))}
                    className="w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold"
                    style={{ borderColor: guests.adults <= 1 ? "#DFE3EB" : C.navy, color: guests.adults <= 1 ? "#DFE3EB" : C.navy }}>−</button>
                  <span className="w-5 text-center font-bold">{guests.adults}</span>
                  <button type="button" disabled={guests.adults >= 10} onClick={() => setGuests(g => ({ ...g, adults: g.adults + 1 }))}
                    className="w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold"
                    style={{ borderColor: guests.adults >= 10 ? "#DFE3EB" : C.navy, color: guests.adults >= 10 ? "#DFE3EB" : C.navy }}>+</button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div><div className="text-sm font-semibold">Crianças</div></div>
                <div className="flex items-center gap-3">
                  <button type="button" disabled={guests.children <= 0} onClick={() => setGuests(g => ({ ...g, children: g.children - 1 }))}
                    className="w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold"
                    style={{ borderColor: guests.children <= 0 ? "#DFE3EB" : C.navy, color: guests.children <= 0 ? "#DFE3EB" : C.navy }}>−</button>
                  <span className="w-5 text-center font-bold">{guests.children}</span>
                  <button type="button" disabled={guests.children >= 10} onClick={() => setGuests(g => ({ ...g, children: g.children + 1 }))}
                    className="w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold"
                    style={{ borderColor: guests.children >= 10 ? "#DFE3EB" : C.navy, color: guests.children >= 10 ? "#DFE3EB" : C.navy }}>+</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* LAYOUT UNIFICADO: HEADER + CONTEÚDO + SIDEBAR */}
      {/* ═══════════════════════════════════════════════════════════ */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 lg:pb-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">

          {/* COLUNA ESQUERDA - Header + Conteúdo */}
          <div className="lg:col-span-2">

            {/* Header Info */}
            <div>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {property.superhost && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                    <div className="w-3.5 h-3.5">{Icon.shield()}</div>
                    <span>Host Premium</span>
                  </div>
                )}
                {property.verified && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                    <div className="w-3.5 h-3.5">{Icon.verified()}</div>
                    <span>Verificado</span>
                  </div>
                )}
              </div>

              {/* Nome */}
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{property.name}</h1>

              {/* Score e Localização */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg rounded-tr-none font-black text-white" style={{ backgroundColor: C.navy }}>
                    {property.score}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{property.scoreLabel}</div>
                    <div className="text-gray-600">{property.reviews} avaliações</div>
                  </div>
                </div>

                {property.city && (
                  <>
                    <div className="hidden sm:block w-px h-8 bg-gray-300"/>
                    <div className="flex items-center gap-2 text-gray-700">
                      <div className="w-4 h-4 flex-shrink-0">{Icon.locationPin()}</div>
                      <span className="font-semibold">{property.city}, {property.state}, {property.country}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Seções de Conteúdo */}
            <div className="space-y-6">

            {/* 1. SOBRE A PROPRIEDADE */}
            {property.description && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200 mt-6">
                <h2 className="text-2xl font-black text-gray-900 mb-4">Sobre esta propriedade</h2>
                <p className="text-gray-700 leading-relaxed">
                  {showFullDescription ? property.description : `${property.description.slice(0, 200)}...`}
                </p>
                {property.description.length > 200 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-3 font-bold text-sm hover:underline"
                    style={{ color: C.navy }}>
                    {showFullDescription ? "Ver menos" : "Ler mais"}
                  </button>
                )}
              </div>
            )}

            {/* 2. COMODIDADES */}
            {property.amenitiesDetail && property.amenitiesDetail.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-2xl font-black text-gray-900 mb-6">O que este lugar oferece</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(showAllAmenities ? property.amenitiesDetail : property.amenitiesDetail.slice(0, 6)).map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-6 h-6 ${amenity.included ? "text-gray-900" : "text-gray-400"}`}>
                        {amenity.icon === "wifi" && Icon.wifi()}
                        {amenity.icon === "pool" && Icon.poolIcon()}
                        {amenity.icon === "coffee" && Icon.coffee()}
                        {amenity.icon === "ac" && Icon.aircon()}
                        {amenity.icon === "parking" && Icon.parking()}
                        {amenity.icon === "tv" && Icon.tv()}
                        {!["wifi","pool","coffee","ac","parking","tv"].includes(amenity.icon) && Icon.check()}
                      </div>
                      <span className={`text-sm font-semibold ${amenity.included ? "text-gray-900" : "text-gray-400 line-through"}`}>
                        {amenity.label}
                      </span>
                    </div>
                  ))}
                </div>
                {property.amenitiesDetail.length > 6 && (
                  <button
                    onClick={() => setShowAllAmenities(!showAllAmenities)}
                    className="mt-6 px-6 py-3 border-2 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors"
                    style={{ borderColor: C.navy, color: C.navy }}>
                    {showAllAmenities ? "Ver menos" : `+ Ver todas ${property.amenitiesDetail.length} comodidades`}
                  </button>
                )}
              </div>
            )}

            {/* 3. QUARTOS - LAYOUT FINAL ALINHADO */}
            {property.rooms && property.rooms.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Escolha seu quarto</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {property.rooms.map((room) => {
                    const selectedPolicy = selectedRoomPolicy[room.id] || 'non-refundable';
                    const currentPolicy = room.policies?.find(p => p.type === selectedPolicy);
                    const roomPricing = getRoomEffectivePrice(room);
                    const totalPrice = roomPricing.perNight + (currentPolicy?.extraCost || 0);
                    const nights = roomPricing.nights;
                    const stayTotal = totalPrice * nights;
                    const { finalPrice: discountedTotal, discountApplied } = applyLengthDiscount(stayTotal, nights, lengthDiscounts);
                    const scoreColor = room.rating >= 9 ? C.navy : room.rating >= 8 ? C.blue : C.lightBlue;

                    return (
                      <div
                        key={room.id}
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all flex flex-col">

                        {/* Badge Featured */}
                        {room.featured && (
                          <div className="bg-amber-500 px-3 py-1.5">
                            <span className="text-white font-bold text-xs">Reservada com frequência</span>
                          </div>
                        )}

                        {/* Foto */}
                        <div className="relative overflow-hidden group h-48">
                          <Image
                            src={room.images?.[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80'}
                            alt={room.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {room.images && room.images.length > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                                <circle cx="12" cy="13" r="4"/>
                              </svg>
                              {room.images.length}
                            </div>
                          )}
                        </div>

                        {/* Conteúdo - flex-grow para alinhar botões */}
                        <div className="p-4 flex flex-col flex-grow">
                          {/* Título MAIOR */}
                          <h3 className="text-lg font-black text-gray-900 mb-3 line-clamp-2">
                            {room.name}
                          </h3>

                          {/* Score NA FRENTE - Igual Home */}
                          {room.rating && (
                            <div className="flex items-center gap-2 mb-3">
                              <div
                                className="px-2 py-1 rounded font-black text-white text-sm"
                                style={{ backgroundColor: scoreColor }}>
                                {room.rating}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-900">{room.ratingLabel}</p>
                                <p className="text-xs text-gray-500">1 avaliação</p>
                              </div>
                            </div>
                          )}

                          {/* Comodidades - ÍCONES SVG MINIMALISTAS */}
                          <div className="space-y-1 mb-3 text-xs text-gray-700">
                            {room.breakfast && (
                              <div className="flex items-center gap-2">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
                                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                                </svg>
                                <span>Café da manhã incluído</span>
                              </div>
                            )}

                            {room.lakeView && (
                              <div className="flex items-center gap-2">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                                </svg>
                                <span>Vista para o lago</span>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
                                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                              </svg>
                              <span>{room.roomCount} quarto{room.roomCount > 1 ? 's' : ''}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                              </svg>
                              <span>Acomoda {room.capacity}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
                                <path d="M2 4v16m20-16v16M6 8h12M6 12h12M6 16h12"/>
                              </svg>
                              <span>{room.beds}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
                                <path d="M21.3 8.7L8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4z"/>
                              </svg>
                              <span>{room.size}</span>
                            </div>

                            {room.installments && (
                              <div className="flex items-center gap-2">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                <span>Pague em até 12x sem juros</span>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
                                <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/>
                              </svg>
                              <span>Wi-Fi grátis</span>
                            </div>

                            {room.bathtub && (
                              <div className="flex items-center gap-2 font-semibold text-blue-700">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
                                  <path d="M9 6a3 3 0 0 1 3-3 3 3 0 0 1 3 3"/><path d="M22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6"/>
                                </svg>
                                <span>Banheira de imersão</span>
                              </div>
                            )}

                            {room.giftPoints && (
                              <div className="flex items-center gap-2 font-bold" style={{ color: C.yellow }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
                                  <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/>
                                </svg>
                                <span>Giftback 10%</span>
                              </div>
                            )}
                          </div>

                          {/* Mais detalhes */}
                          <button className="text-xs font-bold hover:underline mb-3 text-left" style={{ color: C.blue }}>
                            Mais detalhes →
                          </button>

                          {/* Políticas */}
                          {room.policies && (
                            <div className="mb-3 pb-3 border-t border-gray-100 pt-3">
                              <p className="text-[10px] font-bold text-gray-700 mb-2 uppercase">Política de Cancelamento</p>
                              <div className="space-y-1.5">
                                {room.policies.map((policy) => (
                                  <label
                                    key={policy.type}
                                    className="flex items-center gap-2 text-[11px] cursor-pointer">
                                    <input
                                      type="radio"
                                      name={`policy-${room.id}`}
                                      checked={selectedPolicy === policy.type}
                                      onChange={() => setSelectedRoomPolicy({...selectedRoomPolicy, [room.id]: policy.type})}
                                      className="w-3 h-3"
                                      style={{ accentColor: C.navy }}
                                    />
                                    <span className="text-gray-700 flex-1">{policy.label}</span>
                                    <span className="font-bold text-gray-900">
                                      {policy.extraCost > 0 ? `+R$ ${policy.extraCost}` : ''}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Preço - margin-top: auto para empurrar pro fim */}
                          <div className="mb-3 mt-auto">
                            <div className="text-2xl font-black text-gray-900">R$ {totalPrice}</div>
                            {discountApplied ? (
                              <>
                                <div className="text-xs text-gray-400 line-through">Total: R$ {stayTotal.toLocaleString('pt-BR')}</div>
                                <div className="text-sm font-bold" style={{ color: '#16A34A' }}>Total: R$ {discountedTotal.toLocaleString('pt-BR')}</div>
                              </>
                            ) : (
                              <div className="text-xs text-gray-600">Total: R$ {stayTotal.toLocaleString('pt-BR')}</div>
                            )}
                            <div className="text-[10px] text-gray-500">{nights} noite{nights > 1 ? 's' : ''} · impostos inclusos</div>
                            {/* Length discount badges */}
                            {lengthDiscounts.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {lengthDiscounts.slice(0, 2).map(d => (
                                  <span key={d.id} className="inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold"
                                    style={{ backgroundColor: '#ECFDF5', color: '#16A34A' }}>
                                    {d.minNights}+ noites: {d.discountType === 'percent' ? `-${d.discountValue}%` : `-R$${d.discountValue}/noite`}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Botão Reservar - SEMPRE NA MESMA ALTURA */}
                          <button
                            className="w-full py-3 rounded-lg font-bold text-white text-sm hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: C.navy }}>
                            Reservar
                          </button>

                          <p className="text-center text-[10px] text-gray-500 mt-2">
                            Nenhuma cobrança será feita por enquanto
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. LOCALIZAÇÃO */}
            {property.location && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Onde você vai ficar</h2>

                {/* Mapa Placeholder */}
                <div className="bg-gray-200 rounded-xl h-64 mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 text-gray-400">{Icon.mapPin()}</div>
                    <p className="text-gray-600 font-semibold">{property.location.address}</p>
                    <p className="text-sm text-gray-500">{property.city}, {property.state}</p>
                  </div>
                </div>

                {/* Distâncias */}
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-900 mb-3">Distâncias importantes</h3>
                  {property.location.distances.map((dist, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 text-gray-600">{Icon.navigation()}</div>
                        <span className="text-gray-900 font-semibold">{dist.place}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">{dist.distance}</div>
                        <div className="text-xs text-gray-500">{dist.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. AVALIAÇÕES */}
            {property.ratings && property.reviewsData && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg rounded-tr-none font-black text-white text-xl" style={{ backgroundColor: C.navy }}>
                    {property.ratings.overall}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">{property.scoreLabel}</h2>
                    <p className="text-gray-600">{property.reviews} avaliações verificadas</p>
                  </div>
                </div>

                {/* Barras de avaliação */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {[
                    { label: "Limpeza", value: property.ratings.cleanliness },
                    { label: "Conforto", value: property.ratings.comfort },
                    { label: "Localização", value: property.ratings.location },
                    { label: "Atendimento", value: property.ratings.staff },
                    { label: "Instalações", value: property.ratings.facilities },
                    { label: "Custo-benefício", value: property.ratings.valueForMoney },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold text-gray-900">{item.label}</span>
                        <span className="font-bold text-gray-900">{item.value}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(item.value / 10) * 100}%`, backgroundColor: C.navy }}/>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Últimas avaliações */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900">Últimas avaliações</h3>
                  {property.reviewsData && property.reviewsData.length > 0 && property.reviewsData.slice(0, 3).map((review) => (
                    <div key={review.id} className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                            {review.author.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{review.author}</div>
                            <div className="text-xs text-gray-500">{review.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 font-bold" style={{ color: C.navy }}>
                          <div className="w-4 h-4">{Icon.star()}</div>
                          {review.rating}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. REGRAS E POLÍTICAS */}
            {property.policies && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Bom saber</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 text-gray-900">{Icon.clock()}</div>
                      <h3 className="font-bold text-gray-900">Horários</h3>
                    </div>
                    <p className="text-sm text-gray-700">Check-in: {property.policies.checkIn}</p>
                    <p className="text-sm text-gray-700">Check-out: {property.policies.checkOut}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 text-green-600">{Icon.check()}</div>
                      <h3 className="font-bold text-gray-900">Cancelamento</h3>
                    </div>
                    <p className="text-sm text-gray-700">{property.policies.cancellation}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 text-gray-900">{Icon.info()}</div>
                      <h3 className="font-bold text-gray-900">Crianças</h3>
                    </div>
                    <p className="text-sm text-gray-700">{property.policies.children}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 text-red-600">{Icon.xCircle()}</div>
                      <h3 className="font-bold text-gray-900">Animais</h3>
                    </div>
                    <p className="text-sm text-gray-700">{property.policies.pets}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 7. CONTATOS - SIMPLIFICADO */}
            {property.contact && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Entre em contato</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${property.contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-lg border-2 hover:bg-gray-50 transition-colors"
                    style={{ borderColor: '#25D366' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#25D366' }}>
                      <div className="w-5 h-5 text-white">{Icon.whatsapp()}</div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500">WhatsApp</p>
                      <p className="text-sm font-bold text-gray-900">{property.contact.phone}</p>
                    </div>
                  </a>

                  {/* Telefone */}
                  <a
                    href={`tel:${property.contact.phone.replace(/\D/g, '')}`}
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: C.navy }}>
                      <div className="w-5 h-5 text-white">{Icon.phone()}</div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500">Telefone</p>
                      <p className="text-sm font-bold text-gray-900">{property.contact.phone}</p>
                    </div>
                  </a>
                </div>

                {/* Endereço - Discreto */}
                {property.location && (
                  <div className="flex items-start gap-2 text-sm text-gray-600 pt-4 border-t border-gray-100">
                    <div className="w-4 h-4 flex-shrink-0 mt-0.5">{Icon.mapPin()}</div>
                    <p>
                      {property.location.address} · {property.location.neighborhood} · {property.city}, {property.state}
                    </p>
                  </div>
                )}
              </div>
            )}

            </div>
          </div>

          {/* COLUNA DIREITA - Calendário com Preços Sticky */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-20">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">

                {/* Preço a partir de */}
                <div className="mb-4">
                  {(() => {
                    const cheapest = property.rooms && property.rooms.length > 0
                      ? Math.min(...property.rooms.map(r => getRoomEffectivePrice(r).perNight))
                      : property.price;
                    return (
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm text-gray-500">A partir de</span>
                        <span className="text-2xl font-black text-gray-900">R$ {cheapest}</span>
                        <span className="text-gray-600">/noite</span>
                      </div>
                    );
                  })()}
                </div>

                {/* Datas selecionadas */}
                <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
                  <div className="grid grid-cols-2 divide-x divide-gray-200">
                    <div className="p-3">
                      <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">CHECK-IN</div>
                      <div className="text-sm font-semibold" style={{ color: calCheckIn ? C.navy : '#9CA3AF' }}>
                        {calCheckIn ? new Date(calCheckIn + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) : "Selecione"}
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">CHECK-OUT</div>
                      <div className="text-sm font-semibold" style={{ color: calCheckOut ? C.navy : '#9CA3AF' }}>
                        {calCheckOut ? new Date(calCheckOut + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) : "Selecione"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calendário */}
                {(() => {
                  const today = toDateStr(new Date());
                  const cheapestPrice = Object.values(calendarData).reduce((min, d) => {
                    if (d.price !== null && d.available && (min === null || d.price < min)) return d.price;
                    return min;
                  }, null as number | null);

                  const renderMonth = (year: number, month: number) => {
                    const days = getDaysInMonth(year, month);
                    const first = new Date(year, month, 1).getDay();
                    const cells: React.ReactNode[] = [];
                    for (let i = 0; i < first; i++) cells.push(<div key={`e${i}`} />);
                    for (let d = 1; d <= days; d++) {
                      const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                      const past = ds < today;
                      const dayData = calendarData[ds];
                      const isCi = ds === calCheckIn, isCo = ds === calCheckOut;
                      const inRange = calCheckIn && calCheckOut && ds > calCheckIn && ds < calCheckOut;
                      const sel = isCi || isCo;
                      const unavailable = dayData && !dayData.available;
                      const price = dayData?.price;
                      const minStay = dayData?.minStay || 1;

                      cells.push(
                        <button key={d} type="button" disabled={past || (unavailable ?? false)}
                          onClick={() => handleCalendarDayClick(ds)}
                          style={{
                            width: "100%", aspectRatio: "1", border: "none",
                            borderRadius: sel ? 8 : 4,
                            cursor: past || unavailable ? "default" : "pointer",
                            backgroundColor: sel ? C.navy : inRange ? C.navy + "15" : "transparent",
                            color: past ? "#C5CBD8" : unavailable ? "#C5CBD8" : sel ? "#fff" : "#1A2138",
                            fontWeight: sel ? 700 : 500, fontSize: 12,
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                            gap: 1, padding: 2, position: "relative", transition: "all 0.12s",
                          }}>
                          <span style={{ fontSize: 13, lineHeight: 1 }}>{d}</span>
                          {unavailable ? (
                            <span style={{ color: "#EF4444", fontSize: 10, fontWeight: 800, lineHeight: 1 }}>✕</span>
                          ) : price != null && !past ? (
                            <span style={{ fontSize: 8, lineHeight: 1, fontWeight: 600, opacity: sel ? 0.9 : 0.7, color: sel ? "#fff" : C.navy }}>
                              {fmtShort(price)}
                            </span>
                          ) : null}
                          {minStay > 1 && !past && !unavailable && (
                            <span style={{ position: "absolute", top: 1, right: 2, fontSize: 7, color: sel ? "rgba(255,255,255,0.7)" : "#8C95A8", fontWeight: 700 }}>
                              {minStay}n
                            </span>
                          )}
                        </button>
                      );
                    }
                    return (
                      <div>
                        <div style={{ textAlign: "center", fontWeight: 700, marginBottom: 8, color: "#1A2138", fontSize: 13 }}>{MONTHS[month]} {year}</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, textAlign: "center" }}>
                          {WKDAYS.map(w => <div key={w} style={{ fontSize: 9, color: "#8C95A8", fontWeight: 700, padding: "3px 0", textTransform: "uppercase" }}>{w}</div>)}
                          {cells}
                        </div>
                      </div>
                    );
                  };

                  return (
                    <div className="mb-4">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <button type="button" onClick={() => {
                          let m = calendarMonth.month - 1, y = calendarMonth.year;
                          if (m < 0) { m = 11; y--; }
                          setCalendarMonth({ year: y, month: m });
                        }} style={{ background: "none", border: "1px solid #DFE3EB", borderRadius: 8, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                          <span style={{ fontSize: 14 }}>‹</span>
                        </button>
                        {loadingCalendar && (
                          <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: `${C.navy}20`, borderTopColor: C.navy }} />
                        )}
                        <button type="button" onClick={() => {
                          let m = calendarMonth.month + 1, y = calendarMonth.year;
                          if (m > 11) { m = 0; y++; }
                          setCalendarMonth({ year: y, month: m });
                        }} style={{ background: "none", border: "1px solid #DFE3EB", borderRadius: 8, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                          <span style={{ fontSize: 14 }}>›</span>
                        </button>
                      </div>
                      {renderMonth(calendarMonth.year, calendarMonth.month)}
                      {/* Legend */}
                      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 8, fontSize: 10, color: "#8C95A8", flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{ color: "#EF4444", fontWeight: 800 }}>✕</span><span>Indisponível</span>
                        <span style={{ fontSize: 8, fontWeight: 700, color: "#8C95A8", background: "#F1F3F7", borderRadius: 3, padding: "1px 3px" }}>2n</span><span>Mín. noites</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Hóspedes */}
                <div className="mb-4">
                  <button
                    onClick={() => setShowGuestPicker(!showGuestPicker)}
                    className="w-full border border-gray-200 rounded-lg p-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">HÓSPEDES</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {guests.adults} {guests.adults === 1 ? "adulto" : "adultos"}
                        {guests.children > 0 && `, ${guests.children} ${guests.children === 1 ? "criança" : "crianças"}`}
                      </div>
                    </div>
                    <span style={{ fontSize: 14, color: "#8C95A8", transform: showGuestPicker ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
                  </button>
                  {showGuestPicker && (
                    <div className="border border-gray-200 border-t-0 rounded-b-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div><div className="text-sm font-semibold">Adultos</div><div className="text-xs text-gray-500">13+ anos</div></div>
                        <div className="flex items-center gap-3">
                          <button type="button" disabled={guests.adults <= 1} onClick={() => setGuests(g => ({ ...g, adults: g.adults - 1 }))}
                            className="w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold"
                            style={{ borderColor: guests.adults <= 1 ? "#DFE3EB" : C.navy, color: guests.adults <= 1 ? "#DFE3EB" : C.navy }}>−</button>
                          <span className="w-5 text-center font-bold">{guests.adults}</span>
                          <button type="button" disabled={guests.adults >= 10} onClick={() => setGuests(g => ({ ...g, adults: g.adults + 1 }))}
                            className="w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold"
                            style={{ borderColor: guests.adults >= 10 ? "#DFE3EB" : C.navy, color: guests.adults >= 10 ? "#DFE3EB" : C.navy }}>+</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div><div className="text-sm font-semibold">Crianças</div><div className="text-xs text-gray-500">0-12 anos</div></div>
                        <div className="flex items-center gap-3">
                          <button type="button" disabled={guests.children <= 0} onClick={() => setGuests(g => ({ ...g, children: g.children - 1 }))}
                            className="w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold"
                            style={{ borderColor: guests.children <= 0 ? "#DFE3EB" : C.navy, color: guests.children <= 0 ? "#DFE3EB" : C.navy }}>−</button>
                          <span className="w-5 text-center font-bold">{guests.children}</span>
                          <button type="button" disabled={guests.children >= 10} onClick={() => setGuests(g => ({ ...g, children: g.children + 1 }))}
                            className="w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold"
                            style={{ borderColor: guests.children >= 10 ? "#DFE3EB" : C.navy, color: guests.children >= 10 ? "#DFE3EB" : C.navy }}>+</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Noites info */}
                {totalNights > 0 && (
                  <div className="text-center text-sm font-semibold mb-3" style={{ color: C.navy }}>
                    {totalNights} noite{totalNights > 1 ? "s" : ""} selecionada{totalNights > 1 ? "s" : ""}
                  </div>
                )}

                {/* Botão Buscar */}
                <button
                  onClick={handleSearchBooking}
                  disabled={!calCheckIn || !calCheckOut}
                  className="w-full py-4 rounded-lg font-bold text-white text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: C.navy }}>
                  Buscar disponibilidade
                </button>

                <div className="text-center text-xs text-gray-500 mt-3">
                  Você não será cobrado ainda
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* BOOKING BAR MOBILE - Bottom fixo */}
      {/* ═══════════════════════════════════════════════════════════ */}

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            {calCheckIn && calCheckOut ? (
              <div className="text-sm font-semibold" style={{ color: C.navy }}>
                {new Date(calCheckIn + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                {" → "}
                {new Date(calCheckOut + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                <span className="text-gray-500 font-normal"> ({totalNights} noite{totalNights > 1 ? "s" : ""})</span>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Selecione as datas acima</div>
            )}
          </div>
          <button
            onClick={handleSearchBooking}
            disabled={!calCheckIn || !calCheckOut}
            className="px-5 py-3 rounded-lg font-bold text-white shadow-lg disabled:opacity-50"
            style={{ backgroundColor: C.navy }}>
            Buscar
          </button>
        </div>
      </div>

      <style>{`.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}.scrollbar-hide::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}
