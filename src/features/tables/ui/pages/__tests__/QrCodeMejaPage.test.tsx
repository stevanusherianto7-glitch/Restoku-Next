import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QrCodeMejaPage } from "../QrCodeMejaPage";
import { useTableViewModel } from "@features/tables/ui/viewmodels/useTableViewModel";
import { useAuthStore } from "@features/auth/ui/stores/useAuthStore";

// Mock MSW-free view model + auth
vi.mock("@features/tables/ui/viewmodels/useTableViewModel", () => ({
  useTableViewModel: vi.fn(),
}));
vi.mock("@features/auth/ui/stores/useAuthStore", () => ({
  useAuthStore: vi.fn(),
}));

const mockTables = [
  { id: "tbl-1", number: 1, name: "Meja 1", is_active: true, is_queue: false, qr_type: "self_order" },
  { id: "tbl-2", number: 2, name: "Meja 2", is_active: true, is_queue: false, qr_type: "self_order" },
];

function renderPage() {
  return render(
    <MemoryRouter>
      <QrCodeMejaPage />
    </MemoryRouter>
  );
}

describe("QrCodeMejaPage", () => {
  beforeEach(() => {
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { tenant_id: "rest-1" },
    });
  });

  it("renders loading skeleton then QR grid", async () => {
    (useTableViewModel as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      tables: mockTables,
      isLoading: false,
      generateQr: vi.fn().mockResolvedValue([{ tableId: "tbl-1", qrUrl: "data:image/x" }]),
    });
    renderPage();
    await waitFor(() => expect(screen.getByText("Cetak Stiker QR Self-Order")).toBeTruthy());
    // Both tables shown
    expect(screen.getByText("Meja 1")).toBeTruthy();
    expect(screen.getByText("Meja 2")).toBeTruthy();
  });

  it("shows empty state when no tables", async () => {
    (useTableViewModel as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      tables: [],
      isLoading: false,
      generateQr: vi.fn(),
    });
    renderPage();
    await waitFor(() => expect(screen.getByText("Belum Ada Meja Terdaftar")).toBeTruthy());
  });

  it("opens print modal on 'Cetak Semua QR'", async () => {
    const generateQr = vi.fn().mockResolvedValue([
      { tableId: "tbl-1", qrUrl: "data:image/x" },
      { tableId: "tbl-2", qrUrl: "data:image/x" },
    ]);
    (useTableViewModel as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      tables: mockTables,
      isLoading: false,
      generateQr,
    });
    renderPage();
    const printAll = await screen.findByText("🖨️ Cetak Semua QR");
    printAll.click();
    await waitFor(() => expect(screen.getByText(/Lembar Cetak QR Code Self-Order Semua Meja/)).toBeTruthy());
    expect(generateQr).toHaveBeenCalledWith(["tbl-1", "tbl-2"]);
  });
});
