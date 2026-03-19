# Nền tảng Phòng chống Tệ nạn Ma túy

Ứng dụng web toàn diện cho tổ chức tình nguyện **phòng chống tệ nạn ma túy** trong cộng đồng. Nền tảng cung cấp tài nguyên giáo dục, khảo sát đánh giá rủi ro, đào tạo trực tuyến và dịch vụ tư vấn trực tiếp trong một hệ thống thống nhất.

---

## 📖 Mục lục

- [Tầm nhìn](#-tầm-nhìn)
- [Tính năng](#-tính-năng)
- [Công nghệ](#-công-nghệ)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cài đặt & Chạy](#-cài-đặt--chạy)
- [Biến môi trường](#-biến-môi-trường)
- [Build & Deploy](#-build--deploy)
- [Đóng góp](#-đóng-góp)
- [Liên hệ](#-liên-hệ)

---

## 🎯 Tầm nhìn

> *"Trao quyền cho cộng đồng với kiến thức, công cụ đánh giá và hướng dẫn chuyên gia để **ngăn chặn lạm dụng ma túy trước khi nó bắt đầu**."*

Nền tảng phục vụ nhiều nhóm người dùng: học sinh, phụ huynh, giáo viên, tình nguyện viên y tế — với nội dung thiết kế riêng, đánh giá rủi ro tương tác (ASSIST, CRAFFT...), đặt lịch tư vấn và theo dõi tiến độ.

---

## 🧩 Tính năng

### Trang công khai
- Trang chủ, blog, khóa học, chương trình cộng đồng
- Đánh giá rủi ro (khảo sát)
- Đặt lịch tư vấn
- Giỏ hàng & thanh toán

### Theo vai trò

| Vai trò | Tính năng chính |
|---------|-----------------|
| **Admin** | Quản lý toàn hệ thống: người dùng, blog, khóa học, phiên học, bài học, danh mục, thống kê |
| **Manager** | Phân tích, quản lý nhân viên/giảng viên, chương trình, khảo sát, báo cáo |
| **Staff** | Tổng quan, quản lý bài đăng, quản lý giảng viên, duyệt yêu cầu giảng viên |
| **Consultant** | Tổng quan, khóa học, khách hàng, lịch hẹn tư vấn, cài đặt |
| **Customer** | Khóa học của tôi, lịch sử đơn hàng, lịch hẹn, cài đặt |
| **Instructor** | Khóa học, học viên, doanh thu, đánh giá |

---

## 🛠️ Công nghệ

### Frontend
| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| React | 19.x | UI framework |
| Vite | 6.x | Build tool & dev server |
| TypeScript | 5.9 | Type safety |
| Ant Design | 5.x | UI components |
| React Router | 7.x | Định tuyến |
| TanStack Query | 5.x | Data fetching & cache |
| Zustand / Redux | - | State management |
| Tailwind CSS | 3.x | Styling |
| TinyMCE | 7.x | Rich text editor |
| AWS S3 | - | Lưu trữ file |

### Backend (tham chiếu)
- **.NET 8 (C#)** — REST API
- **Entity Framework Core** — ORM
- **JWT** — Xác thực
- **SQL Server** — Database
- **PayOS** — Thanh toán (nếu có)

---

## 📁 Cấu trúc dự án

```
src/
├── app/              # Cấu hình app, store, enums
├── components/       # Components theo module
│   ├── admin/        # Giao diện Admin
│   ├── client/       # Trang công khai (khóa học, blog, tư vấn...)
│   ├── common/       # Components dùng chung
│   ├── consultant/   # Giao diện Consultant
│   ├── customer/     # Giao diện Customer
│   ├── home/         # Trang chủ
│   └── manager/      # Giao diện Manager
├── contexts/         # React contexts (Auth, ...)
├── consts/           # Constants (API, router, ...)
├── hooks/            # Custom hooks
├── layouts/          # Layout theo vai trò
│   ├── admin/
│   ├── consultant/
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
git clone https://github.com/server-craftsman/swp391-web-app-drug-use-prevention-support-system.git
cd web-app-drug-use-prevention-support-system
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

| Môi trường | Công nghệ | Ghi chú |
|------------|-----------|---------|
| Frontend | Vercel / Netlify / Static Host | Deploy thư mục `dist` |
| Backend | Azure App Service / Render | .NET 8 API |

CI/CD có thể thiết lập qua **GitHub Actions** (lint, build, deploy tự động khi push `main`).

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

- **Nguyễn Đan Huy** — huyit2003@gmail.com
- Vui lòng tạo **GitHub Issue** cho lỗi hoặc đề xuất tính năng.

---

> *"Chung tay xây dựng tương lai không ma túy."* 🌱
