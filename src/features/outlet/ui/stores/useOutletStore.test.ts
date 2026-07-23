import { describe, it, expect, beforeEach } from "vitest";
import { useOutletStore } from "@features/outlet/ui/stores/useOutletStore";
import type { Outlet } from "@features/outlet/domain/entities/Outlet";

const outlet1: Outlet = {
  id: "out-1",
  name: "Cabang Utama",
  address: "Jl. Sudirman 123",
  phone: "021-1234567",
  is_active: true,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

const outlet2: Outlet = {
  id: "out-2",
  name: "Cabang BSD",
  address: "Jl. BSD Raya 456",
  phone: "021-7654321",
  is_active: true,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

describe("useOutletStore", () => {
  beforeEach(() => {
    useOutletStore.setState({ outlets: [], selectedOutlet: null });
  });

  describe("setOutlets", () => {
    it("should set outlets and auto-select first", () => {
      useOutletStore.getState().setOutlets([outlet1, outlet2]);

      const state = useOutletStore.getState();
      expect(state.outlets).toHaveLength(2);
      expect(state.selectedOutlet?.id).toBe("out-1");
    });

    it("should set selectedOutlet to null when array is empty", () => {
      useOutletStore.getState().setOutlets([]);

      expect(useOutletStore.getState().selectedOutlet).toBeNull();
    });
  });

  describe("selectOutlet", () => {
    it("should select a specific outlet", () => {
      useOutletStore.getState().setOutlets([outlet1, outlet2]);
      useOutletStore.getState().selectOutlet(outlet2);

      expect(useOutletStore.getState().selectedOutlet?.id).toBe("out-2");
    });
  });

  describe("clearOutlet", () => {
    it("should clear selected outlet", () => {
      useOutletStore.getState().setOutlets([outlet1]);
      useOutletStore.getState().clearOutlet();

      expect(useOutletStore.getState().selectedOutlet).toBeNull();
    });
  });
});
