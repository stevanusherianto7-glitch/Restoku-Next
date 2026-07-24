import { AdminLayout } from "@shared/ui/templates/AdminLayout";
import { Card, CardHeader, CardTitle } from "@shared/ui/atoms/Card";
import { Badge } from "@shared/ui/atoms/Badge";
import { useOutletComparisonViewModel } from "../viewmodels/useOutletComparisonViewModel";
import { formatPrice } from "@features/menu/domain/entities/MenuItem";

export function OutletComparisonPage() {
  const { outlets, isLoading } = useOutletComparisonViewModel();
  const maxRevenue = Math.max(...outlets.map((o) => o.revenue), 1);

  return (
    <AdminLayout title="Perbandingan Outlet">
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80">
        <h2 className="text-lg font-extrabold text-slate-900">Performa Antar Outlet</h2>
        <p className="text-xs text-slate-500">Bandingkan revenue & jumlah order.</p>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Outlet</CardTitle>
            <p className="text-xs text-slate-500">{outlets.length} outlet.</p>
          </div>
        </CardHeader>
        <div className="p-4 space-y-4">
          {isLoading ? (
            <p className="text-center text-xs text-slate-400 py-8">Memuat...</p>
          ) : outlets.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-8">Belum ada data.</p>
          ) : (
            outlets.map((o) => (
              <div key={o.outletId} className="rounded-xl border border-slate-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800">{o.name}</span>
                  <Badge variant={o.comparePct >= 0 ? "success" : "danger"}>
                    {o.comparePct >= 0 ? "▲" : "▼"} {Math.abs(o.comparePct)}%
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-slate-500 w-24">Revenue</span>
                  <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: `${(o.revenue / maxRevenue) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{formatPrice(o.revenue)}</span>
                </div>
                <div className="text-xs text-slate-400">{o.orders} order</div>
              </div>
            ))
          )}
        </div>
      </Card>
    </AdminLayout>
  );
}
