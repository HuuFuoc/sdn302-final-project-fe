import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Row,
  Space,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  BookOutlined,
  FileTextOutlined,
  ReadOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Bar, Column, Line, Pie } from "@ant-design/charts";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { API_PATH } from "../../../consts/api.path.const";
import { ROUTER_URL } from "../../../consts/router.path.const";
import { BlogService } from "../../../services/blog/blog.service";
import { CategoryService } from "../../../services/category/category.service";
import { ConsultantService } from "../../../services/consultant/consultant.service";
import { CourseService } from "../../../services/course/course.service";
import { LessonService } from "../../../services/lesson/lesson.service";
import { SessionService } from "../../../services/session/session.service";
import { UserService } from "../../../services/user/user.service";
import type { Blog } from "../../../types/blog/Blog.res.type";
import type { Category } from "../../../types/category/Category.res.type";
import type { Consultant } from "../../../types/consultant/consultant.res.type";
import type { Course } from "../../../types/course/Course.res.type";
import type { Lesson } from "../../../types/lesson/Lesson.res.type";
import type { Session } from "../../../types/session/Session.res.type";
import type { UserResponse } from "../../../types/user/User.res.type";

const { Title, Text } = Typography;

type ApiHealth = "success" | "failed";
type ApiKey =
  | "users"
  | "courses"
  | "blogs"
  | "categories"
  | "consultants"
  | "sessions"
  | "lessons"
  | "instructorRequests";

interface ApiAuditRow {
  key: ApiKey;
  module: string;
  endpoint: string;
  purpose: string;
  status: ApiHealth;
  error?: string;
}

const API_AUDIT_TEMPLATE: Omit<ApiAuditRow, "status" | "error">[] = [
  {
    key: "users",
    module: "User",
    endpoint: API_PATH.USER.GET_ALL_USERS_ADMIN,
    purpose: "Lấy danh sách người dùng theo vai trò",
  },
  {
    key: "courses",
    module: "Course",
    endpoint: API_PATH.COURSE.GET_ALL_COURSES,
    purpose: "Lấy danh sách khóa học và trạng thái",
  },
  {
    key: "blogs",
    module: "Blog",
    endpoint: API_PATH.BLOG.GET_ALL_BLOGS,
    purpose: "Lấy danh sách bài viết",
  },
  {
    key: "categories",
    module: "Category",
    endpoint: API_PATH.CATEGORY.GET_ALL_CATEGORIES,
    purpose: "Lấy danh mục khóa học",
  },
  {
    key: "consultants",
    module: "Instructor",
    endpoint: API_PATH.INSTRUCTOR.GET_ALL_INSTRUCTORS,
    purpose: "Lấy danh sách giảng viên/consultant",
  },
  {
    key: "sessions",
    module: "Session",
    endpoint: API_PATH.SESSION.GET_ALL_SESSIONS,
    purpose: "Lấy tổng số phiên học",
  },
  {
    key: "lessons",
    module: "Lesson",
    endpoint: API_PATH.LESSON.GET_ALL_LESSONS,
    purpose: "Lấy tổng số bài học",
  },
  {
    key: "instructorRequests",
    module: "Instructor Request",
    endpoint: API_PATH.INSTRUCTOR.GET_INSTRUCTOR_REQUESTS,
    purpose: "Theo dõi yêu cầu trở thành giảng viên",
  },
];

const ADMIN_AUDITED_ROUTES = [
  { label: "Dashboard", path: ROUTER_URL.ADMIN.BASE },
  { label: "Thống kê", path: ROUTER_URL.ADMIN.ANALYTICS },
  { label: "Quản lý user", path: ROUTER_URL.ADMIN.MANAGER_USER },
  { label: "Quản lý manager", path: ROUTER_URL.ADMIN.MANAGERS },
  { label: "Nhân viên & giảng viên", path: ROUTER_URL.ADMIN.STAFF_CONSULTANTS },
  { label: "Quản lý khóa học", path: ROUTER_URL.ADMIN.MANAGER_COURSE },
  { label: "Quản lý danh mục", path: ROUTER_URL.ADMIN.MANAGER_CATEGORY },
  { label: "Quản lý blog", path: ROUTER_URL.ADMIN.MANAGER_BLOG },
  { label: "Cài đặt", path: ROUTER_URL.ADMIN.SETTINGS },
];

const emptyAuditRows = (): ApiAuditRow[] =>
  API_AUDIT_TEMPLATE.map((item) => ({
    ...item,
    status: "failed",
    error: "Chưa gọi",
  }));

const pickArray = <T,>(response: any): T[] => {
  const root = response?.data;
  const candidates = [
    root?.data,
    root?.pageData,
    root?.items,
    root?.data?.items,
    root,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate as T[];
  }
  return [];
};

const safeMonth = (value?: string) => {
  if (!value) return "";
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("YYYY-MM") : "";
};

const mapRoleLabelForChart = (roleValue: unknown): string => {
  if (roleValue === 0 || roleValue === "0" || roleValue === "Admin") return "Admin";
  if (roleValue === 1 || roleValue === "1" || roleValue === "Staff") return "Staff";
  if (
    roleValue === 2 ||
    roleValue === "2" ||
    roleValue === "User" ||
    roleValue === "Customer"
  ) {
    return "Customer";
  }
  if (
    roleValue === 3 ||
    roleValue === "3" ||
    roleValue === "Consultant" ||
    roleValue === "Instructor"
  ) {
    return "Instructor";
  }
  return "Unknown";
};

const ROLE_CHART_COLORS: Record<string, string> = {
  Admin: "#ef4444",
  Staff: "#3b82f6",
  Customer: "#22c55e",
  Instructor: "#8b5cf6",
  Unknown: "#94a3b8",
};

const COURSE_STATUS_COLORS: Record<string, string> = {
  draft: "#f59e0b",
  published: "#10b981",
  archived: "#64748b",
};

const hashString = (value: string) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
};

const generateColorByKey = (key: string) => {
  const hash = hashString(key);
  const hue = hash % 360;
  const saturation = 65 + (hash % 15);
  const lightness = 45 + (hash % 10);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const getCourseStatusColor = (status: string) => {
  const normalized = status.trim().toLowerCase();
  return COURSE_STATUS_COLORS[normalized] || generateColorByKey(`status-${normalized}`);
};

const getCategoryColor = (category: string) =>
  generateColorByKey(`category-${category.trim().toLowerCase()}`);

const getCategoryId = (category: unknown): string => {
  const raw = category as Record<string, unknown>;
  return String(raw?.id || raw?._id || "").trim();
};

const getCategoryName = (category: unknown): string => {
  const raw = category as Record<string, unknown>;
  return String(raw?.name || "").trim();
};

const getCourseCategoryId = (course: unknown): string => {
  const raw = course as Record<string, unknown>;
  return String(raw?.categoryId || raw?.category_id || "").trim();
};

const Overview: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [instructorRequests, setInstructorRequests] = useState<Record<string, unknown>[]>([]);
  const [apiAudit, setApiAudit] = useState<ApiAuditRow[]>(emptyAuditRows());

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);

      const requestItems: Array<{ key: ApiKey; request: Promise<any> }> = [
        {
          key: "users",
          request: UserService.getAllUsersByAdmin({ pageNumber: 1, pageSize: 1000 }),
        },
        {
          key: "courses",
          request: CourseService.getAllCourses({ pageNumber: 1, pageSize: 1000 }),
        },
        {
          key: "blogs",
          request: BlogService.getAllBlogs({ pageNumber: 1, pageSize: 1000 }),
        },
        {
          key: "categories",
          request: CategoryService.getAllCategories({ pageNumber: 1, pageSize: 1000 }),
        },
        {
          key: "consultants",
          request: ConsultantService.getAllConsultants({ PageNumber: 1, PageSize: 1000 }),
        },
        {
          key: "sessions",
          request: SessionService.getAllSessions({ pageNumber: 1, pageSize: 1000 }),
        },
        {
          key: "lessons",
          request: LessonService.getAllLessons({ pageNumber: 1, pageSize: 1000 }),
        },
        {
          key: "instructorRequests",
          request: ConsultantService.getInstructorRequests({ PageNumber: 1, PageSize: 200 }),
        },
      ];

      const auditMap = new Map<ApiKey, ApiAuditRow>(
        API_AUDIT_TEMPLATE.map((item) => [
          item.key,
          { ...item, status: "failed", error: "Không gọi được" },
        ]),
      );

      const settled = await Promise.allSettled(requestItems.map((item) => item.request));

      settled.forEach((result, index) => {
        const key = requestItems[index].key;
        const current = auditMap.get(key);
        if (!current) return;

        if (result.status === "fulfilled") {
          auditMap.set(key, { ...current, status: "success", error: undefined });
          const response = result.value;

          if (key === "users") setUsers(pickArray<UserResponse>(response));
          if (key === "courses") setCourses(pickArray<Course>(response));
          if (key === "blogs") setBlogs(pickArray<Blog>(response));
          if (key === "categories") setCategories(pickArray<Category>(response));
          if (key === "consultants") setConsultants(pickArray<Consultant>(response));
          if (key === "sessions") setSessions(pickArray<Session>(response));
          if (key === "lessons") setLessons(pickArray<Lesson>(response));
          if (key === "instructorRequests") {
            setInstructorRequests(pickArray<Record<string, unknown>>(response));
          }
          return;
        }

        const message =
          result.reason instanceof Error ? result.reason.message : "API request failed";
        auditMap.set(key, { ...current, status: "failed", error: message });
      });

      setApiAudit(Array.from(auditMap.values()));
      setLoading(false);
    };

    fetchDashboard();
  }, []);

  const cards = useMemo(
    () => [
      { label: "Tổng user", value: users.length, icon: <UsergroupAddOutlined />, color: "#2563eb" },
      { label: "Tổng khóa học", value: courses.length, icon: <BookOutlined />, color: "#16a34a" },
      { label: "Tổng giảng viên", value: consultants.length, icon: <ReadOutlined />, color: "#db2777" },
      { label: "Tổng blog", value: blogs.length, icon: <FileTextOutlined />, color: "#0891b2" },
      { label: "Tổng sessions", value: sessions.length, icon: <BookOutlined />, color: "#0f766e" },
      { label: "Tổng lessons", value: lessons.length, icon: <BookOutlined />, color: "#6d28d9" },
      {
        label: "Yêu cầu giảng viên",
        value: instructorRequests.length,
        icon: <ReadOutlined />,
        color: "#b45309",
      },
      {
        label: "User đã xác thực",
        value: users.filter(
          (user) => Boolean((user as any)?.isVerified) || (user as any)?.verify === 1,
        ).length,
        icon: <UsergroupAddOutlined />,
        color: "#1d4ed8",
      },
    ],
    [blogs.length, consultants.length, courses.length, instructorRequests.length, lessons.length, sessions.length, users],
  );

  const resourceDistribution = useMemo(
    () =>
      [
        { type: "Users", value: users.length },
        { type: "Courses", value: courses.length },
        { type: "Instructors", value: consultants.length },
        { type: "Blogs", value: blogs.length },
        { type: "Sessions", value: sessions.length },
        { type: "Lessons", value: lessons.length },
      ].filter((item) => item.value > 0),
    [blogs.length, consultants.length, courses.length, lessons.length, sessions.length, users.length],
  );

  const userByRole = useMemo(() => {
    const countMap = new Map<string, number>();
    users.forEach((user) => {
      const role = mapRoleLabelForChart((user as any).role);
      countMap.set(role, (countMap.get(role) || 0) + 1);
    });
    return Array.from(countMap.entries()).map(([role, count]) => ({ role, count }));
  }, [users]);

  const courseByStatus = useMemo(() => {
    const countMap = new Map<string, number>();
    courses.forEach((course) => {
      const status = (course.status || "unknown").toString();
      countMap.set(status, (countMap.get(status) || 0) + 1);
    });
    return Array.from(countMap.entries()).map(([status, count]) => ({
      status,
      count,
      color: getCourseStatusColor(status),
    }));
  }, [courses]);

  const topCategories = useMemo(() => {
    const categoryNameMap = new Map(
      categories
        .map((category) => [getCategoryId(category), getCategoryName(category)] as const)
        .filter(([id]) => Boolean(id)),
    );
    const countMap = new Map<string, number>();

    courses.forEach((course) => {
      const id = getCourseCategoryId(course);
      if (!id) return;
      countMap.set(id, (countMap.get(id) || 0) + 1);
    });

    return Array.from(countMap.entries())
      .map(([categoryId, count]) => ({
        category: categoryNameMap.get(categoryId) || `Category ${categoryId}`,
        count,
        color: getCategoryColor(categoryNameMap.get(categoryId) || `Category ${categoryId}`),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [categories, courses]);

  const contentGrowth = useMemo(() => {
    const monthKeys = Array.from({ length: 6 }, (_, index) =>
      dayjs()
        .subtract(5 - index, "month")
        .format("YYYY-MM"),
    );

    const monthSet = new Set(monthKeys);
    const courseCount = new Map<string, number>(monthKeys.map((key) => [key, 0]));
    const blogCount = new Map<string, number>(monthKeys.map((key) => [key, 0]));

    courses.forEach((course) => {
      const key = safeMonth((course as any).createdAt);
      if (monthSet.has(key)) courseCount.set(key, (courseCount.get(key) || 0) + 1);
    });

    blogs.forEach((blog) => {
      const key = safeMonth((blog as any).createdAt || (blog as any).created_at);
      if (monthSet.has(key)) blogCount.set(key, (blogCount.get(key) || 0) + 1);
    });

    const result: Array<{ month: string; type: string; count: number }> = [];
    monthKeys.forEach((key) => {
      const label = dayjs(`${key}-01`).format("MM/YYYY");
      result.push({ month: label, type: "Courses", count: courseCount.get(key) || 0 });
      result.push({ month: label, type: "Blogs", count: blogCount.get(key) || 0 });
    });

    return result;
  }, [blogs, courses]);

  const apiFailedCount = apiAudit.filter((item) => item.status === "failed").length;
  const totalResources =
    users.length + courses.length + consultants.length + blogs.length + sessions.length + lessons.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[360px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Space direction="vertical" size={20} style={{ width: "100%" }}>
      <div>
        <Title level={2} style={{ marginBottom: 4 }}>
          Dashboard Admin - Tổng quan API và thống kê
        </Title>
        <Text type="secondary">
          Dashboard này tổng hợp dữ liệu từ các API admin đang sử dụng trong hệ thống.
        </Text>
      </div>

      <Alert
        type={apiFailedCount > 0 ? "warning" : "info"}
        showIcon
        message={`Tổng tài nguyên đang theo dõi: ${totalResources.toLocaleString("vi-VN")} | API lỗi: ${apiFailedCount}/${apiAudit.length}`}
      />

      <Row gutter={[16, 16]}>
        {cards.map((card) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={card.label}>
            <Card style={{ borderRadius: 14 }}>
              <Statistic
                title={card.label}
                value={card.value}
                prefix={<span style={{ color: card.color }}>{card.icon}</span>}
                valueStyle={{ color: card.color, fontWeight: 700 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={10}>
          <Card title="Cơ cấu tài nguyên hệ thống" style={{ borderRadius: 14 }}>
            {resourceDistribution.length > 0 ? (
              <Pie
                data={resourceDistribution}
                angleField="value"
                colorField="type"
                innerRadius={0.62}
                legend={{ color: { position: "bottom", cols: 2 } }}
                height={300}
              />
            ) : (
              <Text type="secondary">Không có dữ liệu.</Text>
            )}
          </Card>
        </Col>
        <Col xs={24} xl={14}>
          <Card title="Người dùng theo role" style={{ borderRadius: 14 }}>
            {userByRole.length > 0 ? (
              <Column
                data={userByRole}
                xField="role"
                yField="count"
                colorField="role"
                color={(datum: { role: string }) =>
                  ROLE_CHART_COLORS[datum.role] || ROLE_CHART_COLORS.Unknown
                }
                label={{ text: "count" }}
                height={300}
              />
            ) : (
              <Text type="secondary">Không có dữ liệu.</Text>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Card title="Trạng thái khóa học" style={{ borderRadius: 14 }}>
            {courseByStatus.length > 0 ? (
              <Bar
                data={courseByStatus}
                xField="status"
                yField="count"
                colorField="status"
                color={(datum: { status: string; color?: string }) =>
                  datum.color || getCourseStatusColor(datum.status)
                }
                label={{ text: "count", position: "right" }}
                height={300}
              />
            ) : (
              <Text type="secondary">Không có dữ liệu.</Text>
            )}
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <Card title="Tăng trưởng nội dung 6 tháng gần nhất" style={{ borderRadius: 14 }}>
            {contentGrowth.length > 0 ? (
              <Line
                data={contentGrowth}
                xField="month"
                yField="count"
                colorField="type"
                point={{ shapeField: "circle", sizeField: 4 }}
                height={300}
              />
            ) : (
              <Text type="secondary">Không có dữ liệu.</Text>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="Top danh mục theo số khóa học" style={{ borderRadius: 14 }}>
            {topCategories.length > 0 ? (
              <Bar
                data={topCategories}
                xField="category"
                yField="count"
                colorField="category"
                color={(datum: { category: string; color?: string }) =>
                  datum.color || getCategoryColor(datum.category)
                }
                label={{ text: "count", position: "right" }}
                height={320}
              />
            ) : (
              <Text type="secondary">Không có dữ liệu.</Text>
            )}
          </Card>
        </Col>
      </Row>

      <Card title="Bảng kiểm tra API admin" style={{ borderRadius: 14 }}>
        <Table
          rowKey="key"
          size="small"
          pagination={false}
          dataSource={apiAudit}
          columns={[
            { title: "Module", dataIndex: "module", key: "module" },
            { title: "Endpoint", dataIndex: "endpoint", key: "endpoint" },
            { title: "Mục đích", dataIndex: "purpose", key: "purpose" },
            {
              title: "Trạng thái",
              key: "status",
              render: (_, record: ApiAuditRow) =>
                record.status === "success" ? (
                  <Tag color="green">OK</Tag>
                ) : (
                  <Tag color="red">ERROR</Tag>
                ),
            },
            {
              title: "Chi tiết lỗi",
              dataIndex: "error",
              key: "error",
              render: (error?: string) => error || "-",
            },
          ]}
        />
      </Card>

      <Card title="Điều hướng admin" style={{ borderRadius: 14 }}>
        <Space size={[8, 10]} wrap>
          {ADMIN_AUDITED_ROUTES.map((route) => (
            <Button key={route.path} onClick={() => navigate(route.path)}>
              {route.label}
              <Tag style={{ marginLeft: 8, marginRight: 0 }}>{route.path}</Tag>
            </Button>
          ))}
        </Space>
      </Card>
    </Space>
  );
};

export default Overview;
