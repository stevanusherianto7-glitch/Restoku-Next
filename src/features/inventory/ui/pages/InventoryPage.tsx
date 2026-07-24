import { AdminLayout } from "@shared/ui/templates/AdminLayout";
import { Button } from "@shared/ui/atoms/Button";
import { Card, CardHeader, CardTitle } from "@shared/ui/atoms/Card";
import { StatCard } from "@shared/ui/molecules/StatCard";
import { Badge } from "@shared/ui/atoms/Badge";
import { useInventoryViewModel } from "../viewmodels/useInventoryViewModel";
import { formatPrice } from "@features/menu/domain/entities/MenuItem";

export function InventoryPage() {
  const { items, lowStock, isLoading } = useInventoryViewModel();

  return (
    <AdminLayout title="Stok Bahan Baku">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Manajemen Stok</h2>
          <p className="text-xs text-slate-500">Pantau bahan baku dan stok minimum.</p>
        </div>
        <Button variant="primary" size="sm">+ Tambah Bahan</Button>
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
          <StatCard title="Total Item" value={String(items.length)} subtitle="bahan baku" icon={<span>📦</span>} />
          <StatCard title="Stok Menipis" value={String(lowStock)} subtitle="perlu restock" icon={<span>⚠️</span>} />
          <StatCard title="Kategori" value={String(new Set(items.map((i) => i.category)).size)} subtitle="jenis" icon={<span>🏷️</span>} />
        </div>
      )}

      <Card className="mt-6">
        <CardHeader>
          <div>
            <CardTitle>Daftar Bahan Baku</CardTitle>
            <p className="text-xs text-slate-500">{items.length} item terdaftar.</p>
          </div>
        </CardHeader>
        <div className="p-4 overflow-x-auto">
          {items.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-8">Belum ada data.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-3 py-2">Nama</th>
                  <th className="px-3 py-2">Unit</th>
                  <th className="px-3 py-2">Stok</th>
                  <th className="px-3 py-2">Min</th>
                  <th className="px-3 py-2">Biaya/Unit</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((it) => (
                  <tr key={it.id} className="font-medium text-slate-700">
                    <td className="px-3 py-3">{it.name}</td>
                    <td className="px-3 py-3">{it.unit}</td>
                    <td className="px-3 py-3">{it.stock}</td>
                    <td className="px-3 py-3">{it.minStock}</td>
                    <td className="px-3 py-3">{formatPrice(it.costPerUnit)}</td>
                    <td className="px-3 py-3">
                      {it.stock <= it.minStock ? (
                        <Badge variant="danger">Menipis</Badge>
                      ) : (
                        <Badge variant="success">Aman</Badge>
                      )}
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
