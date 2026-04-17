import type { PMSRatePlan, InventoryEntry, LengthDiscount, Season } from "@/types";

// ─── INVENTORY MAP TYPE ─────────────────────────────────────────────────────
// { [roomId]: { [date "YYYY-MM-DD"]: InventoryEntry } }
export type InventoryMap = Record<number, Record<string, InventoryEntry>>;

// ─── BUILD INVENTORY MAP FROM FLAT ARRAY ────────────────────────────────────
export function buildInventoryMap(entries: InventoryEntry[]): InventoryMap {
  const map: InventoryMap = {};
  for (const e of entries) {
    if (!map[e.roomId]) map[e.roomId] = {};
    map[e.roomId][e.date] = e;
  }
  return map;
}

// ─── GET ROOM PRICE FOR A SINGLE DATE ───────────────────────────────────────
// Priority: Inventory rate → Season rate → ratePlan rateTotal per room → ratePlan basePrice → room.price

export function getRoomPriceForDate(
  roomId: number,
  date: string, // "YYYY-MM-DD"
  roomPrice: number,
  ratePlan?: { basePrice: number; rateTotal?: number | null },
  inventoryMap?: InventoryMap,
  seasons?: Season[]
): number {
  // 1. Inventory override (mais específico)
  const inv = inventoryMap?.[roomId]?.[date];
  if (inv?.rate != null) return inv.rate;
  // 2. Season rate (feriado/temporada)
  if (seasons && Array.isArray(seasons) && seasons.length > 0) {
    const season = seasons.find(s => s.active && s.rate != null && date >= s.startDate && date <= s.endDate);
    if (season?.rate != null) return season.rate;
  }
  // 3. Rate plan (rateTotal per room, or basePrice)
  if (ratePlan?.rateTotal != null) return ratePlan.rateTotal;
  if (ratePlan) return ratePlan.basePrice;
  // 4. Base room price
  return roomPrice;
}

// ─── GET MIN STAY FOR A DATE ────────────────────────────────────────────────

export function getMinStayForDate(
  roomId: number,
  date: string,
  inventoryMap?: InventoryMap,
  _ratePlan?: PMSRatePlan,
  _dateObj?: Date
): number {
  const inv = inventoryMap?.[roomId]?.[date];
  if (inv?.minStay != null) return inv.minStay;
  return 1;
}

// ─── GET MAX STAY FOR A DATE ──────────────────────────────────────────────

export function getMaxStayForDate(
  roomId: number,
  date: string,
  inventoryMap?: InventoryMap
): number | null {
  const inv = inventoryMap?.[roomId]?.[date];
  if (inv?.maxStay != null) return inv.maxStay;
  return null; // null = sem limite
}

// ─── LEGACY WRAPPERS (keep for any remaining callers) ───────────────────────

export function getPriceForDate(
  ratePlan: PMSRatePlan,
  _date: Date
): { price: number; label: string } {
  return { price: ratePlan.basePrice, label: "" };
}

// ─── CALCULATE FULL STAY PRICE ──────────────────────────────────────────────

export interface StayBreakdown {
  nights: { date: Date; dateStr: string; price: number; label: string }[];
  subtotal: number;
  total: number;
}

export function calculateStayPrice(
  roomId: number,
  roomPrice: number,
  checkIn: Date,
  checkOut: Date,
  ratePlan?: { basePrice: number; rateTotal?: number | null },
  inventoryMap?: InventoryMap,
  seasons?: Season[]
): StayBreakdown {
  const nights: StayBreakdown["nights"] = [];
  const current = new Date(checkIn);

  while (current < checkOut) {
    const dateStr = current.toISOString().slice(0, 10);
    const price = getRoomPriceForDate(roomId, dateStr, roomPrice, ratePlan, inventoryMap, seasons);
    nights.push({ date: new Date(current), dateStr, price, label: "" });
    current.setDate(current.getDate() + 1);
  }

  const subtotal = nights.reduce((sum, n) => sum + n.price, 0);

  return {
    nights,
    subtotal,
    total: subtotal,
  };
}

// ─── CALCULATE EXTRA GUEST CHARGES PER NIGHT ──────────────────────────────

export function calculateExtraGuestCharges(
  adults: number,
  children: number,
  occupancyIncluded: number,
  extraAdultRate: number,
  extraChildRate: number,
): number {
  if (!occupancyIncluded || occupancyIncluded <= 0) return 0;
  const totalGuests = adults + children;
  if (totalGuests <= occupancyIncluded) return 0;

  // Adultos extras primeiro, depois crianças extras
  const extraAdults = Math.max(0, adults - occupancyIncluded);
  const remainingIncluded = Math.max(0, occupancyIncluded - adults);
  const extraChildren = Math.max(0, children - remainingIncluded);

  return (extraAdults * (extraAdultRate || 0)) + (extraChildren * (extraChildRate || 0));
}

// ─── APPLY LENGTH DISCOUNT ─────────────────────────────────────────────────

export function applyLengthDiscount(
  totalPrice: number,
  totalNights: number,
  discounts: LengthDiscount[]
): { finalPrice: number; discountApplied: LengthDiscount | null } {
  if (!Array.isArray(discounts)) return { finalPrice: totalPrice, discountApplied: null };
  const applicable = discounts
    .filter(d => d.active && totalNights >= d.minNights)
    .sort((a, b) => b.minNights - a.minNights)[0];

  if (!applicable) return { finalPrice: totalPrice, discountApplied: null };

  if (applicable.discountType === 'percent') {
    return {
      finalPrice: Math.round(totalPrice * (1 - applicable.discountValue / 100)),
      discountApplied: applicable,
    };
  }
  // fixed = desconto por noite
  return {
    finalPrice: Math.max(0, totalPrice - (applicable.discountValue * totalNights)),
    discountApplied: applicable,
  };
}
