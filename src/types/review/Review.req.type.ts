export interface GetAllReviewRequest {
  pageSize?: number;
  pageNumber?: number;
  filterByCourseId?: string;
  filterByUserId?: string;
  filterByAppointmentId?: string;
}
export interface GetReviewByCourseIdRequest {
  courseId: string;
}
export interface GetReviewByUserIdRequest {
  userId: string;
}
export interface CreateReviewRequest {
  courseId: string;
  userId: string;
  rating: number;
  comment: string;
}

export type CreateCourseReviewRequest = CreateReviewRequest;
export interface DeleteReviewRequest {
  id: string;
}
export interface GetReviewById {
  id: string;
}

export interface ReviewAppointmentRequest {
  appointmentId: string;
  userId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewRequest {
  id: string;
  rating: number;
  comment: string;
}
