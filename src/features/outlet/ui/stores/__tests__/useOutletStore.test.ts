import { describe, it, expect, beforeEach } from "vitest";
import { useOutletStore } from "../useOutletStore";
import type { Outlet } from "@features/outlet/domain/entities/Outlet";

describe("useOutletStore", () => {
  const mockOutlets: Outlet[] = [
    { id: "outlet-1", name: "Cabang Utama", address: "Jl. Sudirman", phone: "021-123456", is_active: true, created_at: "2024-01-01", updated_at: "2024-01-01" },
    { id: "outlet-2", name: "Cabang Dua", address: "Jl. Thamrin", phone: "021-654321", is_active: true, created_at: "2024-01-01", updated_at: "2024-01-01" },
  ];

  beforeEach(() => {
    useOutletStore.setState({ outlets: [], selectedOutlet: null });
  });

  it("should start with empty outlets", () => {
    const state = useOutletStore.getState();
    expect(state.outlets).toEqual([]);
    expect(state.selectedOutlet).toBeNull();
  });

  it("should set outlets and select first one", () => {
    useOutletStore.getState().setOutlets(mockOutlets);

    const state = useOutletStore.getState();
    expect(state.outlets).toHaveLength(2);
    expect(state.selectedOutlet?.id).toBe("outlet-1");
  });

  it("should select outlet", () => {
    useOutletStore.getState().setOutlets(mockOutlets);
    const secondOutlet = mockOutlets[1];
    if (secondOutlet) {
      useOutletStore.getState().selectOutlet(secondOutlet);
    }

    expect(useOutletStore.getState().selectedOutlet?.id).toBe("outlet-2");
  });

  it("should clear selected outlet", () => {
    useOutletStore.getState().setOutlets(mockOutlets);
    useOutletStore.getState().clearOutlet();

    expect(useOutletStore.getState().selectedOutlet).toBeNull();
  });

  it("should select first outlet when setting empty array", () => {
    useOutletStore.getState().setOutlets([]);

    expect(useOutletStore.getState().selectedOutlet).toBeNull();
  });
});
