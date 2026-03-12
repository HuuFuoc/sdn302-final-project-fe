import React from "react";
import { Badge } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import type { Course } from "../../../../types/course/Course.res.type";
import coverImage from "../../../../assets/cover.jpg";

interface CourseCardImageProps {
  course: Course;
}

const CourseCardImage: React.FC<CourseCardImageProps> = ({ course }) => {
  // Calculate discount percentage
  const discountPercentage = course.discount;
  const courseImage =
    course.imageUrls?.[0] || (course as any).imageUrl || coverImage;

  return (
    <div className="relative overflow-hidden h-56">
      {course.isPurchased === true ? (
        <Badge.Ribbon
          text="Đã mua"
          color="green"
          className="absolute top-0 right-0 z-10"
        />
      ) : course.discount > 0 ? (
        <Badge.Ribbon
          text={`-${discountPercentage}%`}
          color="red"
          className="absolute top-0 right-0 z-10"
        />
      ) : null}
      <img
        alt={course.name}
        src={courseImage}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        onError={(e) => {
          e.currentTarget.onerror = null;
          (e.currentTarget as HTMLImageElement).src = coverImage;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Preview Play Button */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors duration-200">
          <PlayCircleOutlined className="text-white text-3xl" />
        </div>
      </div>
    </div>
  );
};

export default CourseCardImage;
