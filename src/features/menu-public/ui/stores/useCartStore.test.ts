import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "@features/menu-public/ui/stores/useCartStore";
import type { MenuItem, MenuId, CategoryId } from "@features/menu/domain/entities/MenuItem";

const testMenu: MenuItem = {
  id: "menu-1" as MenuId,
  name: "Nasi Goreng",
  description: null,
  price: 25000,
  category_id: "cat-1" as CategoryId,
  category: "makanan",
  image_url: null,
  status: "active",
  is_popular: false,
  is_new: false,
  is_promo: false,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

const testMenu2: MenuItem = {
  ...testMenu,
  id: "menu-2" as MenuId,
  name: "Es Teh",
  price: 5000,
};

describe("useCartStore (Public Cart)", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], restaurantId: null, tableNumber: null });
  });

  describe("addItem", () => {
    it("should add item with default quantity 1", () => {
      useCartStore.getState().addItem(testMenu);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0]?.quantity).toBe(1);
    });

    it("should add item with custom quantity", () => {
      useCartStore.getState().addItem(testMenu, 5);
      expect(useCartStore.getState().items[0]?.quantity).toBe(5);
    });

    it("should increment existing item quantity for same menu + variant", () => {
      useCartStore.getState().addItem(testMenu, 2, "large");
      useCartStore.getState().addItem(testMenu, 3, "large");

      expect(useCartStore.getState().items).toHaveLength(1);
      expect(useCartStore.getState().items[0]?.quantity).toBe(5);
    });

    it("should treat different variants as separate items", () => {
      useCartStore.getState().addItem(testMenu, 1, "small");
      useCartStore.getState().addItem(testMenu, 1, "large");

      expect(useCartStore.getState().items).toHaveLength(2);
    });

    it("should add items with notes", () => {
      useCartStore.getState().addItem(testMenu, 1, undefined, "no ice");
      expect(useCartStore.getState().items[0]?.notes).toBe("no ice");
    });
  });

  describe("removeItem", () => {
    it("should remove item by menuId", () => {
      useCartStore.getState().addItem(testMenu);
      useCartStore.getState().addItem(testMenu2);
      useCartStore.getState().removeItem("menu-1");

      expect(useCartStore.getState().items).toHaveLength(1);
      expect(useCartStore.getState().items[0]?.menu.id).toBe("menu-2");
    });
  });

  describe("updateQuantity", () => {
    it("should update quantity", () => {
      useCartStore.getState().addItem(testMenu);
      useCartStore.getState().updateQuantity("menu-1", 10);

      expect(useCartStore.getState().items[0]?.quantity).toBe(10);
    });

    it("should remove item when quantity <= 0", () => {
      useCartStore.getState().addItem(testMenu);
      useCartStore.getState().updateQuantity("menu-1", 0);

      expect(useCartStore.getState().items).toHaveLength(0);
    });

    it("should remove item when quantity is negative", () => {
      useCartStore.getState().addItem(testMenu);
      useCartStore.getState().updateQuantity("menu-1", -5);

      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  describe("updateNotes", () => {
    it("should update notes for an item", () => {
      useCartStore.getState().addItem(testMenu);
      useCartStore.getState().updateNotes("menu-1", "extra spicy");

      expect(useCartStore.getState().items[0]?.notes).toBe("extra spicy");
    });
  });

  describe("clearCart", () => {
    it("should clear all items", () => {
      useCartStore.getState().addItem(testMenu);
      useCartStore.getState().addItem(testMenu2);
      useCartStore.getState().clearCart();

      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  describe("setRestaurant", () => {
    it("should set restaurantId and tableNumber", () => {
      useCartStore.getState().setRestaurant("rest-xyz", 3);

      const state = useCartStore.getState();
      expect(state.restaurantId).toBe("rest-xyz");
      expect(state.tableNumber).toBe(3);
    });
  });

  describe("getTotal", () => {
    it("should return 0 for empty cart", () => {
      expect(useCartStore.getState().getTotal()).toBe(0);
    });

    it("should calculate total correctly", () => {
      useCartStore.getState().addItem(testMenu, 2);    // 25000 * 2 = 50000
      useCartStore.getState().addItem(testMenu2, 4);   // 5000 * 4 = 20000

      expect(useCartStore.getState().getTotal()).toBe(70000);
    });
  });

  describe("getItemCount", () => {
    it("should return 0 for empty cart", () => {
      expect(useCartStore.getState().getItemCount()).toBe(0);
    });

    it("should return sum of quantities", () => {
      useCartStore.getState().addItem(testMenu, 2);
      useCartStore.getState().addItem(testMenu2, 4);

      expect(useCartStore.getState().getItemCount()).toBe(6);
    });
  });
});
