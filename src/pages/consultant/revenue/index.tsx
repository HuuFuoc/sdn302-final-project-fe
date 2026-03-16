import { useEffect, useMemo, useState } from "react";
import { Alert, Card, Col, Empty, Row, Select, Spin, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DollarCircleOutlined, ShoppingCartOutlined, BookOutlined, LineChartOutlined } from "@ant-design/icons";
import { ConsultantService } from "../../../services/consultant/consultant.service";
import { formatCurrency } from "../../../utils/helper";
import type {
  InstructorDashboardSummaryRange,
  InstructorDashboardSummaryResponseData,
  InstructorDashboardSummaryTopCourse,
  InstructorDashboardSummaryTrendItem,
} from "../../../types/consultant/instructorRevenue.res.type";

const { Title, Text } = Typography;

interface TopCourseUI {
  key: string;
  courseName: string;
  totalPaidOrders: number;
  grossRevenue: number;
  netRevenue: number;
}

interface TrendUI {
  key: string;
  date: string;
  totalPaidOrders: number;
  grossRevenue: number;
  netRevenue: number;
}

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

const ConsultantRevenuePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<InstructorDashboardSummaryRange>("30d");
  const [summary, setSummary] = useState<InstructorDashboardSummaryResponseData | null>(null);

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await ConsultantService.getInstructorDashboardSummary(range);
        setSummary(res.data?.data || null);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Không thể tải dữ liệu dashboard.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardSummary();
  }, [range]);

  const overview = summary?.overview;

  const topCoursesData: TopCourseUI[] = useMemo(
    () =>
      (summary?.topCourses || []).map((item: InstructorDashboardSummaryTopCourse, index) => ({
        key: `${item.courseId}-${index}`,
        courseName: item.courseName,
        totalPaidOrders: item.totalPaidOrders,
        grossRevenue: item.grossRevenue,
        netRevenue: item.netRevenue,
      })),
    [summary?.topCourses]
  );

  const trendData: TrendUI[] = useMemo(
    () =>
      (summary?.trend || []).map((item: InstructorDashboardSummaryTrendItem, index) => ({
        key: `${item.date}-${index}`,
        date: formatDate(item.date),
        totalPaidOrders: item.totalPaidOrders,
        grossRevenue: item.grossRevenue,
        netRevenue: item.netRevenue,
      })),
    [summary?.trend]
  );

  const topCoursesColumns: ColumnsType<TopCourseUI> = [
    { title: "Khóa học", dataIndex: "courseName", key: "courseName" },
    { title: "Đơn đã thanh toán", dataIndex: "totalPaidOrders", key: "totalPaidOrders", width: 170 },
    {
      title: "Doanh thu gộp",
      dataIndex: "grossRevenue",
      key: "grossRevenue",
      width: 180,
      render: (value: number) => <Text strong className="text-blue-600">{formatCurrency(value)}</Text>,
    },
    {
      title: "Doanh thu ròng",
      dataIndex: "netRevenue",
      key: "netRevenue",
      width: 180,
      render: (value: number) => <Text strong className="text-green-600">{formatCurrency(value)}</Text>,
    },
  ];

  const trendColumns: ColumnsType<TrendUI> = [
    { title: "Ngày", dataIndex: "date", key: "date", width: 140 },
    { title: "Đơn đã thanh toán", dataIndex: "totalPaidOrders", key: "totalPaidOrders", width: 170 },
    {
      title: "Doanh thu gộp",
      dataIndex: "grossRevenue",
      key: "grossRevenue",
      width: 180,
      render: (value: number) => <Text strong className="text-blue-600">{formatCurrency(value)}</Text>,
    },
    {
      title: "Doanh thu ròng",
      dataIndex: "netRevenue",
      key: "netRevenue",
      width: 180,
      render: (value: number) => <Text strong className="text-green-600">{formatCurrency(value)}</Text>,
    },
  ];

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
          <Title level={2} style={{ marginBottom: 8 }}>Tổng quan giảng viên</Title>
          <Text type="secondary">Dữ liệu lấy từ endpoint dashboard summary.</Text>
        </div>
        <div>
          <Text type="secondary" style={{ marginRight: 8 }}>Khoảng thời gian:</Text>
          <Select
            value={range}
            onChange={(value) => setRange(value)}
            options={RANGE_OPTIONS}
            style={{ width: 180 }}
          />
        </div>
      </div>

      {error && <Alert type="error" message={error} showIcon />}

      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card>
            <div className="flex items-center gap-3">
              <BookOutlined className="text-2xl text-amber-600" />
              <div>
                <Text type="secondary">Tổng khóa học</Text>
                <div className="text-xl font-bold">{overview?.totalCoursesCreated ?? 0}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <div className="flex items-center gap-3">
              <ShoppingCartOutlined className="text-2xl text-blue-600" />
              <div>
                <Text type="secondary">Đơn đã thanh toán</Text>
                <div className="text-xl font-bold">{overview?.totalPaidOrders ?? 0}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <div className="flex items-center gap-3">
              <DollarCircleOutlined className="text-2xl text-green-600" />
              <div>
                <Text type="secondary">Doanh thu gộp</Text>
                <div className="text-xl font-bold">{formatCurrency(overview?.grossRevenue ?? 0)}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <div className="flex items-center gap-3">
              <DollarCircleOutlined className="text-2xl text-purple-600" />
              <div>
                <Text type="secondary">Doanh thu ròng</Text>
                <div className="text-xl font-bold">{formatCurrency(overview?.netRevenue ?? 0)}</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="Top khóa học theo doanh thu gộp">
        <Table<TopCourseUI>
          rowKey="key"
          columns={topCoursesColumns}
          dataSource={topCoursesData}
          locale={{ emptyText: <Empty description="Chưa có dữ liệu top khóa học" /> }}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          scroll={{ x: 860 }}
        />
      </Card>

      <Card title={<span><LineChartOutlined className="mr-2" />Xu hướng doanh thu / đơn hàng</span>}>
        <Table<TrendUI>
          rowKey="key"
          columns={trendColumns}
          dataSource={trendData}
          locale={{ emptyText: <Empty description="Chưa có dữ liệu xu hướng trong khoảng thời gian đã chọn" /> }}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          scroll={{ x: 860 }}
        />
      </Card>
    </div>
  );
};

export default ConsultantRevenuePage;
