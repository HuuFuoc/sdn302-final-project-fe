export interface OrderResponse {
  orderId?: string;
  _id?: string;
  cart_id?: string;
  userId: string;
  userName?: string;
  totalAmount: number;
  orderDate?: string;
  paymentStatus?: string;
  paymentId?: string;
  orderStatus?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
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
