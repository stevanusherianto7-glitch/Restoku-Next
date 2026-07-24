import { http, HttpResponse } from "msw";
import { delay } from "../data/seed";
import type { StockOpname } from "@features/stock-opname/domain/entities/StockOpname";

const seedOpname: StockOpname[] = [
  { id: "op_0001", date: "2026-07-20", itemId: "inv_0002", itemName: "Minyak Goreng", systemStock: 18, physicalStock: 15, difference: -3, note: "Tumpah" },
  { id: "op_0002", date: "2026-07-21", itemId: "inv_0004", itemName: "Gula Pasir", systemStock: 8, physicalStock: 10, difference: 2, note: "Salah catat" },
];

export const stockOpnameHandlers = [
  http.get("/api/v1/stock-opname", async () => {
    await delay();
    return HttpResponse.json({ success: true, data: seedOpname });
  }),
];
