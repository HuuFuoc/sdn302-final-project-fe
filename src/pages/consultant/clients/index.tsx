import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Card,
  Col,
  Empty,
  Input,
  Row,
  Select,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  BookOutlined,
  TeamOutlined,
  UserOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { ConsultantService } from "../../../services/consultant/consultant.service";
import type { InstructorOrderHistoryItem } from "../../../types/consultant/instructorRevenue.res.type";
import { formatCurrency } from "../../../utils/helper";

const { Title, Text } = Typography;

interface InstructorCustomerRow {
  key: string;
  customerId: string;
  customerName: string;
  courseId: string;
  courseName: string;
  orderId: string;
  purchasedAt: string;
  amount: number;
  status: string;
}

const pickDisplayName = (item: InstructorOrderHistoryItem) =>
  item.customerName ||
  item.studentName ||
  item.fullName ||
  item.userName ||
  "Khách hàng";

const pickCustomerId = (item: InstructorOrderHistoryItem) =>
  item.buyerId || item.userId || "";

const pickAmount = (item: InstructorOrderHistoryItem) =>
  item.finalPrice || item.earnedAmount || item.totalAmount || item.amount || item.price || 0;

const pickDate = (item: InstructorOrderHistoryItem) =>
  item.purchasedAt || item.orderDate || "";

const formatDate = (rawDate: string) => {
  if (!rawDate) return "--";
  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return rawDate;
  return date.toLocaleString("vi-VN");
};

const normalizeRows = (items: InstructorOrderHistoryItem[]): InstructorCustomerRow[] =>
  items
    .map((item, index) => {
      const orderId = item.orderId || `order-${index}`;
      const customerName = pickDisplayName(item);
      const customerId = pickCustomerId(item);
      const courseName = item.courseName || "Khóa học";
      const courseId = item.courseId || "";
      const purchasedAt = pickDate(item);
      const amount = pickAmount(item);
      const status = item.status || "unknown";

      return {
        key: `${orderId}-${courseId || index}`,
        customerId,
        customerName,
        courseId,
        courseName,
        orderId,
        purchasedAt,
        amount,
        status,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime()
    );

const getStatusColor = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized.includes("paid")) return "green";
  if (normalized.includes("success")) return "green";
  if (normalized.includes("pending")) return "gold";
  if (normalized.includes("cancel")) return "red";
  return "blue";
};

const ConsultantClientsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<InstructorCustomerRow[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  useEffect(() => {
    const fetchOrderHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await ConsultantService.getInstructorOrderHistory();
        const items = Array.isArray(res.data?.data?.items)
          ? res.data.data.items
          : [];
        setRows(normalizeRows(items));
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "Không thể tải danh sách khách hàng của giảng viên."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  const courseOptions = useMemo(() => {
    const uniqueCourseMap = new Map<string, { label: string; value: string }>();
    rows.forEach((row) => {
      const key = row.courseId || row.courseName;
      if (!uniqueCourseMap.has(key)) {
        uniqueCourseMap.set(key, {
          value: key,
          label: row.courseName,
        });
      }
    });
    return Array.from(uniqueCourseMap.values());
  }, [rows]);

  const filteredRows = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return rows.filter((row) => {
      const matchKeyword =
        !keyword ||
        row.customerName.toLowerCase().includes(keyword) ||
        row.courseName.toLowerCase().includes(keyword) ||
        row.orderId.toLowerCase().includes(keyword);

      const matchCourse =
        !selectedCourse ||
        (row.courseId || row.courseName) === selectedCourse;

      return matchKeyword && matchCourse;
    });
  }, [rows, searchKeyword, selectedCourse]);

  const uniqueCustomers = useMemo(
    () => new Set(filteredRows.map((row) => row.customerId || row.customerName)).size,
    [filteredRows]
  );

  const uniqueCourses = useMemo(
    () => new Set(filteredRows.map((row) => row.courseId || row.courseName)).size,
    [filteredRows]
  );

  const totalRevenue = useMemo(
    () => filteredRows.reduce((sum, row) => sum + row.amount, 0),
    [filteredRows]
  );

  const columns: ColumnsType<InstructorCustomerRow> = [
    {
      title: "Khách hàng",
      key: "customerName",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar icon={<UserOutlined />} />
          <div>
            <div className="font-semibold text-slate-800">{record.customerName}</div>
            <Text type="secondary" className="text-xs">
              {record.customerId || "Ẩn ID"}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Khóa học đăng ký",
      dataIndex: "courseName",
      key: "courseName",
    },
    {
      title: "Thời điểm đăng ký",
      dataIndex: "purchasedAt",
      key: "purchasedAt",
      render: (value: string) => formatDate(value),
      width: 180,
    },
    {
      title: "Giá trị đơn",
      dataIndex: "amount",
      key: "amount",
      render: (value: number) => <Text strong>{formatCurrency(value)}</Text>,
      width: 160,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status || "unknown"}</Tag>
      ),
      width: 140,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[280px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Title level={3} style={{ marginBottom: 8 }}>
          Khách hàng khóa học của bạn
        </Title>
        <Text type="secondary">
          Danh sách học viên đã đăng ký các khóa học do bạn phụ trách.
        </Text>
      </div>

      {error && <Alert type="error" message={error} showIcon />}

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Khách hàng"
              value={uniqueCustomers}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Khóa học có đăng ký"
              value={uniqueCourses}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Doanh thu từ danh sách lọc"
              value={formatCurrency(totalRevenue)}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <Input.Search
            allowClear
            placeholder="Tìm theo khách hàng, khóa học, mã đơn..."
            onSearch={(value) => setSearchKeyword(value)}
            onChange={(e) => setSearchKeyword(e.target.value)}
            value={searchKeyword}
            className="md:max-w-md"
          />
          <Select
            allowClear
            placeholder="Lọc theo khóa học"
            options={courseOptions}
            value={selectedCourse || undefined}
            onChange={(value) => setSelectedCourse(value || "")}
            className="md:min-w-[260px]"
          />
        </div>

        <Table<InstructorCustomerRow>
          rowKey="key"
          columns={columns}
          dataSource={filteredRows}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          locale={{
            emptyText: (
              <Empty description="Chưa có khách hàng đăng ký khóa học của bạn" />
            ),
          }}
          scroll={{ x: 880 }}
        />
      </Card>
    </div>
  );
};

export default ConsultantClientsPage;
