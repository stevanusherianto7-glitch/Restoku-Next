import { http, HttpResponse } from "msw";
import { delay } from "../data/seed";
import type { GoogleReview } from "@features/reviews/domain/entities/GoogleReview";

const reviews: GoogleReview[] = [
  { id: "rv_0001", author: "Budi S.", rating: 5, text: "Makanannya enak!", replied: false, createdAt: "2026-07-20" },
  { id: "rv_0002", author: "Siti M.", rating: 4, text: "Pelayanan ramah.", replyText: "Terima kasih!", replied: true, createdAt: "2026-07-21" },
  { id: "rv_0003", author: "Anton", rating: 3, text: "Antri lama.", replied: false, createdAt: "2026-07-22" },
];

export const reviewsHandlers = [
  http.get("/api/v1/reviews", async () => {
    await delay();
    return HttpResponse.json({ success: true, data: reviews });
  }),
  http.post("/api/v1/reviews/:id/reply", async ({ params }) => {
    await delay();
    const r = reviews.find((x) => x.id === params.id);
    if (r) {
      r.replied = true;
      r.replyText = "Terima kasih atas masukannya!";
    }
    return HttpResponse.json({ success: true, data: r });
  }),
];
