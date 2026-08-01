import { create } from "zustand";

interface AppState {
  activeSection: "hero" | "packages" | "mission-control";
  selectedPackage: any | null;
  isBookingModalOpen: boolean;
  activeRegion: string;
  hoveredCity: string | null;
  
  setActiveSection: (section: "hero" | "packages" | "mission-control") => void;
  setSelectedPackage: (pkg: any | null) => void;
  setIsBookingModalOpen: (isOpen: boolean) => void;
  setActiveRegion: (region: string) => void;
  setHoveredCity: (city: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeSection: "hero",
  selectedPackage: null,
  isBookingModalOpen: false,
  activeRegion: "ALL",
  hoveredCity: null,

  setActiveSection: (section) => set({ activeSection: section }),
  setSelectedPackage: (pkg) => set({ selectedPackage: pkg }),
  setIsBookingModalOpen: (isOpen) => set({ isBookingModalOpen: isOpen }),
  setActiveRegion: (region) => set({ activeRegion: region }),
  setHoveredCity: (city) => set({ hoveredCity: city }),
}));
