import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { InventoryPage } from "../InventoryPage";
import { useInventoryViewModel } from "../../viewmodels/useInventoryViewModel";

vi.mock("../../viewmodels/useInventoryViewModel", () => ({
  useInventoryViewModel: vi.fn(),
}));

describe("InventoryPage", () => {
  it("renders title and item list", async () => {
    (useInventoryViewModel as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      items: [
        { id: "1", name: "Beras", unit: "kg", stock: 100, minStock: 30, costPerUnit: 12000, category: "Pokok" },
      ],
      lowStock: 0,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <InventoryPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Stok Bahan Baku")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Beras")).toBeInTheDocument());
  });

  it("shows loading skeleton", () => {
    (useInventoryViewModel as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      items: [],
      lowStock: 0,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <InventoryPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Stok Bahan Baku")).toBeInTheDocument();
  });
});
