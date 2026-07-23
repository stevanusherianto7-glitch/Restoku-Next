import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Outlet } from "@features/outlet/domain/entities/Outlet";

interface OutletStore {
  outlets: Outlet[];
  selectedOutlet: Outlet | null;
  setOutlets: (outlets: Outlet[]) => void;
  selectOutlet: (outlet: Outlet) => void;
  clearOutlet: () => void;
}

export const useOutletStore = create<OutletStore>()(
  persist(
    (set) => ({
      outlets: [],
      selectedOutlet: null,
      setOutlets: (outlets) => set({ outlets, selectedOutlet: outlets[0] || null }),
      selectOutlet: (outlet) => set({ selectedOutlet: outlet }),
      clearOutlet: () => set({ selectedOutlet: null }),
    }),
    {
      name: "outlet-storage",
    }
  )
);
