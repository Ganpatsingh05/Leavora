# Leavora - Employee Leave Management System

A modern, premium full-stack HR web application for managing employee leaves with role-based access control.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Tailwind CSS (Vite) |
| Routing | React Router v6 |
| State Management | Context API |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT |
| Authorization | Role-Based (Admin / Manager / Employee) |

## Features

- **Split-screen Login** with glassmorphism design
- **Employee Dashboard** - View leave balance, apply for leaves, track status
- **Manager Dashboard** - Approve/reject leave requests with search & filter
- **Admin Panel** - Manage users, view all leaves, analytics charts
- **Dark/Light Mode** toggle
- **Chart.js** analytics widgets
- **Toast notifications** for all actions
- **Responsive design** (Mobile + Tablet + Desktop)
- **Skeleton loading** states
- **Smooth animations** and micro-interactions

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally (default: `mongodb://localhost:27017`)

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Seed Database (Optional)

```bash
cd backend
npm run seed
```

This creates sample users:
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@company.com | password123 |
| Manager | manager@company.com | password123 |
| Employee | john@company.com | password123 |
| Employee | jane@company.com | password123 |
| Employee | mike@company.com | password123 |

### 3. Start Development

```bash
# Terminal 1 - Backend (port 5000)
cd backend
npm run dev

# Terminal 2 - Frontend (port 5173)
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
HR Dashboard/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── middleware/auth.js     # JWT & RBAC middleware
│   ├── models/
│   │   ├── User.js            # User model (roles, leave balance)
│   │   └── Leave.js           # Leave model
│   ├── routes/
│   │   ├── auth.js            # Login, Register, Profile
│   │   ├── leaves.js          # CRUD + approve/reject
│   │   └── users.js           # Admin user management
│   ├── seed/seed.js           # Database seeder
│   ├── server.js              # Express entry point
│   └── .env                   # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── SkeletonLoader.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── EmployeeDashboard.jsx
│   │   │   ├── ApplyLeave.jsx
│   │   │   ├── LeaveHistory.jsx
│   │   │   ├── ManagerDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ManageUsers.jsx
│   │   │   └── AdminLeaveHistory.jsx
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── vite.config.js
└── README.md
```

## Design System

- **Primary**: Deep Indigo / Royal Blue (`#3730a3` / `#6366f1`)
- **Secondary**: Emerald Green (`#059669`)
- **Accent**: Soft Amber / Orange (`#f59e0b`)
- **Background**: Light gray with glassmorphism blur cards
- **Typography**: Inter font family
- **Corners**: Rounded-xl / Rounded-2xl
- **Shadows**: Soft, colored shadows with hover elevation
- **Animations**: Fade-in, slide, scale micro-interactions
