import { AdminLayout } from "@shared/ui/templates/AdminLayout";
import { Button } from "@shared/ui/atoms/Button";
import { Card, CardHeader, CardTitle } from "@shared/ui/atoms/Card";
import { StatCard } from "@shared/ui/molecules/StatCard";
import { useExpensesViewModel } from "../viewmodels/useExpensesViewModel";
import { formatPrice } from "@features/menu/domain/entities/MenuItem";

export function ExpensesPage() {
  const { expenses, totalThisMonth, isLoading } = useExpensesViewModel();

  return (
    <AdminLayout title="Biaya Operasional">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Biaya Operasional</h2>
          <p className="text-xs text-slate-500">Total bulan ini.</p>
        </div>
        <Button variant="primary" size="sm">+ Catat Biaya</Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
              <div className="h-4 w-1/2 rounded bg-slate-200" />
              <div className="mt-4 h-8 w-3/4 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <StatCard title="Total Bulan Ini" value={formatPrice(totalThisMonth)} subtitle="pengeluaran" icon={<span>🔴</span>} />
          <StatCard title="Jumlah Biaya" value={String(expenses.length)} subtitle="transaksi" icon={<span>🧾</span>} />
        </div>
      )}

      <Card className="mt-6">
        <CardHeader>
          <div>
            <CardTitle>Daftar Biaya</CardTitle>
            <p className="text-xs text-slate-500">{expenses.length} entri.</p>
          </div>
        </CardHeader>
        <div className="p-4 overflow-x-auto">
          {expenses.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-8">Belum ada data.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-3 py-2">Tanggal</th>
                  <th className="px-3 py-2">Kategori</th>
                  <th className="px-3 py-2">Jumlah</th>
                  <th className="px-3 py-2">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((e) => (
                  <tr key={e.id} className="font-medium text-slate-700">
                    <td className="px-3 py-3">{e.date}</td>
                    <td className="px-3 py-3">{e.category}</td>
                    <td className="px-3 py-3 text-red-600">{formatPrice(e.amount)}</td>
                    <td className="px-3 py-3 text-slate-500">{e.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </AdminLayout>
  );
}
