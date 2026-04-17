import { create } from "zustand";
import type { Room } from "@/types";

interface SearchState {
  selectedCity: string;
  checkIn: Date | null;
  checkOut: Date | null;
  rooms: Room[];
  showCityPicker: boolean;

  // Computed
  totalGuests: () => number;

  // Actions
  setSelectedCity: (city: string) => void;
  setCheckIn: (date: Date | null) => void;
  setCheckOut: (date: Date | null) => void;
  setDates: (checkIn: Date | null, checkOut: Date | null) => void;
  setShowCityPicker: (show: boolean) => void;
  addRoom: () => void;
  removeRoom: (idx: number) => void;
  updateRoom: (idx: number, field: "adults" | "children", val: number) => void;
}

export const useSearchStore = create<SearchState>()((set, get) => ({
  selectedCity: "capitolio",
  checkIn: null,
  checkOut: null,
  rooms: [{ adults: 2, children: 0 }],
  showCityPicker: false,

  totalGuests: () =>
    get().rooms.reduce((sum, r) => sum + r.adults + r.children, 0),

  setSelectedCity: (city) => set({ selectedCity: city }),
  setCheckIn: (date) => set({ checkIn: date }),
  setCheckOut: (date) => set({ checkOut: date }),
  setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
  setShowCityPicker: (show) => set({ showCityPicker: show }),

  addRoom: () =>
    set((state) => ({
      rooms: [...state.rooms, { adults: 2, children: 0 }],
    })),

  removeRoom: (idx) =>
    set((state) => ({
      rooms: state.rooms.filter((_, i) => i !== idx),
    })),

  updateRoom: (idx, field, val) =>
    set((state) => {
      const newRooms = [...state.rooms];
      newRooms[idx] = {
        ...newRooms[idx],
        [field]: Math.max(field === "adults" ? 1 : 0, val),
      };
      return { rooms: newRooms };
    }),
}));
