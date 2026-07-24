import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Spinner } from "@shared/ui/atoms/Spinner";
import { useAuthStore } from "@features/auth/ui/stores/useAuthStore";
import { ErrorBoundary } from "@shared/ui/components/ErrorBoundary";

const LandingPage = lazy(() => import("@features/landing/ui/pages/LandingPage").then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import("@features/auth/ui/pages/LoginPage").then(m => ({ default: m.LoginPage })));
const NotFoundPage = lazy(() => import("@features/landing/ui/pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));
const DashboardPage = lazy(() => import("@features/dashboard/ui/pages/DashboardPage").then(m => ({ default: m.DashboardPage })));
const MenuPage = lazy(() => import("@features/menu/ui/pages/MenuPage").then(m => ({ default: m.MenuPage })));
const MenuPublicPage = lazy(() => import("@features/menu-public/ui/pages/MenuPublicPage").then(m => ({ default: m.MenuPublicPage })));
const TableManagementPage = lazy(() => import("@features/tables/ui/pages/TableManagementPage").then(m => ({ default: m.TableManagementPage })));
const QrCodeMejaPage = lazy(() => import("@features/tables/ui/pages/QrCodeMejaPage").then(m => ({ default: m.QrCodeMejaPage })));
const PosPage = lazy(() => import("@features/pos/ui/pages/PosPage").then(m => ({ default: m.PosPage })));
const ReportsPage = lazy(() => import("@features/reports/ui/pages/ReportsPage").then(m => ({ default: m.ReportsPage })));
const ShiftPage = lazy(() => import("@features/shifts/ui/pages/ShiftPage").then(m => ({ default: m.ShiftPage })));
const CashierSessionStartPage = lazy(() => import("@features/shifts/ui/pages/CashierSessionStartPage").then(m => ({ default: m.CashierSessionStartPage })));
const KitchenPage = lazy(() => import("@features/kitchen/ui/pages/KitchenPage").then(m => ({ default: m.KitchenPage })));
const WaiterBarPage = lazy(() => import("@features/waiter/ui/pages/WaiterBarPage").then(m => ({ default: m.WaiterBarPage })));

const InventoryPage = lazy(() => import("@features/inventory/ui/pages/InventoryPage").then(m => ({ default: m.InventoryPage })));
const SuppliersPage = lazy(() => import("@features/suppliers/ui/pages/SuppliersPage").then(m => ({ default: m.SuppliersPage })));
const StockOpnamePage = lazy(() => import("@features/stock-opname/ui/pages/StockOpnamePage").then(m => ({ default: m.StockOpnamePage })));
const InventoryDashboardPage = lazy(() => import("@features/inventory/ui/pages/InventoryDashboardPage").then(m => ({ default: m.InventoryDashboardPage })));
const OutletComparisonPage = lazy(() => import("@features/outlet/ui/pages/OutletComparisonPage").then(m => ({ default: m.OutletComparisonPage })));
const CashFlowPage = lazy(() => import("@features/finance/ui/pages/CashFlowPage").then(m => ({ default: m.CashFlowPage })));
const ProfitLossPage = lazy(() => import("@features/finance/ui/pages/ProfitLossPage").then(m => ({ default: m.ProfitLossPage })));
const ExpensesPage = lazy(() => import("@features/finance/ui/pages/ExpensesPage").then(m => ({ default: m.ExpensesPage })));
const OutletSettingsPage = lazy(() => import("@features/settings/ui/pages/OutletSettingsPage").then(m => ({ default: m.OutletSettingsPage })));
const DiscountsPage = lazy(() => import("@features/settings/ui/pages/DiscountsPage").then(m => ({ default: m.DiscountsPage })));
const PrinterSettingsPage = lazy(() => import("@features/settings/ui/pages/PrinterSettingsPage").then(m => ({ default: m.PrinterSettingsPage })));
const TtsSettingsPage = lazy(() => import("@features/settings/ui/pages/TtsSettingsPage").then(m => ({ default: m.TtsSettingsPage })));
const EmployeesPage = lazy(() => import("@features/employees/ui/pages/EmployeesPage").then(m => ({ default: m.EmployeesPage })));
const InventoryAlertsPage = lazy(() => import("@features/inventory/ui/pages/InventoryAlertsPage").then(m => ({ default: m.InventoryAlertsPage })));
const ReviewsPage = lazy(() => import("@features/reviews/ui/pages/ReviewsPage").then(m => ({ default: m.ReviewsPage })));
const OwnerSettingsPage = lazy(() => import("@features/settings/ui/pages/OwnerSettingsPage").then(m => ({ default: m.OwnerSettingsPage })));

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
          <Route path="/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
          <Route path="/suppliers" element={<ProtectedRoute><SuppliersPage /></ProtectedRoute>} />
          <Route path="/stock-opname" element={<ProtectedRoute><StockOpnamePage /></ProtectedRoute>} />
          <Route path="/dashboard-inventory" element={<ProtectedRoute><InventoryDashboardPage /></ProtectedRoute>} />

          {/* Operasional Group */}
          <Route path="/shifts" element={<ProtectedRoute><ShiftPage /></ProtectedRoute>} />
          <Route path="/cashier-session" element={<ProtectedRoute><CashierSessionStartPage /></ProtectedRoute>} />

          {/* Laporan Group */}
          <Route path="/outlet-comparison" element={<ProtectedRoute><OutletComparisonPage /></ProtectedRoute>} />
          <Route path="/cash-flow" element={<ProtectedRoute><CashFlowPage /></ProtectedRoute>} />
          <Route path="/profit-loss" element={<ProtectedRoute><ProfitLossPage /></ProtectedRoute>} />
          <Route path="/reports/products" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
          <Route path="/reports/shifts" element={<ProtectedRoute><ShiftPage /></ProtectedRoute>} />
          <Route path="/reports/tables" element={<ProtectedRoute><TableManagementPage /></ProtectedRoute>} />

          {/* Keuangan Group */}
          <Route path="/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} />

          {/* Pengaturan Group */}
          <Route path="/settings/outlet" element={<ProtectedRoute><OutletSettingsPage /></ProtectedRoute>} />
          <Route path="/settings/discounts" element={<ProtectedRoute><DiscountsPage /></ProtectedRoute>} />
          <Route path="/settings/qr" element={<ProtectedRoute><QrCodeMejaPage /></ProtectedRoute>} />
          <Route path="/settings/printer" element={<ProtectedRoute><PrinterSettingsPage /></ProtectedRoute>} />
          <Route path="/settings/tts" element={<ProtectedRoute><TtsSettingsPage /></ProtectedRoute>} />

          {/* Owner View Group */}
          <Route path="/owner/employees" element={<ProtectedRoute><EmployeesPage /></ProtectedRoute>} />
          <Route path="/owner/inventory/alerts" element={<ProtectedRoute><InventoryAlertsPage /></ProtectedRoute>} />
          <Route path="/owner/reviews" element={<ProtectedRoute><ReviewsPage /></ProtectedRoute>} />
          <Route path="/owner/settings" element={<ProtectedRoute><OwnerSettingsPage /></ProtectedRoute>} />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
