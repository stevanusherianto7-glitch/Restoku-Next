# Tech Stack — Restoku

**Version:** 1.0
**Last Updated:** July 2026

---

## Overview

Restoku dibangun dengan modern web stack untuk performa, developer experience, dan skalabilitas.

---

## Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.x | UI library |
| **TypeScript** | 5.5.x | Type safety |
| **Vite** | 5.4.x | Build tool & dev server |
| **Tailwind CSS** | 3.4.x | Utility-first CSS |
| **Zustand** | 4.5.x | Client state management |
| **TanStack Query** | 5.x | Server state management |
| **React Router** | 6.26.x | Client-side routing |
| **React Hook Form** | 7.53.x | Form handling |
| **Zod** | 3.23.x | Schema validation |
| **Axios** | 1.7.x | HTTP client |

### Frontend Dev Dependencies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Vitest** | 2.x | Unit testing |
| **Testing Library** | 16.x | Component testing |
| **MSW** | 2.3.x | API mocking |
| **ESLint** | 9.x | Linting |
| **PostCSS** | 8.4.x | CSS processing |
| **Autoprefixer** | 10.4.x | CSS vendor prefixes |

---

## Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Laravel** | 13.x | PHP framework |
| **PHP** | 8.2.x | Runtime |
| **PostgreSQL** | 15.x | Primary database |
| **Redis** | 7.x | Cache, queue, sessions |
| **Sanctum** | — | API authentication (JWT) |
| **Reverb** | — | WebSocket (real-time) |

### Backend Packages

| Package | Purpose |
|---------|---------|
| **endroid/qr-code** | QR code generation |
| **spatie/laravel-permission** | Role & permission |
| **spatie/laravel-medialibrary** | File/media management |
| **intervention/image** | Image processing |
| **laravel/horizon** | Queue monitoring |

---

## Infrastructure

| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Local multi-service |
| **Nginx** | Reverse proxy |
| **GitHub Actions** | CI/CD |

---

## Architecture

| Aspect | Standard |
|--------|----------|
| **Pattern** | Hexagonal (Ports & Adapters) |
| **Slicing** | Vertical (by feature) |
| **Frontend Components** | Atomic Design |
| **API Style** | RESTful JSON |
| **Auth** | JWT (Bearer token) |
| **Real-time** | WebSocket (Laravel Reverb) |

---

## Coding Standards

| Standard | Rule |
|----------|------|
| **TypeScript** | ❌ No `any` type |
| **TypeScript** | ✅ Explicit types, interfaces, generics |
| **TypeScript** | ✅ `unknown` + validation if uncertain |
| **Import** | Path aliases (`@app/*`, `@features/*`, `@shared/*`) |
| **Architecture** | Domain layer is pure (no infra imports) |
| **Naming** | snake_case (JSON/DB), camelCase (TS/PHP vars), PascalCase (classes/types) |

---

## Environment

| Variable | Development | Staging | Production |
|----------|-------------|---------|------------|
| `VITE_API_URL` | `http://localhost:8000/api/v1` | `https://staging-api.restoku.id/api/v1` | `https://api.restoku.id/api/v1` |
| `APP_ENV` | `local` | `staging` | `production` |
| `APP_DEBUG` | `true` | `false` | `false` |
| `DB_CONNECTION` | `pgsql` | `pgsql` | `pgsql` |
| `SESSION_DRIVER` | `redis` | `redis` | `redis` |
| `QUEUE_CONNECTION` | `redis` | `redis` | `redis` |

---

## Version Pinning

```json
{
  "engines": {
    "node": ">=20.0.0",
    "php": ">=8.2.0"
  }
}
```

---

## References

- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Laravel Docs](https://laravel.com/docs)
- [Hexagonal Architecture](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software))
