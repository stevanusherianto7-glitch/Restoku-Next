import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { StockOpnamePage } from "../StockOpnamePage";
import { useStockOpnameViewModel } from "../../viewmodels/useStockOpnameViewModel";

vi.mock("../../viewmodels/useStockOpnameViewModel", () => ({
  useStockOpnameViewModel: vi.fn(),
}));

describe("StockOpnamePage", () => {
  it("renders records with difference badge", async () => {
    (useStockOpnameViewModel as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      records: [{ id: "1", date: "2026-07-20", itemId: "x", itemName: "Minyak", systemStock: 18, physicalStock: 15, difference: -3, note: "" }],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <StockOpnamePage />
      </MemoryRouter>
    );

    expect(screen.getByText("Stock Opname")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Minyak")).toBeInTheDocument());
    expect(screen.getByText("-3")).toBeInTheDocument();
  });
});
