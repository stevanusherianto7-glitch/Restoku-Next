import { useReportsViewModel } from "@features/reports/ui/viewmodels/useReportsViewModel";
import { formatPrice } from "@features/menu/domain/entities/MenuItem";
import type { ReportPeriod } from "@features/reports/domain/entities/Report";
import { Button } from "@shared/ui/atoms/Button";
import { Card, CardHeader, CardTitle } from "@shared/ui/atoms/Card";
import { StatCard } from "@shared/ui/molecules/StatCard";
import { AdminLayout } from "@shared/ui/templates/AdminLayout";

export function ReportsPage() {
  const { report, period, date, isLoading, setPeriod, setDate } =
    useReportsViewModel();

  const periods: { value: ReportPeriod; label: string }[] = [
    { value: "daily", label: "Harian" },
    { value: "weekly", label: "Mingguan" },
    { value: "monthly", label: "Bulanan" },
  ];

  return (
    <AdminLayout title="Laporan & Analitik Keuangan">
      {/* Top Banner Action */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Analisa Penjualan</h2>
          <p className="text-xs text-slate-500">Evaluasi performa omset bisnis, rata-rata transaksi, dan kategori terlaris.</p>
        </div>
        <Button variant="outline" size="sm">
          <svg className="h-4 w-4 mr-1.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Laporan PDF
        </Button>
      </div>

      {/* Filters: Period & Date */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Period Selector Tabs */}
        <div className="flex gap-2">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                period === p.value
                  ? "bg-cabe-600 text-white shadow-md shadow-cabe-600/30"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Date Picker */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Tanggal:</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-xs font-bold text-slate-900 bg-transparent focus:outline-none"
          />
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
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Omset Penjualan"
              value={formatPrice(report?.total_sales || 0)}
              subtitle={`Periode ${period}`}
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              iconBgColor="bg-cabe-50"
              iconTextColor="text-cabe-600"
            />
            <StatCard
              title="Jumlah Transaksi"
              value={`${report?.total_orders || 0} Order`}
              subtitle="Total pesanan terbayar"
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 022 2h2a2 2 0 022-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
              iconBgColor="bg-emas-50"
              iconTextColor="text-emas-600"
            />
            <StatCard
              title="Rata-rata Order (AOV)"
              value={formatPrice(report?.average_order_value || 0)}
              subtitle="Nilai rata-rata struk"
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
              iconBgColor="bg-emerald-50"
              iconTextColor="text-emerald-600"
            />
            <StatCard
              title="Kategori Utama"
              value={report?.sales_by_category[0]?.category || "-"}
              subtitle="Kontribusi pendapatan tertinggi"
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 11h.01M7 15h.01M11 7h8m-8 4h8m-8 4h8" />
                </svg>
              }
              iconBgColor="bg-sky-50"
              iconTextColor="text-sky-600"
            />
          </div>

          {/* Charts Row */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Sales by Category Progress Bars */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Distribusi Penjualan per Kategori</CardTitle>
                  <p className="text-xs text-slate-500">Persentase kontribusi omset per kategori</p>
                </div>
              </CardHeader>
              <div className="space-y-4 pt-2">
                {(report?.sales_by_category || []).map((cat) => (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="capitalize">{cat.category}</span>
                      <span>{formatPrice(cat.sales)}</span>
                    </div>
                    <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cabe-600 to-emas-500 transition-all duration-300"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                      <span>{cat.orders} pesanan</span>
                      <span>{cat.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Sales Chart Bars */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Tren Penjualan</CardTitle>
                  <p className="text-xs text-slate-500">Grafik omset berdasarkan periode {period}</p>
                </div>
              </CardHeader>
              <div className="h-64 pt-4">
                <div className="flex h-full items-end gap-1.5">
                  {(report?.daily_sales || report?.sales_by_hour || []).map((item, index) => {
                    const data = "date" in item ? item : item;
                    const maxSales = Math.max(
                      ...((report?.daily_sales || report?.sales_by_hour || []).map(
                        (i) => ("sales" in i ? i.sales : 0)
                      ) || [1]),
                      1
                    );
                    const sales = "sales" in data ? data.sales : 0;
                    const height = Math.max((sales / maxSales) * 100, 8);
                    const label = "date" in data ? data.date : ("hour" in data ? data.hour : "");
                    return (
                      <div key={index} className="group relative flex flex-1 flex-col items-center h-full justify-end">
                        <div className="absolute -top-8 hidden rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-bold text-white shadow group-hover:block z-10 whitespace-nowrap">
                          {formatPrice(sales)}
                        </div>
                        <div
                          className="w-full rounded-t-xl bg-cabe-600 group-hover:bg-cabe-700 transition-colors shadow-sm"
                          style={{ height: `${height}%` }}
                        />
                        <p className="mt-2 text-[10px] font-bold text-slate-500">
                          {period === "daily" ? label.split(":")[0] : label.slice(-2)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* Top Selling Dish Ranking Table */}
          <Card className="mt-6">
            <CardHeader>
              <div>
                <CardTitle>Peringkat Menu Terlaris</CardTitle>
                <p className="text-xs text-slate-500">Volume kuantitas terjual dan omset pendapatan</p>
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Peringkat</th>
                    <th className="px-4 py-3">Nama Menu</th>
                    <th className="px-4 py-3">Total Terjual</th>
                    <th className="px-4 py-3">Total Pendapatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {(report?.top_menus || []).map((menu, index) => (
                    <tr key={menu.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="whitespace-nowrap px-4 py-3 font-bold text-slate-900">
                        #{index + 1}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-extrabold text-slate-900">
                        {menu.name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600 font-semibold">
                        {menu.quantity_sold} Porsi
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-black text-cabe-600">
                        {formatPrice(menu.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </AdminLayout>
  );
}
