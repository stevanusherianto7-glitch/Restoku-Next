import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { OutletComparisonPage } from "../OutletComparisonPage";
import { useOutletComparisonViewModel } from "../../viewmodels/useOutletComparisonViewModel";

vi.mock("../../viewmodels/useOutletComparisonViewModel", () => ({
  useOutletComparisonViewModel: vi.fn(),
}));

describe("OutletComparisonPage", () => {
  it("renders outlets with compare badge", async () => {
    (useOutletComparisonViewModel as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      outlets: [{ outletId: "o1", name: "Kedai Sudirman", revenue: 12500000, orders: 412, comparePct: 8.4 }],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <OutletComparisonPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Perbandingan Outlet")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Kedai Sudirman")).toBeInTheDocument());
  });
});
