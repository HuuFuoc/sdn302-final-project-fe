import { lazy } from "react";
import { ROUTER_URL } from "../../../consts/router.path.const";
import type { RouteObject } from "react-router-dom";
import AppointmentDetail from "../../../components/customer/appointment/Detail.com";

// Lazy load consultant pages
const ConsultantLayout = lazy(() => import("../../../layouts/consultant/Consultant.layout"));
const OverviewPage = lazy(() => import("../../../pages/consultant/overview"));
const SettingsPage = lazy(() => import("../../../pages/client/settings"));
const AppointmentPage = lazy(() => import("../../../pages/customer/appointment"));
const RevenuePage = lazy(() => import("../../../pages/consultant/revenue"));
const CourseManagementPage = lazy(() => import("../../../pages/consultant/course"));
const ClientsPage = lazy(() => import("../../../pages/consultant/clients"));
// Consultant routes with layout protection
export const ConsultantRoutes: RouteObject[] = [
    {
        path: ROUTER_URL.CONSULTANT.BASE,
        element: <ConsultantLayout />,
        children: [
            {
                index: true,
                element: <OverviewPage />,
            },
            {
                path: ROUTER_URL.CONSULTANT.OVERVIEW,
                element: <OverviewPage />,
            },
            {
                path: ROUTER_URL.CONSULTANT.APPOINTMENTS,
                element: <AppointmentPage />, // Temporary placeholder
            },
            {
                path: ROUTER_URL.CONSULTANT.COURSES,
                element: <CourseManagementPage />,
            },
            {
                path: ROUTER_URL.CONSULTANT.APPOINTMENT_DETAIL,
                element: <AppointmentDetail />,
            },
            {
                path: ROUTER_URL.CONSULTANT.CLIENTS,
                element: <ClientsPage />,
            },
            {
                path: "consultations",
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: "assessments",
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: "resources",
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: ROUTER_URL.CONSULTANT.REPORTS,
                element: <RevenuePage />,
            },
            {
                path: ROUTER_URL.CONSULTANT.SETTINGS,
                element: <SettingsPage />,
            },
        ],
    },
]; 
