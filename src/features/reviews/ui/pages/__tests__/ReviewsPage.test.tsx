import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ReviewsPage } from "../ReviewsPage";
import { useReviewsViewModel } from "../../viewmodels/useReviewsViewModel";

vi.mock("../../viewmodels/useReviewsViewModel", () => ({
  useReviewsViewModel: vi.fn(),
}));

describe("ReviewsPage", () => {
  it("renders reviews and replies via button", async () => {
    const replyMock = vi.fn();
    (useReviewsViewModel as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      reviews: [{ id: "rv1", author: "Budi", rating: 5, text: "Enak!", replied: false, createdAt: "2026-07-20" }],
      isLoading: false,
      error: null,
      reply: replyMock,
    });

    render(
      <MemoryRouter>
        <ReviewsPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Google Review")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Budi")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Balas"));
    fireEvent.click(screen.getByText("Kirim Balasan"));
    expect(replyMock).toHaveBeenCalledWith("rv1");
  });
});
