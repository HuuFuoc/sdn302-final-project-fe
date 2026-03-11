import React from "react";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import type { Course } from "../../../../types/course/Course.res.type";
import AddToCartButton from "../../../common/addToCartButton.com";

interface CourseInfoActionsProps {
  course: Course;
  navigate: (to: number) => void;
}

const CourseInfoActions: React.FC<CourseInfoActionsProps> = ({
  course,
  navigate,
}) => {
  const courseId =
    (course as any).id || (course as any)._id || (course as any).courseId;

  return (
    <div className="space-y-4">
      <AddToCartButton courseId={courseId} />
      
      <Button 
        size="middle"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        className="w-full h-12 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:text-blue-500 transition-all duration-300"
      >
        Quay lại danh sách khóa học
      </Button>
    </div>
  );
};

export default CourseInfoActions; 