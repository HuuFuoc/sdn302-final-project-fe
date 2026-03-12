/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Spin, Button, Typography, message } from "antd";
import type { CourseDetailResponse } from "../../../types/course/Course.res.type";
import { CourseService } from "../../../services/course/course.service";
import { ReviewService } from "../../../services/review/review.service";
import { UserService } from "../../../services/user/user.service";
import { BaseService } from "../../../app/api/base.service";
import { API_PATH } from "../../../consts/api.path.const";
import { ROUTER_URL } from "../../../consts/router.path.const";
import type { Review } from "../../../types/review/Review.res.type";
// Import detail components
import CourseHero from "./detail/CourseHero.com.tsx";
import CourseHighlights from "./detail/CourseHighlights.com.tsx";
import CourseContent from "./detail/CourseContent.com.tsx";
import CourseDescription from "./detail/CourseDescription.com.tsx";
import CourseInstructor from "./detail/CourseInstructor.com.tsx";
import CoursePurchaseCard from "./detail/CoursePurchaseCard.com.tsx";
import CourseReviews from "./detail/CourseReviews.com.tsx";
// import MyCourseDetail from "../../customer/my-course/MyCourseDetail.com.tsx";

const { Title } = Typography;

interface UserInfo {
  fullName: string;
  profilePicUrl?: string;
}

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // State cho review
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);

  // Trạng thái kiểm tra đã mua khóa học hay chưa
  // const [checkingPurchase, setCheckingPurchase] = useState<boolean>(false);
  const [isPurchased, setIsPurchased] = useState<boolean>(false);

  // State cho user info
  const [userMap, setUserMap] = useState<Record<string, UserInfo>>({});

  // Lấy userId từ localStorage (nên lấy từ object userInfo nếu có)
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const userId = userInfo.id || localStorage.getItem("userId");

  // Lấy course
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        if (courseId) {

          const normalizedCourseId = courseId.trim();

          const res = await CourseService.getCourseById({
            id: normalizedCourseId,
            userId: userId ? userId : undefined,
      
          const detailData = res.data?.data as CourseDetailResponse | undefined;
          if (res.data?.success && detailData?.id) {
            setCourse(detailData);

          if (res.data && res.data.success && res.data.data) {
            // Dữ liệu backend có dạng { course, sessions }, dùng any để map linh hoạt
            const raw: any = res.data.data as any;
            const rawCourse: any = raw.course ?? raw;
            const rawSessions: any[] = raw.sessions ?? [];

            const mappedCourse: CourseDetailResponse = {
              id: rawCourse._id || rawCourse.id,
              name: rawCourse.name,
              userId: rawCourse.user_id || rawCourse.userId,
              categoryId: rawCourse.category_id || rawCourse.categoryId,
              content: rawCourse.content,
              status: rawCourse.status,
              targetAudience: rawCourse.targetAudience,
              imageUrls:
                rawCourse.imageUrls && rawCourse.imageUrls.length > 0
                  ? rawCourse.imageUrls
                  : rawCourse.imageUrl
                  ? [rawCourse.imageUrl]
                  : [],
              videoUrls: rawCourse.videoUrls || [],
              price: rawCourse.price,
              discount: rawCourse.discount || 0,
              slug: rawCourse.slug,
              createdAt: rawCourse.created_at || rawCourse.createdAt,
              isInCart: !!rawCourse.isInCart,
              isPurchased: !!rawCourse.isPurchased,
              sessionList:
                rawSessions.map((session) => {
                  const lessons: any[] = session.lessons || [];
                  return {
                    id: session._id || session.id,
                    courseId: session.course_id || session.courseId,
                    name: session.name,
                    userId: session.user_id || session.userId,
                    slug: session.slug,
                    content: session.content,
                    lessonList: lessons.map((lesson) => ({
                      id: lesson._id || lesson.id,
                      name: lesson.name,
                      content: lesson.content,
                      lessonType: lesson.lessonType,
                      videoUrl: lesson.videoUrl,
                      imageUrl: lesson.imageUrl,
                      fullTime: lesson.fullTime,
                      positionOrder: lesson.positionOrder,
                      sessionId: lesson.session_id || lesson.sessionId,
                      courseId: lesson.course_id || lesson.courseId,
                      userAvatar: "",
                      fullName: "",
                      createdAt: lesson.created_at || lesson.createdAt,
                      updatedAt: lesson.updated_at || lesson.updatedAt,
                      userId: lesson.user_id || lesson.userId,
                    })),
                  };
                }) || [],
              riskLevel: rawCourse.riskLevel,
            };

            setCourse(mappedCourse);

          } else {
            // Fallback when detail endpoint returns inconsistent shape
            const allRes = await CourseService.getAllCourses({
              pageNumber: 1,
              pageSize: 500,
              userId: userId ? userId : undefined,
            } as any);
            const list = Array.isArray(allRes.data?.data)
              ? allRes.data.data
              : [];
            const matched = list.find((item: any) => {
              const id = String(item?.id ?? item?._id ?? "").trim();
              const slug = String(item?.slug ?? "").trim();
              return id === normalizedCourseId || slug === normalizedCourseId;
            });
            setCourse((matched as CourseDetailResponse) ?? null);
          }
        }
      } catch (err) {
        console.error("Error fetching course detail:", err);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId, userId]);

  // Kiểm tra user đã mua khóa học hay chưa dựa vào order logs
  const checkCoursePurchased = useCallback(async (currentCourseId: string) => {
    try {
      const ordersRes = await BaseService.get<{
        data?: { _id?: string; orderId?: string; status?: string }[];
      }>({
        url: API_PATH.ORDER.GET_ORDER_BY_USER_ID,
        isLoading: false,
      });

      const orders = ordersRes.data?.data || [];

      const paidOrders = orders.filter(
        (o) => (o.status || "").toLowerCase() === "paid",
      );

      if (paidOrders.length === 0) {
        setIsPurchased(false);
        return;
      }

      const detailResponses = await Promise.all(
        paidOrders.map((order) =>
          BaseService.get<{
            data?: { logs?: { course_id?: string }[] };
          }>({
            url: API_PATH.ORDER.GET_ORDER_BY_ID(
              String(order._id || order.orderId),
            ),
            isLoading: false,
          }),
        ),
      );

      const allLogs =
        detailResponses.flatMap((res) => res.data?.data?.logs || []) || [];

      const hasPurchased = allLogs.some(
        (log) => log.course_id === currentCourseId,
      );

      setIsPurchased(hasPurchased);
    } catch (error) {
      console.error("Error checking course purchase status:", error);
      setIsPurchased(false);
    }
  }, []);

  // Gọi check mua khi đã có courseId
  useEffect(() => {
    if (!courseId) return;

    // Nếu chưa đăng nhập (không có token hoặc userInfo) thì không call API order
    const token = localStorage.getItem("token");
    const userInfoStr = localStorage.getItem("userInfo");
    if (!token || !userInfoStr) {
      setIsPurchased(false);
      return;
    }

    checkCoursePurchased(courseId as string);
  }, [courseId, checkCoursePurchased]);

  // Lấy review theo courseId
  const fetchReviews = async () => {
    const reviewCourseId = course?.id || courseId?.trim();
    if (!reviewCourseId) return;
    setLoadingReviews(true);
    try {
      const res = await ReviewService.getReviewByCourseId({
        courseId: reviewCourseId,
      });
      console.log("Reviews response:", res);

      const dataObj = res.data?.data as {
        reviews?: Review[];
        data?: Review[];
        averageRating?: number;
        totalReviews?: number;
      };

      let reviewsData: Review[] = [];
      if (dataObj) {
        reviewsData = Array.isArray(dataObj.reviews)
          ? dataObj.reviews
          : Array.isArray(dataObj.data)
            ? dataObj.data
            : [];

        setAverageRating(dataObj.averageRating || 0);
        setTotalReviews(dataObj.totalReviews || reviewsData.length || 0);
      }

      console.log("Processed reviews data:", reviewsData);
      setReviews(reviewsData);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      message.error("Không thể tải đánh giá!");
      setReviews([]);
      setTotalReviews(0);
      setAverageRating(0);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (course?.id || courseId) {
      fetchReviews();
    }
    // eslint-disable-next-line
  }, [course?.id, courseId]);

  // Lấy thông tin user cho từng review
  useEffect(() => {
    const fetchUsers = async () => {
      // Lấy danh sách userId duy nhất từ reviews
      const ids = Array.from(new Set(reviews.map((r) => r.userId)));
      // Chỉ lấy những userId chưa có trong userMap
      const missingIds = ids.filter((id) => !(id in userMap));
      if (missingIds.length === 0) return;

      const newUserMap: Record<string, UserInfo> = { ...userMap };
      await Promise.all(
        missingIds.map(async (id) => {
          try {
            const res = await UserService.getUserById({ userId: id });
            if (res.data?.success && res.data?.data) {
              newUserMap[id] = {
                fullName: res.data.data.fullName,
                profilePicUrl: res.data.data.profilePicUrl,
              };
            }
          } catch (error) {
            console.error("Error fetching user info for review:", error);
          }
        }),
      );
      setUserMap(newUserMap);
    };
    if (Array.isArray(reviews) && reviews.length > 0) fetchUsers();
    // eslint-disable-next-line
  }, [reviews]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // Error state
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

  const finalIsPurchased = isPurchased || course.isPurchased;

  // Highlights từ data thật
  const courseHighlights = [
    "Truy cập trên thiết bị di động và TV",
    "Quyền truy cập đầy đủ suốt đời",
    "Giấy chứng nhận hoàn thành",
  ];

  // Content từ sessionList
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
    <div className="min-h-screen ">
      {/* Hero Section */}
      <CourseHero course={course} averageRating={averageRating} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Row gutter={[32, 32]}>
          {/* Left Content */}
          <Col xs={24} lg={16}>
            <div className="space-y-8">
              {/* What you'll learn */}
              <CourseHighlights highlights={courseHighlights} />

              {/* Course Content */}
              <CourseContent
                content={courseContent}
                isPurchased={finalIsPurchased}
                onLessonClick={(lessonId) => {
                  // Điều hướng sang trang học lesson theo lessonId
                  navigate(
                    ROUTER_URL.CUSTOMER.LESSON_DETAIL.replace(
                      ":lessonId",
                      lessonId,
                    ),
                  );
                }}
              />

              {/* Description */}
              <CourseDescription course={course} />

              {/* Instructor Section */}
              <CourseInstructor instructorId={course.userId} />

              {/* Reviews Section */}
              <CourseReviews
                reviews={reviews}
                loading={loadingReviews}
                userMap={userMap}
                totalReviews={totalReviews}
                averageRating={averageRating}
              />

              {/* More Courses Section */}
            </div>
          </Col>

          {/* Right Sidebar - Sticky Purchase Card */}
          <Col xs={0} lg={8}>
            <CoursePurchaseCard course={course} highlights={courseHighlights} />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CourseDetail;
