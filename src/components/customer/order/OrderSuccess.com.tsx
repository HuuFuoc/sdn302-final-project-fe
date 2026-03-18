import React, { useEffect, useState } from "react";
import { Table, message, Button, Modal, Spin, Tooltip, Tag } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { OrderService } from "../../../services/order/order.service";
import { CourseService } from "../../../services/course/course.service";
import type { OrderResponse } from "../../../types/order/Order.res.type";
import noImage from "../../../assets/images/no-image.svg";

const PAGE_SIZE = 8;

const OrderSuccessList: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);

  // View modal state
  const [viewModal, setViewModal] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(
    null
  );


  // Course details state
  const [courseDetails, setCourseDetails] = useState<Record<string, any>>({});



  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await OrderService.getMyOrders({
          pageNumber: current,
          pageSize: PAGE_SIZE,
        });

        let allOrders: OrderResponse[] = [];
        if (res.data) {
          const respData = res.data;
          const innerData = (res.data as any).data;
          
          if (Array.isArray(respData)) {
            allOrders = respData;
          } else if (Array.isArray(innerData)) {
            allOrders = innerData;
          } else if (innerData?.items && Array.isArray(innerData.items)) {
            allOrders = innerData.items;
          } else if (innerData?.data && Array.isArray(innerData.data)) {
            allOrders = innerData.data;
          }
        }

        console.log("Fetched Orders before filter:", allOrders);
        const successOrders = allOrders.filter(
          (order: any) => {
             const s = (order.orderStatus || order.status || "").toLowerCase();
             return s === "paid" || s === "success" || s === "completed" || s === "done";
          }
        );

        
        setOrders(successOrders);
        setTotal(successOrders.length);
      } catch (error) {
        console.error("Fetch orders error:", error);
        message.error("Không thể tải lịch sử đơn hàng!");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
    // eslint-disable-next-line
  }, [current]);

  // Xem chi tiết đơn hàng
  const handleView = async (orderId: string) => {
    setViewLoading(true);
    setViewModal(true);
    try {
      const res = await OrderService.getOrderById({ orderId });
      if (res.data?.success && res.data?.data) {
        setSelectedOrder(res.data.data);
      } else {
        setSelectedOrder(null);
        message.error("Không tìm thấy đơn hàng!");
      }
    } catch {
      setSelectedOrder(null);
      message.error("Không thể tải chi tiết đơn hàng!");
    } finally {
      setViewLoading(false);
    }
  };

  useEffect(() => {
    if (selectedOrder?.logs) {
      selectedOrder.logs.forEach((log: any) => {
        const cId = log.course_id;
        if (cId && !courseDetails[cId]) {
          CourseService.getCourseById({ id: cId })
            .then((res) => {
              const coursePayload = res.data?.data as any;
              const cData = coursePayload?.course || coursePayload;
              if (cData) {
                setCourseDetails((prev) => ({
                  ...prev,
                  [cId]: cData,
                }));
              }
            })
            .catch(() => {});
        }
      });
    }
    // eslint-disable-next-line
  }, [selectedOrder]);

  const columns = [
    // KHÔNG hiển thị orderId

    {
      title: "Mã đơn hàng",
      key: "orderId",
      render: (_: any, record: any) => (
        <span style={{ fontWeight: 500, color: "#1677ff" }}>
          {record.orderId || record._id || "Không có"}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: () => <Tag color="green">Đã mua</Tag>,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => (
        <div className="flex justify-end">
          {amount?.toLocaleString("vi-VN") + " đ"}
        </div>
      ),
    },
    {
      title: "Ngày mua",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (date: string) => (
        <div className="flex justify-end">
          {date ? new Date(date).toLocaleDateString("vi-VN") : ""}
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Tooltip title="Xem chi tiết">
          <Button
            icon={<EyeOutlined />}
            shape="circle"
            size="small"
            onClick={() => handleView(record.orderId || record._id)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <Table
        dataSource={orders}
        columns={columns}
        rowKey={(record: any) => record.orderId || record._id}
        loading={loading}
        pagination={{
          current,
          pageSize: PAGE_SIZE,
          total,
          onChange: setCurrent,
        }}
        bordered
        size="middle"
        scroll={{ x: 900 }}
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          padding: 0,
          minWidth: 900,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      />

      <Modal
        open={viewModal}
        title={
          <span style={{ fontSize: 22, fontWeight: 600 }}>
            Thông tin đơn hàng
          </span>
        }
        onCancel={() => setViewModal(false)}
        footer={[
          <Button key="close" onClick={() => setViewModal(false)} size="large">
            Đóng
          </Button>,
        ]}
        width={520}
        style={{ top: 40 }}
        bodyStyle={{
          padding: 32,
          background: "#fff",
          borderRadius: 12,
        }}
        centered
      >
        {viewLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 80,
            }}
          >
            <Spin />
          </div>
        ) : selectedOrder ? (
          (() => {
            const orderInfo = selectedOrder.order || selectedOrder;
            return (
              <div style={{ fontSize: 16 }}>
                <div style={{ marginBottom: 10 }}>
                  <b>Mã đơn hàng:</b>{" "}
                  <span style={{ color: "#1677ff", fontWeight: 500 }}>
                    {orderInfo.orderId || orderInfo._id}
                  </span>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <b>Ngày đặt:</b>{" "}
                  {orderInfo.orderDate
                    ? new Date(orderInfo.orderDate).toLocaleDateString("vi-VN")
                    : (orderInfo.created_at ? new Date(orderInfo.created_at).toLocaleDateString("vi-VN") : "")}
                </div>
                <div style={{ marginBottom: 10 }}>
                  <b>Khóa học đã mua:</b>
                  <ul style={{ margin: 0, paddingLeft: 0, marginTop: 10 }}>
                    {selectedOrder.logs?.map((log: any, index: number) => {
                      const cId = log.course_id;
                      const course = courseDetails[cId];
                      const detailMatch = selectedOrder.details?.[index];
                      const priceAmt = detailMatch ? detailMatch.amount : (course?.price || 0);
                      
                      return (
                        <li
                          key={cId + index}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 14,
                            marginBottom: 18,
                            background: "#f7f9fa",
                            borderRadius: 8,
                            padding: 12,
                            border: "1px solid #eee",
                            listStyle: "none",
                          }}
                        >
                          <img
                            src={course?.imageUrls?.[0] || course?.imageUrl || noImage}
                            alt={course?.name || "Khóa học"}
                            onError={(e) => {
                              const image = e.currentTarget as HTMLImageElement;
                              image.onerror = null;
                              image.src = noImage;
                            }}
                            style={{
                              width: 56,
                              height: 56,
                              objectFit: "cover",
                              borderRadius: 8,
                              border: "1px solid #eee",
                              background: "#fafafa",
                              flexShrink: 0,
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontWeight: 700,
                                fontSize: 17,
                                color: "#20558A",
                              }}
                            >
                              {course?.name || "Đang tải thông tin..."}
                            </div>
    
                            <div
                              style={{
                                fontSize: 14,
                                color: "#555",
                                margin: "4px 0",
                              }}
                            >
                              <b>Giá mua:</b>{" "}
                              <span style={{ color: "#888", fontSize: 13 }}>
                                {priceAmt?.toLocaleString("vi-VN")} đ
                              </span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <b>Tổng tiền:</b>{" "}
                  {orderInfo.totalAmount?.toLocaleString("vi-VN")} đ
                </div>
                <div>
                  <b>Thanh toán:</b>{" "}
                  <Tag
                    color={
                      (orderInfo.paymentStatus || orderInfo.status) === "paid" || 
                      orderInfo.paymentStatus === "Success" ? "green" : "red"
                    }
                  >
                    {(orderInfo.paymentStatus || orderInfo.status) === "paid" || 
                     orderInfo.paymentStatus === "Success"
                      ? "Thành công"
                      : orderInfo.paymentStatus || orderInfo.status}
                  </Tag>
                </div>
                {orderInfo.orderStatus === "Paid" || orderInfo.status === "paid" ? null : (
                  <div style={{ marginTop: 10 }}>
                    <b>Trạng thái:</b> <Tag color="red">Đã hủy</Tag>
                  </div>
                )}
              </div>
            );
          })()
        ) : (
          <div>Không tìm thấy dữ liệu đơn hàng.</div>
        )}
      </Modal>
    </>
  );
};

export default OrderSuccessList;
