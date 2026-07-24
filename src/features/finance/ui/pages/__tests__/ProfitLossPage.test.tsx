import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ProfitLossPage } from "../ProfitLossPage";
import { useProfitLossViewModel } from "../../viewmodels/useProfitLossViewModel";

vi.mock("../../viewmodels/useProfitLossViewModel", () => ({
  useProfitLossViewModel: vi.fn(),
}));

describe("ProfitLossPage", () => {
  it("renders PnL and ~Estimasi badge", async () => {
    (useProfitLossViewModel as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      pnl: { period: "2026-07", revenue: 385000000, cogs: 134750000, opex: 77000000, netProfit: 173250000, marginPct: 45, isEstimate: true },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProfitLossPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Laba & Rugi")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("~Estimasi")).toBeInTheDocument());
  });
});
