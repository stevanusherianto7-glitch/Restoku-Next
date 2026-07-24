import { AdminLayout } from "@shared/ui/templates/AdminLayout";
import { Button } from "@shared/ui/atoms/Button";
import { Card, CardHeader, CardTitle } from "@shared/ui/atoms/Card";
import { Input } from "@shared/ui/atoms/Input";
import { Badge } from "@shared/ui/atoms/Badge";
import { useOwnerSettingsViewModel } from "../viewmodels/useOwnerSettingsViewModel";

export function OwnerSettingsPage() {
  const { settings, isLoading, save } = useOwnerSettingsViewModel();

  if (isLoading || !settings) {
    return (
      <AdminLayout title="Pengaturan Owner">
        <div className="animate-pulse rounded-2xl bg-white p-6 shadow-sm border border-slate-100 h-64" />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Pengaturan Owner">
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80">
        <h2 className="text-lg font-extrabold text-slate-900">Profil Tenant</h2>
        <p className="text-xs text-slate-500">Info pemilik & paket berlangganan.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Form Owner</CardTitle>
            <Badge variant="info">{settings.subscriptionPlan.toUpperCase()}</Badge>
          </div>
        </CardHeader>
        <div className="p-4 space-y-4 max-w-lg">
          <div>
            <label className="text-xs font-medium text-slate-500">Nama Tenant</label>
            <Input defaultValue={settings.tenantName} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Nama Pemilik</label>
            <Input defaultValue={settings.ownerName} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Email</label>
            <Input defaultValue={settings.email} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Telepon</label>
            <Input defaultValue={settings.phone} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Paket</label>
            <select
              defaultValue={settings.subscriptionPlan}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              onChange={() => undefined}
            >
              <option value="trial">Trial</option>
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          <Button variant="primary" size="sm" onClick={() => save(settings)}>Simpan</Button>
        </div>
      </Card>
    </AdminLayout>
  );
}
