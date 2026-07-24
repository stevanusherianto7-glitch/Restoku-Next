import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { InventoryDashboardPage } from "../InventoryDashboardPage";
import { useInventoryDashboardViewModel } from "../../viewmodels/useInventoryDashboardViewModel";

vi.mock("../../viewmodels/useInventoryDashboardViewModel", () => ({
  useInventoryDashboardViewModel: vi.fn(),
}));

describe("InventoryDashboardPage", () => {
  it("renders dashboard cards", async () => {
    (useInventoryDashboardViewModel as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      dashboard: { totalItems: 42, totalValue: 3850000, lowStockCount: 7, outOfStockCount: 2, categories: [{ category: "Pokok", count: 18 }] },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <InventoryDashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Dasbor Stok")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("42")).toBeInTheDocument());
  });
});
