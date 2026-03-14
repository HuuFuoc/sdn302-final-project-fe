import { Suspense, lazy } from "react";

const CourseManagement = lazy(() => import("../../admin/course"));

export default function ConsultantCourseManagementPage() {
  return (
    <Suspense>
      <CourseManagement />
    </Suspense>
  );
}
