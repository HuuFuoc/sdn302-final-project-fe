import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Typography } from "antd";
import { SectionLoader } from "../../../../components/common/loaders";
import { CourseService } from "../../../../services/course/course.service";
import { CourseStatus } from "../../../../app/enums/courseStatus.enum";
import { CourseTargetAudience } from "../../../../app/enums/courseTargetAudience.enum";
import { RiskLevel } from "../../../../app/enums/riskLevel.enum";
import type { CourseDetailResponse } from "../../../../types/course/Course.res.type";
import MyCourseDetail from "../../../../components/customer/my-course/MyCourseDetail.com";

const { Title } = Typography;

interface RawLesson {
  _id?: string;
  id?: string;
  name?: string;
  content?: string;
  lessonType?: string;
  videoUrl?: string;
  imageUrl?: string;
  fullTime?: number;
  positionOrder?: number;
  session_id?: string;
  sessionId?: string;
  course_id?: string;
  courseId?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
  user_id?: string;
  userId?: string;
}

interface RawSession {
  _id?: string;
  id?: string;
  course_id?: string;
  courseId?: string;
  name?: string;
  user_id?: string;
  userId?: string;
  slug?: string;
  content?: string;
  lessons?: RawLesson[];
}

interface RawCourse {
  _id?: string;
  id?: string;
  name?: string;
  user_id?: string;
  userId?: string;
  authorId?: string;
  instructorId?: string;
  createdBy?: string;
  user?: {
    _id?: string;
    id?: string;
    userId?: string;
  };
  category_id?: string;
  categoryId?: string;
  content?: string;
  status?: CourseDetailResponse["status"];
  targetAudience?: CourseDetailResponse["targetAudience"];
  imageUrls?: string[];
  imageUrl?: string;
  videoUrls?: string[];
  price?: number;
  discount?: number;
  slug?: string;
  created_at?: string;
  createdAt?: string;
  isInCart?: boolean;
  isPurchased?: boolean;
  riskLevel?: CourseDetailResponse["riskLevel"];
}

interface RawCourseDetail {
  course?: RawCourse;
  sessions?: RawSession[];
}

const MyCourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      if (!courseId || courseId === "undefined") {
        setCourse(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        const userId =
          typeof userInfo?.id === "string" ? userInfo.id : undefined;

        const res = await CourseService.getCourseById({
          id: courseId,
          userId,
        });

        if (!res.data?.success || !res.data?.data) {
          setCourse(null);
          return;
        }

        const raw = res.data.data as unknown as RawCourseDetail | RawCourse;
        const detailPayload = raw as RawCourseDetail;
        const rawCourse: RawCourse = detailPayload.course
          ? detailPayload.course
          : (raw as RawCourse);
        const rawSessions: RawSession[] = Array.isArray(detailPayload.sessions)
          ? detailPayload.sessions
          : [];

        const normalizedInstructorId =
          rawCourse.user_id ||
          rawCourse.userId ||
          rawCourse.authorId ||
          rawCourse.instructorId ||
          rawCourse.createdBy ||
          rawCourse.user?._id ||
          rawCourse.user?.id ||
          rawCourse.user?.userId ||
          rawSessions.find((session) => session.user_id || session.userId)
            ?.user_id ||
          rawSessions.find((session) => session.user_id || session.userId)
            ?.userId ||
          "";

        const mappedCourse: CourseDetailResponse = {
          id: rawCourse._id || rawCourse.id || "",
          name: rawCourse.name || "",
          userId: normalizedInstructorId,
          categoryId: rawCourse.category_id || rawCourse.categoryId || "",
          content: rawCourse.content || "",
          status: rawCourse.status || CourseStatus.PUBLISHED,
          targetAudience:
            rawCourse.targetAudience || CourseTargetAudience.GENERAL_PUBLIC,
          imageUrls:
            Array.isArray(rawCourse.imageUrls) && rawCourse.imageUrls.length > 0
              ? rawCourse.imageUrls
              : rawCourse.imageUrl
                ? [rawCourse.imageUrl]
                : [],
          videoUrls: Array.isArray(rawCourse.videoUrls)
            ? rawCourse.videoUrls
            : [],
          price: rawCourse.price || 0,
          discount: rawCourse.discount || 0,
          slug: rawCourse.slug || "",
          createdAt: rawCourse.created_at || rawCourse.createdAt || "",
          isInCart: !!rawCourse.isInCart,
          isPurchased: !!rawCourse.isPurchased,
          sessionList: rawSessions.map((session) => ({
            id: session._id || session.id || "",
            courseId: session.course_id || session.courseId || "",
            name: session.name || "",
            userId: session.user_id || session.userId || "",
            slug: session.slug || "",
            content: session.content || "",
            lessonList: Array.isArray(session.lessons)
              ? session.lessons.map((lesson) => ({
                  id: lesson._id || lesson.id || "",
                  name: lesson.name || "",
                  content: lesson.content || "",
                  lessonType: lesson.lessonType || "",
                  videoUrl: lesson.videoUrl || "",
                  imageUrl: lesson.imageUrl || "",
                  fullTime: lesson.fullTime || 0,
                  positionOrder: lesson.positionOrder || 0,
                  sessionId: lesson.session_id || lesson.sessionId || "",
                  courseId: lesson.course_id || lesson.courseId || "",
                  userAvatar: "",
                  fullName: "",
                  createdAt: lesson.created_at || lesson.createdAt || "",
                  updatedAt: lesson.updated_at || lesson.updatedAt || "",
                  userId: lesson.user_id || lesson.userId || "",
                }))
              : [],
          })),
          riskLevel: rawCourse.riskLevel || RiskLevel.NONE,
        };

        setCourse(mappedCourse);
      } catch {
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [courseId]);

  if (loading) {
    return <SectionLoader className="min-h-screen" />;
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Title level={3}>Không tìm thấy khóa học</Title>
        <Button type="primary" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>
    );
  }

  return <MyCourseDetail course={course} />;
};

export default MyCourseDetailPage;
