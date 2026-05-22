<div align="center">

<img src="./public/logo.svg" alt="Ostro Logo" width="120" />

# OSTRO FRONTEND

### Modern • Fast • Scalable • Real-time

<p align="center">
  A sleek and high-performance frontend architecture built with  web technologies.
</p>

<br/>

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Zustand-State%20Management-000000?style=for-the-badge" />
<img src="https://img.shields.io/badge/Socket.io-RealTime-black?style=for-the-badge&logo=socketdotio" />
<img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" />

<br/>
<br/>

<p align="center">
  <a href="#-english-documentation">🇺🇸 English</a>
  &nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="#-tài-liệu-tiếng-việt">🇻🇳 Tiếng Việt</a>
</p>

</div>

---

# 🇺🇸 English Documentation

## 📖 Introduction

**Ostro Frontend** is a modern client-side application engineered for performance, scalability, and exceptional user experience.

Built with cutting-edge technologies including **React 19**, **Vite**, and **Tailwind CSS v4**, the project delivers a responsive and maintainable architecture suitable for both rapid development and production-scale deployment.

---

## ✨ Core Features

<table>
<tr>
<td width="50%">

### ⚡ Ultra Fast Performance

- Lightning-fast Vite dev server
- Optimized production builds
- Instant Hot Module Replacement

</td>
<td width="50%">

### 💬 Real-time Communication

- Live updates with Socket.io
- Seamless interactive experiences
- Event-driven architecture

</td>
</tr>

<tr>
<td width="50%">

### 🔐 Authentication System

- Google OAuth 2.0 integration
- Secure authentication flow
- Persistent session handling

</td>
<td width="50%">

### 🧩 Modern UI Architecture

- Accessible UI components
- Radix UI primitives
- Clean and reusable design system

</td>
</tr>

<tr>
<td width="50%">

### 🗂️ Scalable State Management

- Lightweight Zustand stores
- Predictable state flow
- Minimal boilerplate

</td>
<td width="50%">

### 📱 Responsive Experience

- Mobile-first approach
- Adaptive layouts
- Smooth user interactions

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Layer                  | Technologies                              |
| ---------------------- | ----------------------------------------- |
| **Frontend Core**      | React 19 • TypeScript • Vite              |
| **Routing**            | React Router v7                           |
| **State Management**   | Zustand                                   |
| **UI & Styling**       | Tailwind CSS v4 • Radix UI • Lucide React |
| **Forms & Validation** | React Hook Form • Zod                     |
| **Networking**         | Axios • Socket.io-client                  |
| **Authentication**     | Google OAuth 2.0                          |
| **Developer Tools**    | ESLint • Prettier • Husky • Lint-staged   |

</div>

---

## 📂 Project Structure

```bash
ostro-fe/
│
├── public/                     # Static assets
│   ├── icons/
│   ├── images/
│   └── fonts/
│
├── src/
│   ├── assets/                 # Application assets
│   ├── components/             # Shared reusable components
│   │   ├── ui/
│   │   ├── common/
│   │   └── layouts/
│   │
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities & configurations
│   ├── pages/                  # Route-level pages
│   ├── routes/                 # Route definitions
│   ├── services/               # API & socket services
│   ├── stores/                 # Zustand stores
│   ├── types/                  # Shared TypeScript types
│   ├── constants/              # Application constants
│   └── styles/                 # Global styles
│
├── .env.development
├── .eslintrc.js
├── .prettierrc
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

# 🚀 Getting Started

## 📋 Prerequisites

Ensure the following tools are installed before starting:

| Tool    | Recommended Version |
| ------- | ------------------- |
| Node.js | v20+                |
| pnpm    | Latest              |
| Git     | Latest              |

---

## ⚙️ Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-org/ostro-fe.git
cd ostro-fe
```

---

### 2️⃣ Install Dependencies

```bash
pnpm install
```

---

### 3️⃣ Configure Environment Variables

Create a local environment file:

```bash
cp .env.development .env
```

Update the following variables:

```env
# API
VITE_API_BASE_URL=http://localhost:5000/api

# WebSocket
VITE_SOCKET_URL=http://localhost:5000

# Authentication
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

> ⚠️ Never commit `.env` files to source control.

---

### 4️⃣ Run Development Server

```bash
pnpm dev
```

Application will run at:

```txt
http://localhost:5173
```

---

## 📜 Available Scripts

| Command        | Description               |
| -------------- | ------------------------- |
| `pnpm dev`     | Start development server  |
| `pnpm build`   | Build production bundle   |
| `pnpm preview` | Preview production build  |
| `pnpm lint`    | Run ESLint                |
| `pnpm format`  | Format code with Prettier |

---

## 🔌 Main Integrations

| Service       | Purpose                 | Environment Variable    |
| ------------- | ----------------------- | ----------------------- |
| Ostro Backend | REST API & WebSocket    | `VITE_API_BASE_URL`     |
| Socket.io     | Real-time communication | `VITE_SOCKET_URL`       |
| Google OAuth  | Authentication          | `VITE_GOOGLE_CLIENT_ID` |

---

# 🧪 Development Workflow

## 🧹 Code Quality

The project enforces strict code quality standards using:

- ESLint
- Prettier
- Husky
- Lint-staged
- TypeScript strict mode

---

## 🌿 Git Workflow

```bash
feature/your-feature
fix/your-bug
refactor/your-module
```

---

## 🤝 Contributing

Contributions are welcome.

### Development Process

1. Fork the repository
2. Create a feature branch
3. Write clean and typed code
4. Run lint checks
5. Submit a Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

See the `LICENSE` file for more information.

---

<div align="center">

### ⭐ Built with passion using web technologies

</div>

---

<br/>
<br/>

# 🇻🇳 Tài liệu Tiếng Việt

## 📖 Giới thiệu

**Ostro Frontend** là ứng dụng giao diện phía client được xây dựng với mục tiêu tối ưu hiệu năng, khả năng mở rộng và trải nghiệm người dùng.

Dự án sử dụng các công nghệ hiện đại như **React 19**, **Vite** và **Tailwind CSS v4** nhằm mang lại kiến trúc frontend mạnh mẽ, dễ bảo trì và phù hợp cho cả phát triển nhanh lẫn triển khai production quy mô lớn.

---

## ✨ Tính năng nổi bật

<table>
<tr>
<td width="50%">

### ⚡ Hiệu năng cực nhanh

- Vite dev server siêu tốc
- Build production tối ưu
- Hỗ trợ Hot Module Replacement

</td>
<td width="50%">

### 💬 Giao tiếp thời gian thực

- Cập nhật realtime bằng Socket.io
- Trải nghiệm tương tác mượt mà
- Kiến trúc hướng sự kiện

</td>
</tr>

<tr>
<td width="50%">

### 🔐 Hệ thống xác thực

- Tích hợp Google OAuth 2.0
- Luồng đăng nhập an toàn
- Quản lý phiên đăng nhập ổn định

</td>
<td width="50%">

### 🧩 Kiến trúc UI hiện đại

- Component dễ tái sử dụng
- Xây dựng trên Radix UI
- Design system sạch và đồng nhất

</td>
</tr>

<tr>
<td width="50%">

### 🗂️ Quản lý state mở rộng tốt

- Zustand nhẹ và tối giản
- Luồng state rõ ràng
- Giảm boilerplate

</td>
<td width="50%">

### 📱 Responsive toàn diện

- Thiết kế mobile-first
- Giao diện thích ứng
- Hiệu ứng và thao tác mượt mà

</td>
</tr>
</table>

---

## 🛠️ Công nghệ sử dụng

<div align="center">

| Thành phần             | Công nghệ                                 |
| ---------------------- | ----------------------------------------- |
| **Frontend Core**      | React 19 • TypeScript • Vite              |
| **Routing**            | React Router v7                           |
| **Quản lý State**      | Zustand                                   |
| **UI & Styling**       | Tailwind CSS v4 • Radix UI • Lucide React |
| **Form & Validation**  | React Hook Form • Zod                     |
| **Networking**         | Axios • Socket.io-client                  |
| **Xác thực**           | Google OAuth 2.0                          |
| **Công cụ phát triển** | ESLint • Prettier • Husky • Lint-staged   |

</div>

---

## 📂 Cấu trúc dự án

```bash
ostro-fe/
│
├── public/                     # Tài nguyên tĩnh
│   ├── icons/
│   ├── images/
│   └── fonts/
│
├── src/
│   ├── assets/                 # Tài nguyên ứng dụng
│   ├── components/             # Component tái sử dụng
│   │   ├── ui/
│   │   ├── common/
│   │   └── layouts/
│   │
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility & cấu hình
│   ├── pages/                  # Các trang ứng dụng
│   ├── routes/                 # Định nghĩa route
│   ├── services/               # API & socket service
│   ├── stores/                 # Zustand stores
│   ├── types/                  # Kiểu TypeScript dùng chung
│   ├── constants/              # Hằng số hệ thống
│   └── styles/                 # Global styles
│
├── .env.development
├── .eslintrc.js
├── .prettierrc
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

# 🚀 Bắt đầu sử dụng

## 📋 Yêu cầu hệ thống

Đảm bảo đã cài đặt các công cụ sau:

| Công cụ | Phiên bản khuyến nghị |
| ------- | --------------------- |
| Node.js | v20+                  |
| pnpm    | Mới nhất              |
| Git     | Mới nhất              |

---

## ⚙️ Cài đặt

### 1️⃣ Clone repository

```bash
git clone https://github.com/your-org/ostro-fe.git
cd ostro-fe
```

---

### 2️⃣ Cài đặt dependencies

```bash
pnpm install
```

---

### 3️⃣ Cấu hình biến môi trường

Tạo file môi trường local:

```bash
cp .env.development .env
```

Cập nhật các biến sau:

```env
# API
VITE_API_BASE_URL=http://localhost:5000/api

# WebSocket
VITE_SOCKET_URL=http://localhost:5000

# Authentication
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

> ⚠️ Không commit file `.env` lên repository.

---

### 4️⃣ Khởi chạy môi trường phát triển

```bash
pnpm dev
```

Ứng dụng sẽ chạy tại:

```txt
http://localhost:5173
```

---

## 📜 Các script hỗ trợ

| Lệnh           | Chức năng                   |
| -------------- | --------------------------- |
| `pnpm dev`     | Chạy môi trường development |
| `pnpm build`   | Build production            |
| `pnpm preview` | Preview bản production      |
| `pnpm lint`    | Kiểm tra lỗi ESLint         |
| `pnpm format`  | Format code với Prettier    |

---

## 🔌 Tích hợp chính

| Dịch vụ       | Mục đích             | Biến môi trường         |
| ------------- | -------------------- | ----------------------- |
| Ostro Backend | REST API & WebSocket | `VITE_API_BASE_URL`     |
| Socket.io     | Giao tiếp realtime   | `VITE_SOCKET_URL`       |
| Google OAuth  | Xác thực người dùng  | `VITE_GOOGLE_CLIENT_ID` |

---

# 🧪 Quy trình phát triển

## 🧹 Chất lượng code

Dự án áp dụng các tiêu chuẩn code nghiêm ngặt với:

- ESLint
- Prettier
- Husky
- Lint-staged
- TypeScript strict mode

---

## 🌿 Quy ước branch Git

```bash
feature/ten-tinh-nang
fix/ten-loi
refactor/ten-module
```

---

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh.

### Quy trình đóng góp

1. Fork repository
2. Tạo branch tính năng
3. Viết code sạch và đầy đủ kiểu dữ liệu
4. Chạy kiểm tra lint
5. Tạo Pull Request

---

# 📄 Giấy phép

Dự án được phát hành theo giấy phép **MIT License**.

Xem file `LICENSE` để biết thêm thông tin.

---

<div align="center">

### ⭐ Được xây dựng với niềm đam mê dành cho công nghệ web

</div>
