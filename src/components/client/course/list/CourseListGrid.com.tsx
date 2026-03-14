import React from "react";
import { Empty, Row, Col } from "antd";
import { SectionLoader } from "../../../common/loaders";
import { motion } from "framer-motion";
import type { Course } from "../../../../types/course/Course.res.type";
import CourseCard from "../card/CourseCardMain.com.tsx";
import CustomPagination from "../../../common/Pagiation.com.tsx";

interface CourseListGridProps {
  courses: Course[];
  myCourseIds: Set<string>;
  loading: boolean;
  total: number;
  current: number;
  pageSize: number;
  onPageChange: (page: number, size: number) => void;
}

const CourseListGrid: React.FC<CourseListGridProps> = ({
  courses,
  myCourseIds,
  loading,
  total,
  current,
  pageSize,
  onPageChange,
}) => {
  if (loading) {
    return <SectionLoader className="min-h-0 py-20" />;
  }

  if (courses.length === 0) {
    return (
      <div className="py-20">
        <Empty
          description="Không tìm thấy khóa học nào"
          className="text-gray-500"
        />
      </div>
    );
  }

  return (
    <div className="course-list-grid">
      {/* Course Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Row gutter={[24, 24]}>
          {courses.map((course, index) => (
            <Col key={course.id ?? index} xs={24} sm={12} lg={8} xl={6}>
              <CourseCard
                course={course}
                isPurchased={myCourseIds.has(course.id)}
              />
            </Col>
          ))}
        </Row>
      </motion.div>

      {/* Pagination */}
      {total > pageSize && (
        <div className="flex flex-col items-center pt-8 space-y-4">
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <CustomPagination
              total={total}
              current={current}
              pageSize={pageSize}
              onChange={onPageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseListGrid;
