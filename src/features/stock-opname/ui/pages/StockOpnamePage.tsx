import { AdminLayout } from "@shared/ui/templates/AdminLayout";
import { Card, CardHeader, CardTitle } from "@shared/ui/atoms/Card";
import { Badge } from "@shared/ui/atoms/Badge";
import { useStockOpnameViewModel } from "../viewmodels/useStockOpnameViewModel";

export function StockOpnamePage() {
  const { records, isLoading } = useStockOpnameViewModel();

  return (
    <AdminLayout title="Stock Opname">
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80">
        <h2 className="text-lg font-extrabold text-slate-900">Catatan Opname</h2>
        <p className="text-xs text-slate-500">Selisih stok sistem vs fisik.</p>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Hasil Opname</CardTitle>
            <p className="text-xs text-slate-500">{records.length} catatan.</p>
          </div>
        </CardHeader>
        <div className="p-4 overflow-x-auto">
          {isLoading ? (
            <p className="text-center text-xs text-slate-400 py-8">Memuat...</p>
          ) : records.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-8">Belum ada data.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-3 py-2">Tanggal</th>
                  <th className="px-3 py-2">Item</th>
                  <th className="px-3 py-2">Sistem</th>
                  <th className="px-3 py-2">Fisik</th>
                  <th className="px-3 py-2">Selisih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r) => (
                  <tr key={r.id} className="font-medium text-slate-700">
                    <td className="px-3 py-3">{r.date}</td>
                    <td className="px-3 py-3">{r.itemName}</td>
                    <td className="px-3 py-3">{r.systemStock}</td>
                    <td className="px-3 py-3">{r.physicalStock}</td>
                    <td className="px-3 py-3">
                      <Badge variant={r.difference === 0 ? "success" : "danger"}>
                        {r.difference > 0 ? "+" : ""}{r.difference}
                      </Badge>
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
