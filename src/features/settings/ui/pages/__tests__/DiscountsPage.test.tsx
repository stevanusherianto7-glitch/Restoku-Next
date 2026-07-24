import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DiscountsPage } from "../DiscountsPage";
import { useDiscountsViewModel } from "../../viewmodels/useDiscountsViewModel";

vi.mock("../../viewmodels/useDiscountsViewModel", () => ({
  useDiscountsViewModel: vi.fn(),
}));

describe("DiscountsPage", () => {
  it("renders discounts and taxes", async () => {
    (useDiscountsViewModel as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      discounts: [{ id: "d1", name: "Diskon Member", type: "percent", value: 10, appliesTo: "Semua" }],
      taxes: [{ id: "t1", name: "PPN", rate: 11 }],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <DiscountsPage />
      </MemoryRouter>
    );

    expect(screen.getAllByText("Diskon & Pajak")[0]).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Diskon Member")).toBeInTheDocument());
    expect(screen.getByText("PPN")).toBeInTheDocument();
  });
});
