import React, { useEffect, useState } from "react";
import {
  Modal,
  Typography,
  Image,
  Tag,
  message,
  Card,
  Row,
  Col,
  Statistic,
} from "antd";
import { InlineLoader } from "../../../common/loaders";
import {
  BookOutlined,
  PlayCircleOutlined,
  PictureOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { LessonService } from "../../../../services/lesson/lesson.service";
import type { Lesson } from "../../../../types/lesson/Lesson.res.type";
import type { Course } from "../../../../types/course/Course.res.type";
import type { Session } from "../../../../types/session/Session.res.type";

const { Title, Text } = Typography;

/** Chuẩn hóa API response - backend có thể trả về { lesson } hoặc snake_case (_id, lesson_type, course_id, ...) */
function normalizeLesson(raw: unknown): Lesson | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  const o = (obj.lesson && typeof obj.lesson === "object" ? obj.lesson : obj) as Record<string, unknown>;
  if (!o || typeof o !== "object") return null;
  return {
    id: String(o.id ?? o._id ?? ""),
    name: String(o.name ?? ""),
    content: String(o.content ?? ""),
    lessonType: String(o.lessonType ?? o.lesson_type ?? ""),
    videoUrl: String(o.videoUrl ?? o.video_url ?? ""),
    imageUrl: String(o.imageUrl ?? o.image_url ?? ""),
    fullTime: Number(o.fullTime ?? o.full_time ?? 0),
    positionOrder: Number(o.positionOrder ?? o.position_order ?? 0),
    sessionId: String(o.sessionId ?? o.session_id ?? ""),
    courseId: String(o.courseId ?? o.course_id ?? ""),
    userAvatar: String(o.userAvatar ?? o.user_avatar ?? ""),
    fullName: String(o.fullName ?? o.full_name ?? ""),
    createdAt: String(o.createdAt ?? o.created_at ?? ""),
    updatedAt: String(o.updatedAt ?? o.updated_at ?? ""),
    userId: String(o.userId ?? o.user_id ?? ""),
  };
}

interface ViewLessonProps {
  lessonId: string | null;
  open: boolean;
  onClose: () => void;
  courses: Course[];
  sessions: Session[];
}

const ViewLesson: React.FC<ViewLessonProps> = ({
  lessonId,
  open,
  onClose,
  courses,
  sessions,
}) => {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lessonId && open) {
      fetchLesson(lessonId);
    }
  }, [lessonId, open]);

  const fetchLesson = async (id: string) => {
    setLoading(true);
    try {
      const res = await LessonService.getLessonById({ lessonId: id });
      const raw = res.data?.data as unknown;
      const normalized = raw ? normalizeLesson(raw) : null;
      setLesson(normalized);
    } catch {
      message.error("Không thể tải thông tin bài học.");
      setLesson(null);
    } finally {
      setLoading(false);
    }
  };

  const getCourseName = () => {
    if (!lesson || !lesson.courseId) return "Không xác định";
    const found = courses.find(
      (c) => c.id === lesson.courseId || (c as { _id?: string })._id === lesson.courseId
    );
    return found?.name || "Không xác định";
  };

  const getSessionName = () => {
    if (!lesson || !lesson.sessionId) return "Không xác định";
    const found = sessions.find(
      (s) => s.id === lesson.sessionId || (s as { _id?: string })._id === lesson.sessionId
    );
    return found?.name || "Không xác định";
  };

  const getLessonTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "video":
        return <PlayCircleOutlined className="text-red-500" />;
      case "image":
        return <PictureOutlined className="text-green-500" />;
      default:
        return <FileTextOutlined className="text-blue-500" />;
    }
  };

  const getLessonTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "video":
        return "red";
      case "image":
        return "green";
      default:
        return "blue";
    }
  };

  const renderLessonContent = () => {
    if (!lesson) return null;
    const type = (lesson.lessonType || "").toLowerCase();
    switch (type) {
      case "video":
        if (!lesson.videoUrl && !lesson.imageUrl) {
          return (
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <PlayCircleOutlined className="text-4xl text-gray-400 mb-2" />
              <Text type="secondary" className="text-lg">
                Không có video hoặc hình ảnh
              </Text>
            </div>
          );
        }

        return (
          <div className="space-y-4">
            {lesson.videoUrl && (
              <div className="bg-black rounded-lg overflow-hidden">
                <video
                  controls
                  width="100%"
                  src={lesson.videoUrl}
                  className="rounded-lg"
                />
              </div>
            )}
            {lesson.imageUrl && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <Image
                  src={lesson.imageUrl}
                  width="100%"
                  className="rounded-lg shadow-sm"
                  preview={{
                    mask: (
                      <div className="flex items-center gap-2">
                        <EyeOutlined /> Xem ảnh
                      </div>
                    ),
                  }}
                />
              </div>
            )}
          </div>
        );
      case "image":
        return lesson.imageUrl ? (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <Image
              src={lesson.imageUrl}
              width="100%"
              className="rounded-lg shadow-sm"
              preview={{
                mask: <div className="flex items-center gap-2"><EyeOutlined /> Xem ảnh</div>
              }}
            />
          </div>
        ) : (
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <PictureOutlined className="text-4xl text-gray-400 mb-2" />
            <Text type="secondary" className="text-lg">Không có hình ảnh</Text>
          </div>
        );
      default:
        return lesson.content ? (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: lesson.content
              }}
            />
          </div>
        ) : (
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <FileTextOutlined className="text-4xl text-gray-400 mb-2" />
            <Text type="secondary" className="text-lg">Không có nội dung</Text>
          </div>
        );
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={900}
      className="lesson-detail-modal"
      styles={{
        body: {
          padding: '24px 32px'
        },
        content: {
          borderRadius: '16px',
          background: 'white'
        },
        header: {
          background: 'white',
          borderBottom: '1px solid #f0f0f0',
          padding: '24px 32px 0'
        }
      }}
      title={
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <BookOutlined className="text-white text-xl" />
          </div>
          <div>
            <Title level={3} className="!mb-1 text-gray-800">Chi tiết bài học</Title>
            <Text className="text-gray-500">Xem thông tin chi tiết bài học</Text>
          </div>
        </div>
      }
    >
      {loading ? (
        <InlineLoader />
      ) : lesson ? (
        <div className="space-y-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center gap-4">
              <div>
                <Title level={2} className="!mb-1 text-gray-800">{lesson.name}</Title>
                <div className="flex items-center gap-3">
                  <Tag color={getLessonTypeColor(lesson.lessonType)} className="text-sm px-3 py-1 rounded-full">
                    {getLessonTypeIcon(lesson.lessonType)}
                    {(lesson.lessonType || "").toUpperCase()}
                  </Tag>
                  <Text className="text-gray-500">#{lesson.positionOrder}</Text>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <Row gutter={16}>
            <Col span={8}>
              <Card className="text-center border-0 shadow-sm hover:shadow-md transition-all duration-200 h-24 flex items-center justify-center">
                <Statistic
                  title="Khóa học"
                  value={getCourseName()}
                  valueStyle={{ color: '#10b981', fontSize: '16px' }}
                  prefix={<BookOutlined />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card className="text-center border-0 shadow-sm hover:shadow-md transition-all duration-200 h-24 flex items-center justify-center">
                <Statistic
                  title="Phiên học"
                  value={getSessionName()}
                  valueStyle={{ color: '#f59e0b', fontSize: '16px' }}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card className="text-center border-0 shadow-sm hover:shadow-md transition-all duration-200 h-24 flex items-center justify-center">
                <Statistic
                  title="Thứ tự"
                  value={lesson.positionOrder || 0}
                  valueStyle={{ color: '#8b5cf6', fontSize: '16px' }}
                  prefix={<TrophyOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* Content Section */}
          <Card
            title={
              <div className="flex items-center gap-2">
                {getLessonTypeIcon(lesson.lessonType)}
                <span className="font-semibold text-gray-700">Nội dung bài học</span>
              </div>
            }
            className="border-0 shadow-sm"
          >
            {renderLessonContent()}
          </Card>
        </div>
      ) : (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <Title level={4} className="text-gray-600 mb-2">Không tìm thấy bài học</Title>
            <Text className="text-gray-500">Vui lòng kiểm tra lại thông tin bài học</Text>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ViewLesson;
