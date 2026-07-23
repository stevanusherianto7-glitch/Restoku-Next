import { useState } from "react";
import { useTableViewModel } from "@features/tables/ui/viewmodels/useTableViewModel";
import { useAuthStore } from "@features/auth/ui/stores/useAuthStore";
import { Button } from "@shared/ui/atoms/Button";
import { Badge } from "@shared/ui/atoms/Badge";
import { Card } from "@shared/ui/atoms/Card";
import { AdminLayout } from "@shared/ui/templates/AdminLayout";
import type { TableId } from "@features/tables/domain/entities/RestaurantTable";

interface QrSticker {
  tableId: TableId;
  tableName: string;
  tableNumber: number;
  qrUrl: string;
  targetUrl: string;
}

export function QrCodeMejaPage() {
  const { user } = useAuthStore();
  const restaurantId = user?.tenant_id || "rest-1";
  const { tables, isLoading, generateQr } = useTableViewModel(restaurantId);
  const [qrModalData, setQrModalData] = useState<{ title: string; items: QrSticker[] } | null>(null);

  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

  const handlePrintAll = async () => {
    if (tables.length === 0) return;
    const results = await generateQr(tables.map((t) => t.id));
    const items: QrSticker[] = results.map((res) => {
      const t = tables.find((x) => x.id === res.tableId);
      const num = t ? t.number : 1;
      return {
        tableId: res.tableId,
        tableName: t ? t.name : `Meja ${num}`,
        tableNumber: num,
        qrUrl: res.qrUrl,
        targetUrl: `${origin}/menu/${restaurantId}?table=${num}`,
      };
    });
    setQrModalData({ title: "Lembar Cetak QR Code Self-Order Semua Meja", items });
  };

  const handlePrintOne = async (tableId: TableId) => {
    const results = await generateQr([tableId]);
    const first = results[0];
    const t = tables.find((x) => x.id === tableId);
    if (!first || !t) return;
    setQrModalData({
      title: `Stiker QR Code - ${t.name}`,
      items: [
        {
          tableId,
          tableName: t.name,
          tableNumber: t.number,
          qrUrl: first.qrUrl,
          targetUrl: `${origin}/menu/${restaurantId}?table=${t.number}`,
        },
      ],
    });
  };

  return (
    <AdminLayout title="QR Code Meja">
      {/* Top Banner */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Cetak Stiker QR Self-Order</h2>
          <p className="text-xs text-slate-500">
            Generate & cetak QR Code per meja yang mengarahkan tamu langsung ke Buku Menu Digital.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handlePrintAll} disabled={tables.length === 0}>
          🖨️ Cetak Semua QR
        </Button>
      </div>

      {/* QR Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
              <div className="h-10 w-10 rounded-xl bg-slate-200" />
            </div>
          ))}
        </div>
      ) : tables.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cabe-50 text-cabe-600">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <h3 className="mt-4 text-base font-extrabold text-slate-900">Belum Ada Meja Terdaftar</h3>
          <p className="mt-1 text-xs text-slate-500">Tambahkan meja di menu "Manajemen Meja" untuk mencetak QR.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tables.map((table) => (
            <Card hoverable key={table.id} className="transition-all duration-200 hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-base font-extrabold text-white shadow-md">
                    {table.number}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">{table.name}</h3>
                    <p className="text-xs font-semibold text-slate-400">Nomor Meja {table.number}</p>
                  </div>
                </div>
                <Badge variant={table.is_active ? "success" : "danger"}>
                  {table.is_active ? "Tersedia" : "Nonaktif"}
                </Badge>
              </div>

              <div className="mt-4 flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                <div className="text-[10px] font-extrabold tracking-widest text-cabe-600 uppercase mb-1">
                  RESTOKU QR ORDER
                </div>
                <div className="my-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
                  <QrPlaceholder number={table.number} />
                </div>
                <span className="text-[11px] font-bold text-slate-600">Scan Meja #{table.number}</span>
              </div>

              <div className="mt-4 flex gap-2 pt-3 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 font-bold text-xs"
                  onClick={() => handlePrintOne(table.id)}
                >
                  Cetak QR Ini
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Printable Modal */}
      {qrModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{qrModalData.title}</h3>
                <p className="text-xs text-slate-500">Pindai QR dari ponsel untuk membuka Buku Menu Digital</p>
              </div>
              <button
                onClick={() => setQrModalData(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-2">
              {qrModalData.items.map((item) => (
                <div
                  key={item.tableId}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-5 text-center shadow-xs"
                >
                  <div className="text-[10px] font-extrabold tracking-widest text-cabe-600 uppercase mb-1">
                    RESTOKU QR ORDER
                  </div>
                  <div className="text-sm font-black text-slate-900">{item.tableName}</div>
                  <div className="my-3 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
                    <img src={item.qrUrl} alt={`QR Meja ${item.tableNumber}`} className="h-36 w-36 object-contain" />
                  </div>
                  <a
                    href={item.targetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 text-xs font-bold text-cabe-600 hover:underline flex items-center justify-center gap-1 bg-cabe-50 px-3 py-1.5 rounded-xl border border-cabe-200/80 transition-all hover:bg-cabe-100"
                  >
                    📱 Buka Menu Digital ↗
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
              <Button variant="outline" size="sm" onClick={() => setQrModalData(null)}>
                Tutup
              </Button>
              <Button variant="primary" size="sm" onClick={() => window.print()}>
                🖨️ Cetak Lembar Stiker
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// Placeholder visual QR (inline SVG) — diganti <img> nyata saat backend kirim qrUrl PNG
function QrPlaceholder({ number }: { number: number }) {
  return (
    <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-white">
      <svg viewBox="0 0 100 100" className="h-full w-full text-slate-800" fill="currentColor">
        <rect x="5" y="5" width="25" height="25" rx="3" />
        <rect x="70" y="5" width="25" height="25" rx="3" />
        <rect x="5" y="70" width="25" height="25" rx="3" />
        <rect x="40" y="40" width="20" height="20" rx="2" />
        <rect x="70" y="70" width="10" height="10" />
        <rect x="85" y="70" width="10" height="10" />
        <text x="50" y="92" fontSize="8" textAnchor="middle" fill="#cbd5e1">QR {number}</text>
      </svg>
    </div>
  );
}
