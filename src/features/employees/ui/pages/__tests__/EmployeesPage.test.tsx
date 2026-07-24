import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { EmployeesPage } from "../EmployeesPage";
import { useEmployeesViewModel } from "../../viewmodels/useEmployeesViewModel";

vi.mock("../../viewmodels/useEmployeesViewModel", () => ({
  useEmployeesViewModel: vi.fn(),
}));

describe("EmployeesPage", () => {
  it("renders employees", async () => {
    (useEmployeesViewModel as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      employees: [{ id: "1", name: "Andi", role: "kasir", email: "a@b.c", phone: "0811", pin: "123456", active: true }],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <EmployeesPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Data Karyawan")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Andi")).toBeInTheDocument());
  });
});
