import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CashFlowPage } from "../CashFlowPage";
import { useCashFlowViewModel } from "../../viewmodels/useCashFlowViewModel";

vi.mock("../../viewmodels/useCashFlowViewModel", () => ({
  useCashFlowViewModel: vi.fn(),
}));

describe("CashFlowPage", () => {
  it("renders totals and entries", async () => {
    (useCashFlowViewModel as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      entries: [{ id: "1", date: "2026-07-22", type: "in", category: "Penjualan", amount: 2500000, note: "" }],
      totalIn: 2500000,
      totalOut: 0,
      balance: 2500000,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <CashFlowPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Arus Kas")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Penjualan")).toBeInTheDocument());
  });
});
