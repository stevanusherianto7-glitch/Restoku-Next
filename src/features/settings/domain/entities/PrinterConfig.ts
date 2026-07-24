export interface PrinterConfig {
  printerName: string;
  paperSize: "58mm" | "80mm";
  autoPrint: boolean;
  footerNote: string;
}
