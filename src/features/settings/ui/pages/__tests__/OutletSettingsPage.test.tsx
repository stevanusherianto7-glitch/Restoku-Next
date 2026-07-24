import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { OutletSettingsPage } from "../OutletSettingsPage";
import { useOutletSettingsViewModel } from "../../viewmodels/useOutletSettingsViewModel";

vi.mock("../../viewmodels/useOutletSettingsViewModel", () => ({
  useOutletSettingsViewModel: vi.fn(),
}));

describe("OutletSettingsPage", () => {
  it("renders form with settings", async () => {
    (useOutletSettingsViewModel as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      settings: { outletId: "o1", name: "Kedai Sudirman", address: "Jl. S", phone: "021", screenMode: "nano-banana", qrType: "self_order" },
      isLoading: false,
      error: null,
      save: vi.fn(),
    });

    render(
      <MemoryRouter>
        <OutletSettingsPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Pengaturan Outlet")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByDisplayValue("Kedai Sudirman")).toBeInTheDocument());
  });
});
