import { lazy } from "react";
import { ROUTER_URL } from "../../../consts/router.path.const";
import type { RouteObject } from "react-router-dom";

import CustomerLayout from "../../../layouts/customer/Customer.layout";
import MyCoursePage from "../../../pages/customer/my-course";
import OrderHistory from "../../../pages/customer/order";
import AppointmentDetail from "../../../components/customer/appointment/Detail.com";
// Lazy load customer pages
const SettingsPage = lazy(() => import("../../../pages/client/settings"));
const AppointmentPage = lazy(
  () => import("../../../pages/customer/appointment"),
);
const CustomerDashboardPage = lazy(
  () => import("../../../pages/customer/dashboard"),
);

// Customer routes that require authentication
export const CustomerRoutes: RouteObject[] = [
  {
    path: ROUTER_URL.CUSTOMER.BASE,
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <CustomerDashboardPage />,
      },
      {
        path: ROUTER_URL.CUSTOMER.SETTINGS,
        element: <SettingsPage />,
      },
      {
        path: ROUTER_URL.CUSTOMER.APPOINTMENTS,
        element: <AppointmentPage />,
      },
      {
        path: ROUTER_URL.CUSTOMER.APPOINTMENT_DETAIL,
        element: <AppointmentDetail />,
      },
      {
        path: ROUTER_URL.CUSTOMER.MY_COURSE,
        element: <MyCoursePage />,
      },
      {
        path: ROUTER_URL.CUSTOMER.ORDER_HISTORY,
        element: <OrderHistory />,
      },
      // Lesson detail dùng route public /bai-hoc/:lessonId - không cần route riêng /customer/bai-hoc
    ],
  },
];
