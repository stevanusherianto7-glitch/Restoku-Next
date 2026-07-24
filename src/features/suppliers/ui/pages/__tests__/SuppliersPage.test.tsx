import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SuppliersPage } from "../SuppliersPage";
import { useSuppliersViewModel } from "../../viewmodels/useSuppliersViewModel";

vi.mock("../../viewmodels/useSuppliersViewModel", () => ({
  useSuppliersViewModel: vi.fn(),
}));

describe("SuppliersPage", () => {
  it("renders title and supplier list", async () => {
    (useSuppliersViewModel as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      suppliers: [{ id: "1", name: "CV Sinar Tani", contact: "Budi", phone: "0812", email: "a@b.c", address: "x", leadTimeDays: 2 }],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <SuppliersPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Supplier & Pembelian")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("CV Sinar Tani")).toBeInTheDocument());
  });
});
