# Rencana Kerja — Restoku MVP

**Version:** 1.0
**Duration:** 16 minggu (4 bulan)
**Start Date:** TBD

---

## Overview

Rencana kerja pembangunan Restoku MVP (Phase 1) dengan 8 fitur utama.

---

## Phase 1: Foundation (Minggu 1-4)

### Minggu 1-2: Setup & Auth

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Setup project (frontend + backend) | ✅ | — | Docker, CI/CD |
| Database schema (restaurants, users, roles) | ⬜ | Backend | PostgreSQL |
| Auth API (login, logout, refresh) | ⬜ | Backend | Sanctum JWT |
| Auth UI (login page) | ⬜ | Frontend | React + TypeScript |
| Role-based access control | ⬜ | Backend | Owner, Manager, Cashier, Kitchen |
| Protected routes | ⬜ | Frontend | React Router |

**Deliverable:** User bisa login dan akses dashboard

---

### Minggu 3-4: Menu Management

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Menu CRUD API | ⬜ | Backend | Categories, items, variants |
| Menu CRUD UI | ⬜ | Frontend | Admin panel |
| Image upload | ⬜ | Backend | Cloudinary/S3 |
| Menu validation | ⬜ | Backend + Frontend | Zod schemas |
| Menu seeding | ⬜ | Backend | Dummy data |

**Deliverable:** Admin bisa kelola menu (CRUD)

---

## Phase 2: Core Business (Minggu 5-8)

### Minggu 5-6: Digital Menu (QR)

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Public menu API | ⬜ | Backend | No auth required |
| QR code generation | ⬜ | Backend | Per table |
| Public menu UI | ⬜ | Frontend | Mobile-first |
| Menu browsing & search | ⬜ | Frontend | Filter kategori |
| Menu detail & variants | ⬜ | Frontend | Modal/drawer |

**Deliverable:** Tamu bisa scan QR dan lihat menu

---

### Minggu 7-8: POS (Point of Sale)

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Order API (create, status) | ⬜ | Backend | Real-time updates |
| Payment integration | ⬜ | Backend | Midtrans/Xendit |
| POS UI | ⬜ | Frontend | Fast checkout |
| Kitchen display | ⬜ | Frontend | Order queue |
| Receipt generation | ⬜ | Backend | PDF/print |
| Real-time updates | ⬜ | Fullstack | WebSocket |

**Deliverable:** Kasir bisa proses pesanan dan pembayaran

---

## Phase 3: Visibility (Minggu 9-12)

### Minggu 9-10: Dashboard & Reports

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Dashboard entity & types | ✅ | Frontend | DashboardData, Stats, etc. |
| Dashboard ViewModel | ✅ | Frontend | useDashboardViewModel |
| Dashboard UI | ✅ | Frontend | Stats cards, charts, tables |
| Reports entity & types | ✅ | Frontend | SalesReport, ReportPeriod |
| Reports ViewModel | ✅ | Frontend | useReportsViewModel |
| Reports UI | ✅ | Frontend | Period selector, charts, export |
| Dashboard API | ⬜ | Backend | Real-time stats |
| Sales reports API | ⬜ | Backend | Daily/weekly/monthly |

**Deliverable:** Pemilik bisa lihat laporan penjualan

---

### Minggu 11-12: Multi-outlet

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Outlet entity & types | ✅ | Frontend | Outlet interface, state |
| Outlet store | ✅ | Frontend | Zustand persist |
| Outlet switcher | ✅ | Frontend | Dropdown/select component |
| Outlet CRUD API | ⬜ | Backend | Multiple locations |
| Per-outlet data | ⬜ | Backend | Scoped queries |
| Outlet dashboard | ⬜ | Frontend | Per-location stats |

**Deliverable:** Satu akun bisa kelola banyak cabang

---

## Phase 4: Reliability (Minggu 13-16)

### Minggu 13-14: Offline Mode

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Service worker | ✅ | Frontend | PWA setup, sw.js |
| Local storage sync | ✅ | Frontend | IndexedDB (offlineDB.ts) |
| Queue offline orders | ✅ | Frontend | useOfflineSync hook |
| Conflict resolution | ✅ | Frontend | Last-write-wins |
| Sync indicator | ✅ | Frontend | OnlineIndicator.tsx |
| PWA manifest | ✅ | Frontend | manifest.json |

**Deliverable:** POS bisa jalan tanpa internet

---

### Minggu 15-16: Polish & Launch

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Lint & type check | ✅ | Frontend | ESLint + TypeScript strict |
| Error handling | ✅ | Frontend | Graceful offline fallback |
| UI polish | ✅ | Frontend | Loading states, empty states |
| Performance optimization | ⬜ | Fullstack | Lighthouse > 90 |
| Security audit | ⬜ | Backend | OWASP top 10 |
| E2E testing | ⬜ | Fullstack | Playwright |
| Documentation | ⬜ | Fullstack | API docs, user guide |
| Staging deployment | ⬜ | DevOps | Docker |

**Deliverable:** Restoku MVP siap launch

---

## Dependencies

| Dependency | Status | Impact |
|------------|--------|--------|
| Midtrans/Xendit account | ⬜ | Payment integration |
| Cloudinary/S3 bucket | ⬜ | Image upload |
| Domain name | ⬜ | Production URL |
| SSL certificate | ⬜ | HTTPS |
| Server (VPS/cloud) | ⬜ | Deployment |

---

## Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Backend complexity | Medium | High | Start early, iterative |
| Payment integration | Low | High | Use sandbox first |
| Offline sync conflicts | Medium | Medium | Simple strategy |
| Performance issues | Low | Medium | Profile early |

---

## Team

| Role | Responsibility |
|------|----------------|
| **Fullstack Developer** | Backend API, Frontend UI |
| **Designer** | UI/UX, branding |
| **QA** | Testing, bug reports |

---

## Definition of Done

- [ ] Code reviewed
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] No `any` types
- [ ] TypeScript strict mode
- [ ] ESLint clean
- [ ] Responsive (mobile-first)
- [ ] Documentation updated

---

## Weekly Standup Format

```
## Week X — [Date]

### Completed
- [ ] Task 1
- [ ] Task 2

### In Progress
- [ ] Task 3

### Blocked
- [ ] Task 4 (reason)

### Next Week
- [ ] Task 5
- [ ] Task 6
```
