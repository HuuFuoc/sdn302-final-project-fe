import { Suspense, type JSX } from "react";
import { Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { UserRole } from "../../app/enums";
import { AdminRoutes } from "./access/adminPermission";
import { CustomerRoutes } from "./access/customerPermission";
import { ConsultantRoutes } from "./access/consultantPermission";
import { StaffRoutes } from "./access/staffPermission";
import { ManagerRoutes } from "./access/managerPermission";
import { ROUTER_URL } from "../../consts/router.path.const";
import { useAuth } from "../../contexts/Auth.context";
import GuardProtectedRoute from "./GuardProtectedRoute";

const useProtectedRoutes = (): RouteObject[] => {
  const { role } = useAuth();

  if (role === null) {
    return [
      {
        path: "*",
        element: <Navigate to={ROUTER_URL.AUTH.LOGIN} replace />,
      },
    ];
  }

  let protectedRoutes: RouteObject[] = [];

  switch (role) {
    case UserRole.ADMIN:
      protectedRoutes = [
        ...AdminRoutes.map((route) => ({
          ...route,
          element: (
            <Suspense>
              <GuardProtectedRoute
                component={route.element as JSX.Element}
                allowedRoles={[UserRole.ADMIN]}
              />
            </Suspense>
          ),
        })),
        ...CustomerRoutes.map((route) => ({
          ...route,
          element: (
            <Suspense>
              <GuardProtectedRoute
                component={route.element as JSX.Element}
                allowedRoles={[UserRole.ADMIN]}
              />
            </Suspense>
          ),
        })),
      ];
      break;

    case UserRole.MANAGER:
      protectedRoutes = [
        ...ManagerRoutes.map((route) => ({
          ...route,
          element: (
            <Suspense>
              <GuardProtectedRoute
                component={route.element as JSX.Element}
                allowedRoles={[UserRole.MANAGER]}
              />
            </Suspense>
          ),
        })),
        ...CustomerRoutes.map((route) => ({
          ...route,
          element: (
            <Suspense>
              <GuardProtectedRoute
                component={route.element as JSX.Element}
                allowedRoles={[UserRole.MANAGER]}
              />
            </Suspense>
          ),
        })),
      ];
      break;

    case UserRole.STAFF:
      protectedRoutes = [
        ...StaffRoutes.map((route) => ({
          ...route,
          element: (
            <Suspense>
              <GuardProtectedRoute
                component={route.element as JSX.Element}
                allowedRoles={[UserRole.STAFF]}
              />
            </Suspense>
          ),
        })),
        ...CustomerRoutes.map((route) => ({
          ...route,
          element: (
            <Suspense>
              <GuardProtectedRoute
                component={route.element as JSX.Element}
                allowedRoles={[UserRole.STAFF]}
              />
            </Suspense>
          ),
        })),
      ];
      break;

    case UserRole.CONSULTANT:
    case UserRole.INSTRUCTOR:
      protectedRoutes = [
        ...ConsultantRoutes.map((route) => ({
          ...route,
          element: (
            <Suspense>
              <GuardProtectedRoute
                component={route.element as JSX.Element}
                allowedRoles={[UserRole.CONSULTANT, UserRole.INSTRUCTOR]}
              />
            </Suspense>
          ),
        })),
        ...CustomerRoutes.map((route) => ({
          ...route,
          element: (
            <Suspense>
              <GuardProtectedRoute
                component={route.element as JSX.Element}
                allowedRoles={[UserRole.CONSULTANT, UserRole.INSTRUCTOR]}
              />
            </Suspense>
          ),
        })),
      ];
      break;

    case UserRole.CUSTOMER:
      protectedRoutes = CustomerRoutes.map((route) => ({
        ...route,
        element: (
          <Suspense>
            <GuardProtectedRoute
              component={route.element as JSX.Element}
              allowedRoles={[UserRole.CUSTOMER]}
            />
          </Suspense>
        ),
      }));
      break;

    default:
      return [
        {
          path: "*",
          element: <Navigate to={ROUTER_URL.AUTH.LOGIN} replace />,
        },
      ];
  }

  return protectedRoutes;
};

export default useProtectedRoutes;
