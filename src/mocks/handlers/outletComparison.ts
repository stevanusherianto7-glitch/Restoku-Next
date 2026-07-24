import { http, HttpResponse } from "msw";
import { delay } from "../data/seed";
import type { OutletComparison } from "@features/outlet/domain/entities/OutletComparison";

const seedComparison: OutletComparison[] = [
  { outletId: "o1", name: "Kedai Sudirman", revenue: 12500000, orders: 412, comparePct: 8.4 },
  { outletId: "o2", name: "Kedai Kemang", revenue: 9800000, orders: 331, comparePct: -3.2 },
  { outletId: "o3", name: "Kedai PIK", revenue: 15400000, orders: 520, comparePct: 12.1 },
];

export const outletComparisonHandlers = [
  http.get("/api/v1/outlets/comparison", async () => {
    await delay();
    return HttpResponse.json({ success: true, data: seedComparison });
  }),
];
