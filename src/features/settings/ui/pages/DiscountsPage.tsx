import { AdminLayout } from "@shared/ui/templates/AdminLayout";
import { Button } from "@shared/ui/atoms/Button";
import { Card, CardHeader, CardTitle } from "@shared/ui/atoms/Card";
import { Badge } from "@shared/ui/atoms/Badge";
import { useDiscountsViewModel } from "../viewmodels/useDiscountsViewModel";

export function DiscountsPage() {
  const { discounts, taxes, isLoading } = useDiscountsViewModel();

  return (
    <AdminLayout title="Diskon & Pajak">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Diskon & Pajak</h2>
          <p className="text-xs text-slate-500">Atur promo & pajak outlet.</p>
        </div>
        <Button variant="primary" size="sm">+ Tambah Diskon</Button>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div>
            <CardTitle>Daftar Diskon</CardTitle>
            <p className="text-xs text-slate-500">{discounts.length} diskon.</p>
          </div>
        </CardHeader>
        <div className="p-4 overflow-x-auto">
          {isLoading ? (
            <p className="text-center text-xs text-slate-400 py-8">Memuat...</p>
          ) : discounts.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-8">Belum ada data.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-3 py-2">Nama</th>
                  <th className="px-3 py-2">Tipe</th>
                  <th className="px-3 py-2">Nilai</th>
                  <th className="px-3 py-2">Berlaku</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {discounts.map((d) => (
                  <tr key={d.id} className="font-medium text-slate-700">
                    <td className="px-3 py-3">{d.name}</td>
                    <td className="px-3 py-3"><Badge variant="info">{d.type}</Badge></td>
                    <td className="px-3 py-3">{d.type === "percent" ? `${d.value}%` : `Rp ${d.value}`}</td>
                    <td className="px-3 py-3">{d.appliesTo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <div>
            <CardTitle>Pajak</CardTitle>
          </div>
        </CardHeader>
        <div className="p-4">
          {taxes.map((t) => (
            <div key={t.id} className="flex items-center justify-between py-2">
              <span className="font-medium text-slate-700">{t.name}</span>
              <Badge variant="warning">{t.rate}%</Badge>
            </div>
          ))}
        </div>
      </Card>
    </AdminLayout>
  );
}
