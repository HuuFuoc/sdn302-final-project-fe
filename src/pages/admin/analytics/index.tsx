import React, { useEffect, useMemo, useState } from "react";
import { Alert, Card, Col, Divider, Row, Space, Spin, Statistic, Typography } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined, WalletOutlined } from "@ant-design/icons";
import { Bar, Column } from "@ant-design/charts";
import { PaymentService } from "../../../services/payment/payment.service";
import type { AdminFinancialOverviewResponse } from "../../../types/payment/AdminFinancialOverview.res.type";

const { Title, Text } = Typography;

const VIETNAMESE_FONT_FAMILY =
  "\"Be Vietnam Pro\", \"Noto Sans\", \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif";

const toMoney = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

const toNumber = (value: number) => new Intl.NumberFormat("vi-VN").format(value);

const safeValue = (value: unknown) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  return num;
};

const AdminAnalyticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [overview, setOverview] = useState<AdminFinancialOverviewResponse>({
    totalRevenue: 0,
    totalProfit: 0,
    totalCompletedPayments: 0,
    totalPaidOrders: 0,
  });

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await PaymentService.getAdminFinancialOverview();
        const data = response?.data?.data;

        setOverview({
          totalRevenue: safeValue(data?.totalRevenue),
          totalProfit: safeValue(data?.totalProfit),
          totalCompletedPayments: safeValue(data?.totalCompletedPayments),
          totalPaidOrders: safeValue(data?.totalPaidOrders),
        });
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Không thể tải dữ liệu thống kê tài chính.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const revenue = overview.totalRevenue;
  const profit = overview.totalProfit;
  const completedPayments = overview.totalCompletedPayments;
  const paidOrders = overview.totalPaidOrders;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const reconciliationGap = Math.abs(completedPayments - paidOrders);

  const financeComparisonData = useMemo(
    () => [
      { metric: "Doanh thu", value: revenue },
      { metric: "Lợi nhuận", value: profit },
    ],
    [profit, revenue],
  );

  const reconciliationData = useMemo(
    () => [
      { category: "Thanh toán hoàn tất", count: completedPayments },
      { category: "Đơn hàng đã thanh toán", count: paidOrders },
    ],
    [completedPayments, paidOrders],
  );

  const paymentQualityData = useMemo(
    () => [
      {
        state: "Khớp dữ liệu",
        total: Math.max(0, Math.min(completedPayments, paidOrders)),
      },
      {
        state: "Chênh lệch",
        total: reconciliationGap,
      },
    ],
    [completedPayments, paidOrders, reconciliationGap],
  );

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: VIETNAMESE_FONT_FAMILY }}>
      <Space direction="vertical" size={18} style={{ width: "100%" }}>
        <div>
          <Title level={2} style={{ marginBottom: 4 }}>
            Thống kê và báo cáo tài chính
          </Title>
          <Text type="secondary">
            Dữ liệu lấy trực tiếp từ API admin financial overview của backend.
          </Text>
        </div>

        {error ? (
          <Alert
            showIcon
            type="error"
            message="Không tải được dữ liệu báo cáo"
            description={error}
          />
        ) : (
          <Alert
            showIcon
            type="info"
            message={`Đối soát: ${toNumber(completedPayments)} thanh toán hoàn tất và ${toNumber(paidOrders)} đơn hàng đã thanh toán`}
          />
        )}

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <Card style={{ borderRadius: 14 }}>
              <Statistic
                title="Tổng doanh thu"
                value={revenue}
                formatter={(value) => toMoney(safeValue(value))}
                prefix={<WalletOutlined style={{ color: "#1677ff" }} />}
                valueStyle={{ color: "#1677ff", fontWeight: 700 }}
              />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card style={{ borderRadius: 14 }}>
              <Statistic
                title="Tổng lợi nhuận"
                value={profit}
                formatter={(value) => toMoney(safeValue(value))}
                prefix={<ArrowUpOutlined style={{ color: "#16a34a" }} />}
                valueStyle={{ color: "#16a34a", fontWeight: 700 }}
              />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card style={{ borderRadius: 14 }}>
              <Statistic
                title="Biên lợi nhuận ước tính"
                value={margin}
                precision={2}
                suffix="%"
                prefix={
                  margin >= 0 ? (
                    <ArrowUpOutlined style={{ color: "#0891b2" }} />
                  ) : (
                    <ArrowDownOutlined style={{ color: "#dc2626" }} />
                  )
                }
                valueStyle={{
                  color: margin >= 0 ? "#0891b2" : "#dc2626",
                  fontWeight: 700,
                }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} xl={12}>
            <Card title="So sánh doanh thu và lợi nhuận" style={{ borderRadius: 14 }}>
              <Column
                data={financeComparisonData}
                xField="metric"
                yField="value"
                colorField="metric"
                label={{
                  text: (d: { value: number }) => toMoney(d.value),
                  style: { fontSize: 12, fontFamily: VIETNAMESE_FONT_FAMILY },
                }}
                height={300}
                axis={{
                  y: {
                    labelFormatter: (v: string) => toMoney(Number(v)),
                  },
                }}
                style={{ radiusTopLeft: 10, radiusTopRight: 10 }}
              />
            </Card>
          </Col>

          <Col xs={24} xl={12}>
            <Card title="Đối soát thanh toán và đơn hàng" style={{ borderRadius: 14 }}>
              <Bar
                data={reconciliationData}
                xField="category"
                yField="count"
                colorField="category"
                label={{
                  text: (d: { count: number }) => toNumber(d.count),
                  position: "right",
                  style: { fontFamily: VIETNAMESE_FONT_FAMILY },
                }}
                height={300}
              />
            </Card>
          </Col>
        </Row>

        <Card title="Báo cáo chất lượng đối soát" style={{ borderRadius: 14 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} xl={14}>
              <Bar
                data={paymentQualityData}
                xField="state"
                yField="total"
                colorField="state"
                color={({ state }: { state: string }) =>
                  state === "Khớp dữ liệu" ? "#22c55e" : "#f59e0b"
                }
                label={{
                  text: (d: { total: number }) => toNumber(d.total),
                  position: "right",
                  style: { fontFamily: VIETNAMESE_FONT_FAMILY },
                }}
                height={240}
              />
            </Col>
            <Col xs={24} xl={10}>
              <Space direction="vertical" size={10} style={{ width: "100%" }}>
                <Statistic
                  title="Số thanh toán hoàn tất"
                  value={completedPayments}
                  formatter={(value) => toNumber(safeValue(value))}
                />
                <Statistic
                  title="Số đơn hàng đã thanh toán"
                  value={paidOrders}
                  formatter={(value) => toNumber(safeValue(value))}
                />
                <Divider style={{ margin: "8px 0" }} />
                <Text>
                  Chênh lệch đối soát: <strong>{toNumber(reconciliationGap)}</strong>
                </Text>
              </Space>
            </Col>
          </Row>
        </Card>
      </Space>
    </div>
  );
};

export default AdminAnalyticsPage;

