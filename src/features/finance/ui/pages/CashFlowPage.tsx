import { AdminLayout } from "@shared/ui/templates/AdminLayout";
import { Button } from "@shared/ui/atoms/Button";
import { Card, CardHeader, CardTitle } from "@shared/ui/atoms/Card";
import { StatCard } from "@shared/ui/molecules/StatCard";
import { useCashFlowViewModel } from "../viewmodels/useCashFlowViewModel";
import { formatPrice } from "@features/menu/domain/entities/MenuItem";

export function CashFlowPage() {
  const { entries, totalIn, totalOut, balance, isLoading } = useCashFlowViewModel();

  return (
    <AdminLayout title="Arus Kas">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Arus Kas Harian</h2>
          <p className="text-xs text-slate-500">Pemasukan & pengeluaran kas.</p>
        </div>
        <Button variant="primary" size="sm">+ Catat</Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
              <div className="h-4 w-1/2 rounded bg-slate-200" />
              <div className="mt-4 h-8 w-3/4 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StatCard title="Masuk" value={formatPrice(totalIn)} subtitle="pemasukan" icon={<span>🟢</span>} />
          <StatCard title="Keluar" value={formatPrice(totalOut)} subtitle="pengeluaran" icon={<span>🔴</span>} />
          <StatCard title="Saldo" value={formatPrice(balance)} subtitle="net" icon={<span>💰</span>} />
        </div>
      )}

      <Card className="mt-6">
        <CardHeader>
          <div>
            <CardTitle>Transaksi</CardTitle>
            <p className="text-xs text-slate-500">{entries.length} entri.</p>
          </div>
        </CardHeader>
        <div className="p-4 overflow-x-auto">
          {entries.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-8">Belum ada data.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-3 py-2">Tanggal</th>
                  <th className="px-3 py-2">Tipe</th>
                  <th className="px-3 py-2">Kategori</th>
                  <th className="px-3 py-2">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entries.map((e) => (
                  <tr key={e.id} className="font-medium text-slate-700">
                    <td className="px-3 py-3">{e.date}</td>
                    <td className="px-3 py-3">{e.type === "in" ? "Masuk" : "Keluar"}</td>
                    <td className="px-3 py-3">{e.category}</td>
                    <td className={`px-3 py-3 ${e.type === "in" ? "text-green-600" : "text-red-600"}`}>
                      {e.type === "in" ? "+" : "-"}{formatPrice(e.amount)}
                    </td>
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
