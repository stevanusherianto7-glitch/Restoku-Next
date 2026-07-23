import { useState } from "react";
import { useTableViewModel } from "@features/tables/ui/viewmodels/useTableViewModel";
import { useAuthStore } from "@features/auth/ui/stores/useAuthStore";
import { Button } from "@shared/ui/atoms/Button";
import { Input } from "@shared/ui/atoms/Input";
import { Badge } from "@shared/ui/atoms/Badge";
import { Card } from "@shared/ui/atoms/Card";
import { AdminLayout } from "@shared/ui/templates/AdminLayout";
import type { TableId } from "@features/tables/domain/entities/RestaurantTable";

export function TableManagementPage() {
  const { user } = useAuthStore();
  const restaurantId = user?.tenant_id || "";

  const { tables, isLoading, createTable, deleteTable, generateQr } =
    useTableViewModel(restaurantId);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTableName, setNewTableName] = useState("");
  const [newTableNumber, setNewTableNumber] = useState(1);

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTable({ name: newTableName, number: newTableNumber });
    setShowAddModal(false);
    setNewTableName("");
    setNewTableNumber(tables.length + 1);
  };

  const handleGenerateQr = async (tableId: TableId) => {
    const results = await generateQr([tableId]);
    const firstResult = results[0];
    if (firstResult) {
      window.open(firstResult.qrUrl, "_blank");
    }
  };

  const handlePrintAllQr = async () => {
    const tableIds = tables.map((t) => t.id);
    await generateQr(tableIds);
  };

  return (
    <AdminLayout title="Denah Meja & QR Self-Order">
      {/* Top Banner Action */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Manajemen Meja Pelanggan</h2>
          <p className="text-xs text-slate-500">Cetak QR Code unik untuk tiap nomor meja agar pelanggan bisa pesan mandiri.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrintAllQr}>
            Cetak Semua QR
          </Button>
          <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
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
          <Button variant="primary" size="sm" className="mt-4" onClick={() => setShowAddModal(true)}>
            + Tambah Meja Pertama
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tables.map((table) => (
            <Card hoverable key={table.id} className="relative">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-base font-extrabold text-white shadow-md">
                    {table.number}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">{table.name}</h3>
                    <p className="text-xs font-semibold text-slate-400">Meja {table.number}</p>
                  </div>
                </div>
                <Badge variant={table.is_active ? "success" : "danger"}>
                  {table.is_active ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>

              <div className="mt-5 flex gap-2 pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleGenerateQr(table.id)}
                >
                  <svg className="h-4 w-4 mr-1 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  Lihat QR
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-rose-600 hover:bg-rose-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-extrabold text-slate-900">Tambah Meja Baru</h3>
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
                <Button type="submit" variant="primary" size="sm">
                  Simpan Meja
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
