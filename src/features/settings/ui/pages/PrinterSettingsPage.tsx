import { AdminLayout } from "@shared/ui/templates/AdminLayout";
import { Button } from "@shared/ui/atoms/Button";
import { Card, CardHeader, CardTitle } from "@shared/ui/atoms/Card";
import { Input } from "@shared/ui/atoms/Input";
import { usePrinterSettingsViewModel } from "../viewmodels/usePrinterSettingsViewModel";

export function PrinterSettingsPage() {
  const { config, isLoading, save } = usePrinterSettingsViewModel();

  if (isLoading || !config) {
    return (
      <AdminLayout title="Konfigurasi Printer">
        <div className="animate-pulse rounded-2xl bg-white p-6 shadow-sm border border-slate-100 h-64" />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Konfigurasi Printer">
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80">
        <h2 className="text-lg font-extrabold text-slate-900">Printer Struk</h2>
        <p className="text-xs text-slate-500">Atur cetak otomatis struk.</p>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Pengaturan</CardTitle>
          </div>
        </CardHeader>
        <div className="p-4 space-y-4 max-w-lg">
          <div>
            <label className="text-xs font-medium text-slate-500">Nama Printer</label>
            <Input defaultValue={config.printerName} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Ukuran Kertas</label>
            <select defaultValue={config.paperSize} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <option value="58mm">58mm</option>
              <option value="80mm">80mm</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" defaultChecked={config.autoPrint} /> Cetak otomatis setelah bayar
          </label>
          <div>
            <label className="text-xs font-medium text-slate-500">Catatan Kaki</label>
            <Input defaultValue={config.footerNote} />
          </div>
          <Button variant="primary" size="sm" onClick={() => save(config)}>Simpan</Button>
        </div>
      </Card>
    </AdminLayout>
  );
}
