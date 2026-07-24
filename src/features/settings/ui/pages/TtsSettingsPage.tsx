import { AdminLayout } from "@shared/ui/templates/AdminLayout";
import { Button } from "@shared/ui/atoms/Button";
import { Card, CardHeader, CardTitle } from "@shared/ui/atoms/Card";
import { useTtsSettingsViewModel } from "../viewmodels/useTtsSettingsViewModel";

export function TtsSettingsPage() {
  const { config, isLoading, save } = useTtsSettingsViewModel();

  if (isLoading || !config) {
    return (
      <AdminLayout title="Pengaturan TTS">
        <div className="animate-pulse rounded-2xl bg-white p-6 shadow-sm border border-slate-100 h-64" />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Pengaturan TTS (Voice Order)">
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80">
        <h2 className="text-lg font-extrabold text-slate-900">Text-to-Speech Dapur</h2>
        <p className="text-xs text-slate-500">Suara pengumuman order baru di layar dapur.</p>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Pengaturan Suara</CardTitle>
          </div>
        </CardHeader>
        <div className="p-4 space-y-4 max-w-lg">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" defaultChecked={config.enabled} /> Aktifkan TTS
          </label>
          <div>
            <label className="text-xs font-medium text-slate-500">Voice</label>
            <select defaultValue={config.voice} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <option value="id-ID-Wavenet-A">Wanita (id-ID-A)</option>
              <option value="id-ID-Wavenet-B">Pria (id-ID-B)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Kecepatan: {config.rate}x</label>
            <input type="range" min={0.5} max={2} step={0.1} defaultValue={config.rate} className="w-full" />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" defaultChecked={config.announceNewOrder} /> Umumkan order baru
          </label>
          <Button variant="primary" size="sm" onClick={() => save(config)}>Simpan</Button>
        </div>
      </Card>
    </AdminLayout>
  );
}
