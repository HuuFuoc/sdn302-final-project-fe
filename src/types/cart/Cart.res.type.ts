import type { CartItemStatus } from "../../app/enums/cartItemStatus.enum";

export interface CartItem {
  cartId: string; // mapped from backend _id
  courseId: string; // backend course._id
  courseName: string;
  courseImageUrl: string;
  price: number;
  discount: number;
  status: CartItemStatus;
  createdAt: string;
}
