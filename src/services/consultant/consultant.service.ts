import { BaseService } from "../../app/api/base.service";
import type { PromiseState } from "../../app/api/base.service";
import { axiosInstance } from "../../app/api/base.service";
import type { ResponseSuccess } from "../../app/interface";
import type { Consultant } from "../../types/consultant/consultant.res.type";
import type {
  InstructorCourseSalesSummaryResponseData,
  InstructorOrderHistoryResponseData,
} from "../../types/consultant/instructorRevenue.res.type";
import type {
  CourseDetailRequest,
  CourseRequest,
  CreateCourseRequest,
  DeleteCourseRequest,
  UpdateCourseRequest,
} from "../../types/course/Course.req.type";
import type { Course, CourseDetailResponse } from "../../types/course/Course.res.type";
import { API_PATH } from "../../consts/api.path.const";
import type {
  BecomeInstructorRequest,
  ConsultantRequest,
  CreateConsultantRequest,
  UpdateConsultantRequest,
  DeleteConsultantRequest,
  ConsultantDetailRequest,
  InstructorRequestQuery,
  ReviewInstructorRequest,
} from "../../types/consultant/consultant.req.type";

export const ConsultantService = {
  getErrorStatus(error: any): number | undefined {
    return error?.response?.status ?? error?.status;
  },

  getAllConsultants(params: ConsultantRequest) {
    return BaseService.get<ResponseSuccess<Consultant[]>>({
      url: API_PATH.INSTRUCTOR.GET_ALL_INSTRUCTORS,
      payload: params,
    });
  },

  getAllInstructors(params: ConsultantRequest) {
    return ConsultantService.getAllConsultants(params);
  },

  createConsultant(
    params: CreateConsultantRequest | BecomeInstructorRequest
  ) {
    return BaseService.post<ResponseSuccess<Consultant>>({
      url: API_PATH.USER.BECOME_INSTRUCTOR,
      payload: params,
    });
  },

  becomeInstructor(params: BecomeInstructorRequest = {}) {
    return BaseService.post<ResponseSuccess<unknown>>({
      url: API_PATH.USER.BECOME_INSTRUCTOR,
      payload: params,
    });
  },

  updateConsultant(params: UpdateConsultantRequest) {
    return BaseService.put<ResponseSuccess<Consultant>>({
      url: API_PATH.INSTRUCTOR.UPDATE_INSTRUCTOR(params.id),
      payload: params,
    });
  },

  deleteConsultant(params: DeleteConsultantRequest) {
    return BaseService.remove<ResponseSuccess<void>>({
      url: API_PATH.INSTRUCTOR.DELETE_INSTRUCTOR(params.id),
      payload: params,
    });
  },

  getConsultantById(param: ConsultantDetailRequest) {
    return BaseService.get<ResponseSuccess<Consultant>>({
      url: API_PATH.INSTRUCTOR.GET_INSTRUCTOR_BY_ID(param.id),
      payload: param,
    });
  },

  getInstructorById(param: ConsultantDetailRequest) {
    return ConsultantService.getConsultantById(param);
  },

  getInstructorRequests(params: InstructorRequestQuery) {
    return BaseService.get<ResponseSuccess<any[]>>({
      url: API_PATH.INSTRUCTOR.GET_INSTRUCTOR_REQUESTS,
      payload: params,
    });
  },

  getInstructorOrderHistory() {
    return BaseService.get<ResponseSuccess<InstructorOrderHistoryResponseData>>({
      url: API_PATH.INSTRUCTOR.GET_INSTRUCTOR_ORDER_HISTORY,
    });
  },

  getInstructorCourseSalesSummary() {
    return BaseService.get<ResponseSuccess<InstructorCourseSalesSummaryResponseData>>({
      url: API_PATH.INSTRUCTOR.GET_INSTRUCTOR_COURSE_SALES_SUMMARY,
    });
  },

  getInstructorCourses(params: CourseRequest) {
    return BaseService.get<ResponseSuccess<Course[]>>({
      url: API_PATH.COURSE.GET_ALL_COURSES,
      payload: params,
    });
  },

  createInstructorCourse(params: CreateCourseRequest) {
    return BaseService.post<ResponseSuccess<Course>>({
      url: API_PATH.INSTRUCTOR.CREATE_INSTRUCTOR_COURSE,
      payload: params,
    });
  },

  updateInstructorCourse(params: UpdateCourseRequest) {
    return BaseService.put<ResponseSuccess<Course>>({
      url: API_PATH.INSTRUCTOR.UPDATE_INSTRUCTOR_COURSE(params.id),
      payload: params,
    });
  },

  deleteInstructorCourse(params: DeleteCourseRequest) {
    return BaseService.remove<ResponseSuccess<void>>({
      url: API_PATH.INSTRUCTOR.DELETE_INSTRUCTOR_COURSE(params.id),
      payload: params,
    });
  },

  getInstructorCourseById(param: CourseDetailRequest) {
    return BaseService.get<ResponseSuccess<CourseDetailResponse>>({
      url: API_PATH.INSTRUCTOR.GET_INSTRUCTOR_COURSE_DETAIL(param.id),
      payload: param,
    });
  },

  reviewInstructorRequest(params: ReviewInstructorRequest) {
    const { requestId, isApproved, note } = params;
    return ConsultantService.reviewBySingleEndpoint<ResponseSuccess<unknown>>(
      API_PATH.INSTRUCTOR.REVIEW_INSTRUCTOR_REQUEST(requestId),
      {
        decision: isApproved ? "approve" : "reject",
        review_note: note || "",
      }
    );
  },

  async reviewBySingleEndpoint<T>(
    url: string,
    payload: Record<string, unknown>
  ): Promise<PromiseState<T>> {
    try {
      const patchResponse = await axiosInstance.patch<T>(url, payload);
      return patchResponse as PromiseState<T>;
    } catch (patchError: any) {
      const status = ConsultantService.getErrorStatus(patchError);
      // Some backends implement this endpoint as POST instead of PATCH.
      if (status === 405) {
        const postResponse = await axiosInstance.post<T>(url, payload);
        return postResponse as PromiseState<T>;
      }
      throw patchError;
    }
  },
};
