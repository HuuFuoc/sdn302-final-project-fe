import React from "react";
import { Typography, Tag } from "antd";
import {
  ClockCircleOutlined,
  UserOutlined,
  CheckCircleTwoTone,
} from "@ant-design/icons";
import type { Course } from "../../../../types/course/Course.res.type";
import { formatCurrency } from "../../../../utils/helper";

const { Paragraph } = Typography;

interface CourseCardContentProps {
  course: Course;
  isPurchased?: boolean;
}

const CourseCardContent: React.FC<CourseCardContentProps> = ({
  course,
  isPurchased = false,
}) => {
  const finalPrice = course.price * (1 - course.discount / 100);

  const getTargetAudienceLabel = (audience: string) => {
    const map: Record<string, string> = {
      student: "Học sinh",
      teacher: "Giáo viên",
      parent: "Phụ huynh",
    };

    if (!audience || audience.toLowerCase() === "all") return "";
    return map[audience] || "";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("vi-VN");
  };

  const targetAudienceLabel = getTargetAudienceLabel(course.targetAudience);
  const createdAtLabel = formatDate(course.createdAt);

  return (
    <div className="p-6 h-64 flex flex-col justify-between bg-white">
      <div>
        <div className="flex items-center justify-between mb-3">
          {targetAudienceLabel ? (
            <Tag
              color="#1A8FE3"
              className="text-xs font-medium px-3 py-1 rounded-full"
            >
              <UserOutlined className="mr-1" />
              {targetAudienceLabel}
            </Tag>
          ) : (
            <span />
          )}

          {createdAtLabel ? (
            <div className="flex items-center text-gray-500 text-xs">
              <ClockCircleOutlined className="mr-1" />
              {createdAtLabel}
            </div>
          ) : null}
        </div>

        <h3 className="text-lg font-bold mb-3 text-gray-800 line-clamp-2 min-h-[3.5rem] leading-tight group-hover:text-[#1A8FE3] transition-colors duration-300">
          {course.name}
        </h3>

        <Paragraph className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
          <span dangerouslySetInnerHTML={{ __html: course.content }} />
        </Paragraph>
      </div>

      <div className="mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {isPurchased ? (
              <span className="flex items-center text-green-600 font-bold text-base">
                <CheckCircleTwoTone twoToneColor="#52c41a" className="mr-2" />
                Đã sở hữu
              </span>
            ) : course.discount > 0 ? (
              <>
                <span className="text-xs text-gray-400 line-through">
                  {formatCurrency(course.price)}
                </span>
                <span className="text-xl font-bold text-red-500">
                  {formatCurrency(finalPrice)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-[#1A8FE3]">
                {formatCurrency(course.price)}
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 h-1 bg-gradient-to-r from-[#1A8FE3] to-[#6610F2] rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </div>
    </div>
  );
};

export default CourseCardContent;
