import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Col,
  Row,
  Space,
  Spin,
  Statistic,
  Typography,
  Badge,
  Avatar,
} from "antd";
import {
  BookOutlined,
  FileTextOutlined,
  ReadOutlined,
  AuditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { Bar, Column, Line, Pie } from "@ant-design/charts";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL } from "../../../consts/router.path.const";
import { BlogService } from "../../../services/blog/blog.service";
import { CategoryService } from "../../../services/category/category.service";
import { ConsultantService } from "../../../services/consultant/consultant.service";
import { CourseService } from "../../../services/course/course.service";
import type { Blog } from "../../../types/blog/Blog.res.type";
import type { Category } from "../../../types/category/Category.res.type";
import type { Consultant } from "../../../types/consultant/consultant.res.type";
import type { Course } from "../../../types/course/Course.res.type";

const { Title, Text } = Typography;

// ─── helpers ─────────────────────────────────────────────────────────────────

const pickArray = <T,>(response: unknown): T[] => {
  const root = (response as Record<string, unknown>)?.data;
  const candidates = [
    (root as Record<string, unknown>)?.data,
    (root as Record<string, unknown>)?.pageData,
    (root as Record<string, unknown>)?.items,
    (root as Record<string, unknown>)?.data,
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

const COURSE_STATUS_COLORS: Record<string, string> = {
  draft: "#f59e0b",
  published: "#10b981",
  archived: "#64748b",
  pending: "#6366f1",
};

const getCourseStatusColor = (status: string) => {
  const normalized = status.trim().toLowerCase();
  return COURSE_STATUS_COLORS[normalized] ?? "#94a3b8";
};

const getCourseStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    draft: "Bản nháp",
    published: "Đã xuất bản",
    archived: "Lưu trữ",
    pending: "Chờ duyệt",
  };
  return map[status.toLowerCase()] ?? status;
};

const hashColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 50%)`;
};

const getCategoryId = (cat: unknown) =>
  String((cat as Record<string, unknown>)?.id || (cat as Record<string, unknown>)?._id || "").trim();

const getCategoryName = (cat: unknown) =>
  String((cat as Record<string, unknown>)?.name || "").trim();

const getCourseCategoryId = (course: unknown) =>
  String(
    (course as Record<string, unknown>)?.categoryId ||
      (course as Record<string, unknown>)?.category_id ||
      ""
  ).trim();

// ─── component ────────────────────────────────────────────────────────────────

const StaffOverview: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [instructorRequests, setInstructorRequests] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const [coursesRes, blogsRes, catsRes, consultantsRes, reqRes] = await Promise.allSettled([
        CourseService.getAllCourses({ pageNumber: 1, pageSize: 1000 }),
        BlogService.getAllBlogs({ pageNumber: 1, pageSize: 1000 }),
        CategoryService.getAllCategories({ pageNumber: 1, pageSize: 1000 }),
        ConsultantService.getAllConsultants({ PageNumber: 1, PageSize: 1000 }),
        ConsultantService.getInstructorRequests({ PageNumber: 1, PageSize: 200 }),
      ]);
      if (coursesRes.status === "fulfilled") setCourses(pickArray<Course>(coursesRes.value));
      if (blogsRes.status === "fulfilled") setBlogs(pickArray<Blog>(blogsRes.value));
      if (catsRes.status === "fulfilled") setCategories(pickArray<Category>(catsRes.value));
      if (consultantsRes.status === "fulfilled")
        setConsultants(pickArray<Consultant>(consultantsRes.value));
      if (reqRes.status === "fulfilled")
        setInstructorRequests(pickArray<Record<string, unknown>>(reqRes.value));
      setLoading(false);
    };
    fetch();
  }, []);

  // ── stat cards ──
  const stats = useMemo(
    () => [
      {
        label: "Tổng khóa học",
        value: courses.length,
        icon: <BookOutlined />,
        color: "#6366f1",
        bg: "#eef2ff",
        to: ROUTER_URL.STAFF.COURSES,
      },
      {
        label: "Bài viết",
        value: blogs.length,
        icon: <FileTextOutlined />,
        color: "#0891b2",
        bg: "#e0f7fa",
        to: ROUTER_URL.STAFF.CONTENT,
      },
      {
        label: "Giảng viên",
        value: consultants.length,
        icon: <ReadOutlined />,
        color: "#db2777",
        bg: "#fce7f3",
        to: ROUTER_URL.STAFF.INSTRUCTORS,
      },
      {
        label: "Yêu cầu giảng viên",
        value: instructorRequests.length,
        icon: <AuditOutlined />,
        color: "#d97706",
        bg: "#fef3c7",
        to: ROUTER_URL.STAFF.INSTRUCTOR_REQUESTS,
      },
      {
        label: "Đã xuất bản",
        value: courses.filter(
          (c) => (c as unknown as Record<string, unknown>).status?.toString().toLowerCase() === "published"
        ).length,
        icon: <CheckCircleOutlined />,
        color: "#10b981",
        bg: "#d1fae5",
        to: ROUTER_URL.STAFF.COURSES,
      },
      {
        label: "Đang chờ duyệt",
        value: courses.filter(
          (c) => (c as unknown as Record<string, unknown>).status?.toString().toLowerCase() === "draft"
        ).length,
        icon: <ClockCircleOutlined />,
        color: "#f59e0b",
        bg: "#fffbeb",
        to: ROUTER_URL.STAFF.COURSES,
      },
      {
        label: "Danh mục",
        value: categories.length,
        icon: <RocketOutlined />,
        color: "#7c3aed",
        bg: "#ede9fe",
        to: ROUTER_URL.STAFF.COURSES,
      },
    ],
    [blogs.length, categories.length, consultants.length, courses, instructorRequests.length]
  );

  // ── chart 1: courses by status (Column) ──
  const courseByStatus = useMemo(() => {
    const map = new Map<string, number>();
    courses.forEach((c) => {
      const s = ((c as unknown as Record<string, unknown>).status || "unknown").toString();
      map.set(s, (map.get(s) || 0) + 1);
    });
    return Array.from(map.entries()).map(([status, count]) => ({
      status: getCourseStatusLabel(status),
      count,
      color: getCourseStatusColor(status),
    }));
  }, [courses]);

  // ── chart 2: courses by category (Pie) ──
  const courseByCategory = useMemo(() => {
    const nameMap = new Map(
      categories
        .map((cat) => [getCategoryId(cat), getCategoryName(cat)] as const)
        .filter(([id]) => Boolean(id))
    );
    const countMap = new Map<string, number>();
    courses.forEach((c) => {
      const id = getCourseCategoryId(c);
      if (!id) return;
      const name = nameMap.get(id) || `Cat ${id.slice(0, 6)}`;
      countMap.set(name, (countMap.get(name) || 0) + 1);
    });
    return Array.from(countMap.entries())
      .map(([category, value]) => ({ category, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [categories, courses]);

  // ── chart 3: content growth 6 months (Line) ──
  const contentGrowth = useMemo(() => {
    const monthKeys = Array.from({ length: 6 }, (_, i) =>
      dayjs().subtract(5 - i, "month").format("YYYY-MM")
    );
    const monthSet = new Set(monthKeys);
    const courseCount = new Map(monthKeys.map((k) => [k, 0]));
    const blogCount = new Map(monthKeys.map((k) => [k, 0]));

    courses.forEach((c) => {
      const k = safeMonth((c as unknown as Record<string, unknown>).createdAt as string);
      if (monthSet.has(k)) courseCount.set(k, (courseCount.get(k) || 0) + 1);
    });
    blogs.forEach((b) => {
      const k = safeMonth(
        ((b as unknown as Record<string, unknown>).createdAt ||
          (b as unknown as Record<string, unknown>).created_at) as string
      );
      if (monthSet.has(k)) blogCount.set(k, (blogCount.get(k) || 0) + 1);
    });

    const result: { month: string; type: string; count: number }[] = [];
    monthKeys.forEach((k) => {
      const label = dayjs(`${k}-01`).format("MM/YYYY");
      result.push({ month: label, type: "Khóa học", count: courseCount.get(k) || 0 });
      result.push({ month: label, type: "Bài viết", count: blogCount.get(k) || 0 });
    });
    return result;
  }, [blogs, courses]);

  // ── chart 4: top categories Bar ──
  const topCategories = useMemo(() => {
    const nameMap = new Map(
      categories
        .map((cat) => [getCategoryId(cat), getCategoryName(cat)] as const)
        .filter(([id]) => Boolean(id))
    );
    const countMap = new Map<string, number>();
    courses.forEach((c) => {
      const id = getCourseCategoryId(c);
      if (!id) return;
      const name = nameMap.get(id) || `Cat ${id.slice(0, 6)}`;
      countMap.set(name, (countMap.get(name) || 0) + 1);
    });
    return Array.from(countMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [categories, courses]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <Space direction="vertical" size={24} style={{ width: "100%", padding: "0 4px" }}>
      {/* ── Header ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: 16,
          padding: "28px 32px",
          color: "#fff",
          boxShadow: "0 8px 32px rgba(102,126,234,0.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar
            size={56}
            style={{ background: "rgba(255,255,255,0.25)", fontSize: 24 }}
          >
            📊
          </Avatar>
          <div>
            <Title level={2} style={{ margin: 0, color: "#fff" }}>
              Tổng quan nhân viên
            </Title>
            <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 14 }}>
              Cập nhật lần cuối: {dayjs().format("HH:mm DD/MM/YYYY")}
            </Text>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <Row gutter={[16, 16]}>
        {stats.map((s) => (
          <Col xs={12} sm={8} lg={6} xl={4} key={s.label}>
            <Card
              onClick={() => navigate(s.to)}
              style={{
                borderRadius: 14,
                border: "none",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                background: "#fff",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
              }}
              styles={{ body: { padding: "20px 16px" } }}
              className="hover-card"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 8px 24px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 2px 12px rgba(0,0,0,0.08)";
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: s.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    color: s.color,
                    flexShrink: 0,
                  }}
                >
                  {s.icon}
                </div>
                <Statistic
                  title={
                    <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>
                      {s.label}
                    </span>
                  }
                  value={s.value}
                  valueStyle={{ color: s.color, fontWeight: 700, fontSize: 26, lineHeight: 1.2 }}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ── Row 1: Course status + Category pie ── */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <span style={{ fontWeight: 600, fontSize: 15 }}>
                📚 Khóa học theo trạng thái
              </span>
            }
            style={{ borderRadius: 14, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}
          >
            {courseByStatus.length > 0 ? (
              <Column
                data={courseByStatus}
                xField="status"
                yField="count"
                colorField="status"
                color={(datum: { status: string; color?: string }) =>
                  datum.color || "#6366f1"
                }
                label={{ text: "count", style: { fontWeight: 600 } }}
                height={280}
                style={{ borderRadius: 6 }}
                axis={{ x: { labelFontSize: 13 }, y: { title: false } }}
              />
            ) : (
              <Text type="secondary">Không có dữ liệu</Text>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <span style={{ fontWeight: 600, fontSize: 15 }}>
                🗂️ Phân bổ danh mục khóa học
              </span>
            }
            style={{ borderRadius: 14, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}
          >
            {courseByCategory.length > 0 ? (
              <Pie
                data={courseByCategory}
                angleField="value"
                colorField="category"
                innerRadius={0.55}
                legend={{ color: { position: "bottom", cols: 2 } }}
                height={280}
                label={{
                  text: (d: { category: string; value: number }) =>
                    `${d.category}: ${d.value}`,
                  style: { fontSize: 11 },
                }}
                color={(datum: { category: string }) => hashColor(datum.category)}
              />
            ) : (
              <Text type="secondary">Không có dữ liệu</Text>
            )}
          </Card>
        </Col>
      </Row>

      {/* ── Row 2: Line + Bar ── */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card
            title={
              <span style={{ fontWeight: 600, fontSize: 15 }}>
                📈 Tăng trưởng nội dung 6 tháng gần nhất
              </span>
            }
            style={{ borderRadius: 14, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}
          >
            {contentGrowth.length > 0 ? (
              <Line
                data={contentGrowth}
                xField="month"
                yField="count"
                colorField="type"
                point={{ shapeField: "circle", sizeField: 5 }}
                height={300}
                smooth
                legend={{ position: "top-right" }}
                color={["#6366f1", "#0891b2"]}
              />
            ) : (
              <Text type="secondary">Không có dữ liệu</Text>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title={
              <span style={{ fontWeight: 600, fontSize: 15 }}>
                🏆 Top danh mục có nhiều khóa học
              </span>
            }
            style={{ borderRadius: 14, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}
          >
            {topCategories.length > 0 ? (
              <Bar
                data={topCategories}
                xField="count"
                yField="category"
                colorField="category"
                color={(datum: { category: string }) => hashColor(datum.category)}
                label={{ text: "count", position: "right", style: { fontWeight: 600 } }}
                height={300}
                axis={{ y: { labelFontSize: 12 } }}
              />
            ) : (
              <Text type="secondary">Không có dữ liệu</Text>
            )}
          </Card>
        </Col>
      </Row>

      {/* ── Quick status badges ── */}
      <Card
        title={<span style={{ fontWeight: 600, fontSize: 15 }}>🔍 Trạng thái nhanh</span>}
        style={{ borderRadius: 14, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}
      >
        <Row gutter={[24, 16]}>
          {[
            {
              label: "Khóa học đã xuất bản",
              count: courses.filter(
                (c) =>
                  (c as unknown as Record<string, unknown>).status
                    ?.toString()
                    .toLowerCase() === "published"
              ).length,
              color: "green",
            },
            {
              label: "Khóa học bản nháp",
              count: courses.filter(
                (c) =>
                  (c as unknown as Record<string, unknown>).status
                    ?.toString()
                    .toLowerCase() === "draft"
              ).length,
              color: "orange",
            },
            {
              label: "Khóa học lưu trữ",
              count: courses.filter(
                (c) =>
                  (c as unknown as Record<string, unknown>).status
                    ?.toString()
                    .toLowerCase() === "archived"
              ).length,
              color: "default",
            },
            {
              label: "Yêu cầu giảng viên chờ xử lý",
              count: instructorRequests.length,
              color: "blue",
            },
          ].map((item) => (
            <Col xs={12} sm={6} key={item.label}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  padding: "16px 8px",
                  borderRadius: 12,
                  background: "#f9fafb",
                }}
              >
                <Badge
                  count={item.count}
                  overflowCount={9999}
                  color={
                    item.color === "green"
                      ? "#10b981"
                      : item.color === "orange"
                        ? "#f59e0b"
                        : item.color === "blue"
                          ? "#3b82f6"
                          : "#94a3b8"
                  }
                  showZero
                  style={{ fontSize: 13, fontWeight: 700, minWidth: 36 }}
                />
                <Text style={{ fontSize: 12, color: "#6b7280", textAlign: "center" }}>
                  {item.label}
                </Text>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </Space>
  );
};

export default StaffOverview;
