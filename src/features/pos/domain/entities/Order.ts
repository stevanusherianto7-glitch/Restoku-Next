export type OrderId = string & { readonly __brand: unique symbol };
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "cooking"
  | "ready"
  | "served"
  | "completed"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "paid"
  | "failed"
  | "refunded"
  | "expired";

export type CookingStatus = "pending" | "cooking" | "ready" | "served";

export interface OrderItem {
  id?: string;
  menu_id: string;
  menu_name: string;
  quantity: number;
  price: number;
  variant?: string;
  notes?: string;
  subtotal: number;
  cooking_status: CookingStatus;
}

export interface Order {
  id: OrderId;
  restaurant_id: string;
  table_id?: string;
  table_number: number;
  items: OrderItem[];
  status: OrderStatus;
  payment_status: PaymentStatus;
  total: number;
  subtotal: number;
  tax_amount: number;
  notes: string | null;
  source: "pos" | "qr" | "online";
  customer_name?: string;
  idempotency_key?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface VoidOrderParams {
  orderId: string;
  reason: string;
  managerPin?: string;
}

export interface VoidOrderResult {
  success: boolean;
  message: string;
  wastageRecorded?: boolean;
}

export function createOrderId(id: string): OrderId {
  return id as OrderId;
}

export function calculateOrderTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.subtotal, 0);
}

export function getStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    cooking: "bg-orange-100 text-orange-700",
    ready: "bg-green-100 text-green-700",
    served: "bg-emerald-100 text-emerald-700",
    completed: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return colors[status];
}

export function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    pending: "Menunggu",
    confirmed: "Dikonfirmasi",
    cooking: "Sedang Dimasak",
    ready: "Siap",
    served: "Terhidang",
    completed: "Selesai",
    cancelled: "Dibatalkan",
  };
  return labels[status];
}

export function getCookingStatusColor(status: CookingStatus): string {
  const colors: Record<CookingStatus, string> = {
    pending: "bg-slate-100 text-slate-600",
    cooking: "bg-amber-100 text-amber-700",
    ready: "bg-green-100 text-green-700",
    served: "bg-blue-100 text-blue-700",
  };
  return colors[status];
}

export function isOrderVoidable(order: Order): boolean {
  return ["pending", "confirmed"].includes(order.status);
}

export function canVoidCookedItems(order: Order): boolean {
  return order.items.some((item) =>
    ["cooking", "ready", "served"].includes(item.cooking_status)
  );
}
