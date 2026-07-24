import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ExpensesPage } from "../ExpensesPage";
import { useExpensesViewModel } from "../../viewmodels/useExpensesViewModel";

vi.mock("../../viewmodels/useExpensesViewModel", () => ({
  useExpensesViewModel: vi.fn(),
}));

describe("ExpensesPage", () => {
  it("renders expenses", async () => {
    (useExpensesViewModel as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      expenses: [{ id: "1", date: "2026-07-22", category: "Gaji", amount: 1200000, note: "Kasir" }],
      totalThisMonth: 1200000,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ExpensesPage />
      </MemoryRouter>
    );

    expect(screen.getAllByText("Biaya Operasional")[0]).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Gaji")).toBeInTheDocument());
  });
});
