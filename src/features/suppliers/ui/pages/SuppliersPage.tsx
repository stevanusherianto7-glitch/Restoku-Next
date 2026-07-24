import { AdminLayout } from "@shared/ui/templates/AdminLayout";
import { Button } from "@shared/ui/atoms/Button";
import { Card, CardHeader, CardTitle } from "@shared/ui/atoms/Card";
import { StatCard } from "@shared/ui/molecules/StatCard";
import { useSuppliersViewModel } from "../viewmodels/useSuppliersViewModel";

export function SuppliersPage() {
  const { suppliers, isLoading } = useSuppliersViewModel();

  return (
    <AdminLayout title="Supplier & Pembelian">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Daftar Supplier</h2>
          <p className="text-xs text-slate-500">Kelola vendor bahan baku & lead time.</p>
        </div>
        <Button variant="primary" size="sm">+ Tambah Supplier</Button>
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
          <StatCard title="Total Supplier" value={String(suppliers.length)} subtitle="vendor aktif" icon={<span>🏭</span>} />
        </div>
      )}

      <Card className="mt-6">
        <CardHeader>
          <div>
            <CardTitle>Supplier</CardTitle>
            <p className="text-xs text-slate-500">{suppliers.length} terdaftar.</p>
          </div>
        </CardHeader>
        <div className="p-4 overflow-x-auto">
          {suppliers.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-8">Belum ada data.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-3 py-2">Nama</th>
                  <th className="px-3 py-2">Kontak</th>
                  <th className="px-3 py-2">Telepon</th>
                  <th className="px-3 py-2">Lead Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {suppliers.map((s) => (
                  <tr key={s.id} className="font-medium text-slate-700">
                    <td className="px-3 py-3">{s.name}</td>
                    <td className="px-3 py-3">{s.contact}</td>
                    <td className="px-3 py-3">{s.phone}</td>
                    <td className="px-3 py-3">{s.leadTimeDays} hari</td>
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
