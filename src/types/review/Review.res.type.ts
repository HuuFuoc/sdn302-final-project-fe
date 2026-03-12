export interface Review {
  id: string;
  courseId?: string;
  appointmentId?: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}
export interface ReviewPageInfo {
  totalReviews: number;
  averageRating: number;
  reviews: Review[];
}
