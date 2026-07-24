import { http, HttpResponse } from "msw";
import { delay } from "../data/seed";
import type { PnL } from "@features/finance/domain/entities/PnL";

const pnl: PnL = {
  period: "2026-07",
  revenue: 385000000,
  cogs: 134750000,
  opex: 77000000,
  netProfit: 173250000,
  marginPct: 45,
  isEstimate: true,
};

export const profitLossHandlers = [
  http.get("/api/v1/profit-loss", async () => {
    await delay();
    return HttpResponse.json({ success: true, data: pnl });
  }),
];
