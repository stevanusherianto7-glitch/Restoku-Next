import { http, HttpResponse } from "msw";
import { delay } from "../data/seed";
import type { OutletSettings } from "@features/settings/domain/entities/OutletSettings";

const settings: OutletSettings = {
  outletId: "o1",
  name: "Kedai Sudirman",
  address: "Jl. Sudirman 123",
  phone: "021-555123",
  screenMode: "nano-banana",
  qrType: "self_order",
};

export const outletSettingsHandlers = [
  http.get("/api/v1/settings/outlet", async () => {
    await delay();
    return HttpResponse.json({ success: true, data: settings });
  }),
  http.put("/api/v1/settings/outlet", async () => {
    await delay();
    return HttpResponse.json({ success: true, data: settings });
  }),
];
