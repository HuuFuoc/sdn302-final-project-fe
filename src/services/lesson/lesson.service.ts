import { BaseService } from "../../app/api/base.service";
import type { ResponseSuccess } from "../../app/interface";
import type {
  LessonRequest,
  CreateLessonRequest,
  DeleteLessonRequest,
  UpdateLessonRequest,
  GetLessonBySessionIdRequest,
  GetLessonByIdRequest,
} from "../../types/lesson/Lesson.req.type";
import type { Lesson } from "../../types/lesson/Lesson.res.type";
import { API_PATH } from "../../consts/api.path.const";

export const LessonService = {
  getAllLessons(params: LessonRequest) {
    const payload: any = { ...params };
    if (params.userId) {
      payload.user_id = params.userId;
      delete payload.userId;
    }
    return BaseService.get<ResponseSuccess<Lesson[]>>({
      url: API_PATH.LESSON.GET_ALL_LESSONS,
      payload,
    });
  },
  createLesson(params: CreateLessonRequest) {
    const payload: any = {
      ...params,
    };

    if ((params as any).courseId) {
      payload.course_id = (params as any).courseId;
      delete payload.courseId;
    }

    if ((params as any).sessionId) {
      payload.session_id = (params as any).sessionId;
      delete payload.sessionId;
    }

    if ((params as any).userId) {
      payload.user_id = (params as any).userId;
      delete payload.userId;
    }

    return BaseService.post<ResponseSuccess<Lesson>>({
      url: API_PATH.LESSON.CREATE_LESSON,
      payload,
    });
  },
  deleteLesson(params: DeleteLessonRequest) {
    return BaseService.remove<ResponseSuccess<void>>({
      url: API_PATH.LESSON.DELETE_LESSON(params.id),
      payload: params,
    });
  },
  updateLesson(params: UpdateLessonRequest) {
    return BaseService.put<ResponseSuccess<Lesson>>({
      url: API_PATH.LESSON.UPDATE_LESSON(params.id),
      payload: params,
    });
  },
  getLessonBySessionId(params: GetLessonBySessionIdRequest) {
    return BaseService.get<ResponseSuccess<Lesson[]>>({
      url: API_PATH.LESSON.GET_LESSON_BY_SESSION_ID(params.SessionId),
      payload: params,
    });
  },
  getLessonById(params: GetLessonByIdRequest) {
    return BaseService.get<ResponseSuccess<Lesson>>({
      url: API_PATH.LESSON.GET_LESSON_BY_ID(params.lessonId),
      payload: params,
    });
  },
};
