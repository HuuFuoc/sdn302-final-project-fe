import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  List,
  Progress,
  Row,
  Skeleton,
  Space,
  Statistic,
  Tag,
  Typography,
} from "antd";
import {
  BookOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  ProfileOutlined,
  RiseOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/Auth.context";
import { ROUTER_URL } from "../../../consts/router.path.const";
import { CourseService } from "../../../services/course/course.service";
import { OrderService } from "../../../services/order/order.service";
import type { Course } from "../../../types/course/Course.res.type";
import type { OrderResponse } from "../../../types/order/Order.res.type";
import {
  extractOrdersFromMyOrdersResponse,
  formatCurrencyVND,
  formatOrderDate,
  normalizeOrders,
} from "../../../components/customer/order/orderHistory.utils";

const { Title, Text } = Typography;

function getGreetingByTime() {
  const hour = dayjs().hour();
  if (hour < 12) return "Chào buổi sáng";
  if (hour < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

const CustomerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [suggestions, setSuggestions] = useState<Course[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const userId = userInfo?.id;
        const [ordersRes, courseRes, suggestionRes] = await Promise.allSettled([
          OrderService.getMyOrders({ pageNumber: 1, pageSize: 200 }),
          CourseService.getMyCourses(),
          CourseService.getAllCourses({
            pageNumber: 1,
            pageSize: 20,
            userId: userId || undefined,
          }),
        ]);

        if (ordersRes.status === "fulfilled") {
          setOrders(extractOrdersFromMyOrdersResponse(ordersRes.value.data));
        }

        if (courseRes.status === "fulfilled") {
          const raw = Array.isArray(courseRes.value.data?.data) ? courseRes.value.data.data : [];
          setMyCourses(raw);
        }

        if (suggestionRes.status === "fulfilled") {
          const raw = Array.isArray(suggestionRes.value.data?.data) ? suggestionRes.value.data.data : [];
          const candidate = raw
            .filter((course) => {
              const status = String(course.status || "").toLowerCase();
              const isPurchased = Boolean(course.isPurchased);
              return status === "published" && !isPurchased;
            })
            .slice(0, 4);
          setSuggestions(candidate);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [userInfo?.id]);

  const normalizedPaidOrders = useMemo(
    () => normalizeOrders(orders).filter((order) => order.normalizedStatus === "paid"),
    [orders],
  );

  const recentPaidOrders = useMemo(() => {
    return [...normalizedPaidOrders]
      .sort((a, b) => {
        const t1 = dayjs(a.orderDate || a.createdAt || 0).valueOf();
        const t2 = dayjs(b.orderDate || b.createdAt || 0).valueOf();
        return t2 - t1;
      })
      .slice(0, 5);
  }, [normalizedPaidOrders]);

  const totalSpent = useMemo(
    () => normalizedPaidOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0),
    [normalizedPaidOrders],
  );

  const recentLearningCourses = useMemo(() => myCourses.slice(0, 5), [myCourses]);
  const userName =
    userInfo?.fullName ||
    `${userInfo?.firstName || ""} ${userInfo?.lastName || ""}`.trim() ||
    "Bạn";

  return (
    <div className="space-y-6">
      <Card
        className="overflow-hidden rounded-2xl border-0"
        styles={{
          body: {
            background:
              "linear-gradient(120deg, rgba(14,116,144,0.12) 0%, rgba(255,255,255,0.94) 45%, rgba(2,132,199,0.08) 100%)",
            borderRadius: 16,
          },
        }}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar
              size={64}
              src={userInfo?.profilePicUrl}
              icon={<UserOutlined />}
              className="border border-sky-100 bg-sky-50"
            />
            <div>
              <Text type="secondary">{getGreetingByTime()}</Text>
              <Title level={3} style={{ margin: 0 }}>
                {userName}
              </Title>
              <Text type="secondary">Tổng quan hành trình học tập của bạn</Text>
            </div>
          </div>
          <Space wrap>
            <Button icon={<PlayCircleOutlined />} type="primary" onClick={() => navigate(ROUTER_URL.CUSTOMER.MY_COURSE)}>
              Tiếp tục học
            </Button>
            <Button icon={<FileTextOutlined />} onClick={() => navigate(ROUTER_URL.CUSTOMER.ORDER_HISTORY)}>
              Xem đơn hàng
            </Button>
            <Button onClick={() => navigate(ROUTER_URL.CUSTOMER.APPOINTMENTS)}>
              Đặt lịch tư vấn
            </Button>
          </Space>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <Card>
            <Statistic title="Khóa học đã mua" value={myCourses.length} prefix={<BookOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card>
            <Statistic title="Khóa học đang học" value={myCourses.length} prefix={<PlayCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card>
            <Statistic title="Khóa học đã hoàn thành" value={0} prefix={<ProfileOutlined />} />
            <Text type="secondary" className="text-xs">
              Chưa có dữ liệu tiến độ từ backend
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card>
            <Statistic
              title="Tổng chi tiêu"
              value={totalSpent}
              formatter={(value) => formatCurrencyVND(Number(value || 0))}
              prefix={<RiseOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={14}>
          <Card
            title="Tiến độ học tập"
            extra={
              <Button type="link" onClick={() => navigate(ROUTER_URL.CUSTOMER.MY_COURSE)}>
                Xem tất cả
              </Button>
            }
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : recentLearningCourses.length === 0 ? (
              <Empty description="Bạn chưa mua khóa học nào" image={Empty.PRESENTED_IMAGE_SIMPLE}>
                <Button type="primary" onClick={() => navigate(ROUTER_URL.CUSTOMER.COURSE)}>
                  Khám phá khóa học
                </Button>
              </Empty>
            ) : (
              <List
                dataSource={recentLearningCourses}
                renderItem={(course, index) => {
                  const percent = Math.max(8, Math.min(80, 80 - index * 12));
                  return (
                    <List.Item
                      actions={[
                        <Button
                          key="learn"
                          type="link"
                          onClick={() =>
                            navigate(ROUTER_URL.CUSTOMER.MY_COURSE_DETAIL.replace(":courseId", course.id))
                          }
                        >
                          Học tiếp
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar shape="square" size={52} src={course.imageUrls?.[0]} icon={<BookOutlined />} />}
                        title={<Text strong>{course.name}</Text>}
                        description={
                          <div className="mt-1">
                            <Progress percent={percent} size="small" strokeColor="#0ea5e9" />
                          </div>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} xl={10}>
          <Card
            title="Đơn hàng gần đây (đã thanh toán)"
            extra={
              <Button type="link" onClick={() => navigate(ROUTER_URL.CUSTOMER.ORDER_HISTORY)}>
                Xem tất cả
              </Button>
            }
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 3 }} />
            ) : recentPaidOrders.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có đơn đã thanh toán" />
            ) : (
              <List
                dataSource={recentPaidOrders}
                renderItem={(order) => (
                  <List.Item>
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <Text strong>
                          {order.displayId.slice(0, 8)}...{order.displayId.slice(-4)}
                        </Text>
                        <Tag color="green">Đã thanh toán</Tag>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-sm text-slate-500">
                        <span>{formatOrderDate(order)}</span>
                        <span>{formatCurrencyVND(order.totalAmount)}</span>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Card title="Khóa học gợi ý">
        {loading ? (
          <Skeleton active paragraph={{ rows: 3 }} />
        ) : suggestions.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có gợi ý phù hợp">
            <Button onClick={() => navigate(ROUTER_URL.CUSTOMER.COURSE)}>Xem khóa học mới</Button>
          </Empty>
        ) : (
          <List
            dataSource={suggestions}
            renderItem={(course) => (
              <List.Item
                actions={[
                  <Button
                    key="view"
                    type="link"
                    onClick={() => navigate(ROUTER_URL.CLIENT.COURSE_DETAIL.replace(":courseId", course.id))}
                  >
                    Xem
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar shape="square" size={48} src={course.imageUrls?.[0]} icon={<ShoppingCartOutlined />} />}
                  title={<Text strong>{course.name}</Text>}
                  description={
                    <Space>
                      <Tag color="geekblue">{course.riskLevel || "N/A"}</Tag>
                      <Text type="secondary">{formatCurrencyVND(course.price || 0)}</Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default CustomerDashboardPage;
