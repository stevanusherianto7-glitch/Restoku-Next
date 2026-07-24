import { http, HttpResponse } from "msw";
import { delay } from "../data/seed";
import type { TtsSettings } from "@features/settings/domain/entities/TtsSettings";

const config: TtsSettings = {
  enabled: true,
  voice: "id-ID-Wavenet-A",
  rate: 1,
  announceNewOrder: true,
};

export const ttsHandlers = [
  http.get("/api/v1/settings/tts", async () => {
    await delay();
    return HttpResponse.json({ success: true, data: config });
  }),
  http.put("/api/v1/settings/tts", async () => {
    await delay();
    return HttpResponse.json({ success: true, data: config });
  }),
];
