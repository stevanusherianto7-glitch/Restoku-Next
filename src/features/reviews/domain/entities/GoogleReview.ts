export interface GoogleReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  replyText?: string;
  replied: boolean;
  createdAt: string;
}
