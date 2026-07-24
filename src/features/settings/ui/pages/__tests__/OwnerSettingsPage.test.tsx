import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { OwnerSettingsPage } from "../OwnerSettingsPage";
import { useOwnerSettingsViewModel } from "../../viewmodels/useOwnerSettingsViewModel";

vi.mock("../../viewmodels/useOwnerSettingsViewModel", () => ({
  useOwnerSettingsViewModel: vi.fn(),
}));

describe("OwnerSettingsPage", () => {
  it("renders owner settings", async () => {
    (useOwnerSettingsViewModel as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      settings: { tenantName: "Restoku", ownerName: "Pak Joko", email: "j@r.id", phone: "0812", subscriptionPlan: "pro" },
      isLoading: false,
      error: null,
      save: vi.fn(),
    });

    render(
      <MemoryRouter>
        <OwnerSettingsPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Pengaturan Owner")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByDisplayValue("Restoku")).toBeInTheDocument());
  });
});
