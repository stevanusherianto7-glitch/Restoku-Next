import { AdminLayout } from "@shared/ui/templates/AdminLayout";
import { Button } from "@shared/ui/atoms/Button";
import { StatCard } from "@shared/ui/molecules/StatCard";
import { Badge } from "@shared/ui/atoms/Badge";
import { useProfitLossViewModel } from "../viewmodels/useProfitLossViewModel";
import { formatPrice } from "@features/menu/domain/entities/MenuItem";

export function ProfitLossPage() {
  const { pnl, isLoading } = useProfitLossViewModel();

  return (
    <AdminLayout title="Laba & Rugi">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Laporan P&L</h2>
          <p className="text-xs text-slate-500">{pnl?.period ?? "-"}</p>
          {pnl?.isEstimate && <Badge variant="warning" className="mt-1">~Estimasi</Badge>}
        </div>
        <Button variant="primary" size="sm">+ Pilih Periode</Button>
      </div>

      {isLoading || !pnl ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
              <div className="h-4 w-1/2 rounded bg-slate-200" />
              <div className="mt-4 h-8 w-3/4 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
          <StatCard title="Revenue" value={formatPrice(pnl.revenue)} subtitle="pendapatan" icon={<span>💰</span>} />
          <StatCard title="COGS" value={formatPrice(pnl.cogs)} subtitle="harga pokok" icon={<span>📦</span>} />
          <StatCard title="OPEX" value={formatPrice(pnl.opex)} subtitle="operasional" icon={<span>⚙️</span>} />
          <StatCard title="Net Profit" value={formatPrice(pnl.netProfit)} subtitle={`margin ${pnl.marginPct}%`} icon={<span>📈</span>} />
        </div>
      )}
    </AdminLayout>
  );
}
