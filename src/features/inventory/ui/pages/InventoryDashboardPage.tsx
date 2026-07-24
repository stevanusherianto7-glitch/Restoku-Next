import { AdminLayout } from "@shared/ui/templates/AdminLayout";
import { StatCard } from "@shared/ui/molecules/StatCard";
import { Card, CardHeader, CardTitle } from "@shared/ui/atoms/Card";
import { useInventoryDashboardViewModel } from "../viewmodels/useInventoryDashboardViewModel";
import { formatPrice } from "@features/menu/domain/entities/MenuItem";

export function InventoryDashboardPage() {
  const { dashboard, isLoading } = useInventoryDashboardViewModel();

  return (
    <AdminLayout title="Dasbor Stok">
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80">
        <h2 className="text-lg font-extrabold text-slate-900">Ringkasan Inventaris</h2>
        <p className="text-xs text-slate-500">Nilai & status stok bahan baku.</p>
      </div>

      {isLoading || !dashboard ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
              <div className="h-4 w-1/2 rounded bg-slate-200" />
              <div className="mt-4 h-8 w-3/4 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
            <StatCard title="Total Item" value={String(dashboard.totalItems)} subtitle="bahan" icon={<span>📦</span>} />
            <StatCard title="Nilai Stok" value={formatPrice(dashboard.totalValue)} subtitle="total" icon={<span>💰</span>} />
            <StatCard title="Stok Menipis" value={String(dashboard.lowStockCount)} subtitle="perlu restock" icon={<span>⚠️</span>} />
            <StatCard title="Habis" value={String(dashboard.outOfStockCount)} subtitle="kosong" icon={<span>🚫</span>} />
          </div>

          <Card className="mt-6">
            <CardHeader>
              <div>
                <CardTitle>Per Kategori</CardTitle>
                <p className="text-xs text-slate-500">Distribusi item.</p>
              </div>
            </CardHeader>
            <div className="p-4 space-y-3">
              {dashboard.categories.map((c) => (
                <div key={c.category} className="flex items-center gap-3">
                  <span className="w-28 text-sm font-medium text-slate-700">{c.category}</span>
                  <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: `${Math.min(100, (c.count / dashboard.totalItems) * 100)}%` }} />
                  </div>
                  <span className="text-sm text-slate-500">{c.count}</span>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </AdminLayout>
  );
}
