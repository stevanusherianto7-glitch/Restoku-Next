import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TtsSettingsPage } from "../TtsSettingsPage";
import { useTtsSettingsViewModel } from "../../viewmodels/useTtsSettingsViewModel";

vi.mock("../../viewmodels/useTtsSettingsViewModel", () => ({
  useTtsSettingsViewModel: vi.fn(),
}));

describe("TtsSettingsPage", () => {
  it("renders tts config", async () => {
    (useTtsSettingsViewModel as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      config: { enabled: true, voice: "id-ID-Wavenet-A", rate: 1, announceNewOrder: true },
      isLoading: false,
      error: null,
      save: vi.fn(),
    });

    render(
      <MemoryRouter>
        <TtsSettingsPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Pengaturan TTS (Voice Order)")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/Aktifkan TTS/)).toBeInTheDocument());
  });
});
