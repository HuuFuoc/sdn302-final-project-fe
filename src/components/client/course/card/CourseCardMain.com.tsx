import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Course } from "../../../../types/course/Course.res.type";
import { ROUTER_URL } from "../../../../consts/router.path.const";
import CourseCardImage from "./CourseCardImage.com.tsx";
import CourseCardContent from "./CourseCardContent.com.tsx";
import CourseCardHover from "./CourseCardHover.com.tsx";

interface CourseCardProps {
  course: Course;
  isPurchased?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isPurchased = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const courseDetailUrl = ROUTER_URL.CLIENT.COURSE_DETAIL.replace(
    ":courseId",
    course.id?.toString() ?? "",
  );

  const myCourseDetailUrl = ROUTER_URL.CLIENT.MY_COURSE_DETAIL.replace(
    ":courseId",
    course.id?.toString() ?? "",
  );

  const targetUrl = isPurchased ? myCourseDetailUrl : courseDetailUrl;

  return (
    <motion.div
      className="relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      style={{ zIndex: isHovered ? 10001 : 1 }}
    >
      <Link to={targetUrl} className="block">
        <div
          className={`group relative overflow-hidden rounded-2xl transition-shadow duration-300 h-full ${
            isPurchased
              ? "bg-emerald-50 shadow-lg shadow-emerald-100/60 ring-1 ring-emerald-200"
              : "bg-white shadow-md hover:shadow-lg"
          }`}
        >
          <CourseCardImage course={course} isPurchased={isPurchased} />
          <CourseCardContent course={course} isPurchased={isPurchased} />
        </div>
      </Link>

      {/* Hover Overlay */}
      <AnimatePresence>
        {isHovered && (
          <div
            className="fixed inset-0 pointer-events-none z-[10000]"
            style={{ zIndex: 10000 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute pointer-events-auto"
              style={{
                top: 0,
                left: "100%",
                marginLeft: "1rem",
                zIndex: 10001,
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <CourseCardHover course={course} isPurchased={isPurchased} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CourseCard;
