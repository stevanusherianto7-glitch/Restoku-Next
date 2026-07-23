# Prompt: Frontend Restoku — Layered Architecture

## Context

```
## Context (carry forward)
- Stack: React 18 + TypeScript + Vite + Tailwind + Zustand + TanStack Query
- Architecture: Hexagonal (Ports & Adapters) + Vertical Slicing
- Path aliases: @app/*, @features/*, @shared/*
- ESLint boundaries: enforced
- Current project: Restoku POS
- Brand: cabe #e23b1f, emas #f4731c
```

---

## Prompt 1: Inisialisasi Feature Module

```
Buatkan feature module baru untuk [feature-name] di Restoku dengan struktur:

src/features/[feature-name]/
├── domain/
│   ├── entities/         # Core business entities
│   └── value-objects/    # Branded types, enums
├── application/
│   ├── use-cases/        # Business operations
│   ├── ports/            # Interfaces (PaymentService, etc.)
│   └── dtos/             # Data transfer objects
├── infrastructure/
│   ├── adapters/         # Port implementations
│   ├── api/              # API clients
│   └── mappers/          # Data mappers
└── ui/
    ├── components/       # Feature-specific components
    ├── pages/            # Route entry points
    ├── hooks/            # Feature hooks
    └── viewmodels/       # ViewModel hooks (bind use cases → UI)

Rules:
- Domain: pure functions, NO framework/infra dependency
- Application: orchestrate domain + ports
- Infrastructure: implement ports, can import from domain/application
- UI: components + viewmodels, CANNOT import from infrastructure directly
- Use Zustand for client state, TanStack Query for server state
```

---

## Prompt 2: Buat Entity & Use Case

```
Buatkan entity dan use case untuk fitur [feature-name]:

1. Entity di domain/entities/[EntityName].ts:
   - Interface dengan field yang jelas
   - Pure functions untuk validasi & bisnis logic
   - Branded types untuk ID (contoh: type OrderId = string & { readonly __brand: unique symbol })

2. Use case di application/use-cases/[operation].ts:
   - Function signature: async function [operation](params, deps: { [port]: [PortType] }): Promise<Result>
   - Impure sandwich pattern: side-effect → pure transform → side-effect
   - Import entity dari domain, port dari application/ports

3. Port di application/ports/[ServiceName].ts:
   - Interface untuk external service
   - Method signature dengan return type yang jelas

Contoh pattern:
```ts
// domain/entities/Order.ts
interface Order { id: OrderId; items: OrderItem[]; status: OrderStatus; total: Money }
function calculateTotal(items: OrderItem[]): Money { ... }

// application/ports/OrderRepository.ts
interface OrderRepository { save(order: Order): Promise<void>; findById(id: OrderId): Promise<Order | null> }

// application/use-cases/createOrder.ts
async function createOrder(items: OrderItem[], deps: { repo: OrderRepository }): Promise<Order> {
  const order = { id: generateId(), items, status: "pending", total: calculateTotal(items) };
  await deps.repo.save(order);
  return order;
}
```
```

---

## Prompt 3: Buat ViewModel & Page

```
Buatkan ViewModel dan Page untuk fitur [feature-name]:

1. ViewModel di ui/viewmodels/use[Feature]ViewModel.ts:
   - Hook yang mengimpor use case dari application layer
   - Menggunakan TanStack Query untuk server state
   - Menggunakan Zustand untuk client state (jika perlu)
   - TIDAK mengimpor dari infrastructure langsung

2. Page di ui/pages/[Feature]Page.tsx:
   - Komponen React yang menggunakan ViewModel
   - Menggunakan shared/ui/atoms untuk Button, Input, dll
   - Tailwind CSS untuk styling
   - Responsive (mobile-first)

Contoh pattern:
```ts
// ui/viewmodels/useMenuViewModel.ts
function useMenuViewModel() {
  const menuRepository = useMenuRepository(); // infrastructure adapter
  return useQuery({ queryKey: ['menus'], queryFn: () => menuRepository.findAll() });
}

// ui/pages/MenuPage.tsx
function MenuPage() {
  const { data: menus, isLoading } = useMenuViewModel();
  if (isLoading) return <Spinner />;
  return <MenuList menus={menus} />;
}
```
```

---

## Prompt 4: Buat Shared Component (Atomic Design)

```
Buatkan shared component mengikuti Atomic Design di shared/ui/:

1. Atom (single element):
   - Button, Input, Badge, Icon, Spinner
   - Props: variant, size, className (gunakan cn() dari lib.ts)
   - File: shared/ui/atoms/[ComponentName].tsx

2. Molecule (2+ atoms):
   - SearchBar, FormField, Card, Avatar
   - Compose dari atoms
   - File: shared/ui/molecules/[MoleculeName].tsx

3. Organism (complex UI):
   - Header, Sidebar, ProductCard, DataTable
   - Compose dari atoms + molecules
   - File: shared/ui/organisms/[OrganismName].tsx

Rules:
- Setiap komponen 1 file
- Gunakan cn() dari @shared/ui/lib untuk merge class
- Gunakan varian warna dari tailwind.config.ts (cabe, emas)
- TypeScript interface untuk props
```

---

## Prompt 5: Buat Infrastructure Adapter

```
Buatkan infrastructure adapter untuk fitur [feature-name]:

File: infrastructure/adapters/[AdapterName].ts

Pattern:
```ts
import type { [PortName] } from "@features/[feature]/application/ports/[PortName]";

export class [AdapterName] implements [PortName] {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async [method](params: [ParamsType]): Promise<[ReturnType]> {
    const response = await fetch(`${this.baseUrl}/[endpoint]`, {
      method: "[HTTP_METHOD]",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error("[Error message]");
    }

    return response.json();
  }
}
```

Rules:
- Implement port interface dari application layer
- Handle error dengan jelas
- Gunakan fetch/axios
- Environment variable untuk base URL (import.meta.env.VITE_API_URL)
```

---

## Prompt 6: Buat Testing

```
Buatkan testing untuk fitur [feature-name]:

1. Domain test (Vitest):
   - File: [feature]/domain/__tests__/[entity].test.ts
   - Test pure functions
   - Mock tidak diperlukan

2. Application test (Vitest):
   - File: [feature]/application/__tests__/[use-case].test.ts
   - Mock ports
   - Test use case logic

3. Infrastructure test (Vitest + MSW):
   - File: [feature]/infrastructure/__tests__/[adapter].test.ts
   - Mock API dengan MSW
   - Test adapter implementation

4. UI test (Vitest + Testing Library):
   - File: [feature]/ui/__tests__/[component].test.tsx
   - Render component
   - Test user interactions
```

---

## Prompt 7: Refactor ke Layered Architecture

```
Refactor file [file-path] untuk mengikuti dependency rule:

1. Identifikasi logic bisnis → pindah ke domain layer
2. Buat port interface di application/ports/
3. Pindah API call ke infrastructure adapter
4. Buat ViewModel di ui/viewmodels/
5. Update import di semua file yang terpengaruh

Rules:
- Domain: tidak boleh import dari infrastructure atau UI
- Application: boleh import dari domain, tidak boleh dari infrastructure/UI
- Infrastructure: boleh import dari domain dan application
- UI: boleh import dari application dan shared, tidak boleh dari infrastructure langsung (gunakan ViewModel)
```

---

## Prompt 8: Tambah Feature ke Routing

```
Tambahkan routing untuk fitur [feature-name]:

1. Buat route definition di src/app/routes/AppRoutes.tsx
2. Lazy load feature module
3. Protect route dengan auth check
4. Redirect ke login jika tidak authenticated

Contoh:
```tsx
import { lazy, Suspense } from "react";
import { Route, Navigate } from "react-router-dom";
import { Spinner } from "@shared/ui/atoms/Spinner";

const MenuPage = lazy(() => import("@features/menu/ui/pages/MenuPage"));

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/pos" element={<ProtectedRoute><POSPage /></ProtectedRoute>} />
      <Route path="/menu" element={<ProtectedRoute><Suspense fallback={<Spinner />}><MenuPage /></Suspense></ProtectedRoute>} />
    </Routes>
  );
}
```
```

---

## Prompt 9: Setup State Management

```
Setup state management untuk fitur [feature-name]:

1. Server State (TanStack Query):
   - Query untuk GET data
   - Mutation untuk POST/PUT/DELETE
   - Optimistic update untuk UX

2. Client State (Zustand):
   - Store untuk UI state (sidebar, modal, etc.)
   - Store untuk cart/temporary data
   - Persist middleware untuk data penting

Contoh:
```ts
// features/pos/ui/stores/useCartStore.ts
import { create } from "zustand";

interface CartStore { items: CartItem[]; addItem: (item: CartItem) => void; removeItem: (id: string) => void; clear: () => void; }

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  clear: () => set({ items: [] }),
}));
```
```

---

## Prompt 10: Setup ESLint Boundaries

```
Setup ESLint boundaries untuk enforce dependency rule:

File: eslint.config.js

Rules:
1. app/ tidak boleh import dari features/ atau shared/
2. domain/ tidak boleh import dari infrastructure/ atau ui/
3. application/ tidak boleh import dari infrastructure/ atau ui/
4. ui/ tidak boleh import dari infrastructure/ langsung (gunakan ViewModel)
5. shared/ boleh di-import oleh semua layer

Gunakan no-restricted-imports dengan patterns:
```js
{
  patterns: [
    { group: ["@app/*"], message: "app/ cannot import from features/ or shared/" },
    { group: ["@features/*/domain/*", "@features/*/application/*"], message: "Domain/Application cannot import from Infrastructure or UI" },
    { group: ["@features/*/ui/*"], message: "UI cannot import from Infrastructure directly. Use ViewModels." },
  ]
}
```
```

---

## Prompt 11: Digital Menu Book — Guest View (Public)

```
Buatkan fitur Buku Menu Digital untuk tamu (public, tanpa login):

1. Route: /menu/:restaurantId?table=:tableNumber

2. Page di features/menu-public/ui/pages/MenuPublicPage.tsx:
   - Public page (no auth required)
   - Mobile-first responsive (320px - 768px)
   - Tampilkan: nama restoran, logo, daftar menu
   - Load time < 2 detik

3. Components:
   - features/menu-public/ui/components/RestaurantHeader.tsx — logo, nama, info
   - features/menu-public/ui/components/CategoryFilter.tsx — filter kategori
   - features/menu-public/ui/components/MenuGrid.tsx — grid/list menu
   - features/menu-public/ui/components/MenuItemCard.tsx — foto, nama, harga, badge
   - features/menu-public/ui/components/MenuDetailModal.tsx — detail, varian, tambah ke cart
   - features/menu-public/ui/components/CartDrawer.tsx — keranjang samping
   - features/menu-public/ui/components/SearchBar.tsx — cari menu

4. ViewModel di features/menu-public/ui/viewmodels/useMenuPublicViewModel.ts:
   - Fetch menu dari public API (tanpa auth)
   - Filter kategori
   - Search menu
   - Cart state (Zustand)

5. State Management:
   - TanStack Query untuk fetch menu
   - Zustand untuk cart local state

6. Design:
   - Gunakan warna brand (cabe, emas)
   - Font besar untuk mobile
   - Foto menu besar dan jelas
   - Badge: "Promo", "Best Seller", "Baru", "Habis"
```

---

## Prompt 12: Digital Menu Book — QR Code Generator (Admin)

```
Buatkan fitur generate QR code untuk meja:

1. Page di features/qr-menu/ui/pages/QRMenuPage.tsx:
   - Admin page (auth required, role: owner/manager)
   - Tampilkan semua meja dengan QR code
   - Generate QR code baru
   - Download QR sebagai gambar (PNG/SVG)
   - Print QR code (format A4)

2. Components:
   - features/qr-menu/ui/components/QRCodeCard.tsx — QR code + nama meja
   - features/qr-menu/ui/components/QRCodeGenerator.tsx — form generate QR
   - features/qr-menu/ui/components/QRCodePreview.tsx — preview sebelum download
   - features/qr-menu/ui/components/TableList.tsx — daftar meja

3. ViewModel di features/qr-menu/ui/viewmodels/useQRMenuViewModel.ts:
   - Fetch semua meja
   - Generate QR code (POST)
   - Delete meja
   - Download QR code

4. QR Code URL format:
   - Production: https://menu.restoku.id/menu/{restaurantId}?table={tableNumber}
   - Development: http://localhost:3000/menu/{restaurantId}?table={tableNumber}

5. Libraries:
   - qrcode.react atau react-qr-code untuk generate QR
   - html2canvas atau dom-to-image untuk download

6. Print:
   - Format: A4 (210mm x 297mm)
   - QR size: 50mm x 50mm
   - Tampilkan: nama restoran, nama meja, QR code
```

---

## Prompt 13: Digital Menu Book — Cart & QR Ordering (Optional)

```
Buatkan fitur keranjang dan QR ordering untuk tamu:

1. Cart Store di features/menu-public/ui/stores/useCartStore.ts:
   - Zustand store
   - Items: menuItem, quantity, variant, notes
   - Add/remove/update quantity
   - Total calculation
   - Clear cart

2. Components:
   - features/menu-public/ui/components/CartDrawer.tsx — drawer samping
   - features/menu-public/ui/components/CartItem.tsx — item di keranjang
   - features/menu-public/ui/components/CartSummary.tsx — total + tombol pesan

3. Order Submission:
   - POST /api/public/orders (public endpoint, no auth)
   - Kirim: restaurantId, tableNumber, items, notes
   - Return: orderId, estimatedTime
   - Show confirmation modal

4. Real-time Updates:
   - WebSocket connection untuk status pesanan
   - Notifikasi: "Pesanan diterima", "Sedang disiapkan", "Siap diantar"
   - Tanpa login (gunakan orderId sebagai identifier)

5. Validation:
   - Minimal 1 item
   - Quantity minimal 1
   - Cek status menu (tersedia/habis)
   - Cek restaurant buka/tutup
```

---

## Prompt 14: Digital Menu Book — Mobile Optimization

```
Optimize Digital Menu Book untuk mobile:

1. Performance:
   - Lazy load gambar menu
   - Virtual scroll untuk menu banyak (>50 item)
   - Cache menu di localStorage
   - Service Worker untuk offline

2. UI/UX:
   - Bottom navigation: Menu, Keranjang, Pencarian
   - Swipe untuk filter kategori
   - Pull-to-refresh
   - Sticky header (nama restoran)

3. Accessibility:
   - Font size minimal 16px
   - Color contrast ratio ≥ 4.5:1
   - Touch target minimal 44px x 44px
   - Alt text untuk gambar menu

4. PWA:
   - Add to homescreen prompt
   - Offline support
   - Push notification untuk status pesanan
```

---

## Prompt 15: Digital Menu Book — Integration dengan POS

```
Integrasi Digital Menu Book dengan POS:

1. When tamu pesan dari QR menu:
   - Pesanan masuk ke POS sebagai "Online Order"
   - Tampilkan di POS dengan source "QR Order"
   - Auto-print di printer dapur (jika ada)
   - Notifikasi ke kasir

2. Data flow:
   - QR Menu → POST /api/public/orders → Backend → Queue → POS (real-time)
   - POS update status → WebSocket → QR Menu (real-time update)

3. Order Status Flow:
   - received → confirmed → preparing → ready → delivered

4. Conflict Handling:
   - Jika menu habis saat pesanan dikirim → reject + notifikasi
   - Jika restoran tutup → disable order button
   - Jika meja tidak valid → error message

5. Reporting:
   - Pisahkan laporan: POS orders vs QR orders
   - Compare conversion rate: QR views → orders
   - Track popular items dari QR menu
```
```
