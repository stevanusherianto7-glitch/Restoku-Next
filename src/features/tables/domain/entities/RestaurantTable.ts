export type TableId = string & { readonly __brand: unique symbol };

export interface RestaurantTable {
  id: TableId;
  restaurant_id: string;
  name: string;
  number: number;
  is_active: boolean;
  qr_url: string | null;
  created_at: string;
  updated_at: string;
}

export function createTableId(id: string): TableId {
  return id as TableId;
}

export function getQrUrl(restaurantId: string, tableNumber: number): string {
  const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  return `${baseUrl}/menu/${restaurantId}?table=${tableNumber}`;
}
