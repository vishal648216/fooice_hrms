# Multi-Tenant SaaS HRMS (Enterprise Edition)

A full-stack, enterprise-grade multi-tenant HRMS (Human Resource Management System) and Workforce Management Platform.

## 📁 Architecture Overview

- **`hrms/`**: Modern Next.js 16 + React 19 + TypeScript frontend with rich dashboard views, attendance punch-in/out, leave management, project/task boards, and real-time chat.
- **`hrms-api/`**: Robust Laravel 11 REST API with multi-tenancy isolation (`TenantScope`), role-based access control (RBAC), subscription plan module gating, and full CRUD for HR, attendance, payroll, and invoicing.

---

## 🛠️ Quick Local Setup

### 1. Backend Setup (`hrms-api`)
```bash
cd hrms-api
composer install
cp .env.example .env
php artisan key:generate
# Configure DB credentials in .env
php artisan migrate --seed
php artisan serve --port=8000
```

### 2. Frontend Setup (`hrms`)
```bash
cd hrms
npm install
npm run dev
# App will run at http://localhost:3000
```

---

## 🔑 Demo Access Credentials

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Platform Super Admin** | `admin@hrms.com` | `Admin@12345` | SaaS Central Management (Tenants, Plans, Subscriptions) |
| **Tenant Super Admin (CEO)** | `rahul@techcorp.com` | `TechCorp@123` | Full Company HRMS, Finance, Settings |
| **HR Manager** | `anita@techcorp.com` | `TechCorp@123` | Attendance, Leaves, Payroll, Employees |
| **Employee** | `priya@techcorp.com` | `TechCorp@123` | Self-Service Portal (Punch In/Out, Tasks, Leaves) |
