import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { ROUTER_URL } from "../../../consts/router.path.const";

// Lazy load instructor layout & pages
const InstructorSidebarLayout = lazy(
  () => import("../../../layouts/instructor/Sidebar.layout"),
);
const OverviewPage = lazy(() => import("../../../pages/admin/overview")); // tạm dùng overview chung
const SettingsPage = lazy(() => import("../../../pages/client/settings"));

export const InstructorRoutes: RouteObject[] = [
  {
    path: ROUTER_URL.INSTRUCTOR.BASE,
    element: <InstructorSidebarLayout />,
    children: [
      {
        index: true,
        element: <OverviewPage />,
      },
      {
        path: ROUTER_URL.INSTRUCTOR.DASHBOARD,
        element: <OverviewPage />,
      },
      {
        path: ROUTER_URL.INSTRUCTOR.SETTINGS,
        element: <SettingsPage />,
      },
      // Các route chi tiết khác (COURSES, LESSONS, ...) có thể bổ sung dần
    ],
  },
];

