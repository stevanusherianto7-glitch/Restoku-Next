import { http, HttpResponse } from "msw";
import { delay, makeId } from "../data/seed";
import type { InventoryItem } from "@features/inventory/domain/entities/InventoryItem";

const seedItems: InventoryItem[] = [
  { id: "inv_0001", name: "Beras Premium", unit: "kg", stock: 120, minStock: 30, costPerUnit: 12000, category: "Bahan Pokok" },
  { id: "inv_0002", name: "Minyak Goreng", unit: "liter", stock: 18, minStock: 20, costPerUnit: 25000, category: "Bahan Pokok" },
  { id: "inv_0003", name: "Telur Ayam", unit: "pcs", stock: 240, minStock: 50, costPerUnit: 1500, category: "Protein" },
  { id: "inv_0004", name: "Gula Pasir", unit: "kg", stock: 8, minStock: 15, costPerUnit: 14000, category: "Bahan Pokok" },
];

export const inventoryHandlers = [
  http.get("/api/v1/inventory", async () => {
    await delay();
    return HttpResponse.json({ success: true, data: seedItems });
  }),
  http.post("/api/v1/inventory", async ({ request }) => {
    await delay();
    const body = (await request.json()) as Omit<InventoryItem, "id">;
    const created: InventoryItem = { ...body, id: makeId("inv") };
    seedItems.push(created);
    return HttpResponse.json({ success: true, data: created });
  }),
];
