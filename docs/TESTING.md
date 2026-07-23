# 🧪 Restoku-Next — Dokumentasi Testing & Automation Suite

Dokumen ini berisi panduan lengkap pengujian (Unit Test & End-to-End Test) untuk proyek **Restoku-Next**, mencakup arsitektur testing, cara menjalankan pengujian, metrik cakupan (*coverage*), dan struktur file test.

---

## 📊 Summary Coverage & Metrik Utama

- **Total Test Files**: `36` Unit Test Files + `6` E2E Spec Files
- **Total Test Cases**: `328` Unit Tests (100% Pass)
- **Framework Unit Test**: [Vitest](https://vitest.dev/) + [@testing-library/react](https://testing-library.com/)
- **Framework E2E**: [Playwright](https://playwright.dev/)
- **Coverage Engine**: `@vitest/coverage-v8`

> Nilai coverage di bawah diukur dari `npm run test:coverage` (v8). Angka
> diperbarui pasca-remediasi audit (penghapusan file duplikat/0% & penambahan
> test `errorHandler`/`apiClient`).

| Metrik | Hasil Coverage | Threshold Target | Status |
|---|:---:|:---:|:---:|
| **Statements** | **91.45%** | 85% | ✅ Passed |
| **Branches** | **90.81%** | 85% | ✅ Passed |
| **Functions** | **94.93%** | 90% | ✅ Passed |
| **Lines** | **91.45%** | 85% | ✅ Passed |

---

## 🚀 Perintah Menjalankan Test (*CLI Commands*)

Semua perintah testing dapat dijalankan dari root direktori proyek (`Restoku-Next`):

### 1. Menjalankan Unit Tests (Sekali Jalan)
```bash
npm run test:unit
```

### 2. Menjalankan Unit Tests dengan Watch Mode (Interaktif saat Coding)
```bash
npm run test
```

### 3. Menjalankan Unit Tests + Generasi Laporan Coverage (HTML & Terminal)
```bash
npm run test:coverage
```
> Laporan HTML interaktif akan dihasilkan di folder `./coverage/index.html`.

### 4. Menjalankan Unit Tests dengan UI Interaktif
```bash
npm run test:ui
```

### 5. Menjalankan End-to-End (E2E) Tests dengan Playwright
```bash
npm run test:e2e
```

### 6. Menjalankan E2E Tests dengan UI Inspector Playwright
```bash
npx playwright test --ui
```

---

## 📁 Struktur Direktori & File Test

Seluruh file test disusun mengikuti prinsip **Hexagonal Architecture** dan disimpan di dalam modul fitur masing-masing (`src/features/*/`) serta shared utilities (`src/shared/`), ditambah folder `e2e/` untuk E2E tests:

```text
Restoku-Next/
├── TESTING.md                        # Dokumentasi testing ini
├── vitest.config.ts                  # Konfigurasi utama Vitest & Coverage
├── playwright.config.ts              # Konfigurasi E2E Playwright
├── e2e/                              # File Pengujian End-to-End (Playwright)
│   ├── auth.spec.ts                  # Test E2E Auth, Login, Logout, Guard
│   ├── pos.spec.ts                   # Test E2E Kasir / POS & Cart
│   ├── dashboard.spec.ts             # Test E2E Dashboard & Navigasi Sidebar
│   └── reports-tables.spec.ts        # Test E2E Laporan & Manajemen Meja
└── src/
    ├── test/
    │   └── setup.ts                  # Global test setup (localStorage, env, mocks)
    ├── shared/                       # Shared Domain & Utilities Tests
    │   ├── domain/
    │   │   ├── types.test.ts         # Test Branded Types (Money, UserId, RestaurantId)
    │   │   └── validations.test.ts   # Test Zod Schemas (login, menu, order, table)
    │   ├── infrastructure/
    │   │   ├── accessibility/
    │   │   │   └── hooks.test.ts     # Test A11y Hooks (Focus Trap, Keyboard Nav, Aria Live)
    │   │   └── performance/
    │   │       └── lazyLoad.test.ts  # Test Lazy Load & Prefetch Utilities
    │   └── ui/
    │       └── lib.test.ts           # Test cn() Tailwind merge utility
    └── features/                     # Feature Module Unit Tests
        ├── auth/
        │   ├── domain/entities/User.test.ts
        │   ├── application/use-cases/login.test.ts
        │   ├── infrastructure/adapters/ApiAuthService.test.ts
        │   └── ui/stores/useAuthStore.test.ts
        ├── menu/
        │   ├── domain/entities/MenuItem.test.ts
        │   ├── application/use-cases/menuUseCases.test.ts
        │   └── infrastructure/adapters/ApiMenuRepository.test.ts
        ├── pos/
        │   ├── domain/entities/Order.test.ts
        │   └── ui/stores/usePosCartStore.test.ts
        ├── menu-public/
        │   └── ui/stores/useCartStore.test.ts
        ├── tables/
        │   └── domain/entities/RestaurantTable.test.ts
        ├── outlet/
        │   └── ui/stores/useOutletStore.test.ts
        └── offline/
            └── infrastructure/adapters/offlineDB.test.ts
```

---

## 🎯 Detail Cakupan Pengujian (*Test Matrix*)

### 1. **Domain Layer (Pure Logic & Entities)**
- **`types.test.ts`**: Menguji type safety pada branded primitives (`createRestaurantId`, `createUserId`, `createMoney`) dan pengujian error handling untuk nilai uang negatif.
- **`validations.test.ts`**: Menguji validasi skema Zod untuk form login, item menu, pesanan, dan meja restoran.
- **`User.test.ts`**: Menguji fungsi bisnis hak akses (`canManageInventory`, `canProcessPayment`) serta utilitas format email.
- **`MenuItem.test.ts`**: Menguji logika format Rupiah (`formatPrice`), pengecekan ketersediaan menu, dan ekstraksi badge (`Popular`, `Baru`, `Promo`).
- **`Order.test.ts`**: Menguji kalkulasi total pesanan, pemetaan warna status, dan label status dalam Bahasa Indonesia.
- **`RestaurantTable.test.ts`**: Menguji pembuat ID meja dan pembuatan URL QR Code per meja.

### 2. **Application Layer (Use Cases)**
- **`login.test.ts`**: Menguji eksekusi login & logout, validasi kredensial kosong, dan propagasi error.
- **`menuUseCases.test.ts`**: Menguji 6 use cases utama menu (`getMenuList`, `getMenuById`, `createMenu`, `updateMenu`, `deleteMenu`, `getPublicMenu`) dengan *mock repository*.

### 3. **Infrastructure Layer (Adapters & External Systems)**
- **`ApiAuthService.test.ts`**: Menguji panggilan HTTP ke endpoint `/auth/login`, `/auth/logout`, `/auth/refresh`, dan `/auth/me`.
- **`ApiMenuRepository.test.ts`**: Menguji query parameter filter (`search`, `category`, `status`), penanganan HTTP 404, dan pemetaan response DTO ke domain entity.
- **`offlineDB.test.ts`**: Menguji adapter IndexedDB untuk operasi offline mode (penyimpanan order sementara, menu cache, & queue sync).

### 4. **UI & State Management Layer (Zustand Stores & Hooks)**
- **`useAuthStore.test.ts`**: Menguji manajemen state autentikasi, persistensi token JWT di storage, header Axios otomatis, refresh token, dan penanganan logout.
- **`usePosCartStore.test.ts`**: Menguji keranjang POS kasir (tambah item, pengelompokan varian, pembaharuan catatan per item, penyesuaian kuantitas, dan hitung total harga).
- **`useCartStore.test.ts`**: Menguji keranjang publik pemesan makanan melalui QR code meja.
- **`useOutletStore.test.ts`**: Menguji pemilihan dan manajemen cabang/outlet restoran.
- **`hooks.test.ts`**: Menguji perangkap fokus keyboard modal (*Focus Trap*), pengumuman pembaca layar (*ARIA live*), dan navigasi panah keyboard.
- **`lazyLoad.test.ts`**: Menguji *code splitting* komponen React dan prefetching pada event hover/focus.

### 5. **End-to-End (E2E) Browser Tests**
- **`auth.spec.ts`**: Menguji alur lengkap login user, pesan kesalahan jika kredensial salah, redirect otomatis ke dashboard, dan proteksi rute rahasia.
- **`pos.spec.ts`**: Menguji rendering halaman POS, penyaringan kategori menu, pencarian produk, penambahan ke keranjang, dan pengaktifan tombol checkout.
- **`dashboard.spec.ts`**: Menguji visualisasi halaman dashboard admin, ringkasan statistik, dan navigasi menu sidebar.
- **`reports-tables.spec.ts`**: Menguji peralihan tab periode laporan (harian, mingguan, bulanan), pemilih tanggal, ekspor PDF, dan halaman manajemen meja.

---

## 🛠️ Aturan & Praktik Baik Pengujian (*Testing Guidelines*)

1. **Haram Menggunakan `any`**: Seluruh mock dan variabel test harus memiliki tipe TypeScript yang kuat (*strict typing*).
2. **Isolasi State**: Setiap test file Zustand store wajib mereset state pada block `beforeEach()` untuk mencegah *side-effects* antar test.
3. **Mocking External I/O**: Semua panggilan API eksternal wajib menggunakan mock (`vi.fn()`, `msw`, atau mock fetch) agar pengujian cepat dan deterministik.
4. **Hexagonal Test Alignment**: Test dibuat selaras dengan layer-nya — Domain test tidak memerlukan React rendering environment, cukup Node/jsdom murni.
