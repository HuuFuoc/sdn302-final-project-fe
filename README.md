### Trang công khai

- Trang chủ, Bài đăng, khóa học
- Giỏ hàng & thanh toán

### Theo vai trò

| Vai trò        | Tính năng chính                                                                           |
| -------------- | ----------------------------------------------------------------------------------------- |
| **Admin**      | Quản lý toàn hệ thống: người dùng, blog, khóa học, phiên học, bài học, danh mục, thống kê |
| **Staff**      | Tổng quan, quản lý bài đăng, quản lý giảng viên, duyệt yêu cầu giảng viên                 |
| **Customer**   | Khóa học của tôi, lịch sử đơn hàng, cài đặt                                     |
| **Instructor** | Khóa học, học viên, doanh thu, đánh giá                                                   |

---

## 🛠️ Công nghệ

### Frontend

| Công nghệ       | Phiên bản | Mô tả                   |
| --------------- | --------- | ----------------------- |
| React           | 19.x      | UI framework            |
| Vite            | 6.x       | Build tool & dev server |
| TypeScript      | 5.9       | Type safety             |
| Ant Design      | 5.x       | UI components           |
| React Router    | 7.x       | Định tuyến              |
| TanStack Query  | 5.x       | Data fetching & cache   |
| Zustand / Redux | -         | State management        |
| Tailwind CSS    | 3.x       | Styling                 |
| TinyMCE         | 7.x       | Rich text editor        |
| AWS S3          | -         | Lưu trữ file            |

### Backend

- **Node.js + Express.js** — REST API
- **TypeScript** — Kiểm tra kiểu dữ liệu tĩnh
- **MongoDB Atlas** — Cơ sở dữ liệu đám mây
- **JWT** — Xác thực (Access Token & Refresh Token)
- **Swagger (OpenAPI 3.0)** — Tài liệu API
- **Bcryptjs** — Mã hóa mật khẩu
- **Nodemailer** — Gửi email xác thực
- **Express Validator** — Kiểm tra dữ liệu đầu vào

---

## 📁 Cấu trúc dự án

```
src/
├── app/              # Cấu hình app, store, enums
├── components/       # Components theo module
│   ├── admin/        # Giao diện Admin
│   ├── client/       # Trang công khai (khóa học, blog,...)
│   ├── common/       # Components dùng chung
│   ├── customer/     # Giao diện Customer
│   ├── home/         # Trang chủ
├── contexts/         # React contexts (Auth, ...)
├── consts/           # Constants (API, router, ...)
├── hooks/            # Custom hooks
├── layouts/          # Layout theo vai trò
│   ├── admin/
│   ├── customer/
│   ├── main/         # Layout công khai
│   ├── manager/
│   └── staff/
├── pages/            # Trang theo route
├── providers/        # QueryProvider, ...
├── routes/           # Cấu hình route & bảo vệ
├── services/         # API services
├── types/            # TypeScript types
└── utils/            # Các tiện ích
```

---

## ⚙️ Cài đặt & Chạy

### Yêu cầu

- **Node.js** >= 18
- **pnpm** (khuyến nghị) hoặc npm/yarn

### Bước 1: Clone & cài đặt

```bash
git clone https://github.com/HuuFuoc/sdn302-final-project-fe.git
cd sdn302-final-project-fe
pnpm install
```

### Bước 2: Chạy development

```bash
pnpm dev
```

Ứng dụng chạy tại **http://localhost:3000** (mở trình duyệt tự động).

### Các lệnh khác

```bash
pnpm build    # Build production
pnpm preview  # Xem bản build
pnpm lint     # Kiểm tra ESLint
```

---

## 🔐 Biến môi trường

Tạo file `.env` hoặc `.env.local` tại thư mục gốc (nếu cần):

```env
VITE_API_BASE_URL=/api
# Thêm các biến khác theo yêu cầu dự án
```

API mặc định được proxy qua `/api` tới backend (xem `vite.config.ts`).

---

## 🚀 Build & Deploy

### Build production

```bash
pnpm build
```

Output nằm trong thư mục `dist/`.

### Preview bản build

```bash
pnpm preview
```

### Deploy

| Môi trường   | Công nghệ | Ghi chú                                        |
| ------------ | --------- | ---------------------------------------------- |
| **Frontend** | Vercel    | Deploy thư mục `dist` (React/Vite SPA)         |
| **Backend**  | Vercel    | Deploy Node.js + Express REST API (Serverless) |

Cả Frontend và Backend đều triển khai trên **Vercel**. CI/CD có thể thiết lập qua **GitHub Actions** (lint, build, deploy tự động khi push `main`).

---

## 🤝 Đóng góp

1. Fork repository và tạo branch `feat/<tên>` hoặc `fix/<tên>`
2. Commit theo chuẩn **Conventional Commits** (ví dụ: `feat: thêm tính năng X`)
3. Mở Pull Request kèm mô tả rõ ràng
4. Đảm bảo `pnpm lint` và `pnpm build` chạy thành công

---

## 📜 Giấy phép

Dự án phát hành theo giấy phép **MIT**. Xem file `LICENSE` để biết chi tiết.

---

## 📬 Liên hệ

- **Trần Hữu Phước** — huufuocdev@gmail.com
- Vui lòng tạo **GitHub Issue** cho lỗi hoặc đề xuất tính năng.

---

> _"Chung tay xây dựng tương lai tốt đẹp cho mầm non đất nước."_
