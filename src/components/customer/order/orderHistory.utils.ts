import dayjs from "dayjs";
import type { OrderResponse } from "../../../types/order/Order.res.type";

export type NormalizedOrderStatus = "paid" | "pending" | "failed" | "unknown";

export interface NormalizedOrder {
  id: string;
  displayId: string;
  totalAmount: number;
  orderDate?: string;
  createdAt?: string;
  updatedAt?: string;
  normalizedStatus: NormalizedOrderStatus;
  rawStatus: string;
  raw: OrderResponse;
}

type OrderStatusConfig = {
  label: string;
  color: "green" | "gold" | "red" | "default";
};

const STATUS_CONFIG: Record<NormalizedOrderStatus, OrderStatusConfig> = {
  paid: { label: "Đã thanh toán", color: "green" },
  pending: { label: "Chờ thanh toán", color: "gold" },
  failed: { label: "Đã hủy/Thất bại", color: "red" },
  unknown: { label: "Không xác định", color: "default" },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function getPrimaryOrderId(order: OrderResponse): string | undefined {
  return order.orderId || order._id;
}

export function normalizeOrderStatus(value: string | undefined): NormalizedOrderStatus {
  const status = (value || "").trim().toLowerCase();
  if (["paid", "success", "completed", "done"].includes(status)) return "paid";
  if (["pending", "processing", "awaiting_payment"].includes(status)) return "pending";
  if (["failed", "fail", "canceled", "cancelled", "voided"].includes(status)) return "failed";
  return "unknown";
}

export function getOrderStatusConfig(status: NormalizedOrderStatus): OrderStatusConfig {
  return STATUS_CONFIG[status];
}

export function extractOrdersFromMyOrdersResponse(payload: unknown): OrderResponse[] {
  if (Array.isArray(payload)) return payload as OrderResponse[];
  if (!isRecord(payload)) return [];

  const directData = payload.data;
  if (Array.isArray(directData)) return directData as OrderResponse[];

  if (isRecord(directData)) {
    const nestedData = directData.data;
    if (Array.isArray(nestedData)) return nestedData as OrderResponse[];

    const items = directData.items;
    if (Array.isArray(items)) return items as OrderResponse[];
  }

  return [];
}

export function normalizeOrders(rawOrders: OrderResponse[]): NormalizedOrder[] {
  return rawOrders
    .map((order) => {
      const id = getPrimaryOrderId(order);
      if (!id) return null;

      const rawStatus = order.status || order.orderStatus || order.paymentStatus || "";
      const normalizedStatus = normalizeOrderStatus(rawStatus);

      return {
        id,
        displayId: id,
        totalAmount: Number(order.totalAmount || 0),
        orderDate: order.orderDate,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        normalizedStatus,
        rawStatus,
        raw: order,
      } as NormalizedOrder;
    })
    .filter((order): order is NormalizedOrder => Boolean(order));
}

export function getOrderDateISO(order: NormalizedOrder): string | undefined {
  return order.orderDate || order.createdAt || order.updatedAt;
}

export function formatOrderDate(order: NormalizedOrder): string {
  const dateISO = getOrderDateISO(order);
  if (!dateISO) return "--";
  const parsed = dayjs(dateISO);
  return parsed.isValid() ? parsed.format("DD/MM/YYYY HH:mm") : "--";
}

export function formatCurrencyVND(amount: number): string {
  return `${amount.toLocaleString("vi-VN")} đ`;
}
