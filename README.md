# HAP MEDBUDDY - Admin Dashboard

## Thông tin dự án

HAP MEDBUDDY là ứng dụng hỗ trợ người bệnh cao huyết áp, đặc biệt người cao tuổi, trong việc nhắc nhở uống thuốc, theo dõi huyết áp và kết nối với người thân.

## Cách chạy dự án

### Yêu cầu hệ thống
- Node.js & npm - [Cài đặt với nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Các bước chạy

```sh
# Bước 1: Clone repository
git clone <YOUR_GIT_URL>

# Bước 2: Di chuyển vào thư mục dự án
cd EXE201-MEDBUDDY-ADMIN

# Bước 3: Cài đặt dependencies
npm install

# Bước 4: Chạy development server
npm run dev
```

### Các script có sẵn

- `npm run dev` - Chạy development server
- `npm run build` - Build dự án cho production
- `npm run preview` - Preview build production
- `npm run lint` - Chạy ESLint

## Công nghệ sử dụng

Dự án được xây dựng với:

- **Vite** - Build tool và development server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn-ui** - Component library
- **Tailwind CSS** - CSS framework
- **React Router** - Client-side routing
- **React Query** - Data fetching và caching
- **Axios** - HTTP client

## Cấu trúc dự án

```
src/
├── components/          # Reusable components
├── pages/              # Page components
├── services/           # API services
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # CSS styles
```

## Tính năng chính

- **Quản lý người dùng**: Xem, tạo, sửa, xóa người dùng
- **Quản lý gói dịch vụ**: Tạo và quản lý các gói dịch vụ
- **Theo dõi thanh toán**: Xem chi tiết thanh toán PayOS
- **Dashboard**: Thống kê và báo cáo tổng quan
- **Xác thực**: Hệ thống đăng nhập và phân quyền

## Deployment

Để deploy dự án:

1. Build dự án: `npm run build`
2. Upload thư mục `dist` lên hosting service
3. Cấu hình server để serve static files

## Liên hệ

Được phát triển bởi HAP MEDBUDDY Team.