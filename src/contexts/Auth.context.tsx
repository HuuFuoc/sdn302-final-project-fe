import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { UserRole } from "../app/enums";
import { AuthService } from "../services/auth/auth.service";
import { UserService } from "../services/user/user.service";
import { useNavigate } from "react-router-dom";
import { HTTP_STATUS } from "../app/enums";
import { HttpException } from "../app/exceptions";
import type { UserResponse } from "../types/user/User.res.type";
import type { ResponseSuccess } from "../app/interface";
import { helpers } from "../utils";
import { ROUTER_URL } from "../consts/router.path.const";

interface AuthContextType {
  role: UserRole | null;
  setRole: React.Dispatch<React.SetStateAction<UserRole | null>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  userInfo: ResponseSuccess<UserResponse>["data"] | null;
  setUserInfo: React.Dispatch<
    React.SetStateAction<ResponseSuccess<UserResponse>["data"] | null>
  >;
  logout: () => void;
  handleLogin: (loginData: {
    email: string;
    password: string;
  }) => Promise<UserResponse | null>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Map API user (avatar / profile_pic_url / profilePicUrl) to UserResponse */
const normalizeUserFromApi = (raw: any): UserResponse => {
  const profilePicUrl =
    raw?.profilePicUrl ?? raw?.profile_pic_url ?? raw?.avatar ?? "";
  return {
    id: raw?.id ?? raw?._id ?? "",
    firstName: raw?.firstName ?? raw?.first_name ?? "",
    lastName: raw?.lastName ?? raw?.last_name ?? "",
    password: raw?.password ?? "",
    phoneNumber: raw?.phoneNumber ?? raw?.phone_number ?? "",
    gender: raw?.gender ?? "",
    email: raw?.email ?? "",
    dob: raw?.dob ?? "",
    ageGroup: raw?.ageGroup ?? raw?.age_group ?? "",
    token: raw?.token,
    isVerified: raw?.isVerified ?? raw?.is_verified ?? false,
    isDeleted: raw?.isDeleted ?? raw?.is_deleted ?? false,
    verificationToken: raw?.verificationToken ?? raw?.verification_token ?? "",
    verificationTokenExpires: raw?.verificationTokenExpires
      ? new Date(raw.verificationTokenExpires)
      : new Date(),
    role: mapBackendRoleToUserRole(raw?.role) ?? UserRole.CUSTOMER,
    profilePicUrl: profilePicUrl || "",
    createdAt: raw?.createdAt ? new Date(raw.createdAt) : new Date(),
    updatedAt: raw?.updatedAt ? new Date(raw.updatedAt) : new Date(),
    fullName: raw?.fullName ?? raw?.full_name ?? "",
  };
};

const mapBackendRoleToUserRole = (backendRole: any): UserRole | null => {
  // Backend role mapping supports both legacy and current enum/string values.
  switch (backendRole) {
    case 0:
    case 4:
    case "Admin":
      return UserRole.ADMIN;
    case 1:
    case "Staff":
      return UserRole.STAFF;
    case 2:
    case "User":
      return UserRole.CUSTOMER;
    case 3:
    case "Consultant":
    case "Instructor":
      return UserRole.INSTRUCTOR;
    default:
      return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole | null>(
    () => localStorage.getItem("role") as UserRole | null,
  );
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );
  // const [userInfo, setUserInfo] = useState<
  //   ResponseSuccess<UserResponse>["data"] | null
  // >(null);
  const [userInfo, setUserInfo] = useState<UserResponse | null>(() => {
    const stored = localStorage.getItem("userInfo");
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load initial state from localStorage and fetch user by id for avatar
  useEffect(() => {
    const clearAuthData = () => {
      setToken(null);
      setRole(null);
      setUserInfo(null);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userInfo");
    };

    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUserInfo = localStorage.getItem("userInfo");

        if (storedToken) {
          setToken(storedToken);
          try {
            const decoded = jwtDecode(storedToken) as {
              role?: any;
              user_id?: string;
              sub?: string;
            };
            const mappedRole = mapBackendRoleToUserRole(decoded.role);
            if (!mappedRole) {
              throw new Error("Invalid role in token");
            }
            setRole(mappedRole);

            const userId = decoded.user_id ?? decoded.sub;
            if (userId) {
              try {
                const res = await UserService.getUserById({ userId });
                if (res?.data?.data) {
                  setUserInfo(normalizeUserFromApi(res.data.data));
                } else if (storedUserInfo) {
                  setUserInfo(JSON.parse(storedUserInfo));
                }
              } catch {
                if (storedUserInfo) {
                  setUserInfo(JSON.parse(storedUserInfo));
                }
              }
            } else if (storedUserInfo) {
              setUserInfo(JSON.parse(storedUserInfo));
            }
          } catch (error) {
            console.error("Token validation error:", error);
            clearAuthData();
          }
        } else if (storedUserInfo) {
          setUserInfo(JSON.parse(storedUserInfo));
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const logout = useCallback(() => {
    setUserInfo(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userInfo");
    navigate(ROUTER_URL.AUTH.LOGIN, { replace: true });
    helpers.notificationMessage("Đăng xuất thành công!", "success");
  }, [navigate]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (role) {
      localStorage.setItem("role", role);
    } else {
      localStorage.removeItem("role");
    }
  }, [role]);

  useEffect(() => {
    if (userInfo) {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    } else {
      localStorage.removeItem("userInfo");
    }
  }, [userInfo]);

  const handleLogin = useCallback(
    async (loginData: { email: string; password: string }) => {
      setIsLoading(true);
      try {
        const response = await AuthService.login(loginData);
        const { result } = response.data as {
          message?: string;
          result?: { access_token?: string; refresh_token?: string };
        };

        const token = result?.access_token;
        if (!token) {
          throw new HttpException(
            "No token provided",
            HTTP_STATUS.UNAUTHORIZED,
          );
        }

        // Optionally store refresh token if needed later
        if (result?.refresh_token) {
          localStorage.setItem("refresh_token", result.refresh_token);
        }

        const decoded = jwtDecode(token) as {
          role?: any;
          user_id?: string;
          sub?: string;
        };
        const mappedRole = mapBackendRoleToUserRole(decoded.role);
        if (!mappedRole) {
          throw new HttpException("Invalid role", HTTP_STATUS.UNAUTHORIZED);
        }

        const userRole = mappedRole;
        const userId = decoded.user_id ?? decoded.sub ?? "";

        localStorage.setItem("token", token);
        setToken(token);
        setRole(userRole);

        const userData: UserResponse = {
          id: userId,
          firstName: "",
          lastName: "",
          password: "",
          phoneNumber: "",
          gender: "",
          email: loginData.email,
          dob: "",
          ageGroup: "",
          token,
          isVerified: true,
          isDeleted: false,
          verificationToken: "",
          verificationTokenExpires: new Date(),
          role: userRole,
          profilePicUrl: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          fullName: "",
        };

        if (userId) {
          try {
            const res = await UserService.getUserById({ userId });
            if (res?.data?.data) {
              const normalized = normalizeUserFromApi(res.data.data);
              normalized.token = token;
              setUserInfo(normalized);
              helpers.notificationMessage("Đăng nhập thành công!", "success");
              return normalized;
            }
          } catch {
            // fallback to minimal userData
          }
        }

        setUserInfo(userData);
        helpers.notificationMessage("Đăng nhập thành công!", "success");
        return userData;
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [logout],
  );

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        token,
        setToken,
        userInfo,
        setUserInfo,
        logout,
        handleLogin,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new HttpException(
      "useAuth must be used within an AuthProvider",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
  return context;
};
