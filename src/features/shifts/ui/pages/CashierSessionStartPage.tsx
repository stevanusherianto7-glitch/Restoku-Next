import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@shared/ui/templates/AdminLayout";
import { useAuthStore } from "@features/auth/ui/stores/useAuthStore";

export function CashierSessionStartPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [openingCash, setOpeningCash] = useState("500000");

  const cashierName = user?.name || "BUDI HARTONO";
  const initial = cashierName.charAt(0).toUpperCase();

  const handleStartSession = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate directly to POS Cashier after starting session
    navigate("/pos");
  };

  return (
    <AdminLayout title="Sesi Kasir">
      {/* Date & Outlet Sub-header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Sesi Kasir</h2>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Selasa, 14 Juli 2026 · Outlet Pawon Salam - Bandung
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-600 border border-emerald-500/20">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live
          </span>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
          >
            🔔
          </button>
        </div>
      </div>

      {/* Main Start Session Card */}
      <div className="flex justify-center py-6">
        <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-slate-900 text-white p-8 shadow-2xl border border-slate-800 space-y-6">
          {/* Top Circular Terminal Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-950/70 text-indigo-400 border border-indigo-700/50 shadow-inner text-2xl">
            💻
          </div>

          {/* Heading & Instructions */}
          <div className="text-center">
            <h3 className="text-xl font-black text-white">Buka Shift Kasir</h3>
            <p className="mt-2 text-xs text-slate-400 max-w-xs mx-auto leading-relaxed font-medium">
              Masukkan saldo awal laci uang tunai sebelum memulai transaksi pada shift ini.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleStartSession} className="space-y-4 pt-2">
            {/* Active Cashier Name */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">
                Kasir Aktif
              </label>
              <div className="flex items-center gap-3 rounded-2xl bg-slate-800/80 px-4 py-3.5 border border-slate-700/70 text-slate-200 font-black text-xs">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-700 text-amber-400 text-[10px]">
                  {initial}
                </span>
                <span className="tracking-wider uppercase">{cashierName}</span>
              </div>
            </div>

            {/* Opening Cash Input */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">
                Saldo Awal (Modal Tunai)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-xs font-black text-slate-400">
                  Rp
                </span>
                <input
                  type="number"
                  value={openingCash}
                  onChange={(e) => setOpeningCash(e.target.value)}
                  required
                  placeholder="500000"
                  className="w-full rounded-2xl bg-slate-800/80 pl-11 pr-4 py-3.5 text-sm font-black text-white border border-slate-700/70 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </div>

            {/* Start Session CTA Button */}
            <button
              type="submit"
              className="mt-4 w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 py-4 text-xs font-black text-white uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              Buka Sesi & Mulai Transaksi
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
