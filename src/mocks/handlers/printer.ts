import { http, HttpResponse } from "msw";
import { delay } from "../data/seed";
import type { PrinterConfig } from "@features/settings/domain/entities/PrinterConfig";

const config: PrinterConfig = {
  printerName: "EPSON TM-T82",
  paperSize: "80mm",
  autoPrint: true,
  footerNote: "Terima kasih sudah berkunjung!",
};

export const printerHandlers = [
  http.get("/api/v1/settings/printer", async () => {
    await delay();
    return HttpResponse.json({ success: true, data: config });
  }),
  http.put("/api/v1/settings/printer", async () => {
    await delay();
    return HttpResponse.json({ success: true, data: config });
  }),
];
