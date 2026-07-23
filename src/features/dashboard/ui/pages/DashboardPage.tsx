import { AdminLayout } from "@shared/ui/templates/AdminLayout";
import { StatCard } from "@shared/ui/molecules/StatCard";
import { Card, CardHeader, CardTitle } from "@shared/ui/atoms/Card";
import { Badge, BadgeVariant } from "@shared/ui/atoms/Badge";
import { Button } from "@shared/ui/atoms/Button";
import { useDashboardViewModel } from "@features/dashboard/ui/viewmodels/useDashboardViewModel";
import { formatPrice } from "@features/menu/domain/entities/MenuItem";
import { getStatusLabel } from "@features/pos/domain/entities/Order";
import { Link } from "react-router-dom";

export function DashboardPage() {
  const { dashboard, isLoading, refetch } = useDashboardViewModel();

  const getBadgeVariantByStatus = (status: string): BadgeVariant => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "processing":
        return "info";
      case "cancelled":
        return "danger";
      default:
        return "neutral";
    }
  };

  return (
    <AdminLayout title="Dashboard Partner">
      {/* Top Banner / Welcome */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-cabe-950 p-6 text-white shadow-lg">
        <div>
          <span className="inline-block rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-cabe-300 backdrop-blur-sm">
            Ringkasan Operasional
          </span>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            Performa Restoran Hari Ini
          </h2>
          <p className="mt-1 text-xs text-slate-300 sm:text-sm">
            Pantau transaksi kasir, pesanan pelanggan, dan analisa menu terlaris secara real-time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Segarkan Data
          </Button>
          <Link to="/pos">
            <Button variant="accent" size="sm">
              + Buka Kasir POS
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
              <div className="h-4 w-1/2 rounded bg-slate-200" />
              <div className="mt-4 h-8 w-3/4 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Omset Penjualan"
              value={formatPrice(dashboard?.stats.today_sales || 0)}
              change={dashboard?.stats.sales_change}
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              iconBgColor="bg-cabe-50"
              iconTextColor="text-cabe-600"
            />

            <StatCard
              title="Total Pesanan"
              value={`${dashboard?.stats.today_orders || 0} Transaksi`}
              change={dashboard?.stats.orders_change}
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
              iconBgColor="bg-emas-50"
              iconTextColor="text-emas-600"
            />

            <StatCard
              title="Pesanan Aktif"
              value={dashboard?.stats.active_orders || 0}
              subtitle={`${dashboard?.stats.pending_orders || 0} sedang diproses`}
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              iconBgColor="bg-sky-50"
              iconTextColor="text-sky-600"
            />

            <StatCard
              title="Peringatan Stok"
              value={`${dashboard?.stats.low_stock_count || 0} Item`}
              subtitle="Memerlukan restock segera"
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              }
              iconBgColor="bg-rose-50"
              iconTextColor="text-rose-600"
            />
          </div>

          {/* Main Analytics Grid */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left 2 Cols: Hourly Sales & Recent Orders */}
            <div className="space-y-6 lg:col-span-2">
              {/* Hourly Chart Card */}
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>Penjualan Jam Peak</CardTitle>
                    <p className="text-xs text-slate-500">Distribusi omset sepanjang hari ini</p>
                  </div>
                  <Badge variant="neutral" size="sm">Hari ini</Badge>
                </CardHeader>
                <div className="h-56 pt-4">
                  <div className="flex h-full items-end gap-2 sm:gap-3">
                    {(dashboard?.hourly_sales || []).map((hour) => {
                      const maxSales = Math.max(...(dashboard?.hourly_sales || []).map((h) => h.sales), 1);
                      const height = Math.max((hour.sales / maxSales) * 100, 8);
                      return (
                        <div key={hour.hour} className="group relative flex flex-1 flex-col items-center h-full justify-end">
                          {/* Hover Tooltip */}
                          <div className="absolute -top-8 hidden rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-bold text-white shadow group-hover:block z-10 whitespace-nowrap">
                            {formatPrice(hour.sales)}
                          </div>
                          <div
                            className="w-full rounded-t-xl bg-gradient-to-t from-cabe-600 to-cabe-400 transition-all duration-200 group-hover:from-cabe-700 group-hover:to-cabe-500 shadow-sm"
                            style={{ height: `${height}%` }}
                          />
                          <p className="mt-2 text-[10px] font-semibold text-slate-500">{hour.hour}</p>
                        </div>
                      );
                    })}
                    {(!dashboard?.hourly_sales || dashboard.hourly_sales.length === 0) && (
                      <div className="flex h-full w-full items-center justify-center text-xs font-medium text-slate-400">
                        Belum ada grafik penjualan untuk hari ini
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Recent Orders Table */}
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>Pesanan Real-time</CardTitle>
                    <p className="text-xs text-slate-500">Transaksi terbaru dari Kasir & QR Order</p>
                  </div>
                  <Link to="/pos">
                    <Button variant="ghost" size="sm">Lihat Semua →</Button>
                  </Link>
                </CardHeader>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-4 py-3">ID Pesanan</th>
                        <th className="px-4 py-3">Meja</th>
                        <th className="px-4 py-3">Total Transaksi</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {(dashboard?.recent_orders || []).slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-slate-900">
                            #{order.id.slice(-4).toUpperCase()}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-slate-600">
                            Meja {order.table_number}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3.5 font-bold text-slate-900">
                            {formatPrice(order.total)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3.5">
                            <Badge variant={getBadgeVariantByStatus(order.status)}>
                              {getStatusLabel(order.status)}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                      {(!dashboard?.recent_orders || dashboard.recent_orders.length === 0) && (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-xs text-slate-400">
                            Belum ada pesanan terbaru
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Right 1 Col: Top Selling Dishes */}
            <div className="space-y-6">
              <Card className="h-full">
                <CardHeader>
                  <div>
                    <CardTitle>Menu Terlaris</CardTitle>
                    <p className="text-xs text-slate-500">Paling disukai pelanggan hari ini</p>
                  </div>
                  <Badge variant="secondary" size="sm">Top 5</Badge>
                </CardHeader>
                <div className="space-y-4 pt-2">
                  {(dashboard?.top_menus || []).slice(0, 5).map((menu, index) => (
                    <div
                      key={menu.id}
                      className="flex items-center gap-3.5 rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-slate-100/60 transition-colors"
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-extrabold text-xs ${
                          index === 0
                            ? "bg-emas-500 text-white shadow-sm shadow-emas-500/30"
                            : index === 1
                            ? "bg-slate-700 text-white"
                            : index === 2
                            ? "bg-amber-700 text-white"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        #{index + 1}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate text-xs font-bold text-slate-900">{menu.name}</p>
                        <p className="text-[11px] font-semibold text-slate-500">
                          {menu.quantity_sold} porsi terjual
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-cabe-600">{formatPrice(menu.revenue)}</p>
                      </div>
                    </div>
                  ))}
                  {(!dashboard?.top_menus || dashboard.top_menus.length === 0) && (
                    <div className="py-12 text-center text-xs text-slate-400">
                      Belum ada data menu terlaris
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
