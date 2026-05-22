# Ostro Frontend (ostro-fe)

🇬🇧 **English** | 🇻🇳 **Tiếng Việt**

## About / Giới thiệu

**[EN]** Ostro Frontend is the modern, responsive user interface for the Ostro application. Built with React 19, Vite, and Tailwind CSS v4, it provides a fast and seamless user experience, incorporating real-time messaging, Google OAuth authentication, and elegant UI components.
**[VN]** Ostro Frontend là giao diện người dùng hiện đại, có tính phản hồi cao dành cho ứng dụng Ostro. Được xây dựng bằng React 19, Vite và Tailwind CSS v4, dự án mang lại trải nghiệm người dùng nhanh chóng và mượt mà, tích hợp nhắn tin theo thời gian thực, xác thực Google OAuth và các thành phần giao diện bắt mắt.

## Tech Stack / Công nghệ sử dụng

- **Core:** React 19, TypeScript, Vite
- **Routing:** React Router v7
- **State Management:** Zustand
- **Styling & UI:** Tailwind CSS v4, Radix UI, Lucide React, Tailwind Animate
- **Forms & Validation:** React Hook Form, Zod
- **API & Real-time:** Axios, Socket.io-client
- **Authentication:** Google OAuth
- **Other Tools:** Husky, Lint-staged, ESLint, Prettier

## Project Structure / Cấu trúc dự án

```text
ostro-fe/
├── public/           # Static assets / Tài nguyên tĩnh
├── src/
│   ├── components/   # Reusable UI components / Các thành phần UI có thể tái sử dụng
│   ├── hooks/        # Custom React hooks / Các hook tùy chỉnh
│   ├── lib/          # Utility functions and configurations / Hàm tiện ích và cấu hình
│   ├── pages/        # Application pages/views / Các trang giao diện
│   ├── services/     # API integration & external services / Tích hợp API và dịch vụ bên ngoài
│   ├── stores/       # Zustand state management / Quản lý trạng thái Zustand
│   └── types/        # TypeScript type definitions / Định nghĩa kiểu TypeScript
```

## Getting Started / Hướng dẫn cài đặt

### Prerequisites / Yêu cầu hệ thống

- **Node.js**: v18+ (Recommended v20+)
- **Package Manager**: pnpm (Recommended) or npm/yarn

### Installation / Cài đặt

**[EN]** 1. Clone the repository and navigate to the `ostro-fe` directory.
**[VN]** 1. Clone kho lưu trữ và di chuyển đến thư mục `ostro-fe`.

```bash
cd ostro-fe
```

**[EN]** 2. Install dependencies.
**[VN]** 2. Cài đặt các thư viện phụ thuộc.

```bash
pnpm install
```

**[EN]** 3. Set up environment variables. Copy `.env.example` (if any) or create `.env.development`:
**[VN]** 3. Thiết lập biến môi trường. Copy file `.env.example` (nếu có) hoặc tạo file `.env.development`:

```bash
cp .env.development .env
```

_(Ensure you add your Google Client ID, API Base URL, etc. / Đảm bảo thêm Google Client ID, API Base URL, v.v. của bạn)_

**[EN]** 4. Start the development server.
**[VN]** 4. Khởi chạy server phát triển.

```bash
pnpm run dev
```

**[EN]** The application will run at `http://localhost:5173`.
**[VN]** Ứng dụng sẽ chạy tại `http://localhost:5173`.

## Scripts / Các lệnh có sẵn

- `pnpm dev`: Start the development server / Khởi chạy server phát triển.
- `pnpm build`: Build the app for production / Đóng gói ứng dụng cho môi trường production.
- `pnpm preview`: Preview the production build locally / Xem trước bản build production tại local.
- `pnpm lint`: Run ESLint to find and fix problems / Chạy ESLint để tìm và sửa lỗi code.

## Contributing / Đóng góp

**[EN]** Contributions are always welcome! Please create a feature branch and submit a Pull Request. Code must pass all ESLint and Prettier checks before merging.
**[VN]** Mọi đóng góp đều được hoan nghênh! Vui lòng tạo nhánh feature và gửi Pull Request. Code phải vượt qua các kiểm tra của ESLint và Prettier trước khi được merge.
