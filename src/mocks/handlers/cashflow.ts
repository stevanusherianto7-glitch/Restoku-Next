import { http, HttpResponse } from "msw";
import { delay } from "../data/seed";
import type { CashFlowEntry } from "@features/finance/domain/entities/CashFlowEntry";

const seedCashFlow: CashFlowEntry[] = [
  { id: "cf_0001", date: "2026-07-22", type: "in", category: "Penjualan", amount: 2500000, note: "Lunch" },
  { id: "cf_0002", date: "2026-07-22", type: "out", category: "Gaji", amount: 1200000, note: "Kasir" },
  { id: "cf_0003", date: "2026-07-23", type: "in", category: "Penjualan", amount: 3100000, note: "Dinner" },
  { id: "cf_0004", date: "2026-07-23", type: "out", category: "Bahan", amount: 900000, note: "Sayur" },
  { id: "cf_0005", date: "2026-07-24", type: "in", category: "Penjualan", amount: 1800000, note: "Breakfast" },
];

export const cashFlowHandlers = [
  http.get("/api/v1/cash-flow", async () => {
    await delay();
    return HttpResponse.json({ success: true, data: seedCashFlow });
  }),
];
