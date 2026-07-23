import { useState } from "react";
import { AdminLayout } from "@shared/ui/templates/AdminLayout";
import { Card, CardHeader, CardTitle } from "@shared/ui/atoms/Card";
import { StatCard } from "@shared/ui/molecules/StatCard";
import { Button } from "@shared/ui/atoms/Button";
import { Badge } from "@shared/ui/atoms/Badge";
import { Input } from "@shared/ui/atoms/Input";
import { formatPrice } from "@features/menu/domain/entities/MenuItem";

interface ShiftRecord {
  id: string;
  cashierName: string;
  shiftName: string;
  startTime: string;
  endTime: string | null;
  openingCash: number;
  expectedCash: number;
  actualCash: number | null;
  qrisSales: number;
  totalSales: number;
  status: "active" | "closed";
}

const INITIAL_SHIFTS: ShiftRecord[] = [
  {
    id: "shift-102",
    cashierName: "Budi Santoso (Kasir 1)",
    shiftName: "Shift 1 (Pagi)",
    startTime: "2026-07-23 08:00 WIB",
    endTime: null,
    openingCash: 500000,
    expectedCash: 2450000,
    actualCash: null,
    qrisSales: 3120000,
    totalSales: 5070000,
    status: "active",
  },
  {
    id: "shift-101",
    cashierName: "Siti Rahma (Kasir 2)",
    shiftName: "Shift 2 (Malam)",
    startTime: "2026-07-22 16:00 WIB",
    endTime: "2026-07-22 23:00 WIB",
    openingCash: 500000,
    expectedCash: 3100000,
    actualCash: 3100000,
    qrisSales: 4250000,
    totalSales: 6850000,
    status: "closed",
  },
  {
    id: "shift-100",
    cashierName: "Budi Santoso (Kasir 1)",
    shiftName: "Shift 1 (Pagi)",
    startTime: "2026-07-22 08:00 WIB",
    endTime: "2026-07-22 16:00 WIB",
    openingCash: 500000,
    expectedCash: 2150000,
    actualCash: 2150000,
    qrisSales: 2890000,
    totalSales: 4540000,
    status: "closed",
  },
];

export function ShiftPage() {
  const [shifts, setShifts] = useState<ShiftRecord[]>(INITIAL_SHIFTS);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [actualCashInput, setActualCashInput] = useState("");
  const [newOpeningCashInput, setNewOpeningCashInput] = useState("500000");

  const activeShift = shifts.find((s) => s.status === "active");

  const handleCloseShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShift) return;

    const actual = Number(actualCashInput) || activeShift.expectedCash;
    setShifts((prev) =>
      prev.map((s) =>
        s.id === activeShift.id
          ? {
              ...s,
              status: "closed",
              endTime: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
              actualCash: actual,
            }
          : s
      )
    );
    setShowCloseModal(false);
    setActualCashInput("");
  };

  const handleOpenShift = (e: React.FormEvent) => {
    e.preventDefault();
    const newShift: ShiftRecord = {
      id: `shift-${Date.now()}`,
      cashierName: "Admin Owner (Kasir)",
      shiftName: `Shift ${shifts.length + 1}`,
      startTime: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
      endTime: null,
      openingCash: Number(newOpeningCashInput) || 500000,
      expectedCash: Number(newOpeningCashInput) || 500000,
      actualCash: null,
      qrisSales: 0,
      totalSales: 0,
      status: "active",
    };
    setShifts([newShift, ...shifts]);
    setShowOpenModal(false);
  };

  return (
    <AdminLayout title="Manajemen Shift & Rekap Sesi Kasir">
      {/* Top Banner Action */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Rekapitulasi Shift Kasir</h2>
          <p className="text-xs text-slate-500">
            Kelola modal awal (cash float), hitung setoran tunai & QRIS, dan lakukan penutupan shift kasir secara akurat.
          </p>
        </div>
        <div className="flex gap-2">
          {activeShift ? (
            <Button variant="primary" size="sm" onClick={() => setShowCloseModal(true)}>
              🔒 Tutup Shift Aktif
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={() => setShowOpenModal(true)}>
              🔓 Buka Shift Baru
            </Button>
          )}
        </div>
      </div>

      {/* Active Shift Overview */}
      {activeShift && (
        <Card className="mb-6 border-l-4 border-l-cabe-600 bg-gradient-to-br from-white to-amber-50/40">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cabe-600 text-white font-extrabold text-xl shadow-md">
                💼
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900">{activeShift.shiftName}</h3>
                  <Badge variant="success">● Shift Sedang Berjalan</Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Petugas Kasir: <strong className="text-slate-800">{activeShift.cashierName}</strong> · Jam Buka: {activeShift.startTime}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Modal Awal Kasir</span>
                <span className="text-slate-900 font-extrabold">{formatPrice(activeShift.openingCash)}</span>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-slate-400 block text-[10px] uppercase">Estimasi Tunai di Laci</span>
                <span className="text-emerald-700 font-extrabold">{formatPrice(activeShift.expectedCash)}</span>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-slate-400 block text-[10px] uppercase">Total QRIS / Non-Tunai</span>
                <span className="text-sky-700 font-extrabold">{formatPrice(activeShift.qrisSales)}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Total Penjualan Shift Ini"
          value={formatPrice(activeShift?.totalSales || 0)}
          subtitle="Tunai + Non-Tunai"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          iconBgColor="bg-cabe-50"
          iconTextColor="text-cabe-600"
        />
        <StatCard
          title="Setoran Tunai (Cash)"
          value={formatPrice((activeShift?.expectedCash || 0) - (activeShift?.openingCash || 0))}
          subtitle="Pendapatan uang tunai murni"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          iconBgColor="bg-emerald-50"
          iconTextColor="text-emerald-600"
        />
        <StatCard
          title="Setoran QRIS / EDC"
          value={formatPrice(activeShift?.qrisSales || 0)}
          subtitle="Pembayaran via QRIS digital"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          }
          iconBgColor="bg-sky-50"
          iconTextColor="text-sky-600"
        />
        <StatCard
          title="Kesesuaian Kas (Varian)"
          value="Rp 0 (Sesuai)"
          subtitle="Tidak ada selisih uang"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          iconBgColor="bg-emas-50"
          iconTextColor="text-emas-600"
        />
      </div>

      {/* Shifts History Log Table */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Histori Laporan Shift Kasir</CardTitle>
            <p className="text-xs text-slate-500">Catatan rekonsiliasi kasir per jam kerja shift</p>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Shift & Kasir</th>
                <th className="px-4 py-3">Waktu Buka / Tutup</th>
                <th className="px-4 py-3">Modal Awal</th>
                <th className="px-4 py-3">Setoran Tunai</th>
                <th className="px-4 py-3">Setoran QRIS</th>
                <th className="px-4 py-3">Total Sales</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {shifts.map((shift) => (
                <tr key={shift.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="font-extrabold text-slate-900 block">{shift.shiftName}</span>
                    <span className="text-[11px] font-semibold text-slate-400">{shift.cashierName}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600 font-semibold">
                    <div>{shift.startTime}</div>
                    <div className="text-[11px] text-slate-400">{shift.endTime || "Masih Aktif"}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700 font-bold">
                    {formatPrice(shift.openingCash)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-extrabold text-emerald-700">
                    {formatPrice(shift.expectedCash)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-extrabold text-sky-700">
                    {formatPrice(shift.qrisSales)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-black text-cabe-600">
                    {formatPrice(shift.totalSales)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Badge variant={shift.status === "active" ? "success" : "neutral"}>
                      {shift.status === "active" ? "Aktif" : "Selesai"}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.print()}
                    >
                      🖨️ Cetak Struk
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Close Shift Modal */}
      {showCloseModal && activeShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-extrabold text-slate-900">Tutup Shift Kasir ({activeShift.shiftName})</h3>
            <p className="text-xs text-slate-500 mt-1">Hitung fisik uang tunai di laci untuk penutupan shift.</p>

            <form onSubmit={handleCloseShift} className="mt-4 space-y-4">
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 text-xs space-y-1.5 font-bold">
                <div className="flex justify-between text-slate-600">
                  <span>Modal Awal Kasir:</span>
                  <span>{formatPrice(activeShift.openingCash)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimasi Fisik Uang Laci:</span>
                  <span className="text-emerald-700 font-extrabold">{formatPrice(activeShift.expectedCash)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total QRIS Digital:</span>
                  <span className="text-sky-700 font-extrabold">{formatPrice(activeShift.qrisSales)}</span>
                </div>
              </div>

              <Input
                label="Jumlah Fisik Uang Tunai di Laci (Hitung Uang)"
                type="number"
                value={actualCashInput}
                onChange={(e) => setActualCashInput(e.target.value)}
                placeholder={`Contoh: ${activeShift.expectedCash}`}
                required
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCloseModal(false)}
                >
                  Batal
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Proses Tutup Shift
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Open Shift Modal */}
      {showOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-extrabold text-slate-900">Buka Shift Kasir Baru</h3>
            <p className="text-xs text-slate-500 mt-1">Masukkan modal awal uang kembalian kasir.</p>

            <form onSubmit={handleOpenShift} className="mt-4 space-y-4">
              <Input
                label="Nominal Uang Modal Awal (Cash Float)"
                type="number"
                value={newOpeningCashInput}
                onChange={(e) => setNewOpeningCashInput(e.target.value)}
                placeholder="Contoh: 500000"
                required
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOpenModal(false)}
                >
                  Batal
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Buka Shift Kasir
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
