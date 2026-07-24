import { useState } from "react";
import { AdminLayout } from "@shared/ui/templates/AdminLayout";
import { Button } from "@shared/ui/atoms/Button";
import { Card, CardHeader, CardTitle } from "@shared/ui/atoms/Card";
import { Input } from "@shared/ui/atoms/Input";
import { useOutletSettingsViewModel } from "../viewmodels/useOutletSettingsViewModel";
import type { OutletSettings } from "../../domain/entities/OutletSettings";

export function OutletSettingsPage() {
  const { settings, isLoading, save } = useOutletSettingsViewModel();
  const [form, setForm] = useState<OutletSettings | null>(settings ?? null);

  if (isLoading && !form) {
    return (
      <AdminLayout title="Pengaturan Outlet">
        <div className="animate-pulse rounded-2xl bg-white p-6 shadow-sm border border-slate-100 h-64" />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Pengaturan Outlet">
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80">
        <h2 className="text-lg font-extrabold text-slate-900">Profil Outlet</h2>
        <p className="text-xs text-slate-500">Nama, alamat, tampilan, & tipe QR.</p>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Form Outlet</CardTitle>
          </div>
        </CardHeader>
        <div className="p-4 space-y-4 max-w-lg">
          <div>
            <label className="text-xs font-medium text-slate-500">Nama Outlet</label>
            <Input value={form?.name ?? ""} onChange={(e) => setForm((f) => ({ ...(f as OutletSettings), name: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Alamat</label>
            <Input value={form?.address ?? ""} onChange={(e) => setForm((f) => ({ ...(f as OutletSettings), address: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Telepon</label>
            <Input value={form?.phone ?? ""} onChange={(e) => setForm((f) => ({ ...(f as OutletSettings), phone: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Tema Layar</label>
            <select
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={form?.screenMode ?? "nano-banana"}
              onChange={(e) => setForm((f) => ({ ...(f as OutletSettings), screenMode: e.target.value as OutletSettings["screenMode"] }))}
            >
              <option value="nano-banana">Nano Banana</option>
              <option value="warm-cozy">Warm Cozy</option>
              <option value="krem">Krem Hangat</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Tipe QR</label>
            <select
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={form?.qrType ?? "self_order"}
              onChange={(e) => setForm((f) => ({ ...(f as OutletSettings), qrType: e.target.value as OutletSettings["qrType"] }))}
            >
              <option value="self_order">Self Order</option>
              <option value="queue">Antrian</option>
            </select>
          </div>
          <Button variant="primary" size="sm" onClick={() => form && save(form)}>Simpan</Button>
        </div>
      </Card>
    </AdminLayout>
  );
}
