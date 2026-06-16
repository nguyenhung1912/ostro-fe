<div align="center">

<img src="./public/logo.svg" alt="Ostro Logo" width="120" />

# OSTRO FRONTEND

### Modern • Fast • Scalable • Real-time • AI Integrated

<p align="center">
  A sleek, high-fidelity, and responsive chat client frontend built with state-of-the-art web technologies.
</p>

<br/>

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Zustand-v5-000000?style=for-the-badge" />
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

**Ostro Frontend** is the user interface client for Ostro, designed for maximum fluid user experience, real-time interactivity, and AI automation.

Built on top of **React 19**, **TypeScript 6**, **Vite 8**, and **Tailwind CSS v4**, the application delivers a super-fast developer hot-reload and optimized production bundles. It integrates state management through lightweight **Zustand v5** stores, handles routing using **React Router v7**, displays analytical charts via **Chart.js**, and interacts with Gemini AI services for advanced messaging tasks.

---

## ✨ Core Features

<table>
<tr>
<td width="50%">

### 💬 Real-time Chat Interface

- Direct and group chats with dynamic typing status.
- Online/offline presence badges.
- Send messages with emoji picker popovers.
- Recall messages with immediate UI sync.
- Cloudinary-backed chat image attachments.
- Pin/unpin conversations and unread counts.
- Infinite scroll handling.

</td>
<td width="50%">

### 🤖 Gemini AI Companion Panel

- Accessible via the **Sparkles (AI)** menu button in the chat box:
- **Conversation Summarize**: Condense chat logs into a recap.
- **Task/Action Items**: Extract TODO items from chat.
- **Group Name Suggestion**: Generate names based on topics.
- **Draft Rewrite Tone**: Make messages professional, shorter, friendlier, or clearer.
- **Translate**: Live translate drafts into English or Vietnamese.

</td>
</tr>

<tr>
<td width="50%">

### 🔐 Auth & Account Operations

- Custom Landing Page, Sign In, and Sign Up pages.
- Fast Google OAuth 2.0 authentication integration.
- Edit account profiles (display name, bio).
- Upload avatar and cover images (Cloudinary).
- Password change and account deactivations.
- Secure, client-guarded routing.

</td>
<td width="50%">

### 👑 Admin Moderation Panel

- Accessible for accounts with `admin` or `moderator` roles.
- **Dashboard Stats**: Quick cards for Total Users, Total Groups, DAU, and MAU metrics.
- **User Moderation**: List users, promote/demote roles, ban/unban, or delete accounts.
- **Group Moderation**: Delete/dissolve groups.
- **Charts & Metrics**: Graphs of registration growth and message volume trends.

</td>
</tr>

<tr>
<td width="50%">

### 📱 Responsive Premium UI

- Mobile-first approach with collapsible navigation sidebars.
- Stunning dark and light theme toggles.
- Beautiful mesh gradient background visuals.
- Sleek glassmorphism / liquid glass styling.
- Rich Micro-animations and hover transitions.

</td>
<td width="50%">

### 🤝 Friend Management

- Search users by username.
- Send, accept, decline, or cancel friend requests.
- Real-time status indicators on friend lists.
- Group management UI: Create group chat, add members dropdown, group configurations, leave group.

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Layer                | Technologies                                                    |
| :------------------- | :-------------------------------------------------------------- |
| **Frontend Core**    | React 19 • TypeScript 6.0 • Vite 8.0                            |
| **Routing**          | React Router v7 (`react-router-dom`)                            |
| **State Management** | Zustand v5.x                                                    |
| **UI & Styling**     | Tailwind CSS v4 • `@tailwindcss/vite` • Radix UI • Lucide React |
| **Networking**       | Axios • Socket.io-client v4.x                                   |
| **Authentication**   | Google OAuth (`@react-oauth/google`)                            |
| **Notifications**    | Sileo Toast Engine (`sileo`)                                    |
| **Charts**           | Chart.js • React Chartjs 2                                      |
| **Rich Input**       | Emoji Mart (`@emoji-mart/react`)                                |
| **Code Quality**     | ESLint v10.x • Prettier • Husky • Lint-staged                   |

</div>

---

## 📂 Project Structure

```bash
ostro-fe/
│
├── public/                     # Public static resources
│   └── logo.svg                # Ostro Logo asset
│
├── src/
│   ├── components/             # Reusable UI component folders
│   │   ├── add-friend-modal/   # Modal to add friends
│   │   ├── admin/              # Admin dashboard view sub-components
│   │   ├── auth/               # SignIn/SignUp cards and ProtectedRoute guard
│   │   ├── chat/               # Message box, windows, chat headers, AIActionsMenu
│   │   ├── chat-list/          # Left pane conversation listings
│   │   ├── common/             # Avatars, badges, status loaders
│   │   ├── friend-request/     # List of requests received/sent
│   │   ├── group-management/   # Modals for editing groups
│   │   ├── new-group-chat/     # Flow to start group conversations
│   │   ├── profile/            # Profile settings pane
│   │   ├── sidebar/            # Main navigation and user menus
│   │   ├── skeleton/           # Loading placeholder items
│   │   └── ui/                 # Atomic Shadcn components (button, dialog, input, dropdown)
│   │
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Global libraries (Axios instance configurations)
│   ├── pages/                  # Route level page views
│   │   ├── LandingPage.tsx     # Welcome landing page
│   │   ├── SignInPage.tsx      # Sign In page
│   │   ├── SignUpPage.tsx      # Sign Up page
│   │   ├── ChatAppPage.tsx      # Main application workspace
│   │   └── AdminDashboardPage.tsx # Administrative portal
│   │
│   ├── services/               # API endpoints communications services
│   │   ├── adminService.ts     # User/Group management APIs
│   │   ├── aiService.ts        # Gemini AI requests calls
│   │   ├── authService.ts      # Authentication operations
│   │   ├── chatService.ts      # Message & conversation actions
│   │   ├── friendService.ts    # Friends requests lists
│   │   └── userService.ts      # Profile uploads and settings APIs
│   │
│   ├── stores/                 # Zustand globally shared states
│   │   ├── useAuthStore.ts     # User authentication state
│   │   ├── useChatStore.ts     # Active chats and recalled messages lists
│   │   ├── useFriendStore.ts   # Current friends list state
│   │   ├── useSocketStore.ts   # Live Socket connection instances
│   │   ├── useThemeStore.ts    # System theme toggle states
│   │   └── useUserStore.ts     # Searched users lists
│   │
│   ├── types/                  # Shared TypeScript models and interfaces
│   │
│   ├── App.tsx                 # Client routes definition and main wrappers
│   ├── index.css               # Core global CSS style system & Tailwind imports
│   └── main.tsx                # Client DOM rendering mount entry point
│
├── .env.development            # Dev environment config (ignored in Git)
├── .env.production             # Prod environment config
├── components.json             # Component styles configuration file
├── eslint.config.js            # Flat ESLint rules
├── package.json                # Project script commands and dependencies
├── pnpm-lock.yaml              # Lockfile for dependencies
├── pnpm-workspace.yaml         # Workspace configuration
├── tailwind.config.ts          # Tailwind CSS custom themes config
├── tsconfig.json               # Main TypeScript config
├── tsconfig.app.json           # Application TypeScript rules
├── tsconfig.node.json          # Node scripts TypeScript config
├── vercel.json                 # Vercel SPA router deployment config
└── vite.config.ts              # Vite plugins configuration (React 19 + Tailwind v4)
```

---

# 🚀 Getting Started

## 📋 Prerequisites

Ensure the following programs are installed:

- **Node.js**: `v20.0.0` or higher
- **pnpm**: `v9.x` or higher

---

## ⚙️ Installation

### 1️⃣ Install Dependencies

Run the install command:

```bash
pnpm install
```

---

### 2️⃣ Configure Environment Variables

Create a file named `.env` in the `ostro-fe` directory:

```env
# URL pointing to the Backend REST API
VITE_API_BASE_URL=http://localhost:5001/api

# URL pointing to the Backend Socket.io server
VITE_SOCKET_URL=http://localhost:5001

# Google Client OAuth Credential Key
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
```

---

### 3️⃣ Start Development Server

Run the client:

```bash
pnpm dev
```

The application will run locally at: [http://localhost:5173](http://localhost:5173)

---

## 📜 Available Scripts

The following commands are available:

| Command        | Description                                     |
| :------------- | :---------------------------------------------- |
| `pnpm dev`     | Start development server with Vite              |
| `pnpm build`   | Compile and bundle production-optimized assets  |
| `pnpm preview` | Locally serve the production bundle for testing |
| `pnpm lint`    | Scan frontend files for style/syntax violations |

---

# 🇻🇳 Tài liệu Tiếng Việt

## 📖 Giới thiệu

**Ostro Frontend** là giao diện máy khách phía client của hệ thống Ostro, được thiết kế nhằm mục đích đem lại trải nghiệm mượt mà, phản hồi thời gian thực và tích hợp tối ưu các công cụ tự động hóa thông minh từ AI.

Được xây dựng trên nền tảng **React 19**, **TypeScript 6**, **Vite 8** và **Tailwind CSS v4**, ứng dụng đảm bảo tốc độ phản hồi hot-reload cực nhanh khi phát triển và tối ưu dung lượng tệp tin khi đóng gói. Dự án quản lý trạng thái bằng hệ thống store nhẹ **Zustand v5**, định tuyến qua **React Router v7**, hiển thị đồ thị trực quan bằng **Chart.js** và tích hợp gọi trợ lý thông minh Gemini AI cho các nghiệp vụ nhắn tin nâng cao.

---

## ✨ Tính năng nổi bật

<table>
<tr>
<td width="50%">

### 💬 Nhắn tin Real-time tốc độ cao

- Nhắn tin trực tiếp/nhóm với hiển thị trạng thái đang soạn tin (typing).
- Huy hiệu hiển thị online/offline trực quan.
- Chọn icon cảm xúc qua bảng Emoji Mart tiện lợi.
- Tính năng thu hồi tin nhắn đồng bộ tức thì trên giao diện.
- Đính kèm hình ảnh sắc nét qua bộ lưu trữ đám mây Cloudinary.
- Ghim/Bỏ ghim cuộc hội thoại và hiển thị số tin nhắn chưa đọc.
- Hỗ trợ cuộn trang vô hạn tải tin nhắn cũ.

</td>
<td width="50%">

### 🤖 Trợ lý thông minh Gemini AI

- Trực tiếp thao tác từ nút **Sparkles (AI)** trên thanh nhập văn bản:
- **Tóm tắt cuộc trò chuyện**: Thu gọn nội dung các tin nhắn gần đây.
- **Trích xuất công việc**: Tách nhanh các công việc được giao trong chat.
- **Gợi ý tên nhóm**: Tự động gợi ý tên nhóm chat phù hợp nhất.
- **Tối ưu câu chữ**: Chuyển soạn thảo tin nhắn sang các văn phong Chuyên nghiệp, Ngắn gọn, Thân thiện, Dễ hiểu.
- **Dịch tin nhắn**: Dịch tin nhắn nhanh sang Tiếng Anh hoặc Tiếng Việt.

</td>
</tr>

<tr>
<td width="50%">

### 🔐 Xác thực & Quản lý Tài khoản

- Các trang Landing, Đăng nhập và Đăng ký bắt mắt.
- Tích hợp đăng nhập nhanh một chạm qua Google OAuth 2.0.
- Cập nhật thông tin tài khoản (tên hiển thị, tiểu sử).
- Thay đổi ảnh đại diện và ảnh bìa qua Cloudinary.
- Thay đổi mật khẩu tài khoản và chức năng hủy kích hoạt tài khoản.
- Bảo vệ định tuyến phía client nghiêm ngặt.

</td>
<td width="50%">

### 👑 Bảng Quản trị Admin

- Chỉ mở cho các tài khoản có vai trò `admin` hoặc `moderator`.
- **Thống kê tóm tắt**: Thống kê Tổng người dùng, Tổng nhóm chat, DAU, và MAU.
- **Quản lý Thành viên**: Thay đổi phân quyền, Khóa/Mở khóa tài khoản, Xóa tài khoản vĩnh viễn.
- **Quản lý Nhóm**: Xem danh sách nhóm chat và xóa nhóm chat.
- **Phân tích số liệu**: Biểu đồ trực quan tăng trưởng thành viên và số lượng tin nhắn gửi đi.

</td>
</tr>

<tr>
<td width="50%">

### 📱 Giao diện Responsive Cao cấp

- Thiết kế mobile-first tương thích tốt trên điện thoại và máy tính.
- Tùy chọn chuyển đổi hai chế độ sáng/tối ấn tượng.
- Hình nền mesh gradient và hiệu ứng kính mờ (glassmorphic).
- Phản hồi tương tác (micro-animations) mượt mà khi di chuột và bấm giữ.
- Thanh sidebar thu gọn linh hoạt.

</td>
<td width="50%">

### 🤝 Quản lý Bạn bè & Nhóm chat

- Tìm kiếm tài khoản khác bằng username để kết bạn.
- Gửi, chấp nhận, từ chối, hoặc thu hồi lời mời kết bạn.
- Hiển thị trạng thái hoạt động trực quan trên danh sách bạn bè.
- Quản lý nhóm: Tạo nhóm mới, Thêm thành viên, Rời khỏi nhóm.

</td>
</tr>
</table>

---

## 🛠️ Công nghệ sử dụng

<div align="center">

| Thành phần             | Công nghệ                                                       |
| :--------------------- | :-------------------------------------------------------------- |
| **Lõi Frontend**       | React 19 • TypeScript 6.0 • Vite 8.0                            |
| **Định tuyến**         | React Router v7 (`react-router-dom`)                            |
| **Quản lý State**      | Zustand v5.x                                                    |
| **Giao diện & CSS**    | Tailwind CSS v4 • `@tailwindcss/vite` • Radix UI • Lucide React |
| **Kết nối mạng**       | Axios • Socket.io-client v4.x                                   |
| **Xác thực**           | Đăng nhập Google (`@react-oauth/google`)                        |
| **Thông báo**          | Bộ Toast Sileo (`sileo`)                                        |
| **Biểu đồ**            | Chart.js • React Chartjs 2                                      |
| **Bảng chọn Emoji**    | Emoji Mart (`@emoji-mart/react`)                                |
| **Công cụ phát triển** | ESLint v10.x • Prettier • Husky • Lint-staged                   |

</div>

---

## 📂 Cấu trúc thư mục dự án

```bash
ostro-fe/
│
├── public/                     # Thư mục chứa tài nguyên tĩnh
│   └── logo.svg                # Logo hệ thống Ostro
│
├── src/
│   ├── components/             # Các thư mục chứa Component tái sử dụng
│   │   ├── add-friend-modal/   # Modal tìm kiếm và kết bạn
│   │   ├── admin/              # Các component nhỏ phục vụ Dashboard Admin
│   │   ├── auth/               # Khung Đăng nhập/Đăng ký và Route bảo vệ
│   │   ├── chat/               # Bộ tin nhắn, khung chat, tiêu đề và AIActionsMenu
│   │   ├── chat-list/          # Danh sách hội thoại ở cột trái
│   │   ├── common/             # Ảnh đại diện, nhãn trạng thái và vòng tròn tải trang
│   │   ├── friend-request/     # Hiển thị lời mời kết bạn đã gửi/nhận
│   │   ├── group-management/   # Modal cấu hình thông tin nhóm chat
│   │   ├── new-group-chat/     # Modal tạo nhóm chat mới
│   │   ├── profile/            # Khung cấu hình trang cá nhân
│   │   ├── sidebar/            # Thanh điều hướng trái chính
│   │   ├── skeleton/           # Component giả lập khi đang tải dữ liệu
│   │   └── ui/                 # Các component nguyên tử Shadcn (nút bấm, hộp thoại, ô nhập liệu)
│   │
│   ├── hooks/                  # Các custom hook React tự định nghĩa
│   ├── lib/                    # Cấu hình thư viện dùng chung (cấu hình Axios instance)
│   ├── pages/                  # Các trang ứng dụng lớn (Route levels)
│   │   ├── LandingPage.tsx     # Trang chào mừng giới thiệu ứng dụng
│   │   ├── SignInPage.tsx      # Trang đăng nhập
│   │   ├── SignUpPage.tsx      # Trang đăng ký tài khoản
│   │   ├── ChatAppPage.tsx      # Trang trò chuyện chính
│   │   └── AdminDashboardPage.tsx # Trang quản trị viên tối cao
│   │
│   ├── services/               # Gọi API kết nối với backend
│   │   ├── adminService.ts     # API quản lý thành viên/nhóm của admin
│   │   ├── aiService.ts        # API yêu cầu xử lý từ Gemini AI
│   │   ├── authService.ts      # API đăng ký, đăng nhập và đăng xuất
│   │   ├── chatService.ts      # API gửi nhận tin nhắn và cấu hình cuộc trò chuyện
│   │   ├── friendService.ts    # API xử lý yêu cầu kết bạn
│   │   └── userService.ts      # API cập nhật trang cá nhân và tải ảnh
│   │
│   ├── stores/                 # Quản lý state toàn cục bằng Zustand
│   │   ├── useAuthStore.ts     # Quản lý tài khoản đăng nhập
│   │   ├── useChatStore.ts     # Quản lý tin nhắn và hội thoại đang mở
│   │   ├── useFriendStore.ts   # Quản lý danh sách bạn bè
│   │   ├── useSocketStore.ts   # Quản lý phiên kết nối Socket.io
│   │   ├── useThemeStore.ts    # Lưu trữ cài đặt giao diện sáng/tối
│   │   └── useUserStore.ts     # Quản lý kết quả tìm kiếm thành viên khác
│   │
│   ├── types/                  # Khai báo kiểu dữ liệu TypeScript dùng chung
│   │
│   ├── App.tsx                 # Định nghĩa các Route và bọc Provider
│   ├── index.css               # Hệ thống CSS chính và khai báo import Tailwind CSS v4
│   └── main.tsx                # Điểm khởi tạo và render ứng dụng lên DOM
│
├── .env.development            # Biến môi trường local dev (được bỏ qua trong Git)
├── .env.production             # Biến môi trường khi build production
├── components.json             # Tập tin cấu hình component Shadcn
├── eslint.config.js            # Cấu hình kiểm tra cú pháp ESLint
├── package.json                # Định nghĩa dependencies và câu lệnh dự án
├── pnpm-lock.yaml              # Lockfile quản lý dependencies của PNPM
├── pnpm-workspace.yaml         # Cấu hình workspace
├── tailwind.config.ts          # Cấu hình mở rộng Tailwind CSS
├── tsconfig.json               # Cấu hình chính của TypeScript compiler
├── tsconfig.app.json           # Cấu hình TypeScript cho mã nguồn ứng dụng
├── tsconfig.node.json          # Cấu hình TypeScript cho các script chạy Node.js
├── vercel.json                 # Cấu hình định tuyến SPA khi triển khai trên Vercel
└── vite.config.ts              # Cấu hình bộ dịch Vite (React 19 + Tailwind v4)
```

---

# 🚀 Bắt đầu sử dụng

## 📋 Yêu cầu hệ thống

Hãy chắc chắn máy tính của bạn đã được cài đặt:

- **Node.js**: phiên bản `v20.0.0` trở lên
- **pnpm**: phiên bản `v9.x` trở lên

---

## ⚙️ Cài đặt

### 1️⃣ Cài đặt thư viện phụ thuộc

Chạy câu lệnh:

```bash
pnpm install
```

---

### 2️⃣ Cấu hình biến môi trường

Tạo một tệp tin có tên `.env` nằm trong thư mục `ostro-fe`:

```env
# Đường dẫn API REST Backend
VITE_API_BASE_URL=http://localhost:5001/api

# Đường dẫn WebSocket Server Backend
VITE_SOCKET_URL=http://localhost:5001

# Mã Client ID tích hợp Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
```

---

### 3️⃣ Khởi chạy môi trường phát triển

Chạy giao diện ở môi trường local:

```bash
pnpm dev
```

Ứng dụng sẽ chạy tại địa chỉ: [http://localhost:5173](http://localhost:5173)

---

## 📜 Các câu lệnh có sẵn

Các câu lệnh hữu ích trong file `package.json`:

| Câu lệnh       | Chức năng                                                      |
| :------------- | :------------------------------------------------------------- |
| `pnpm dev`     | Chạy ứng dụng ở chế độ development với Vite                    |
| `pnpm build`   | Biên dịch và tối ưu hóa ứng dụng để sẵn sàng deploy production |
| `pnpm preview` | Khởi chạy bản đóng gói production tại local để kiểm tra trước  |
| `pnpm lint`    | Phân tích và quét lỗi cú pháp mã nguồn frontend                |

</div>
