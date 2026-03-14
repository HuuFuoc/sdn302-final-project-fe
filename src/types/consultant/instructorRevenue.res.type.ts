export interface InstructorOrderHistoryItem {
  orderId?: string;
  orderDate?: string;
  purchasedAt?: string;
  status?: string;
  buyerId?: string;
  userId?: string;
  userName?: string;
  customerName?: string;
  studentName?: string;
  fullName?: string;
  totalAmount?: number;
  amount?: number;
  price?: number;
  finalPrice?: number;
  commissionRate?: number;
  earnedAmount?: number;
  courseId?: string;
  courseName?: string;
}

export interface InstructorCourseSalesSummaryItem {
  courseId?: string;
  courseName?: string;
  totalRevenue?: number;
  revenue?: number;
  totalOrders?: number;
  orderCount?: number;
  totalStudents?: number;
  studentCount?: number;
  totalEarned?: number;
}

export interface InstructorOrderHistorySummary {
  totalOrders?: number;
  totalRevenue?: number;
  totalEarned?: number;
}

export interface InstructorCourseSalesSummaryOverview {
  totalCoursesSold?: number;
  totalOrders?: number;
  totalRevenue?: number;
  totalEarned?: number;
}

export interface InstructorOrderHistoryResponseData {
  items?: InstructorOrderHistoryItem[];
  summary?: InstructorOrderHistorySummary;
  pagination?: {
    page?: number;
    limit?: number;
    totalItems?: number;
    totalPages?: number;
  };
}

export interface InstructorCourseSalesSummaryResponseData {
  items?: InstructorCourseSalesSummaryItem[];
  summary?: InstructorCourseSalesSummaryOverview;
}
