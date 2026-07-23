import { describe, it, expect, beforeEach } from "vitest";
import { usePosCartStore } from "@features/pos/ui/stores/usePosCartStore";
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
  name: "Mie Goreng",
  price: 20000,
};

describe("usePosCartStore", () => {
  beforeEach(() => {
    usePosCartStore.setState({ items: [], tableNumber: null });
  });

  describe("addItem", () => {
    it("should add a new item to the cart", () => {
      usePosCartStore.getState().addItem(testMenu);

      const { items } = usePosCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0]?.menu.id).toBe("menu-1");
      expect(items[0]?.quantity).toBe(1);
    });

    it("should add with custom quantity", () => {
      usePosCartStore.getState().addItem(testMenu, 3);

      expect(usePosCartStore.getState().items[0]?.quantity).toBe(3);
    });

    it("should add with variant and notes", () => {
      usePosCartStore.getState().addItem(testMenu, 1, "pedas", "extra sambal");

      const item = usePosCartStore.getState().items[0];
      expect(item?.variant).toBe("pedas");
      expect(item?.notes).toBe("extra sambal");
    });

    it("should increment quantity for same menu + variant", () => {
      usePosCartStore.getState().addItem(testMenu, 1, "pedas");
      usePosCartStore.getState().addItem(testMenu, 2, "pedas");

      const { items } = usePosCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0]?.quantity).toBe(3);
    });

    it("should add separate items for same menu with different variant", () => {
      usePosCartStore.getState().addItem(testMenu, 1, "pedas");
      usePosCartStore.getState().addItem(testMenu, 1, "tidak pedas");

      expect(usePosCartStore.getState().items).toHaveLength(2);
    });

    it("should add multiple different menus", () => {
      usePosCartStore.getState().addItem(testMenu);
      usePosCartStore.getState().addItem(testMenu2);

      expect(usePosCartStore.getState().items).toHaveLength(2);
    });
  });

  describe("removeItem", () => {
    it("should remove an item by menuId", () => {
      usePosCartStore.getState().addItem(testMenu);
      usePosCartStore.getState().addItem(testMenu2);

      usePosCartStore.getState().removeItem("menu-1");

      const { items } = usePosCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0]?.menu.id).toBe("menu-2");
    });

    it("should handle removing non-existent item", () => {
      usePosCartStore.getState().addItem(testMenu);
      usePosCartStore.getState().removeItem("nonexistent");

      expect(usePosCartStore.getState().items).toHaveLength(1);
    });
  });

  describe("updateQuantity", () => {
    it("should update item quantity", () => {
      usePosCartStore.getState().addItem(testMenu);
      usePosCartStore.getState().updateQuantity("menu-1", 5);

      expect(usePosCartStore.getState().items[0]?.quantity).toBe(5);
    });

    it("should remove item when quantity is 0", () => {
      usePosCartStore.getState().addItem(testMenu);
      usePosCartStore.getState().updateQuantity("menu-1", 0);

      expect(usePosCartStore.getState().items).toHaveLength(0);
    });

    it("should remove item when quantity is negative", () => {
      usePosCartStore.getState().addItem(testMenu);
      usePosCartStore.getState().updateQuantity("menu-1", -1);

      expect(usePosCartStore.getState().items).toHaveLength(0);
    });
  });

  describe("updateNotes", () => {
    it("should update item notes", () => {
      usePosCartStore.getState().addItem(testMenu);
      usePosCartStore.getState().updateNotes("menu-1", "extra pedas");

      expect(usePosCartStore.getState().items[0]?.notes).toBe("extra pedas");
    });
  });

  describe("clearCart", () => {
    it("should clear all items and table number", () => {
      usePosCartStore.getState().addItem(testMenu);
      usePosCartStore.getState().addItem(testMenu2);
      usePosCartStore.getState().setTableNumber(5);

      usePosCartStore.getState().clearCart();

      const state = usePosCartStore.getState();
      expect(state.items).toHaveLength(0);
      expect(state.tableNumber).toBeNull();
    });
  });

  describe("setTableNumber", () => {
    it("should set table number", () => {
      usePosCartStore.getState().setTableNumber(7);
      expect(usePosCartStore.getState().tableNumber).toBe(7);
    });

    it("should set table number to null", () => {
      usePosCartStore.getState().setTableNumber(7);
      usePosCartStore.getState().setTableNumber(null);
      expect(usePosCartStore.getState().tableNumber).toBeNull();
    });
  });

  describe("getTotal", () => {
    it("should return 0 for empty cart", () => {
      expect(usePosCartStore.getState().getTotal()).toBe(0);
    });

    it("should calculate total for single item", () => {
      usePosCartStore.getState().addItem(testMenu, 2);
      expect(usePosCartStore.getState().getTotal()).toBe(50000);
    });

    it("should calculate total for multiple items", () => {
      usePosCartStore.getState().addItem(testMenu, 2);     // 25000 * 2 = 50000
      usePosCartStore.getState().addItem(testMenu2, 3);    // 20000 * 3 = 60000
      expect(usePosCartStore.getState().getTotal()).toBe(110000);
    });
  });

  describe("getItemCount", () => {
    it("should return 0 for empty cart", () => {
      expect(usePosCartStore.getState().getItemCount()).toBe(0);
    });

    it("should return total quantity count", () => {
      usePosCartStore.getState().addItem(testMenu, 2);
      usePosCartStore.getState().addItem(testMenu2, 3);
      expect(usePosCartStore.getState().getItemCount()).toBe(5);
    });
  });
});
