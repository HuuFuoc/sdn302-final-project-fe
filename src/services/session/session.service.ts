import { BaseService } from "../../app/api/base.service";
import type { ResponseSuccess } from "../../app/interface";
import type {
  SessionRequest,
  CreateSessionRequest,
  DeleteSessionRequest,
  UpdateSessionRequest,
  GetSessionByCourseIdRequest,
  GetSessionByIdRequest,
} from "../../types/session/Session.req.type";
import type { Session } from "../../types/session/Session.res.type";
import { API_PATH } from "../../consts/api.path.const";

export const SessionService = {
  getAllSessions(params: SessionRequest) {
    const payload: any = { ...params };
    if (params.userId) {
      payload.user_id = params.userId;
      delete payload.userId;
    }
    return BaseService.get<ResponseSuccess<Session[]>>({
      url: API_PATH.SESSION.GET_ALL_SESSIONS,
      payload,
    });
  },
  createSession(params: CreateSessionRequest) {
    const payload: any = {
      ...params,
      course_id: params.courseId,
      user_id: params.userId,
    };
    delete payload.courseId;
    delete payload.userId;
    return BaseService.post<ResponseSuccess<Session>>({
      url: API_PATH.SESSION.CREATE_SESSION,
      payload,
    });
  },
  deleteSession(params: DeleteSessionRequest) {
    return BaseService.remove<ResponseSuccess<void>>({
      url: API_PATH.SESSION.DELETE_SESSION(params.id),
      payload: params,
    });
  },
  updateSession(params: UpdateSessionRequest) {
    return BaseService.put<ResponseSuccess<Session>>({
      url: API_PATH.SESSION.UPDATE_SESSION(params.id),
      payload: params,
    });
  },
  getSessionByCourseId(params: GetSessionByCourseIdRequest) {
    return BaseService.get<ResponseSuccess<Session[]>>({
      url: API_PATH.SESSION.GET_SESSION_BY_COURSE_ID(params.CourseId),
      payload: params,
    });
  },
  getSessionById(params: GetSessionByIdRequest) {
    return BaseService.get<ResponseSuccess<Session>>({
      url: API_PATH.SESSION.GET_SESSION_BY_ID(params.id),
      payload: params,
    });
  },
};
