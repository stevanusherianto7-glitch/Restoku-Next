import { create } from "zustand";
import type { MenuItem } from "@features/menu/domain/entities/MenuItem";
import type { PaymentStatus } from "@features/pos/domain/entities/Order";

export interface PosCartItem {
  menu: MenuItem;
  quantity: number;
  variant?: string;
  notes?: string;
}

interface PosCartState {
  items: PosCartItem[];
  tableNumber: number | null;
  paymentMethod: "cash" | "qris" | "debit" | "credit" | "ewallet" | "gopay" | "ovo" | "dana" | "bank_transfer";
  discountPercentage: number;
  lastOrderId: string | null;
  lastPaymentStatus: PaymentStatus | null;
  addItem: (menu: MenuItem, quantity?: number, variant?: string, notes?: string) => void;
  removeItem: (menuId: string) => void;
  updateQuantity: (menuId: string, quantity: number) => void;
  updateNotes: (menuId: string, notes: string) => void;
  clearCart: () => void;
  setTableNumber: (tableNumber: number | null) => void;
  setPaymentMethod: (method: PosCartState["paymentMethod"]) => void;
  setDiscountPercentage: (discount: number) => void;
  setLastOrder: (orderId: string, paymentStatus: PaymentStatus) => void;
  getTotal: () => number;
  getDiscountAmount: () => number;
  getTaxAmount: () => number;
  getTotalWithTax: () => number;
  getItemCount: () => number;
}

export const usePosCartStore = create<PosCartState>()((set, get) => ({
  items: [],
  tableNumber: null,
  paymentMethod: "cash",
  discountPercentage: 0,
  lastOrderId: null,
  lastPaymentStatus: null,

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
    set({ items: [], tableNumber: null, discountPercentage: 0, lastOrderId: null, lastPaymentStatus: null });
  },

  setTableNumber: (tableNumber) => {
    set({ tableNumber });
  },

  setPaymentMethod: (paymentMethod) => {
    set({ paymentMethod });
  },

  setDiscountPercentage: (discountPercentage) => {
    set({ discountPercentage: Math.max(0, Math.min(100, discountPercentage)) });
  },

  setLastOrder: (orderId, paymentStatus) => {
    set({ lastOrderId: orderId, lastPaymentStatus: paymentStatus });
  },

  getTotal: () => {
    return get().items.reduce(
      (total, item) => total + item.menu.price * item.quantity,
      0
    );
  },

  getDiscountAmount: () => {
    const total = get().getTotal();
    const discount = get().discountPercentage;
    return (total * discount) / 100;
  },

  getTaxAmount: () => {
    const netTotal = get().getTotal() - get().getDiscountAmount();
    return Math.round(netTotal * 0.1);
  },

  getTotalWithTax: () => {
    const netTotal = get().getTotal() - get().getDiscountAmount();
    return netTotal + get().getTaxAmount();
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));
