import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MenuItem } from "@features/menu/domain/entities/MenuItem";

export interface CartItem {
  menu: MenuItem;
  quantity: number;
  variant?: string;
  notes?: string;
}

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  tableNumber: number | null;
  addItem: (menu: MenuItem, quantity?: number, variant?: string, notes?: string) => void;
  removeItem: (menuId: string) => void;
  updateQuantity: (menuId: string, quantity: number) => void;
  updateNotes: (menuId: string, notes: string) => void;
  clearCart: () => void;
  setRestaurant: (restaurantId: string, tableNumber: number) => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      tableNumber: null,

      addItem: (menu, quantity = 1, variant, notes) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.menu.id === menu.id && item.variant === variant
          );

          if (existingIndex >= 0) {
            const existingItem = state.items[existingIndex];
            if (!existingItem) return state;
            
            const newItems = [...state.items];
            newItems[existingIndex] = {
              ...existingItem,
              quantity: existingItem.quantity + quantity,
            };
            return { items: newItems };
          }

          return {
            items: [...state.items, { menu, quantity, variant, notes }],
          };
        });
      },

      removeItem: (menuId) => {
        set((state) => ({
          items: state.items.filter((item) => item.menu.id !== menuId),
        }));
      },

      updateQuantity: (menuId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.menu.id === menuId ? { ...item, quantity } : item
          ),
        }));
      },

      updateNotes: (menuId, notes) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.menu.id === menuId ? { ...item, notes } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      setRestaurant: (restaurantId, tableNumber) => {
        set({ restaurantId, tableNumber });
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.menu.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "restoku-cart",
    }
  )
);
