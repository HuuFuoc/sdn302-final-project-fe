import { BaseService } from "../../app/api/base.service";
import type { ResponseSuccess } from "../../app/interface";
import { API_PATH } from "../../consts/api.path.const";
import type {
  CourseRequest,
  CreateCourseRequest,
  UpdateCourseRequest,
  DeleteCourseRequest,
  CourseDetailRequest,
} from "../../types/course/Course.req.type";
import type {
  Course,
  CourseDetailResponse,
} from "../../types/course/Course.res.type";

const ensureArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.filter(Boolean) as string[];
  if (typeof value === "string" && value.trim()) return [value];
  return [];
};

const toTrimmedString = (value: unknown): string => {
  if (typeof value !== "string") return "";
  return value.trim();
};

const normalizeLesson = (lesson: any) => ({
  ...lesson,
  id: lesson?.id ?? lesson?._id ?? "",
  name: lesson?.name ?? "",
  content: lesson?.content ?? "",
  lessonType: lesson?.lessonType ?? lesson?.lesson_type ?? "",
  videoUrl: lesson?.videoUrl ?? lesson?.video_url ?? "",
  imageUrl: lesson?.imageUrl ?? lesson?.image_url ?? "",
  fullTime: Number(lesson?.fullTime ?? lesson?.full_time ?? 0),
  positionOrder: Number(lesson?.positionOrder ?? lesson?.position_order ?? 0),
  sessionId: lesson?.sessionId ?? lesson?.session_id ?? "",
  courseId: lesson?.courseId ?? lesson?.course_id ?? "",
  userAvatar: lesson?.userAvatar ?? lesson?.user_avatar ?? "",
  fullName: lesson?.fullName ?? lesson?.full_name ?? "",
  createdAt: lesson?.createdAt ?? lesson?.created_at ?? "",
  updatedAt: lesson?.updatedAt ?? lesson?.updated_at ?? "",
  userId: lesson?.userId ?? lesson?.user_id ?? "",
});

const normalizeSession = (session: any) => ({
  ...session,
  id: session?.id ?? session?._id ?? "",
  courseId: session?.courseId ?? session?.course_id ?? "",
  name: session?.name ?? "",
  userId: session?.userId ?? session?.user_id ?? "",
  slug: session?.slug ?? "",
  content: session?.content ?? "",
  lessonList: Array.isArray(session?.lessonList)
    ? session.lessonList.map(normalizeLesson)
    : Array.isArray(session?.lesson_list)
    ? session.lesson_list.map(normalizeLesson)
    : [],
});

const normalizeCourse = (raw: any): Course => ({
  ...raw,
  id: raw?.id ?? raw?._id ?? raw?.courseId ?? "",
  name: raw?.name ?? "",
  userId: raw?.userId ?? raw?.user_id ?? "",
  categoryId: raw?.categoryId ?? raw?.category_id ?? "",
  content: raw?.content ?? "",
  slug: raw?.slug ?? "",
  status: toTrimmedString(raw?.status) as any,
  targetAudience: toTrimmedString(
    raw?.targetAudience ?? raw?.target_audience
  ) as any,
  riskLevel: toTrimmedString(raw?.riskLevel ?? raw?.risk_level) as any,
  createdAt: raw?.createdAt ?? raw?.created_at ?? "",
  price: Number(raw?.price ?? 0),
  discount: Number(raw?.discount ?? 0),
  isInCart: Boolean(raw?.isInCart ?? raw?.is_in_cart),
  isPurchased: Boolean(raw?.isPurchased ?? raw?.is_purchased),
  sessionList: Array.isArray(raw?.sessionList)
    ? raw.sessionList.map(normalizeSession)
    : Array.isArray(raw?.session_list)
    ? raw.session_list.map(normalizeSession)
    : [],
  imageUrls: ensureArray(raw?.imageUrls ?? raw?.image_urls ?? raw?.imageUrl),
  videoUrls: ensureArray(raw?.videoUrls ?? raw?.video_urls ?? raw?.videoUrl),
});

const extractCoursePayload = (payload: any): any | null => {
  if (!payload) return null;
  if (Array.isArray(payload)) return payload[0] ?? null;
  if (payload.course) return payload.course;
  if (payload.item) return payload.item;
  if (payload.result) return payload.result;
  return payload;
};

export const CourseService = {
  getAllCourses(params: CourseRequest) {
    return BaseService.get<ResponseSuccess<Course[]>>({
      url: API_PATH.COURSE.GET_ALL_COURSES,
      payload: params,
    }).then((res) => {
      const rawList = Array.isArray((res.data as any)?.data)
        ? (res.data as any).data
        : [];
      (res.data as any).data = rawList.map(normalizeCourse);
      return res;
    });
  },
  createCourse(params: CreateCourseRequest) {
    return BaseService.post<ResponseSuccess<Course>>({
      url: API_PATH.COURSE.CREATE_COURSE,
      payload: params,
    });
  },
  updateCourse(params: UpdateCourseRequest) {
    return BaseService.put<ResponseSuccess<Course>>({
      url: API_PATH.COURSE.UPDATE_COURSE(params.id),
      payload: params,
    });
  },
  deleteCourse(params: DeleteCourseRequest) {
    return BaseService.remove<ResponseSuccess<void>>({
      url: API_PATH.COURSE.DELETE_COURSE(params.id),
      payload: params,
    });
  },
  getCourseById(param: CourseDetailRequest) {
    return BaseService.get<ResponseSuccess<CourseDetailResponse>>({
      url: API_PATH.COURSE.GET_COURSE_BY_ID(param.id),
      payload: param,
    }).then((res) => {
      const body: any = res.data;
      const raw = extractCoursePayload(
        body?.data ?? body?.course ?? body?.result ?? null
      );
      if (raw) {
        (res.data as any).data = normalizeCourse(raw);
      }
      return res;
    });
  },
  getMyCourses(userId: string) {
    return BaseService.get<ResponseSuccess<Course[]>>({
      url: API_PATH.COURSE.GET_MY_COURSES,
      payload: { userId },
    }).then((res) => {
      const rawList = Array.isArray((res.data as any)?.data)
        ? (res.data as any).data
        : [];
      (res.data as any).data = rawList.map(normalizeCourse);
      return res;
    });
  },
};
