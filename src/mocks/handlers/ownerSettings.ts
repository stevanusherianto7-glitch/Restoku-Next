import { http, HttpResponse } from "msw";
import { delay } from "../data/seed";
import type { OwnerSettings } from "@features/settings/domain/entities/OwnerSettings";

const settings: OwnerSettings = {
  tenantName: "Restoku Sudirman",
  ownerName: "Pak Joko",
  email: "joko@restoku.id",
  phone: "08123456",
  subscriptionPlan: "pro",
};

export const ownerSettingsHandlers = [
  http.get("/api/v1/owner/settings", async () => {
    await delay();
    return HttpResponse.json({ success: true, data: settings });
  }),
  http.put("/api/v1/owner/settings", async () => {
    await delay();
    return HttpResponse.json({ success: true, data: settings });
  }),
];
