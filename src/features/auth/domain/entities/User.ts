import type { UserId } from "@shared/domain/types";

export type UserRole = "owner" | "manager" | "cashier" | "kitchen" | "waiter";

export interface User {
  id: UserId;
  email: string;
  name: string;
  role: UserRole;
  restaurantId: string;
  tenant_id: string;
  outlet_id: string | null;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function canManageInventory(user: User): boolean {
  return user.role === "owner" || user.role === "manager";
}

export function canProcessPayment(user: User): boolean {
  return user.role === "owner" || user.role === "manager" || user.role === "cashier";
}
