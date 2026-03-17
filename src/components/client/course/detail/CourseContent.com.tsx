import React from "react";
import { Typography, Card, Button, Collapse } from "antd";
import {
  DownOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  PictureOutlined,
  LockOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface Lecture {
  id?: string;
  title: string;
  duration: string;
  preview: boolean;
  completed: boolean;
  lessonType?: string; // Thêm lessonType
  imageUrl?: string;
}

interface CourseSection {
  title: string;
  duration: string;
  lessons: number;
  expanded: boolean;
  lectures: Lecture[];
}

interface CourseContentProps {
  content: CourseSection[];
  isPurchased: boolean;
  onLessonClick?: (lessonId: string) => void;
}

const CourseContent: React.FC<CourseContentProps> = ({
  content,
  isPurchased,
  onLessonClick,
}) => {
  const totalLessons = content.reduce(
    (acc, section) => acc + section.lessons,
    0
  );

  // Hàm trả về icon phù hợp với LessonType
  const getLessonIcon = (lessonType?: string) => {
    switch ((lessonType || "").toLowerCase()) {
      case "video":
        return <PlayCircleOutlined className="text-blue-500 text-base" />;
      case "text":
        return <FileTextOutlined className="text-green-500 text-base" />;
      case "image":
        return <PictureOutlined className="text-orange-500 text-base" />;
      default:
        return <FileTextOutlined className="text-gray-400 text-base" />;
    }
  };

  console.log("DEBUG lectures:", content);

  return (
    <Card className="border-0 shadow-sm" style={{ borderRadius: 12 }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <Title level={3} className="text-gray-900 mb-0">
          Nội dung khóa học
        </Title>
        <div className="text-gray-600 text-sm">
          <Text className="mr-4">
            • {content.length} phần • {totalLessons} bài giảng
          </Text>
        </div>
      </div>

      <Collapse
        ghost
        expandIconPosition="end"
        expandIcon={({ isActive }) => (
          <DownOutlined rotate={isActive ? 180 : 0} className="text-gray-500" />
        )}
      >
        {content.map((section, index) => (
          <Panel
            key={index}
            header={
              <div className="flex items-center justify-between w-full pr-4">
                <Text className="font-semibold text-gray-900">
                  {section.title}
                </Text>
                <Text className="text-gray-600 text-sm">
                  {section.lessons} bài • {section.duration}
                </Text>
              </div>
            }
            className="border-b border-gray-200 last:border-b-0"
          >
            {section.lectures && section.lectures.length > 0 ? (
              <div className="space-y-1 pb-4">
                {section.lectures.map((lecture, lectureIndex) => {
                  const isPreviewLesson = Boolean(lecture.preview);
                  const canAccess = isPurchased || isPreviewLesson;
                  const disabled = !canAccess;
                  const canClick = canAccess && !!onLessonClick && !!lecture.id;

                  return (
                    <div
                      key={lecture.id || lectureIndex}
                      className={`flex items-center justify-between py-2 px-4 rounded transition-colors ${
                        disabled
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:bg-gray-50 cursor-pointer"
                      }`}
                      onClick={() => {
                        if (!canClick) return;
                        if (onLessonClick && lecture.id) {
                          onLessonClick(lecture.id);
                        }
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        {/* Hiển thị icon theo lessonType */}
                        {getLessonIcon(lecture.lessonType)}
                        <Text className="text-gray-700 text-sm">
                          {lecture.title}
                        </Text>
                        {isPreviewLesson && (
                          <Button
                            type="link"
                            size="small"
                            className="text-purple-600 p-0 h-auto text-xs"
                          >
                            Học thử
                          </Button>
                        )}
                        {!canAccess && (
                          <span className="flex items-center text-xs text-gray-500 ml-2">
                            <LockOutlined className="mr-1" />
                            Mua khóa học để học bài này
                          </span>
                        )}
                      </div>
                      <Text className="text-gray-600 text-sm">
                        {lecture.duration}
                      </Text>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-gray-600 text-sm py-4 px-4">
                {section.lessons} bài giảng sẽ được cập nhật sớm
              </div>
            )}
          </Panel>
        ))}
      </Collapse>
    </Card>
  );
};

export default CourseContent;
