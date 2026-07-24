import { http, HttpResponse } from "msw";
import { delay } from "../data/seed";
import type { InventoryAlert } from "@features/inventory/domain/entities/InventoryAlert";

const alerts: InventoryAlert[] = [
  { id: "al_0001", itemName: "Minyak Goreng", stock: 18, minStock: 20, severity: "low" },
  { id: "al_0002", itemName: "Gula Pasir", stock: 8, minStock: 15, severity: "critical" },
  { id: "al_0003", itemName: "Garam", stock: 3, minStock: 10, severity: "critical" },
];

export const inventoryAlertsHandlers = [
  http.get("/api/v1/inventory/alerts", async () => {
    await delay();
    return HttpResponse.json({ success: true, data: alerts });
  }),
];
