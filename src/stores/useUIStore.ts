import { create } from "zustand";

interface UIState {
  showFilters: boolean;
  showMobileMenu: boolean;

  setShowFilters: (show: boolean) => void;
  toggleFilters: () => void;
  setShowMobileMenu: (show: boolean) => void;
  toggleMobileMenu: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  showFilters: false,
  showMobileMenu: false,

  setShowFilters: (show) => set({ showFilters: show }),
  toggleFilters: () => set((state) => ({ showFilters: !state.showFilters })),
  setShowMobileMenu: (show) => set({ showMobileMenu: show }),
  toggleMobileMenu: () =>
    set((state) => ({ showMobileMenu: !state.showMobileMenu })),
}));
