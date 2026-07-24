export interface InventoryDashboard {
  totalItems: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  categories: { category: string; count: number }[];
}
