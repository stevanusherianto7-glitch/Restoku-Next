import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Spinner } from "@shared/ui/atoms/Spinner";
import { useAuthStore } from "@features/auth/ui/stores/useAuthStore";
import { ErrorBoundary } from "@shared/ui/components/ErrorBoundary";
import { FeaturePlaceholderPage } from "@shared/ui/pages/FeaturePlaceholderPage";

const LandingPage = lazy(() => import("@features/landing/ui/pages/LandingPage").then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import("@features/auth/ui/pages/LoginPage").then(m => ({ default: m.LoginPage })));
const NotFoundPage = lazy(() => import("@features/landing/ui/pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));
const DashboardPage = lazy(() => import("@features/dashboard/ui/pages/DashboardPage").then(m => ({ default: m.DashboardPage })));
const MenuPage = lazy(() => import("@features/menu/ui/pages/MenuPage").then(m => ({ default: m.MenuPage })));
const MenuPublicPage = lazy(() => import("@features/menu-public/ui/pages/MenuPublicPage").then(m => ({ default: m.MenuPublicPage })));
const TableManagementPage = lazy(() => import("@features/tables/ui/pages/TableManagementPage").then(m => ({ default: m.TableManagementPage })));
const PosPage = lazy(() => import("@features/pos/ui/pages/PosPage").then(m => ({ default: m.PosPage })));
const ReportsPage = lazy(() => import("@features/reports/ui/pages/ReportsPage").then(m => ({ default: m.ReportsPage })));
const ShiftPage = lazy(() => import("@features/shifts/ui/pages/ShiftPage").then(m => ({ default: m.ShiftPage })));
const CashierSessionStartPage = lazy(() => import("@features/shifts/ui/pages/CashierSessionStartPage").then(m => ({ default: m.CashierSessionStartPage })));
const KitchenPage = lazy(() => import("@features/kitchen/ui/pages/KitchenPage").then(m => ({ default: m.KitchenPage })));
const WaiterBarPage = lazy(() => import("@features/waiter/ui/pages/WaiterBarPage").then(m => ({ default: m.WaiterBarPage })));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export function AppRoutes() {
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#030303]">
          <Spinner />
        </div>
      }>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/menu/:restaurantId" element={<MenuPublicPage />} />

          {/* Protected Core Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/pos" element={<ProtectedRoute><PosPage /></ProtectedRoute>} />
          <Route path="/menu" element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
          <Route path="/tables" element={<ProtectedRoute><TableManagementPage /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />

          {/* Protected Sub-Feature Routes (Zero 404 Dead Ends) */}
          <Route path="/orders" element={<ProtectedRoute><KitchenPage /></ProtectedRoute>} />
          <Route path="/kitchen" element={<ProtectedRoute><KitchenPage /></ProtectedRoute>} />
          <Route path="/waiter-bar" element={<ProtectedRoute><WaiterBarPage /></ProtectedRoute>} />
          <Route path="/menu-catalog" element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
          <Route path="/menu-digital" element={<ProtectedRoute><MenuPublicPage /></ProtectedRoute>} />

          {/* Inventaris Group */}
          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <FeaturePlaceholderPage
                  title="Stok & Bahan Baku"
                  category="Inventaris"
                  description="Kelola persediaan bahan baku, resep hidangan, dan peringatan stok menipis."
                  quickActions={[
                    { label: "Katalog Menu", href: "/menu" },
                    { label: "Supplier", href: "/suppliers" },
                  ]}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/suppliers"
            element={
              <ProtectedRoute>
                <FeaturePlaceholderPage
                  title="Manajemen Supplier"
                  category="Inventaris"
                  description="Daftar mitra vendor penyedia bahan baku dan histori pesanan barang."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stock-opname"
            element={
              <ProtectedRoute>
                <FeaturePlaceholderPage
                  title="Stock Opname Restoran"
                  category="Inventaris"
                  description="Audit penyesuaian jumlah fisik bahan baku dengan pencatatan sistem."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard-inventory"
            element={
              <ProtectedRoute>
                <FeaturePlaceholderPage
                  title="Dasbor Analitik Stok"
                  category="Inventaris"
                  description="Grafik tingkat pemakaian bahan baku dan estimasi waktu peremajaan stok."
                />
              </ProtectedRoute>
            }
          />

          {/* Operasional Group */}
          <Route path="/shifts" element={<ProtectedRoute><ShiftPage /></ProtectedRoute>} />
          <Route path="/cashier-session" element={<ProtectedRoute><CashierSessionStartPage /></ProtectedRoute>} />

          {/* Laporan Group */}
          <Route
            path="/outlet-comparison"
            element={
              <ProtectedRoute>
                <FeaturePlaceholderPage
                  title="Perbandingan Kinerja Outlet"
                  category="Laporan"
                  description="Analisa komparatif omset dan performa transaksi antar cabang restoran."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cash-flow"
            element={
              <ProtectedRoute>
                <FeaturePlaceholderPage
                  title="Laporan Arus Kas (Cash Flow)"
                  category="Laporan"
                  description="Pantau arus uang masuk tunai/QRIS dan pengeluaran operasional restoran."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profit-loss"
            element={
              <ProtectedRoute>
                <FeaturePlaceholderPage
                  title="Laporan Laba & Rugi"
                  category="Laporan"
                  description="Kalkulasi bersih pendapatan restoran dikurangi COGS dan beban usaha."
                />
              </ProtectedRoute>
            }
          />
          <Route path="/reports/products" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
          <Route path="/reports/shifts" element={<ProtectedRoute><ShiftPage /></ProtectedRoute>} />
          <Route path="/reports/tables" element={<ProtectedRoute><TableManagementPage /></ProtectedRoute>} />

          {/* Keuangan Group */}
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <FeaturePlaceholderPage
                  title="Pengeluaran & Biaya Operasional"
                  category="Keuangan"
                  description="Pencatatan beban sewa tempat, listrik, belanja bahan, dan gaji staf."
                />
              </ProtectedRoute>
            }
          />

          {/* Pengaturan Group */}
          <Route
            path="/settings/outlet"
            element={
              <ProtectedRoute>
                <FeaturePlaceholderPage
                  title="Pengaturan Profil Outlet"
                  category="Pengaturan"
                  description="Atur nama restoran, alamat cabang, nomor telepon, dan jam operasional."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/discounts"
            element={
              <ProtectedRoute>
                <FeaturePlaceholderPage
                  title="Pengaturan Diskon & Pajak (PB1)"
                  category="Pengaturan"
                  description="Konfigurasi pajak restoran 10%, service charge, dan voucher promo."
                />
              </ProtectedRoute>
            }
          />
          <Route path="/settings/qr" element={<ProtectedRoute><TableManagementPage /></ProtectedRoute>} />
          <Route
            path="/settings/printer"
            element={
              <ProtectedRoute>
                <FeaturePlaceholderPage
                  title="Konfigurasi Printer Struk"
                  category="Pengaturan"
                  description="Hubungkan printer thermal Bluetooth/LAN untuk cetak nota otomatis."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/tts"
            element={
              <ProtectedRoute>
                <FeaturePlaceholderPage
                  title="Pengaturan Panggilan Suara (TTS)"
                  category="Pengaturan"
                  description="Panggilan otomatis nomor antrean via speaker suara sintetis."
                />
              </ProtectedRoute>
            }
          />

          {/* Owner View Group */}
          <Route
            path="/owner/employees"
            element={
              <ProtectedRoute>
                <FeaturePlaceholderPage
                  title="Kelola Data Karyawan & Hak Akses"
                  category="Owner View"
                  description="Kelola akun staf, pin kasir, dan batas wewenang transaksi."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/inventory/alerts"
            element={
              <ProtectedRoute>
                <FeaturePlaceholderPage
                  title="Peringatan Stok & Restock"
                  category="Owner View"
                  description="Notifikasi otomatis saat persediaan bahan baku kritis di bawah minimum."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/reviews"
            element={
              <ProtectedRoute>
                <FeaturePlaceholderPage
                  title="Integrasi Google Review"
                  category="Owner View"
                  description="Kumpulkan ulasan kepuasan pelanggan secara otomatis setelah pembayaran."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/settings"
            element={
              <ProtectedRoute>
                <FeaturePlaceholderPage
                  title="Pengaturan Utama Mitra Restoku"
                  category="Owner View"
                  description="Konfigurasi langganan SaaS, langganan WhatsApp bot, dan profil bisnis."
                />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
