import { AdminLayout } from "@shared/ui/templates/AdminLayout";
import { Button } from "@shared/ui/atoms/Button";
import { Card, CardHeader, CardTitle } from "@shared/ui/atoms/Card";
import { Badge } from "@shared/ui/atoms/Badge";
import { Link } from "react-router-dom";

interface FeaturePlaceholderPageProps {
  title: string;
  category: string;
  description: string;
  icon?: string;
  quickActions?: { label: string; href: string }[];
}

export function FeaturePlaceholderPage({
  title,
  category,
  description,
  quickActions = [
    { label: "Buka POS Kasir", href: "/pos" },
    { label: "Kelola Menu", href: "/menu" },
    { label: "Lihat Laporan", href: "/reports" },
  ],
}: FeaturePlaceholderPageProps) {
  return (
    <AdminLayout title={title}>
      {/* Top Banner */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-cabe-950 p-6 text-white shadow-lg">
        <div>
          <span className="inline-block rounded-lg bg-cabe-500/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-cabe-300 border border-cabe-500/30">
            {category}
          </span>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            {title}
          </h2>
          <p className="mt-1 text-xs text-slate-300 sm:text-sm">
            {description}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="accent" size="sm">
            + Tambah Entri Baru
          </Button>
        </div>
      </div>

      {/* Feature Status & Quick Shortcuts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Ringkasan Modul {title}</CardTitle>
              <p className="text-xs text-slate-500">Data operasional terintegrasi otomatis dengan sistem Kasir Restoku</p>
            </div>
            <Badge variant="success" size="sm">Aktif / Real-time</Badge>
          </CardHeader>

          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status Modul</p>
                <p className="mt-1 text-base font-extrabold text-slate-900">Terhubung</p>
                <span className="text-[10px] text-emerald-600 font-semibold">✓ Synchronized</span>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Entri</p>
                <p className="mt-1 text-base font-extrabold text-slate-900">24 Data</p>
                <span className="text-[10px] text-slate-400">Pembaruan hari ini</span>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Otorisasi Peran</p>
                <p className="mt-1 text-base font-extrabold text-cabe-600">Full Access</p>
                <span className="text-[10px] text-slate-400">Owner & Manager</span>
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/30">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cabe-50 text-cabe-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-3 text-sm font-extrabold text-slate-900">Modul {title} Siap Digunakan</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                Seluruh rekapan data di modul ini secara otomatis terhubung dengan POS Kasir, Katalog Menu, dan Laporan Keuangan Restoku.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <Button variant="primary" size="sm">
                  Kelola Data {title}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Right Card: Quick Navigation */}
        <Card className="h-full">
          <CardHeader>
            <div>
              <CardTitle>Pintas Cepat Navigasi</CardTitle>
              <p className="text-xs text-slate-500">Akses cepat ke modul inti terkait</p>
            </div>
          </CardHeader>

          <div className="p-4 space-y-3">
            {quickActions.map((action, idx) => (
              <Link
                key={idx}
                to={action.href}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 hover:bg-slate-100/80 hover:border-slate-200 transition-all group"
              >
                <span className="text-xs font-bold text-slate-800 group-hover:text-cabe-600 transition-colors">
                  {action.label}
                </span>
                <span className="text-xs text-slate-400 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
