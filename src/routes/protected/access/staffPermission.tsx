import { lazy } from "react";
import { ROUTER_URL } from "../../../consts/router.path.const";
import type { RouteObject } from "react-router-dom";
import AdminInstructorRequestManager from "../../../components/admin/user/staff-consultant/AdminInstructorRequestManager";
import AdminConsultantManager from "../../../components/admin/user/consultant/AdminConsultantManager";
import CourseManagement from "../../../pages/admin/course";
import UserManagement from "../../../pages/admin/user";
import BlogManagement from "../../../pages/admin/blog";

// Lazy load staff pages
const StaffLayout = lazy(() => import("../../../layouts/staff/Staff.layout"));
const OverviewPage = lazy(() => import("../../../pages/admin/overview"));
const SettingsPage = lazy(() => import("../../../pages/client/settings"));

// Staff routes with layout protection
export const StaffRoutes: RouteObject[] = [
  {
    path: ROUTER_URL.STAFF.BASE,
    element: <StaffLayout />,
    children: [
      {
        index: true,
        element: <OverviewPage />,
      },
      {
        path: ROUTER_URL.STAFF.COURSES,
        element: <CourseManagement />,
      },
      {
        path: ROUTER_URL.STAFF.CONTENT,
        element: <BlogManagement />,
      },
      {
        path: ROUTER_URL.STAFF.USERS,
        element: <UserManagement />,
      },
      {
        path: ROUTER_URL.STAFF.INSTRUCTORS,
        element: <AdminConsultantManager />,
      },
      {
        path: ROUTER_URL.STAFF.INSTRUCTOR_REQUESTS,
        element: <AdminInstructorRequestManager />,
      },
      {
        path: ROUTER_URL.STAFF.REPORTS,
        element: <OverviewPage />,
      },
      {
        path: ROUTER_URL.STAFF.SETTINGS,
        element: <SettingsPage />,
      },
    ],
  },
];
