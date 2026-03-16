import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Card,
  Col,
  Empty,
  Row,
  Select,
  Spin,
  Statistic,
  Typography,
} from "antd";
import {
  AreaChartOutlined,
  BookOutlined,
  DollarCircleOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Column, Line, Pie } from "@ant-design/charts";
import { ConsultantService } from "../../../services/consultant/consultant.service";
import { formatCurrency } from "../../../utils/helper";
import type {
  InstructorDashboardSummaryRange,
  InstructorDashboardSummaryResponseData,
  InstructorOrderHistoryItem,
} from "../../../types/consultant/instructorRevenue.res.type";

const { Title, Text } = Typography;

const RANGE_OPTIONS: { label: string; value: InstructorDashboardSummaryRange }[] = [
  { label: "7 ngày", value: "7d" },
  { label: "30 ngày", value: "30d" },
  { label: "90 ngày", value: "90d" },
  { label: "Toàn thời gian", value: "all" },
];

const formatDate = (raw: string) => {
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleDateString("vi-VN");
};

const getCustomerIdentity = (item: InstructorOrderHistoryItem) =>
  (
    item.buyerId ||
    item.userId ||
    item.customerName ||
    item.studentName ||
    item.fullName ||
    item.userName ||
    ""
  ).toString();

const getItemDate = (item: InstructorOrderHistoryItem) => {
  const raw = item.purchasedAt || item.orderDate;
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
};

const isWithinRange = (
  date: Date | null,
  range: InstructorDashboardSummaryRange
) => {
  if (range === "all") return true;
  if (!date) return false;

  const now = new Date();
  const cutoff = new Date(now);
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  cutoff.setDate(cutoff.getDate() - days);
  return date >= cutoff;
};

const InstructorOverviewPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<InstructorDashboardSummaryRange>("30d");
  const [summary, setSummary] = useState<InstructorDashboardSummaryResponseData | null>(null);
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const [summaryRes, orderHistoryRes] = await Promise.all([
          ConsultantService.getInstructorDashboardSummary(range),
          ConsultantService.getInstructorOrderHistory(),
        ]);

        setSummary(summaryRes.data?.data || null);

        const items = (orderHistoryRes.data?.data?.items || []).filter((item) =>
          isWithinRange(getItemDate(item), range)
        );
        const uniqueCustomers = new Set(
          items
            .map(getCustomerIdentity)
            .map((id) => id.trim())
            .filter(Boolean)
        );
        setCustomerCount(uniqueCustomers.size);
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "Không thể tải dữ liệu tổng quan giảng viên."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [range]);

  const overview = summary?.overview;

  const trendChartData = useMemo(
    () =>
      (summary?.trend || []).flatMap((item) => [
        {
          date: formatDate(item.date),
          value: item.grossRevenue || 0,
          metric: "Doanh thu gộp",
        },
        {
          date: formatDate(item.date),
          value: item.netRevenue || 0,
          metric: "Doanh thu ròng",
        },
      ]),
    [summary?.trend]
  );

  const paidOrderTrendData = useMemo(
    () =>
      (summary?.trend || []).map((item) => ({
        date: formatDate(item.date),
        orders: item.totalPaidOrders || 0,
      })),
    [summary?.trend]
  );

  const topCoursesChartData = useMemo(
    () =>
      (summary?.topCourses || []).map((item) => ({
        courseName: item.courseName || "Khóa học",
        revenue: item.grossRevenue || 0,
      })),
    [summary?.topCourses]
  );

  const courseStatusPieData = useMemo(
    () =>
      [
        {
          type: "Published",
          value: overview?.totalPublishedCourses || 0,
        },
        {
          type: "Draft",
          value: overview?.totalDraftCourses || 0,
        },
        {
          type: "Archived",
          value: overview?.totalArchivedCourses || 0,
        },
      ].filter((item) => item.value > 0),
    [overview]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Title level={2} style={{ marginBottom: 8 }}>
            Dashboard giảng viên
          </Title>
          <Text type="secondary">
            Tổng quan khóa học, đơn hàng, khách hàng và doanh thu theo khoảng thời gian đã chọn.
          </Text>
        </div>
        <div>
          <Text type="secondary" style={{ marginRight: 8 }}>
            Khoảng thời gian:
          </Text>
          <Select
            value={range}
            onChange={(value) => setRange(value)}
            options={RANGE_OPTIONS}
            style={{ width: 190 }}
          />
        </div>
      </div>

      {error && <Alert type="error" message={error} showIcon />}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Tổng khóa học"
              value={overview?.totalCoursesCreated || 0}
              prefix={<BookOutlined />}
              valueStyle={{ color: "#7c3aed" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Đơn đã thanh toán"
              value={overview?.totalPaidOrders || 0}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: "#ea580c" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Khách hàng"
              value={customerCount}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#0d9488" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={12}>
          <Card>
            <Statistic
              title="Doanh thu gộp"
              value={formatCurrency(overview?.grossRevenue || 0)}
              prefix={<DollarCircleOutlined />}
              valueStyle={{ color: "#16a34a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={12}>
          <Card>
            <Statistic
              title="Doanh thu ròng"
              value={formatCurrency(overview?.netRevenue || 0)}
              prefix={<AreaChartOutlined />}
              valueStyle={{ color: "#db2777" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Card title="Xu hướng doanh thu">
            {trendChartData.length === 0 ? (
              <Empty description="Chưa có dữ liệu xu hướng doanh thu" />
            ) : (
              <Line
                data={trendChartData}
                xField="date"
                yField="value"
                seriesField="metric"
                color={({ metric }: { metric: string }) =>
                  metric === "Doanh thu gộp" ? "#f97316" : "#8b5cf6"
                }
                point={{ size: 3 }}
                smooth
                height={320}
                legend={{ position: "top" }}
                yAxis={{
                  label: {
                    formatter: (v: string) => Number(v).toLocaleString("vi-VN"),
                  },
                }}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card title="Trạng thái khóa học">
            {courseStatusPieData.length === 0 ? (
              <Empty description="Chưa có dữ liệu trạng thái khóa học" />
            ) : (
              <Pie
                data={courseStatusPieData}
                angleField="value"
                colorField="type"
                color={["#22c55e", "#f59e0b", "#ef4444"]}
                height={320}
                label={{ text: "value", style: { fontWeight: "bold" } }}
                legend={{ color: { position: "right" } }}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Card title="Top khóa học theo doanh thu gộp">
            {topCoursesChartData.length === 0 ? (
              <Empty description="Chưa có dữ liệu top khóa học" />
            ) : (
              <Column
                data={topCoursesChartData}
                xField="courseName"
                yField="revenue"
                color="#f97316"
                label={{
                  text: (d: { revenue: number }) => d.revenue.toLocaleString("vi-VN"),
                  position: "top",
                }}
                axis={{
                  y: {
                    labelFormatter: ",~s",
                  },
                }}
                height={320}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <Card title="Xu hướng đơn thanh toán">
            {paidOrderTrendData.length === 0 ? (
              <Empty description="Chưa có dữ liệu đơn hàng" />
            ) : (
              <Column
                data={paidOrderTrendData}
                xField="date"
                yField="orders"
                color="#0d9488"
                label={{
                  text: (d: { orders: number }) => `${d.orders}`,
                  position: "top",
                }}
                height={320}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InstructorOverviewPage;
