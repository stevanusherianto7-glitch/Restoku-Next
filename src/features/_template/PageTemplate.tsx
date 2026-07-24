// TEMPLATE REFERENCE — copy this skeleton when building the 17 placeholder pages.
// Not imported by the app. Keep patterns consistent: AdminLayout, banner, StatCard grid, skeleton, NO `any`.
import { useState } from "react";
import { AdminLayout } from "@shared/ui/templates/AdminLayout";
import { Button } from "@shared/ui/atoms/Button";
import { Card, CardHeader, CardTitle } from "@shared/ui/atoms/Card";
import { StatCard } from "@shared/ui/molecules/StatCard";

interface TemplateItem {
  id: string;
  name: string;
}

export function PageTemplate() {
  const [items] = useState<TemplateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetch
  const load = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  };
  void load;

  return (
    <AdminLayout title="Judul Halaman">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Judul</h2>
          <p className="text-xs text-slate-500">Deskripsi singkat.</p>
        </div>
        <Button variant="primary" size="sm">+ Tambah Baru</Button>
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total" value={String(items.length)} subtitle="Data" icon={<span>📊</span>} />
        </div>
      )}

      <Card className="mt-6">
        <CardHeader>
          <div>
            <CardTitle>Daftar</CardTitle>
            <p className="text-xs text-slate-500">Tabel data.</p>
          </div>
        </CardHeader>
        <div className="p-4">
          {items.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-8">Belum ada data.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {items.map((it) => (
                <li key={it.id} className="py-3 text-sm font-medium text-slate-700">{it.name}</li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </AdminLayout>
  );
}
