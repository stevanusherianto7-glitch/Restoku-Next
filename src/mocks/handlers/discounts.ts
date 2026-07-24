import { http, HttpResponse } from "msw";
import { delay } from "../data/seed";
import type { Discount, Tax } from "@features/settings/domain/entities/Discount";

const discounts: Discount[] = [
  { id: "d1", name: "Diskon Member", type: "percent", value: 10, appliesTo: "Semua" },
  { id: "d2", name: "Diskon Cash", type: "nominal", value: 5000, appliesTo: "Makanan" },
];
const taxes: Tax[] = [
  { id: "t1", name: "PPN", rate: 11 },
];

export const discountHandlers = [
  http.get("/api/v1/settings/discounts", async () => {
    await delay();
    return HttpResponse.json({ success: true, data: { discounts, taxes } });
  }),
];
