export interface OrderResponse {
  orderId?: string;
  _id?: string;
  userId: string;
  userName?: string;
  totalAmount: number;
  orderDate?: string;
  paymentStatus?: string;
  paymentId?: string;
  orderStatus?: string;
  status?: string;
  orderDetails?: OrderDetail[];
  order?: any;
  details?: any[];
  logs?: any[];
}
export interface OrderDetail {
  orderDetailId: string;
  courseId: string;
  courseName: string;
  amount: number;
}
