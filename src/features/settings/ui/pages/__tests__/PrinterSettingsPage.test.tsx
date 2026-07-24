import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PrinterSettingsPage } from "../PrinterSettingsPage";
import { usePrinterSettingsViewModel } from "../../viewmodels/usePrinterSettingsViewModel";

vi.mock("../../viewmodels/usePrinterSettingsViewModel", () => ({
  usePrinterSettingsViewModel: vi.fn(),
}));

describe("PrinterSettingsPage", () => {
  it("renders printer config", async () => {
    (usePrinterSettingsViewModel as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      config: { printerName: "EPSON TM-T82", paperSize: "80mm", autoPrint: true, footerNote: "Terima kasih" },
      isLoading: false,
      error: null,
      save: vi.fn(),
    });

    render(
      <MemoryRouter>
        <PrinterSettingsPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Konfigurasi Printer")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByDisplayValue("EPSON TM-T82")).toBeInTheDocument());
  });
});
