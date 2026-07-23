import { describe, it, expect, beforeEach } from "vitest";
import { usePosCartStore } from "../usePosCartStore";
import type { MenuItem } from "@features/menu/domain/entities/MenuItem";
import { createMenuId, createCategoryId } from "@features/menu/domain/entities/MenuItem";

describe("usePosCartStore", () => {
  const mockMenu: MenuItem = {
    id: createMenuId("menu-1"),
    name: "Nasi Goreng",
    description: "Nasi goreng spesial",
    price: 25000,
    category_id: createCategoryId("cat-1"),
    category: "makanan",
    image_url: null,
    status: "active",
    is_popular: true,
    is_new: false,
    is_promo: false,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  };

  beforeEach(() => {
    usePosCartStore.setState({ items: [], tableNumber: null });
  });

  it("should start with empty cart", () => {
    const state = usePosCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.tableNumber).toBeNull();
  });

  it("should add item to cart", () => {
    usePosCartStore.getState().addItem(mockMenu);

    const state = usePosCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0]?.menu.name).toBe("Nasi Goreng");
    expect(state.items[0]?.quantity).toBe(1);
  });

  it("should increase quantity for existing item", () => {
    usePosCartStore.getState().addItem(mockMenu);
    usePosCartStore.getState().addItem(mockMenu);

    const state = usePosCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0]?.quantity).toBe(2);
  });

  it("should remove item from cart", () => {
    usePosCartStore.getState().addItem(mockMenu);
    usePosCartStore.getState().removeItem("menu-1");

    const state = usePosCartStore.getState();
    expect(state.items).toHaveLength(0);
  });

  it("should update quantity", () => {
    usePosCartStore.getState().addItem(mockMenu);
    usePosCartStore.getState().updateQuantity("menu-1", 5);

    const state = usePosCartStore.getState();
    expect(state.items[0]?.quantity).toBe(5);
  });

  it("should remove item when quantity is 0", () => {
    usePosCartStore.getState().addItem(mockMenu);
    usePosCartStore.getState().updateQuantity("menu-1", 0);

    const state = usePosCartStore.getState();
    expect(state.items).toHaveLength(0);
  });

  it("should calculate total", () => {
    usePosCartStore.getState().addItem(mockMenu);
    usePosCartStore.getState().addItem(mockMenu);

    const total = usePosCartStore.getState().getTotal();
    expect(total).toBe(50000);
  });

  it("should get item count", () => {
    usePosCartStore.getState().addItem(mockMenu);
    usePosCartStore.getState().addItem(mockMenu);

    const count = usePosCartStore.getState().getItemCount();
    expect(count).toBe(2);
  });

  it("should clear cart", () => {
    usePosCartStore.getState().addItem(mockMenu);
    usePosCartStore.getState().setTableNumber(5);
    usePosCartStore.getState().clearCart();

    const state = usePosCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.tableNumber).toBeNull();
  });

  it("should set table number", () => {
    usePosCartStore.getState().setTableNumber(5);

    expect(usePosCartStore.getState().tableNumber).toBe(5);
  });

  it("should add item with variant", () => {
    usePosCartStore.getState().addItem(mockMenu, 1, "Pedas");

    const state = usePosCartStore.getState();
    expect(state.items[0]?.variant).toBe("Pedas");
  });

  it("should keep separate items for different variants", () => {
    usePosCartStore.getState().addItem(mockMenu, 1, "Pedas");
    usePosCartStore.getState().addItem(mockMenu, 1, "Manis");

    const state = usePosCartStore.getState();
    expect(state.items).toHaveLength(2);
  });

  it("should update notes", () => {
    usePosCartStore.getState().addItem(mockMenu);
    usePosCartStore.getState().updateNotes("menu-1", "Tanpa bawang");

    const state = usePosCartStore.getState();
    expect(state.items[0]?.notes).toBe("Tanpa bawang");
  });
});
