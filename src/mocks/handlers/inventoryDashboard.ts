import { http, HttpResponse } from "msw";
import { delay } from "../data/seed";
import type { InventoryDashboard } from "@features/inventory/domain/entities/InventoryDashboard";

const dashboard: InventoryDashboard = {
  totalItems: 42,
  totalValue: 3850000,
  lowStockCount: 7,
  outOfStockCount: 2,
  categories: [
    { category: "Bahan Pokok", count: 18 },
    { category: "Protein", count: 12 },
    { category: "Sayur", count: 8 },
    { category: "Lainnya", count: 4 },
  ],
};

export const inventoryDashboardHandlers = [
  http.get("/api/v1/inventory/dashboard", async () => {
    await delay();
    return HttpResponse.json({ success: true, data: dashboard });
  }),
];
