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
  Tag,
  Typography,
} from "antd";
import {
  BookOutlined,
  FileTextOutlined,
  FormOutlined,
  ReadOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Pie, Bar } from "@ant-design/charts";
import { useNavigate } from "react-router-dom";
import { DashboardService } from "../../../services/dashboard/dashboard.service";
import { ROUTER_URL } from "../../../consts/router.path.const";
import type { DashboardOverallResponse } from "../../../types/dashboard/Dashboard.res.type";

const { Title, Text } = Typography;

type MetricKey = keyof DashboardOverallResponse;

const METRICS: {
  key: MetricKey;
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}[] = [
  {
    key: "totalUsers",
    label: "Tổng người dùng",
    icon: <UsergroupAddOutlined />,
    color: "#2563eb",
    bg: "#eff6ff",
  },
  {
    key: "totalCourses",
    label: "Khóa học",
    icon: <BookOutlined />,
    color: "#16a34a",
    bg: "#f0fdf4",
  },
  {
    key: "totalCommunityPrograms",
    label: "Chương trình cộng đồng",
    icon: <TeamOutlined />,
    color: "#d97706",
    bg: "#fffbeb",
  },
  {
    key: "totalConsultants",
    label: "Tư vấn viên",
    icon: <ReadOutlined />,
    color: "#db2777",
    bg: "#fdf2f8",
  },
  {
    key: "totalBlogs",
    label: "Blog",
    icon: <FileTextOutlined />,
    color: "#0891b2",
    bg: "#ecfeff",
  },
  {
    key: "totalSurveys",
    label: "Khảo sát",
    icon: <FormOutlined />,
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
];

const ADMIN_AUDITED_ROUTES = [
  { label: "Dashboard", path: ROUTER_URL.ADMIN.BASE },
  { label: "Thống kê", path: ROUTER_URL.ADMIN.ANALYTICS },
  { label: "QL người dùng", path: ROUTER_URL.ADMIN.MANAGER_USER },
  { label: "QL quản lý", path: ROUTER_URL.ADMIN.MANAGERS },
  { label: "Nhân viên & tư vấn", path: ROUTER_URL.ADMIN.STAFF_CONSULTANTS },
  { label: "QL khóa học", path: ROUTER_URL.ADMIN.MANAGER_COURSE },
  { label: "QL danh mục", path: ROUTER_URL.ADMIN.MANAGER_CATEGORY },
  { label: "QL blog", path: ROUTER_URL.ADMIN.MANAGER_BLOG },
  { label: "Cài đặt", path: ROUTER_URL.ADMIN.SETTINGS },
];

const Overview: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardOverallResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await DashboardService.getDashboardOverall({
          pageSize: 10,
          pageNumber: 1,
        });
        if (res.data?.success && res.data?.data) {
          setData(res.data.data as DashboardOverallResponse);
        } else {
          setData(null);
        }
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const totalItems = useMemo(() => {
    if (!data) return 0;
    return METRICS.reduce((sum, metric) => sum + (data[metric.key] || 0), 0);
  }, [data]);

  const distributionData = useMemo(() => {
    if (!data) return [] as { type: string; value: number }[];
    return METRICS.map((metric) => ({
      type: metric.label,
      value: data[metric.key] || 0,
    })).filter((item) => item.value > 0);
  }, [data]);

  const rankingData = useMemo(() => {
    if (!data) return [] as { category: string; count: number }[];
    return METRICS.map((metric) => ({
      category: metric.label,
      count: data[metric.key] || 0,
    }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[320px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[320px]">
        <Text type="danger">Không thể tải dữ liệu dashboard admin.</Text>
      </div>
    );
  }

  return (
    <Space direction="vertical" size={20} style={{ width: "100%" }}>
      <div>
        <Title level={2} style={{ marginBottom: 4 }}>
          Dashboard Quản Trị (SaaS)
        </Title>
        <Text type="secondary">
          Tổng hợp chỉ số vận hành theo thời gian thực từ dữ liệu hệ thống.
        </Text>
      </div>

      <Alert
        type="info"
        showIcon
        message={`Tổng tài nguyên đang theo dõi: ${totalItems.toLocaleString("vi-VN")}`}
      />

      <Row gutter={[16, 16]}>
        {METRICS.map((metric) => (
          <Col xs={24} sm={12} lg={8} xl={8} key={metric.key}>
            <Card
              style={{
                borderRadius: 14,
                background: metric.bg,
                border: `1px solid ${metric.color}22`,
              }}
            >
              <Statistic
                title={metric.label}
                value={data[metric.key] || 0}
                prefix={<span style={{ color: metric.color }}>{metric.icon}</span>}
                valueStyle={{ color: metric.color, fontWeight: 700 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={10}>
          <Card title="Cơ cấu tài nguyên hệ thống" style={{ borderRadius: 14 }}>
            <Pie
              data={distributionData}
              angleField="value"
              colorField="type"
              innerRadius={0.62}
              color={["#2563eb", "#16a34a", "#d97706", "#db2777", "#0891b2", "#7c3aed"]}
              label={{ text: "value", style: { fontWeight: 600 } }}
              legend={{ color: { position: "bottom", cols: 2 } }}
              height={320}
            />
          </Card>
        </Col>
        <Col xs={24} xl={14}>
          <Card title="Xếp hạng hạng mục theo số lượng" style={{ borderRadius: 14 }}>
            <Bar
              data={rankingData}
              yField="category"
              xField="count"
              color="#1d4ed8"
              label={{
                text: (d: { count: number }) => d.count.toLocaleString("vi-VN"),
                position: "right",
              }}
              axis={{
                x: {
                  labelFormatter: ",",
                },
              }}
              height={320}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Đường dẫn admin đã kiểm tra" style={{ borderRadius: 14 }}>
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
