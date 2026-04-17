import { create } from "zustand";
import type { SortBy } from "@/types";

interface FilterState {
  activeFilter: string;
  priceRange: [number, number];
  selectedAmenities: string[];
  onlySuperhost: boolean;
  onlyVerified: boolean;
  sortBy: SortBy;

  // Computed
  activeFiltersCount: () => number;

  // Actions
  setActiveFilter: (filter: string) => void;
  setPriceRange: (range: [number, number]) => void;
  toggleAmenity: (amenity: string) => void;
  setSelectedAmenities: (amenities: string[]) => void;
  setOnlySuperhost: (val: boolean) => void;
  setOnlyVerified: (val: boolean) => void;
  setSortBy: (sort: SortBy) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>()((set, get) => ({
  activeFilter: "Todos",
  priceRange: [0, 1000],
  selectedAmenities: [],
  onlySuperhost: false,
  onlyVerified: false,
  sortBy: "score_desc",

  activeFiltersCount: () => {
    const s = get();
    return (
      (s.activeFilter !== "Todos" ? 1 : 0) +
      (s.priceRange[0] > 0 || s.priceRange[1] < 1000 ? 1 : 0) +
      s.selectedAmenities.length +
      (s.onlySuperhost ? 1 : 0) +
      (s.onlyVerified ? 1 : 0)
    );
  },

  setActiveFilter: (filter) => set({ activeFilter: filter }),
  setPriceRange: (range) => set({ priceRange: range }),
  toggleAmenity: (amenity) =>
    set((state) => ({
      selectedAmenities: state.selectedAmenities.includes(amenity)
        ? state.selectedAmenities.filter((a) => a !== amenity)
        : [...state.selectedAmenities, amenity],
    })),
  setSelectedAmenities: (amenities) => set({ selectedAmenities: amenities }),
  setOnlySuperhost: (val) => set({ onlySuperhost: val }),
  setOnlyVerified: (val) => set({ onlyVerified: val }),
  setSortBy: (sort) => set({ sortBy: sort }),
  clearFilters: () =>
    set({
      activeFilter: "Todos",
      priceRange: [0, 1000],
      selectedAmenities: [],
      onlySuperhost: false,
      onlyVerified: false,
      sortBy: "score_desc",
    }),
}));
