import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { InventoryAlertsPage } from "../InventoryAlertsPage";
import { useInventoryAlertsViewModel } from "../../viewmodels/useInventoryAlertsViewModel";

vi.mock("../../viewmodels/useInventoryAlertsViewModel", () => ({
  useInventoryAlertsViewModel: vi.fn(),
}));

describe("InventoryAlertsPage", () => {
  it("renders alerts with severity badge", async () => {
    (useInventoryAlertsViewModel as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      alerts: [{ id: "1", itemName: "Gula Pasir", stock: 8, minStock: 15, severity: "critical" }],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <InventoryAlertsPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Peringatan Stok")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Gula Pasir")).toBeInTheDocument());
    expect(screen.getByText("Kritis")).toBeInTheDocument();
  });
});
