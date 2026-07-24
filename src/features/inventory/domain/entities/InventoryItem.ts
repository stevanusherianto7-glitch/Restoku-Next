export interface InventoryItem {
  id: string;
  name: string;
  unit: "kg" | "pcs" | "liter";
  stock: number;
  minStock: number;
  costPerUnit: number;
  category: string;
}

export function isLowStock(item: InventoryItem): boolean {
  return item.stock <= item.minStock;
}
