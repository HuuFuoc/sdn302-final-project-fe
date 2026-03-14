import { useEffect, useMemo, useState } from "react";
import { Alert, Card, Col, Empty, Row, Spin, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DollarCircleOutlined, ShoppingCartOutlined, BookOutlined } from "@ant-design/icons";
import { ConsultantService } from "../../../services/consultant/consultant.service";
import { formatCurrency } from "../../../utils/helper";
import type {
  InstructorCourseSalesSummaryItem,
  InstructorCourseSalesSummaryOverview,
  InstructorOrderHistoryItem,
  InstructorOrderHistorySummary,
} from "../../../types/consultant/instructorRevenue.res.type";

const { Title, Text } = Typography;

interface OrderHistoryUI {
  key: string;
  orderId: string;
  courseName: string;
  buyerId: string;
  finalPrice: number;
  earnedAmount: number;
  orderDate: string;
}

interface CourseSalesUI {
  key: string;
  courseName: string;
  totalRevenue: number;
  totalOrders: number;
  totalEarned: number;
}

const parseArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

const firstString = (item: Record<string, unknown>, keys: string[], fallback = "-") => {
  for (const key of keys) {
    const value = item[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return fallback;
};

const firstNumber = (item: Record<string, unknown>, keys: string[], fallback = 0) => {
  for (const key of keys) {
    const value = item[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  return fallback;
};

const formatDateTime = (raw: string) => {
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("vi-VN");
};

const ConsultantRevenuePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderHistory, setOrderHistory] = useState<InstructorOrderHistoryItem[]>([]);
  const [courseSalesSummary, setCourseSalesSummary] = useState<InstructorCourseSalesSummaryItem[]>([]);
  const [orderSummary, setOrderSummary] = useState<InstructorOrderHistorySummary | null>(null);
  const [salesSummary, setSalesSummary] = useState<InstructorCourseSalesSummaryOverview | null>(null);

  useEffect(() => {
    const fetchRevenueData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [orderRes, summaryRes] = await Promise.all([
          ConsultantService.getInstructorOrderHistory(),
          ConsultantService.getInstructorCourseSalesSummary(),
        ]);

        const orderData = (orderRes.data?.data || {}) as Record<string, unknown>;
        const summaryData = (summaryRes.data?.data || {}) as Record<string, unknown>;

        setOrderHistory(parseArray<InstructorOrderHistoryItem>(orderData.items));
        setCourseSalesSummary(parseArray<InstructorCourseSalesSummaryItem>(summaryData.items));
        setOrderSummary((orderData.summary as InstructorOrderHistorySummary | undefined) || null);
        setSalesSummary((summaryData.summary as InstructorCourseSalesSummaryOverview | undefined) || null);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Không thể tải dữ liệu.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  const orderHistoryData: OrderHistoryUI[] = useMemo(
    () =>
      orderHistory.map((entry, index) => {
        const item = entry as Record<string, unknown>;
        const orderId = firstString(item, ["orderId", "id", "order_id"], "-");
        const courseName = firstString(item, ["courseName", "course_title"], "-");
        const buyerId = firstString(item, ["buyerId", "buyer_id"], "-");
        const orderDate = firstString(item, ["purchasedAt", "orderDate", "createdAt"], "");
        const finalPrice = firstNumber(item, ["finalPrice", "totalAmount", "amount"], 0);
        const earnedAmount = firstNumber(item, ["earnedAmount"], 0);

        return {
          key: `${orderId}-${index}`,
          orderId,
          courseName,
          buyerId,
          finalPrice,
          earnedAmount,
          orderDate: formatDateTime(orderDate),
        };
      }),
    [orderHistory]
  );

  const courseSalesData: CourseSalesUI[] = useMemo(
    () =>
      courseSalesSummary.map((entry, index) => {
        const item = entry as Record<string, unknown>;
        const courseName = firstString(item, ["courseName"], `Khóa học ${index + 1}`);
        const totalRevenue = firstNumber(item, ["totalRevenue", "revenue"], 0);
        const totalOrders = firstNumber(item, ["totalOrders", "orderCount"], 0);
        const totalEarned = firstNumber(item, ["totalEarned"], 0);

        return {
          key: `${courseName}-${index}`,
          courseName,
          totalRevenue,
          totalOrders,
          totalEarned,
        };
      }),
    [courseSalesSummary]
  );

  const dashboardStats = useMemo(() => {
    const totalRevenue =
      salesSummary?.totalRevenue ??
      orderSummary?.totalRevenue ??
      courseSalesData.reduce((sum, item) => sum + item.totalRevenue, 0);
    const totalOrders =
      salesSummary?.totalOrders ??
      orderSummary?.totalOrders ??
      courseSalesData.reduce((sum, item) => sum + item.totalOrders, 0);
    const totalCourses = salesSummary?.totalCoursesSold ?? courseSalesData.length;
    const totalEarned =
      salesSummary?.totalEarned ??
      orderSummary?.totalEarned ??
      courseSalesData.reduce((sum, item) => sum + item.totalEarned, 0);

    return { totalRevenue, totalOrders, totalCourses, totalEarned };
  }, [courseSalesData, orderSummary, salesSummary]);

  const orderColumns: ColumnsType<OrderHistoryUI> = [
    { title: "Mã đơn hàng", dataIndex: "orderId", key: "orderId", width: 170 },
    { title: "Khóa học", dataIndex: "courseName", key: "courseName" },
    { title: "Buyer ID", dataIndex: "buyerId", key: "buyerId", width: 180 },
    {
      title: "Giá trị đơn",
      dataIndex: "finalPrice",
      key: "finalPrice",
      width: 150,
      render: (value: number) => <Text strong className="text-green-600">{formatCurrency(value)}</Text>,
    },
    {
      title: "Thực nhận",
      dataIndex: "earnedAmount",
      key: "earnedAmount",
      width: 150,
      render: (value: number) => <Text strong className="text-blue-600">{formatCurrency(value)}</Text>,
    },
    { title: "Ngày đặt", dataIndex: "orderDate", key: "orderDate", width: 190 },
  ];

  const summaryColumns: ColumnsType<CourseSalesUI> = [
    { title: "Khóa học", dataIndex: "courseName", key: "courseName" },
    {
      title: "Doanh thu",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      width: 180,
      render: (value: number) => <Text strong className="text-blue-600">{formatCurrency(value)}</Text>,
    },
    { title: "Số đơn", dataIndex: "totalOrders", key: "totalOrders", width: 120 },
    {
      title: "Thực nhận",
      dataIndex: "totalEarned",
      key: "totalEarned",
      width: 160,
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
      <div>
        <Title level={2} style={{ marginBottom: 8 }}>Báo cáo doanh thu</Title>
        <Text type="secondary">Dữ liệu từ lịch sử đơn hàng và doanh thu theo từng khóa học.</Text>
      </div>

      {error && <Alert type="error" message={error} showIcon />}

      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card>
            <div className="flex items-center gap-3">
              <DollarCircleOutlined className="text-2xl text-green-600" />
              <div>
                <Text type="secondary">Tổng doanh thu</Text>
                <div className="text-xl font-bold">{formatCurrency(dashboardStats.totalRevenue)}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <div className="flex items-center gap-3">
              <ShoppingCartOutlined className="text-2xl text-blue-600" />
              <div>
                <Text type="secondary">Tổng đơn hàng</Text>
                <div className="text-xl font-bold">{dashboardStats.totalOrders}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <div className="flex items-center gap-3">
              <BookOutlined className="text-2xl text-amber-600" />
              <div>
                <Text type="secondary">Số khóa học có doanh thu</Text>
                <div className="text-xl font-bold">{dashboardStats.totalCourses}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <div className="flex items-center gap-3">
              <DollarCircleOutlined className="text-2xl text-purple-600" />
              <div>
                <Text type="secondary">Tổng thực nhận</Text>
                <div className="text-xl font-bold">{formatCurrency(dashboardStats.totalEarned)}</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="Lịch sử đơn hàng đã bán">
        <Table<OrderHistoryUI>
          rowKey="key"
          columns={orderColumns}
          dataSource={orderHistoryData}
          locale={{ emptyText: <Empty description="Chưa có lịch sử đơn hàng" /> }}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          scroll={{ x: 960 }}
        />
      </Card>

      <Card title="Tổng hợp doanh thu theo khóa học">
        <Table<CourseSalesUI>
          rowKey="key"
          columns={summaryColumns}
          dataSource={courseSalesData}
          locale={{ emptyText: <Empty description="Chưa có dữ liệu doanh thu khóa học" /> }}
          pagination={{ pageSize: 10, showSizeChanger: false }}
        />
      </Card>
    </div>
  );
};

export default ConsultantRevenuePage;
