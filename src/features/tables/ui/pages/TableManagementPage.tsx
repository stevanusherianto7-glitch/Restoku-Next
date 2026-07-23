import { useState } from "react";
import { useTableViewModel } from "@features/tables/ui/viewmodels/useTableViewModel";
import { useAuthStore } from "@features/auth/ui/stores/useAuthStore";
import { Button } from "@shared/ui/atoms/Button";
import { Input } from "@shared/ui/atoms/Input";
import { Badge } from "@shared/ui/atoms/Badge";
import { Card } from "@shared/ui/atoms/Card";
import { AdminLayout } from "@shared/ui/templates/AdminLayout";
import type { TableId } from "@features/tables/domain/entities/RestaurantTable";

interface QrItem {
  tableNumber: number;
  tableName: string;
  qrUrl: string;
  targetUrl: string;
}

export function TableManagementPage() {
  const { user } = useAuthStore();
  const restaurantId = user?.tenant_id || "rest-1";

  const { tables, isLoading, createTable, deleteTable, generateQr, isCreating, isDeleting } =
    useTableViewModel(restaurantId);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTableName, setNewTableName] = useState("");
  const [newTableNumber, setNewTableNumber] = useState(1);
  const [qrModalData, setQrModalData] = useState<{
    title: string;
    items: QrItem[];
  } | null>(null);

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTable({ name: newTableName, number: newTableNumber });
    setShowAddModal(false);
    setNewTableName("");
    setNewTableNumber(tables.length + 2);
  };

  const handleGenerateQr = async (tableId: TableId) => {
    const table = tables.find((t) => t.id === tableId);
    const results = await generateQr([tableId]);
    const firstResult = results[0];
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const targetUrl = `${origin}/menu/${restaurantId}?table=${table?.number || 1}`;

    if (firstResult && table) {
      setQrModalData({
        title: `Stiker QR Code - ${table.name}`,
        items: [
          {
            tableNumber: table.number,
            tableName: table.name,
            qrUrl: firstResult.qrUrl,
            targetUrl,
          },
        ],
      });
    }
  };

  const handlePrintAllQr = async () => {
    if (tables.length === 0) return;
    const tableIds = tables.map((t) => t.id);
    const results = await generateQr(tableIds);
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

    const items: QrItem[] = results.map((res) => {
      const table = tables.find((t) => t.id === res.tableId);
      const num = table ? table.number : 1;
      return {
        tableNumber: num,
        tableName: table ? table.name : `Meja ${num}`,
        qrUrl: res.qrUrl,
        targetUrl: `${origin}/menu/${restaurantId}?table=${num}`,
      };
    });
    setQrModalData({
      title: "Lembar Cetak QR Code Self-Order Semua Meja",
      items,
    });
  };

  return (
    <AdminLayout title="Denah Meja & QR Self-Order">
      {/* Top Banner Action */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Manajemen Meja Pelanggan</h2>
          <p className="text-xs text-slate-500">
            Kelola nomor meja, pantau ketersediaan, dan cetak stiker QR Self-Order yang mengarahkan langsung ke Buku Menu Digital.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrintAllQr} disabled={tables.length === 0}>
            🖨️ Cetak Semua QR
          </Button>
          <Button variant="primary" size="sm" onClick={() => {
            setNewTableNumber(tables.length + 1);
            setNewTableName(`Meja ${tables.length + 1}`);
            setShowAddModal(true);
          }}>
            + Tambah Meja Baru
          </Button>
        </div>
      </div>

      {/* Tables Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
              <div className="h-10 w-10 rounded-xl bg-slate-200" />
              <div className="mt-4 h-4 w-1/2 rounded bg-slate-200" />
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
          <p className="mt-1 text-xs text-slate-500">Tambahkan nomor meja untuk mencetak stiker QR Order pelanggan.</p>
          <Button variant="primary" size="sm" className="mt-4" onClick={() => {
            setNewTableNumber(1);
            setNewTableName("Meja 1");
            setShowAddModal(true);
          }}>
            + Tambah Meja Pertama
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tables.map((table) => (
            <Card hoverable key={table.id} className="relative transition-all duration-200 hover:-translate-y-0.5">
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

              <div className="mt-5 flex gap-2 pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 font-bold text-xs"
                  onClick={() => handleGenerateQr(table.id)}
                >
                  <svg className="h-4 w-4 mr-1 text-cabe-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  Lihat QR Stiker
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-rose-600 hover:bg-rose-50"
                  disabled={isDeleting}
                  onClick={() => deleteTable(table.id)}
                >
                  Hapus
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-extrabold text-slate-900">Tambah Meja Baru</h3>
            <p className="text-xs text-slate-500 mt-1">Daftarkan nomor meja untuk mencetak stiker QR Menu Digital.</p>
            <form onSubmit={handleAddTable} className="mt-4 space-y-4">
              <Input
                label="Nama Meja"
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                placeholder="Contoh: Meja VIP 1, Area Teras"
                required
              />
              <Input
                label="Nomor Meja"
                type="number"
                value={newTableNumber}
                onChange={(e) => setNewTableNumber(Number(e.target.value))}
                min={1}
                required
              />
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Batal
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={isCreating}>
                  {isCreating ? "Menyimpan..." : "Simpan Meja"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Printable Modal */}
      {qrModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{qrModalData.title}</h3>
                <p className="text-xs text-slate-500">Pindai QR ini dari ponsel untuk membuka Buku Menu Digital Customer View</p>
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

            {/* QR Stickers Print Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-2">
              {qrModalData.items.map((item) => (
                <div
                  key={item.tableNumber}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-5 text-center shadow-xs"
                >
                  <div className="text-[10px] font-extrabold tracking-widest text-cabe-600 uppercase mb-1">
                    RESTOKU QR ORDER
                  </div>
                  <div className="text-sm font-black text-slate-900">
                    {item.tableName}
                  </div>
                  <div className="my-3 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
                    <img src={item.qrUrl} alt={`QR Meja ${item.tableNumber}`} className="h-36 w-36 object-contain" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">
                    Scan Meja #{item.tableNumber} untuk Pesan
                  </span>
                  <a
                    href={item.targetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 text-xs font-bold text-cabe-600 hover:underline flex items-center justify-center gap-1 bg-cabe-50 px-3 py-1.5 rounded-xl border border-cabe-200/80 transition-all hover:bg-cabe-100"
                  >
                    📱 Buka Menu Digital ↗
                  </a>
                </div>
              ))}
            </div>

            {/* Modal Footer Actions */}
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
