import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Col,
  Row,
  Space,
  Spin,
  Statistic,
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

type ApiKey =
  | "users"
  | "courses"
  | "blogs"
  | "categories"
  | "consultants"
  | "sessions"
  | "lessons"
  | "instructorRequests";

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

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [instructorRequests, setInstructorRequests] = useState<Record<string, unknown>[]>([]);

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

      const settled = await Promise.allSettled(requestItems.map((item) => item.request));

      settled.forEach((result, index) => {
        const key = requestItems[index].key;
        if (result.status !== "fulfilled") return;

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

      });

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


    </Space>
  );
};

export default Overview;
