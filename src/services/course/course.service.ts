import { BaseService } from "../../app/api/base.service";
import type { ResponseSuccess } from "../../app/interface";
import { API_PATH } from "../../consts/api.path.const";
import type {
  CourseRequest,
  CourseRecommendationRequest,
  CreateCourseRequest,
  UpdateCourseRequest,
  DeleteCourseRequest,
  CourseDetailRequest,
} from "../../types/course/Course.req.type";
import type {
  Course,
  CourseDetailResponse,
} from "../../types/course/Course.res.type";

export const CourseService = {
  getAllCourses(params: CourseRequest) {
    const payload: any = { ...params };
    if (params.userId) {
      payload.user_id = params.userId;
      delete payload.userId;
    }
    return BaseService.get<ResponseSuccess<Course[]>>({
      url: API_PATH.COURSE.GET_ALL_COURSES,
      payload,
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
    });
  },
  getMyCourses() {
    return BaseService.get<ResponseSuccess<Course[]>>({
      url: API_PATH.COURSE.GET_MY_COURSES,
    });
  },
  getMyRecommendedCourses(params?: CourseRecommendationRequest) {
    return BaseService.get<ResponseSuccess<Course[]>>({
      url: API_PATH.COURSE.GET_RECOMMENDED_COURSES_ME,
      payload: params,
    });
  },
};
