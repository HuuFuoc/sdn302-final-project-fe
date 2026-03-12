import { BaseService } from "../../app/api/base.service";
import type { ResponseSuccess } from "../../app/interface";
import type {
  CreateCourseReviewRequest,
  CreateReviewRequest,
  DeleteReviewRequest,
  GetAllReviewRequest,
  GetReviewByCourseIdRequest,
  GetReviewByUserIdRequest,
  GetReviewById,
  ReviewAppointmentRequest,
  UpdateReviewRequest,
} from "../../types/review/Review.req.type";
import type {
  Review,
  ReviewPageInfo,
} from "../../types/review/Review.res.type";
import { API_PATH } from "../../consts/api.path.const";

const normalizeReview = (raw: any): Review => ({
  id: raw?.id ?? raw?._id ?? "",
  courseId: raw?.courseId ?? raw?.course_id ?? undefined,
  appointmentId: raw?.appointmentId ?? raw?.appointment_id ?? undefined,
  userId: raw?.userId ?? raw?.user_id ?? "",
  rating: Number(raw?.rating ?? 0),
  comment: raw?.comment ?? "",
  createdAt: raw?.createdAt ?? raw?.created_at ?? "",
  updatedAt: raw?.updatedAt ?? raw?.updated_at ?? undefined,
});

const normalizeReviewList = (raw: unknown): Review[] =>
  Array.isArray(raw) ? raw.map(normalizeReview) : [];

const toReviewPageInfo = (raw: any): ReviewPageInfo => {
  if (Array.isArray(raw)) {
    const reviews = normalizeReviewList(raw);
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, item) => sum + (item.rating || 0), 0) /
          totalReviews
        : 0;
    return { reviews, totalReviews, averageRating };
  }

  const nested =
    raw?.reviews ??
    raw?.data ??
    raw?.items ??
    raw?.pageData ??
    raw?.results ??
    [];
  const reviews = normalizeReviewList(nested);
  const totalReviews = Number(raw?.totalReviews ?? raw?.total ?? reviews.length);
  const averageRating =
    Number(raw?.averageRating ?? raw?.average_rating) ||
    (reviews.length > 0
      ? reviews.reduce((sum, item) => sum + (item.rating || 0), 0) /
        reviews.length
      : 0);

  return { reviews, totalReviews, averageRating };
};

export const ReviewService = {
  getAllReviews(params: GetAllReviewRequest) {
    return BaseService.get<ResponseSuccess<Review[]>>({
      url: API_PATH.REVIEW.GET_ALL_REVIEWS,
      payload: params,
    }).then((res) => {
      (res.data as any).data = normalizeReviewList((res.data as any)?.data);
      return res;
    });
  },
  createCourseReview(params: CreateCourseReviewRequest) {
    return BaseService.post<ResponseSuccess<Review>>({
      url: API_PATH.REVIEW.CREATE_COURSE_REVIEW,
      payload: params,
    }).then((res) => {
      if ((res.data as any)?.data) {
        (res.data as any).data = normalizeReview((res.data as any).data);
      }
      return res;
    });
  },
  createReview(params: CreateReviewRequest) {
    return this.createCourseReview(params);
  },
  deleteReview(params: DeleteReviewRequest) {
    return BaseService.remove<ResponseSuccess<Review>>({
      url: API_PATH.REVIEW.DELETE_REVIEW(params.id),
      payload: params,
    });
  },
  getReviewByCourseId(params: GetReviewByCourseIdRequest) {
    return BaseService.get<ResponseSuccess<ReviewPageInfo>>({
      url: API_PATH.REVIEW.GET_REVIEW_BY_COURSE_ID(params.courseId),
      payload: params,
    }).then((res) => {
      (res.data as any).data = toReviewPageInfo((res.data as any)?.data);
      return res;
    });
  },
  getReviewByUserId(params: GetReviewByUserIdRequest) {
    return BaseService.get<ResponseSuccess<Review[]>>({
      url: API_PATH.REVIEW.GET_REVIEW_BY_USER_ID(params.userId),
      payload: params,
    }).then((res) => {
      (res.data as any).data = normalizeReviewList((res.data as any)?.data);
      return res;
    });
  },
  getReviewById(params: GetReviewById) {
    return BaseService.get<ResponseSuccess<Review>>({
      url: API_PATH.REVIEW.GET_REVIEW_BY_ID(params.id),
      payload: params,
    }).then((res) => {
      if ((res.data as any)?.data) {
        (res.data as any).data = normalizeReview((res.data as any).data);
      }
      return res;
    });
  },
  getReviewByAppointmentId(appointmentId: string) {
    return BaseService.get<ResponseSuccess<Review[]>>({
      url: API_PATH.REVIEW.GET_ALL_REVIEWS,
      payload: { filterByAppointmentId: appointmentId },
    }).then((res) => {
      const reviews = normalizeReviewList((res.data as any)?.data).filter(
        (item) => item.appointmentId === appointmentId
      );
      (res.data as any).data = reviews;
      return res;
    });
  },
  reviewAppointment(params: ReviewAppointmentRequest) {
    return BaseService.post<ResponseSuccess<Review>>({
      url: API_PATH.REVIEW.CREATE_APPOINTMENT_REVIEW,
      payload: params,
    }).then((res) => {
      if ((res.data as any)?.data) {
        (res.data as any).data = normalizeReview((res.data as any).data);
      }
      return res;
    });
  },
  updateReview(params: UpdateReviewRequest) {
    return BaseService.put<ResponseSuccess<Review>>({
      url: API_PATH.REVIEW.UPDATE_REVIEW(params.id),
      payload: params,
    }).then((res) => {
      if ((res.data as any)?.data) {
        (res.data as any).data = normalizeReview((res.data as any).data);
      }
      return res;
    });
  },
};
