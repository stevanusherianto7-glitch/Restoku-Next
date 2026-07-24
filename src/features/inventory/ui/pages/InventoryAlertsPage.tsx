import { AdminLayout } from "@shared/ui/templates/AdminLayout";
import { Card, CardHeader, CardTitle } from "@shared/ui/atoms/Card";
import { Badge } from "@shared/ui/atoms/Badge";
import { useInventoryAlertsViewModel } from "../viewmodels/useInventoryAlertsViewModel";

export function InventoryAlertsPage() {
  const { alerts, isLoading } = useInventoryAlertsViewModel();

  return (
    <AdminLayout title="Peringatan Stok">
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80">
        <h2 className="text-lg font-extrabold text-slate-900">Stok Menipis</h2>
        <p className="text-xs text-slate-500">Item yang butuh restock segera.</p>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Daftar Peringatan</CardTitle>
            <p className="text-xs text-slate-500">{alerts.length} alert.</p>
          </div>
        </CardHeader>
        <div className="p-4 space-y-3">
          {isLoading ? (
            <p className="text-center text-xs text-slate-400 py-8">Memuat...</p>
          ) : alerts.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-8">Stok aman 🎉</p>
          ) : (
            alerts.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
                <div>
                  <div className="font-bold text-slate-800">{a.itemName}</div>
                  <div className="text-xs text-slate-400">Stok {a.stock} / min {a.minStock}</div>
                </div>
                <Badge variant={a.severity === "critical" ? "danger" : "warning"}>
                  {a.severity === "critical" ? "Kritis" : "Rendah"}
                </Badge>
              </div>
            ))
          )}
        </div>
      </Card>
    </AdminLayout>
  );
}
