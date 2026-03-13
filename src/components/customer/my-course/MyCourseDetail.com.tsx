import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Button, Typography, message } from "antd";
import type { CourseDetailResponse } from "../../../types/course/Course.res.type";
import { ReviewService } from "../../../services/review/review.service";
import { UserService } from "../../../services/user/user.service";
import type { Review } from "../../../types/review/Review.res.type";
import CourseHero from "./detail/CourseHero.com";
import CourseHighlights from "./detail/CourseHighlights.com";
import CourseContent from "./detail/CourseContent.com";
import CourseDescription from "./detail/CourseDescription.com";
import CourseInstructor from "./detail/CourseInstructor.com";
import CourseReviews from "./detail/CourseReviews.com";

const { Title } = Typography;

interface MyCourseDetailProps {
  course: CourseDetailResponse;
}

const MyCourseDetail: React.FC<MyCourseDetailProps> = ({ course }) => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const activeCourseId = course?.id || courseId || "";
  const instructorId =
    course?.userId ||
    course?.sessionList?.find((session) => session.userId)?.userId ||
    "";

  // State cho review
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [authorName, setAuthorName] = useState<string>("");
  const [authorLoading, setAuthorLoading] = useState(false);

  // Lấy userId từ localStorage userInfo
  let userId = "";
  const userInfoStr = localStorage.getItem("userInfo");
  if (userInfoStr) {
    try {
      const userInfo = JSON.parse(userInfoStr);
      userId = userInfo.id || "";
    } catch {
      userId = "";
    }
  }

  // Lấy review theo courseId
  const fetchReviews = async () => {
    if (!activeCourseId || activeCourseId === "undefined") return;
    setLoadingReviews(true);
    try {
      const res = await ReviewService.getReviewByCourseId({
        courseId: activeCourseId,
      });
      const raw = res.data?.data as unknown;

      const rawReviews = Array.isArray(raw)
        ? raw
        : Array.isArray((raw as { reviews?: unknown[] })?.reviews)
          ? ((raw as { reviews?: unknown[] }).reviews ?? [])
          : Array.isArray((raw as { data?: unknown[] })?.data)
            ? ((raw as { data?: unknown[] }).data ?? [])
            : [];

      const normalizedReviews: Review[] = rawReviews.map((item) => {
        const review = item as {
          id?: string;
          _id?: string;
          courseId?: string;
          course_id?: string;
          userId?: string;
          user_id?: string;
          customerId?: string;
          customer_id?: string;
          rating?: number;
          rate?: number;
          comment?: string;
          content?: string;
          createdAt?: string;
          created_at?: string;
        };

        return {
          id: review.id ?? review._id ?? "",
          courseId: review.courseId ?? review.course_id ?? activeCourseId,
          userId:
            review.userId ??
            review.user_id ??
            review.customerId ??
            review.customer_id ??
            "",
          rating: review.rating ?? review.rate ?? 0,
          comment: review.comment ?? review.content ?? "",
          createdAt: review.createdAt ?? review.created_at ?? "",
        };
      });

      const total = normalizedReviews.length;
      const sum = normalizedReviews.reduce((acc, item) => acc + item.rating, 0);
      setReviews(normalizedReviews);
      setTotalReviews(total);
      setAverageRating(total > 0 ? sum / total : 0);
    } catch {
      setReviews([]);
      setTotalReviews(0);
      setAverageRating(0);
      message.error("Không thể tải đánh giá!");
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (activeCourseId && activeCourseId !== "undefined") {
      fetchReviews();
    }
  }, [activeCourseId]);

  useEffect(() => {
    const fetchAuthorName = async () => {
      if (!instructorId) {
        setAuthorName("");
        return;
      }

      setAuthorLoading(true);
      try {
        const res = await UserService.getUserById({ userId: instructorId });
        const rawUser = res.data?.data as
          | { name?: string; fullName?: string }
          | undefined;
        setAuthorName(rawUser?.name || rawUser?.fullName || "Unknown author");
      } catch {
        setAuthorName("Unknown author");
      } finally {
        setAuthorLoading(false);
      }
    };

    if (instructorId) {
      fetchAuthorName();
    }
  }, [instructorId]);

  const handleReviewChanged = () => {
    fetchReviews();
  };

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

  const courseHighlights = [
    "Truy cập trên thiết bị di động và TV",
    "Quyền truy cập đầy đủ suốt đời",
    "Giấy chứng nhận hoàn thành",
  ];

  const courseContent =
    course.sessionList?.map((session) => ({
      title: session.name,
      duration: "",
      lessons: session.lessonList?.length || 0,
      expanded: false,
      lectures:
        session.lessonList?.map((lesson) => ({
          id: lesson.id,
          title: lesson.name,
          duration: lesson.fullTime ? `${lesson.fullTime} phút` : "",
          preview: false,
          completed: false,
          imageUrl: lesson.imageUrl || undefined,
          videoUrl: lesson.videoUrl || undefined,
          lessonType: lesson.lessonType || "", // THÊM DÒNG NÀY
        })) || [],
    })) || [];

  return (
    <div className="min-h-screen bg-[#f7f9fa]">
      {/* Hero Section */}
      <CourseHero
        course={course}
        averageRating={averageRating}
        authorName={authorName}
        authorLoading={authorLoading}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Row gutter={[32, 32]}>
          {/* Left Content */}
          <Col xs={24} lg={16}>
            <div className="space-y-8">
              <CourseHighlights highlights={courseHighlights} />
              <CourseContent content={courseContent} />
              <CourseDescription course={course} />
              <CourseInstructor instructorId={instructorId} />

              {/* Reviews Section - cho phép tạo, xóa */}
              <CourseReviews
                courseId={activeCourseId}
                userId={userId}
                reviews={reviews}
                loading={loadingReviews}
                totalReviews={totalReviews}
                averageRating={averageRating}
                onReviewChanged={handleReviewChanged}
              />
            </div>
          </Col>

          {/* Right Sidebar - Custom đẹp hơn */}
          <Col xs={0} lg={8}>
            <div
              className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center"
              style={{
                minHeight: 260,
                border: "1px solid #e6eaf0",
                boxShadow: "0 4px 24px 0 rgba(34, 41, 47, 0.08)",
              }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
                alt="success"
                style={{ width: 64, marginBottom: 16 }}
              />
              <Title level={4} style={{ color: "#20558A", marginBottom: 8 }}>
                Chúc bạn học tốt!
              </Title>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MyCourseDetail;
