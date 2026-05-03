import { create } from "zustand";

interface Interest {
  emoji: string;
  label: string;
}

interface AppState {
  // Identity
  name: string;
  age: string;
  gender: string | null;

  // Interests
  interests: Interest[];

  // Location (from QR scan URL)
  location: string;
  locationName: string;

  // Actions
  setIdentity: (name: string, age: string, gender: string) => void;
  setInterests: (interests: Interest[]) => void;
  setLocation: (slug: string) => void;
  reset: () => void;
}

function formatLocationName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const initialState = {
  name: "",
  age: "",
  gender: null as string | null,
  interests: [] as Interest[],
  location: "kopiloka",
  locationName: "Kopiloka",
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,

  setIdentity: (name, age, gender) => set({ name, age, gender }),

  setInterests: (interests) => set({ interests }),

  setLocation: (slug) =>
    set({
      location: slug,
      locationName: formatLocationName(slug),
    }),

  reset: () => set({ ...initialState }),
}));
