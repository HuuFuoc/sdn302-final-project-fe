import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  DatePicker,
  Empty,
  Grid,
  Input,
  List,
  Modal,
  Pagination,
  Space,
  Spin,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import noImage from "../../../assets/images/no-image.svg";
import { CourseService } from "../../../services/course/course.service";
import { OrderService } from "../../../services/order/order.service";
import type { OrderDetail, OrderResponse } from "../../../types/order/Order.res.type";
import {
  extractOrdersFromMyOrdersResponse,
  formatCurrencyVND,
  formatOrderDate,
  getOrderDateISO,
  getOrderStatusConfig,
  getPrimaryOrderId,
  normalizeOrders,
  normalizeOrderStatus,
  type NormalizedOrder,
} from "./orderHistory.utils";

const PAGE_SIZE = 8;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

type CoursePreview = {
  name?: string;
  imageUrl?: string;
  price?: number;
};

type CourseLog = {
  course_id?: string;
  courseId?: string;
};

type OrderDetailItem = {
  amount?: number;
  courseName?: string;
  course_id?: string;
  courseId?: string;
};

type CourseResponsePayload = {
  course?: {
    name?: string;
    imageUrls?: string[];
    imageUrl?: string;
    price?: number;
  };
  name?: string;
  imageUrls?: string[];
  imageUrl?: string;
  price?: number;
};

type CourseRow = {
  key: string;
  name: string;
  amount: number;
  image?: string;
};

function extractDetailResponse(payload: unknown): OrderResponse | null {
  if (!payload || typeof payload !== "object") return null;
  const maybeRecord = payload as Record<string, unknown>;
  const data = maybeRecord.data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    return data as OrderResponse;
  }
  return maybeRecord as unknown as OrderResponse;
}

function safeCourseId(log: CourseLog): string | undefined {
  return log.course_id || log.courseId;
}

const OrderHistoryContent: React.FC = () => {
  const screens = Grid.useBreakpoint();

  const [orders, setOrders] = useState<NormalizedOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobilePage, setMobilePage] = useState(1);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [courseCache, setCourseCache] = useState<Record<string, CoursePreview>>({});

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await OrderService.getMyOrders({ pageNumber: 1, pageSize: 200 });
        const extracted = extractOrdersFromMyOrdersResponse(res.data);
        setOrders(normalizeOrders(extracted));
      } catch (error) {
        console.error("Fetch my orders error:", error);
        message.error("Không thể tải lịch sử đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const paidOrders = useMemo(
    () => orders.filter((item) => item.normalizedStatus === "paid"),
    [orders],
  );

  const searched = useMemo(() => {
    const search = searchValue.trim().toLowerCase();
    if (!search) return paidOrders;
    return paidOrders.filter((item) => {
      const idMatch = item.displayId.toLowerCase().includes(search);
      const dateMatch = formatOrderDate(item).toLowerCase().includes(search);
      return idMatch || dateMatch;
    });
  }, [searchValue, paidOrders]);

  const filteredOrders = useMemo(() => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) return searched;
    const [from, to] = dateRange;
    return searched.filter((order) => {
      const iso = getOrderDateISO(order);
      if (!iso) return false;
      const date = dayjs(iso);
      if (!date.isValid()) return false;
      return !date.isBefore(from.startOf("day")) && !date.isAfter(to.endOf("day"));
    });
  }, [dateRange, searched]);

  useEffect(() => {
    setCurrentPage(1);
    setMobilePage(1);
  }, [searchValue, dateRange]);

  const summary = useMemo(() => {
    return {
      paidCount: paidOrders.length,
      paidAmount: paidOrders.reduce((sum, item) => sum + item.totalAmount, 0),
    };
  }, [paidOrders]);

  const handleOpenDetail = async (order: NormalizedOrder) => {
    const orderId = getPrimaryOrderId(order.raw);
    if (!orderId) {
      message.error("Không tìm thấy mã đơn hàng.");
      return;
    }

    setViewModalOpen(true);
    setViewLoading(true);
    setSelectedOrder(null);

    try {
      const res = await OrderService.getOrderById({ orderId });
      const detail = extractDetailResponse(res.data);
      if (!detail) {
        message.error("Không tải được chi tiết đơn hàng.");
        return;
      }

      setSelectedOrder(detail);
      const logs = (detail.logs || []) as CourseLog[];
      const missingCourseIds = logs.reduce<string[]>((result, log) => {
        const id = safeCourseId(log);
        if (id && !courseCache[id]) result.push(id);
        return result;
      }, []);

      if (missingCourseIds.length > 0) {
        const uniqueIds = Array.from(new Set(missingCourseIds));
        const fetchedEntries = await Promise.all(
          uniqueIds.map(async (courseId) => {
            try {
              const courseRes = await CourseService.getCourseById({ id: courseId });
              const payload = courseRes.data?.data as CourseResponsePayload | undefined;
              const courseData = payload?.course || payload;
              if (!courseData) return null;

              return [
                courseId,
                {
                  name: courseData.name,
                  imageUrl: courseData.imageUrls?.[0] || courseData.imageUrl,
                  price: courseData.price,
                } as CoursePreview,
              ] as const;
            } catch {
              return null;
            }
          }),
        );

        setCourseCache((prev) => {
          const next = { ...prev };
          fetchedEntries.forEach((entry) => {
            if (entry) next[entry[0]] = entry[1];
          });
          return next;
        });
      }
    } catch (error) {
      console.error("Get order detail error:", error);
      message.error("Không thể tải chi tiết đơn hàng.");
    } finally {
      setViewLoading(false);
    }
  };

  const columns: ColumnsType<NormalizedOrder> = [
    {
      title: "Mã đơn hàng",
      dataIndex: "displayId",
      key: "displayId",
      render: (_, record) => (
        <Tooltip title={record.displayId}>
          <Text copyable={{ text: record.displayId }}>
            {record.displayId.length > 16
              ? `${record.displayId.slice(0, 8)}...${record.displayId.slice(-6)}`
              : record.displayId}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Ngày đặt",
      key: "orderDate",
      render: (_, record) => formatOrderDate(record),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "right",
      render: (amount: number) => <Text strong>{formatCurrencyVND(amount)}</Text>,
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => {
        const config = getOrderStatusConfig(record.normalizedStatus);
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: "Chi tiết",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button
          type="default"
          icon={<EyeOutlined />}
          onClick={() => handleOpenDetail(record)}
        >
          Xem
        </Button>
      ),
    },
  ];

  const details = selectedOrder?.details as OrderDetailItem[] | undefined;
  const logs = selectedOrder?.logs as CourseLog[] | undefined;
  const orderDetails = selectedOrder?.orderDetails as OrderDetail[] | undefined;
  const orderInfo = selectedOrder?.order || selectedOrder;
  const detailStatusConfig = getOrderStatusConfig(
    normalizeOrderStatus(orderInfo?.status || orderInfo?.orderStatus || orderInfo?.paymentStatus),
  );

  const courseRows = useMemo<CourseRow[]>(() => {
    if (orderDetails && orderDetails.length > 0) {
      return orderDetails.map((item, index) => ({
        key: `${item.courseId}-${index}`,
        name: item.courseName || `Khóa học #${index + 1}`,
        amount: item.amount || 0,
        image: undefined,
      }));
    }

    const sourceLogs = logs || [];
    return sourceLogs.map((log, index) => {
      const courseId = safeCourseId(log);
      const detailAmount = details?.[index]?.amount;
      const detailName = details?.[index]?.courseName;
      const cachedCourse = courseId ? courseCache[courseId] : undefined;

      return {
        key: `${courseId || "course"}-${index}`,
        name: detailName || cachedCourse?.name || `Khóa học #${index + 1}`,
        amount: detailAmount || cachedCourse?.price || 0,
        image: cachedCourse?.imageUrl || noImage,
      };
    });
  }, [courseCache, details, logs, orderDetails]);

  const pagedMobileData = useMemo(() => {
    const start = (mobilePage - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, mobilePage]);

  return (
    <div className="w-full space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-sky-50 via-white to-cyan-50 p-5 shadow-sm">
          <Title level={3} style={{ margin: 0 }}>
          Lịch sử đơn hàng
        </Title>
        <Text type="secondary">Theo dõi các đơn hàng đã mua và đã thanh toán.</Text>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <Statistic title="Đơn đã mua và thanh toán" value={summary.paidCount} valueStyle={{ color: "#15803d" }} />
        </Card>
        <Card>
          <Statistic
            title="Tổng chi tiêu"
            value={summary.paidAmount}
            formatter={(value) => formatCurrencyVND(Number(value || 0))}
          />
        </Card>
      </div>

      <Card>
        <Space wrap size="middle" className="w-full justify-between">
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Tìm theo mã đơn hoặc ngày đặt"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            style={{ width: screens.md ? 320 : "100%" }}
          />
          <RangePicker
            value={dateRange}
            onChange={(value) => setDateRange(value)}
            format="DD/MM/YYYY"
            allowClear
          />
        </Space>

        {screens.md ? (
          <Table
            rowKey="id"
            dataSource={filteredOrders}
            columns={columns}
            loading={loading}
            locale={{ emptyText: <Empty description="Không có đơn hàng đã thanh toán phù hợp" /> }}
            pagination={{
              current: currentPage,
              pageSize: PAGE_SIZE,
              total: filteredOrders.length,
              onChange: setCurrentPage,
              showSizeChanger: false,
            }}
          />
        ) : (
          <>
            <List
              loading={loading}
              locale={{ emptyText: <Empty description="Không có đơn hàng đã thanh toán phù hợp" /> }}
              dataSource={pagedMobileData}
              renderItem={(item) => {
                const statusConfig = getOrderStatusConfig(item.normalizedStatus);
                return (
                  <List.Item style={{ paddingInline: 0 }}>
                    <Card className="w-full rounded-xl">
                      <div className="flex items-center justify-between">
                        <Text strong>
                          {item.displayId.length > 16
                            ? `${item.displayId.slice(0, 8)}...${item.displayId.slice(-6)}`
                            : item.displayId}
                        </Text>
                        <Tag color={statusConfig.color}>{statusConfig.label}</Tag>
                      </div>
                      <div className="mt-2 text-sm text-slate-600">
                        <div>Ngày đặt: {formatOrderDate(item)}</div>
                        <div>Tổng tiền: {formatCurrencyVND(item.totalAmount)}</div>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <Button icon={<EyeOutlined />} onClick={() => handleOpenDetail(item)}>
                          Xem chi tiết
                        </Button>
                      </div>
                    </Card>
                  </List.Item>
                );
              }}
            />
            <div className="mt-4 flex justify-end">
              <Pagination
                current={mobilePage}
                pageSize={PAGE_SIZE}
                total={filteredOrders.length}
                onChange={setMobilePage}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </Card>

      <Modal
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalOpen(false)}>
            Đóng
          </Button>,
        ]}
        width={700}
        title="Chi tiết đơn hàng"
      >
        {viewLoading ? (
          <div className="flex min-h-40 items-center justify-center">
            <Spin />
          </div>
        ) : !selectedOrder ? (
          <Empty description="Không tìm thấy dữ liệu đơn hàng" />
        ) : (
          <div className="space-y-4">
            <Card size="small">
              <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                <div>
                  <Text type="secondary">Mã đơn hàng:</Text>{" "}
                  <Text strong>{orderInfo?.orderId || orderInfo?._id || "--"}</Text>
                </div>
                <div>
                  <Text type="secondary">Ngày đặt:</Text>{" "}
                  <Text>{orderInfo?.orderDate ? dayjs(orderInfo.orderDate).format("DD/MM/YYYY HH:mm") : "--"}</Text>
                </div>
                <div>
                  <Text type="secondary">Tổng tiền:</Text>{" "}
                  <Text strong>{formatCurrencyVND(Number(orderInfo?.totalAmount || 0))}</Text>
                </div>
                <div>
                  <Text type="secondary">Trạng thái:</Text>{" "}
                  <Tag color={detailStatusConfig.color}>{detailStatusConfig.label}</Tag>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <Title level={5} style={{ margin: 0 }}>
                Khóa học trong đơn
              </Title>
              {courseRows.length === 0 ? (
                <Empty description="Chưa có thông tin khóa học trong đơn này" />
              ) : (
                <List
                  dataSource={courseRows}
                  renderItem={(item) => (
                    <List.Item key={item.key}>
                      <div className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <img
                          src={item.image || noImage}
                          alt={item.name}
                          className="h-14 w-14 rounded-md border border-slate-200 object-cover"
                          onError={(event) => {
                            const image = event.currentTarget as HTMLImageElement;
                            image.src = noImage;
                          }}
                        />
                        <div className="flex-1">
                          <Text strong>{item.name}</Text>
                          <div className="text-sm text-slate-600">
                            Giá: {formatCurrencyVND(Number(item.amount || 0))}
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistoryContent;
