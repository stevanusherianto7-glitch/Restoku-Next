export interface InventoryAlert {
  id: string;
  itemName: string;
  stock: number;
  minStock: number;
  severity: "low" | "critical";
}
