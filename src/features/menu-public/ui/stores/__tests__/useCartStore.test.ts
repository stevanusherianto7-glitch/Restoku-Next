import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "../useCartStore";
import type { MenuItem } from "@features/menu/domain/entities/MenuItem";
import { createMenuId, createCategoryId } from "@features/menu/domain/entities/MenuItem";

describe("useCartStore", () => {
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
    useCartStore.setState({ items: [], restaurantId: null, tableNumber: null });
  });

  it("should start with empty cart", () => {
    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.restaurantId).toBeNull();
    expect(state.tableNumber).toBeNull();
  });

  it("should add item to cart", () => {
    useCartStore.getState().addItem(mockMenu);

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0]?.menu.name).toBe("Nasi Goreng");
  });

  it("should increase quantity for existing item", () => {
    useCartStore.getState().addItem(mockMenu);
    useCartStore.getState().addItem(mockMenu);

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0]?.quantity).toBe(2);
  });

  it("should remove item from cart", () => {
    useCartStore.getState().addItem(mockMenu);
    useCartStore.getState().removeItem("menu-1");

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("should update quantity", () => {
    useCartStore.getState().addItem(mockMenu);
    useCartStore.getState().updateQuantity("menu-1", 5);

    expect(useCartStore.getState().items[0]?.quantity).toBe(5);
  });

  it("should calculate total", () => {
    useCartStore.getState().addItem(mockMenu);
    useCartStore.getState().addItem(mockMenu);

    expect(useCartStore.getState().getTotal()).toBe(50000);
  });

  it("should get item count", () => {
    useCartStore.getState().addItem(mockMenu);

    expect(useCartStore.getState().getItemCount()).toBe(1);
  });

  it("should clear cart", () => {
    useCartStore.getState().addItem(mockMenu);
    useCartStore.getState().clearCart();

    expect(useCartStore.getState().items).toEqual([]);
  });

  it("should set restaurant and table", () => {
    useCartStore.getState().setRestaurant("rest-1", 5);

    const state = useCartStore.getState();
    expect(state.restaurantId).toBe("rest-1");
    expect(state.tableNumber).toBe(5);
  });
});
