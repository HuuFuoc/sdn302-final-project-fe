import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Typography, Button, Divider, Collapse, Alert } from "antd";
import { LessonService } from "../../../services/lesson/lesson.service";
import { SessionService } from "../../../services/session/session.service";
import { CourseService } from "../../../services/course/course.service";
import type { Lesson } from "../../../types/lesson/Lesson.res.type";
import type { Session } from "../../../types/session/Session.res.type";
import {
  PlayCircleOutlined,
  FileTextOutlined,
  PictureOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";

import LessonVideo from "./LessonVideo.com";
import { ROUTER_URL } from "../../../consts/router.path.const";

const { Title } = Typography;
const { Panel } = Collapse;

type LessonAccessPayload = {
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
  preview?: boolean;
  isPreview?: boolean;
  isFree?: boolean;
};

type SessionLessonItem = {
  _id?: string;
  id?: string;
  name?: string;
  lessonType?: string;
};

type SessionWithLessons = Session & {
  lessons: SessionLessonItem[];
};

const LessonDetail: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [sidebarLoading, setSidebarLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  // Thêm state để lưu lessons
  const [sessionsWithLessons, setSessionsWithLessons] = useState<
    SessionWithLessons[]
  >([]);

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      try {
        if (lessonId) {
          const res = await LessonService.getLessonById({ lessonId });
          if (res.data?.success && res.data?.data) {
            // API trả về field dạng _id, course_id, session_id → map sang Lesson
            const raw = res.data.data as LessonAccessPayload;
            const courseId = raw.course_id || raw.courseId || "";
            const isPreviewLesson = Boolean(
              raw.preview ?? raw.isPreview ?? raw.isFree ?? false,
            );

            let hasAccess = isPreviewLesson;
            if (!hasAccess && courseId) {
              const myCoursesRes = await CourseService.getMyCourses();
              const myCourses = Array.isArray(myCoursesRes.data?.data)
                ? myCoursesRes.data.data
                : [];

              hasAccess = myCourses.some(
                (course: { id?: string; _id?: string; courseId?: string }) => {
                  const id = course.id || course._id || course.courseId || "";
                  return id === courseId;
                },
              );
            }

            if (!hasAccess) {
              setAccessDenied(true);
              setLesson(null);
              return;
            }

            const mappedLesson: Lesson = {
              id: raw._id || raw.id || "",
              name: raw.name || "",
              content: raw.content || "",
              lessonType: raw.lessonType || "",
              videoUrl: raw.videoUrl || "",
              imageUrl: raw.imageUrl || "",
              fullTime: raw.fullTime || 0,
              positionOrder: raw.positionOrder || 0,
              sessionId: raw.session_id || raw.sessionId || "",
              courseId: raw.course_id || raw.courseId || "",
              userAvatar: "",
              fullName: "",
              createdAt: raw.created_at || raw.createdAt || "",
              updatedAt: raw.updated_at || raw.updatedAt || "",
              userId: raw.user_id || raw.userId || "",
            };
            setAccessDenied(false);
            setBackendError(null);
            setLesson(mappedLesson);
          } else {
            setLesson(null);
          }
        }
      } catch (err: unknown) {
        const error = err as { status?: number; response?: { status?: number }; message?: string };
        const status = error?.status || error?.response?.status;
        if (status === 401 || status === 403) {
          setAccessDenied(true);
        }
        setBackendError(
          error?.message || "Khong the xac thuc quyen truy cap bai hoc tu may chu.",
        );
        setLesson(null);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  useEffect(() => {
    const fetchSession = async () => {
      if (!lesson?.sessionId) return;
      try {
        const res = await SessionService.getSessionById({
          id: lesson.sessionId,
        });
        if (res.data?.success && res.data?.data) {
          setSession(res.data.data as Session);
        } else {
          setSession(null);
        }
      } catch {
        setSession(null);
      }
    };
    if (lesson?.sessionId) fetchSession();
  }, [lesson?.sessionId]);

  // Fetch course và tất cả sessions + lessons
  useEffect(() => {
    const fetchCourseAndSessions = async () => {
      if (!lesson?.courseId) return;
      setSidebarLoading(true);
      try {
        // Fetch all sessions của course
        const sessionsRes = await SessionService.getSessionByCourseId({
          CourseId: lesson.courseId,
        });

        if (
          sessionsRes.data?.success &&
          Array.isArray(sessionsRes.data?.data)
        ) {
          // API trả về session với field _id, course_id,... → map sang Session
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rawSessions: any[] = sessionsRes.data.data;

          const normalizedSessions: Session[] = rawSessions.map((s) => ({
            id: s._id || s.id,
            courseId: s.course_id || s.courseId,
            name: s.name,
            userId: s.user_id || s.userId,
            slug: s.slug,
            content: s.content,
            positionOrder: s.positionOrder,
          }));

          // Fetch lessons cho từng session bằng sessionId chuẩn
          const sessionsWithLessonsData = await Promise.all(
            normalizedSessions.map(async (sessionItem) => {
              try {
                const lessonsRes = await LessonService.getLessonBySessionId({
                  SessionId: sessionItem.id,
                });

                return {
                  ...sessionItem,
                  lessons:
                    lessonsRes.data?.success &&
                    Array.isArray(lessonsRes.data?.data)
                      ? lessonsRes.data.data
                      : [],
                };
              } catch {
                return {
                  ...sessionItem,
                  lessons: [],
                };
              }
            }),
          );

          setSessionsWithLessons(sessionsWithLessonsData);
        } else {
          // KHÔNG CẦN SET allSessions VÌ KHÔNG DÙNG
          // setAllSessions([]);
          setSessionsWithLessons([]);
        }
      } catch {
        // KHÔNG CẦN SET course VÀ allSessions VÌ KHÔNG DÙNG
        // setCourse(null);
        // setAllSessions([]);
        setSessionsWithLessons([]);
      } finally {
        setSidebarLoading(false);
      }
    };
    if (lesson?.courseId) fetchCourseAndSessions();
  }, [lesson?.courseId]);

  // Thêm hàm chọn icon theo lessonType
  const getLessonIcon = (lessonType?: string) => {
    switch ((lessonType || "").toLowerCase()) {
      case "video":
        return <PlayCircleOutlined className="text-blue-500 text-sm" />;
      case "text":
        return <FileTextOutlined className="text-green-500 text-sm" />;
      case "image":
        return <PictureOutlined className="text-orange-500 text-sm" />;
      default:
        return <FileTextOutlined className="text-gray-400 text-sm" />;
    }
  };

  // Render sidebar - SỬA PHẦN XỬ LÝ LESSONS
  const renderSidebar = () => (
    <div
      style={{
        width: 350,
        borderRadius: 12,
        padding: 20,
        marginRight: 24,
        border: "1px solid #e6eaf0",
        height: "fit-content",
        position: "sticky",
        top: 20,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 18,
          marginBottom: 20,
          color: "#20558A",
        }}
      >
        Course Content
      </div>
      {sidebarLoading ? (
        <Spin />
      ) : (
        <Collapse
          ghost
          defaultActiveKey={[session?.id || ""]}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined
              rotate={isActive ? 90 : 0}
              className="text-gray-500"
            />
          )}
          expandIconPosition="end"
        >
          {sessionsWithLessons.map((sessionItem) => (
            <Panel
              key={sessionItem.id}
              header={
                <div className="flex items-center justify-between w-full pr-4">
                  <span style={{ fontWeight: 600, color: "#333" }}>
                    {sessionItem.name}
                  </span>
                  <span className="text-gray-600 text-sm">
                    {sessionItem.lessons?.length || 0} bài
                  </span>
                </div>
              }
              className="border-b border-gray-200 last:border-b-0"
              style={{
                marginBottom: 8,
                border: "1px solid #e6eaf0",
                borderRadius: 8,
                background: "#fff",
              }}
            >
              {sessionItem.lessons && sessionItem.lessons.length > 0 ? (
                <div className="space-y-1 pb-4">
                  {sessionItem.lessons.map((lessonItem: SessionLessonItem) => {
                    const targetId = lessonItem.id || lessonItem._id;
                    const isActive = targetId === lessonId;

                    return (
                      <div
                        key={targetId}
                        className="flex items-center justify-between py-2 px-4 hover:bg-gray-50 rounded transition-colors cursor-pointer"
                        onClick={() => {
                          if (!targetId || targetId === lessonId) return;
                          navigate(
                            `/bai-hoc/${targetId}`,
                          );
                        }}
                        style={{
                          backgroundColor: isActive ? "#e6f7ff" : "transparent",
                          borderLeft: isActive
                            ? "3px solid #20558A"
                            : "3px solid transparent",
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? "#20558A" : "#666",
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          {getLessonIcon(lessonItem.lessonType)}
                          <span className="text-gray-700 text-sm">
                            {lessonItem.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-gray-600 text-sm py-4 px-4">
                  Phần này chưa có bài giảng
                </div>
              )}
            </Panel>
          ))}
        </Collapse>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!lesson) {
    if (accessDenied) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="w-full max-w-xl">
            <Alert
              type="warning"
              showIcon
              message="Ban khong co quyen truy cap bai hoc nay"
              description={
                backendError ||
                "Hay mua khoa hoc hoac dung bai hoc hoc thu hop le de tiep tuc."
              }
            />
          </div>
          <div className="mt-6 flex gap-3">
            <Button onClick={() => navigate(ROUTER_URL.CLIENT.COURSE)}>
              Xem khoa hoc
            </Button>
            <Button type="primary" onClick={() => navigate(-1)}>
              Quay lai
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Title level={3}>Không tìm thấy bài học</Title>
        <Button type="primary" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1400,
        margin: "32px auto",
        padding: "0 16px",
        display: "flex",
        gap: 0,
      }}
    >
      {/* Sidebar bên trái */}
      {renderSidebar()}

      {/* Nội dung chính bên phải */}
      <div
        style={{
          flex: 1,
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #e6eaf0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        {/* Title Section */}
        <div style={{ padding: "20px 40px 40px 40px" }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: "#333",
              margin: 0,
              marginBottom: 8,
            }}
          >
            {lesson.name}
          </h1>
        </div>

        <Divider style={{ margin: 0 }} />

        {/* Content Section */}
        <div style={{ padding: "40px" }}>
          {/* Lesson Image */}
          {lesson.imageUrl && (
            <div style={{ marginBottom: 32, textAlign: "left" }}>
              <img
                src={lesson.imageUrl}
                alt={lesson.name}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: 8,
                }}
              />
            </div>
          )}

          {/* Main Content */}
          {lesson.content && (
            <div
              style={{
                lineHeight: 1.8,
                color: "#444",
                fontSize: "16px",
                marginBottom: 40,
              }}
              dangerouslySetInnerHTML={{
                __html: lesson.content,
              }}
            />
          )}

          {/* Video Section */}
          {lesson.videoUrl && (
            <div
              style={{
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <LessonVideo
                videoUrl={lesson.videoUrl}
                imageUrl={lesson.imageUrl}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;
