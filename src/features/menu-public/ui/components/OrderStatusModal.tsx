import { useState } from "react";
import { formatPrice } from "@features/menu/domain/entities/MenuItem";
import { HALAL_LOGO_URL } from "@shared/infrastructure/media/cloudinary";

interface OrderTrackerItem {
  id: string;
  isOffline: boolean;
  orderNumber: string;
  durationMinutes: number;
  step: 1 | 2 | 3 | 4; // 1: Konfirmasi, 2: Dimasak, 3: Siap, 4: Disajikan
  items: { name: string; qty: number; price: number }[];
  total: number;
}

const MOCK_TRACKER_ORDERS: OrderTrackerItem[] = [
  {
    id: "ord-offline-1",
    isOffline: true,
    orderNumber: "OFFLINE-MRHAW5LW-E3X8",
    durationMinutes: 0,
    step: 1,
    items: [{ name: "Soto Ayam Semarang", qty: 1, price: 28000 }],
    total: 30800,
  },
  {
    id: "ord-live-1",
    isOffline: false,
    orderNumber: "ORD-MQZOAZPI-EBDG",
    durationMinutes: 15,
    step: 3,
    items: [{ name: "Soto Ayam Semarang", qty: 1, price: 28000 }],
    total: 28000,
  },
];

interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableName: string;
  restaurantName: string;
}

export function OrderStatusModal({
  isOpen,
  onClose,
  tableName,
  restaurantName,
}: OrderStatusModalProps) {
  const orders: OrderTrackerItem[] = MOCK_TRACKER_ORDERS;
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto font-sans">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#fcf9f2] text-slate-900 shadow-2xl border border-amber-100 my-auto">
        {/* Offline Banner Header */}
        <div className="bg-amber-700 py-2 px-4 text-center text-xs font-extrabold text-amber-50 flex items-center justify-center gap-2">
          <span>⚠️</span> Menampilkan Menu Offline (Koneksi Terputus/Lambat)
        </div>

        {/* Restaurant Sub-header */}
        <div className="bg-[#fffdfa] border-b border-amber-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-900 text-amber-100 font-black text-xs">
              KV
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">{restaurantName || "Kedai Elvera 57"}</h3>
              <p className="text-[11px] font-extrabold text-amber-800">{tableName} · Scan & Order</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <img
              src={HALAL_LOGO_URL}
              alt="Halal Indonesia"
              className="h-9 w-auto object-contain"
            />
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-900 border border-amber-200">
              ⏱️ {orders.length} Pesanan
            </span>
          </div>
        </div>

        {/* Title Bar with Back Button & Auto Aktif Badge */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#fcf9f2]">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-black text-slate-900 hover:text-amber-700 transition-all"
          >
            <span>‹</span> Status Pesanan
          </button>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 border border-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Auto Aktif
            </span>
            <button
              type="button"
              onClick={handleRefresh}
              className={`rounded-full p-1 text-slate-500 hover:bg-amber-100 transition-all ${
                isRefreshing ? "animate-spin" : ""
              }`}
            >
              🔄
            </button>
          </div>
        </div>

        {/* Orders Tracker List */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="rounded-3xl bg-white p-4 shadow-sm border border-amber-100/90 space-y-4"
            >
              {/* Tracker Card Header */}
              <div
                className={`rounded-2xl p-3 flex items-center justify-between border ${
                  ord.isOffline
                    ? "bg-amber-50/80 border-amber-200 text-amber-900"
                    : "bg-indigo-50/80 border-indigo-200 text-indigo-950"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{ord.isOffline ? "🔄" : "🍴"}</span>
                  <div>
                    <h4 className="text-xs font-black">
                      {ord.isOffline ? "Menunggu Jaringan (Offline)" : "Siap Diantar"}
                    </h4>
                    <span className="text-[10px] font-extrabold text-slate-500 block uppercase">
                      DURASI PROSES: {ord.durationMinutes} MNT
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold tracking-wider text-slate-400">
                  {ord.orderNumber}
                </span>
              </div>

              {/* 4 Step Stepper Progress */}
              <div className="grid grid-cols-4 gap-1 text-center py-1">
                {/* Step 1: Konfirmasi */}
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-black transition-all ${
                      ord.step > 1
                        ? "bg-emerald-500 text-white shadow-xs"
                        : ord.step === 1
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md ring-4 ring-orange-400/30 animate-pulse"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {ord.step > 1 ? "✓" : "1"}
                  </div>
                  <span className={`text-[9px] font-black uppercase ${ord.step >= 1 ? "text-amber-800" : "text-slate-400"}`}>
                    KONFIRMASI
                  </span>
                </div>

                {/* Step 2: Dimasak */}
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-black transition-all ${
                      ord.step > 2
                        ? "bg-emerald-500 text-white shadow-xs"
                        : ord.step === 2
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md ring-4 ring-orange-400/30 animate-pulse"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {ord.step > 2 ? "✓" : "2"}
                  </div>
                  <span className={`text-[9px] font-black uppercase ${ord.step >= 2 ? "text-amber-800" : "text-slate-400"}`}>
                    DIMASAK
                  </span>
                </div>

                {/* Step 3: Siap */}
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-black transition-all ${
                      ord.step > 3
                        ? "bg-emerald-500 text-white shadow-xs"
                        : ord.step === 3
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md ring-4 ring-orange-400/30 animate-pulse"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {ord.step > 3 ? "✓" : "3"}
                  </div>
                  <span className={`text-[9px] font-black uppercase ${ord.step >= 3 ? "text-amber-800" : "text-slate-400"}`}>
                    SIAP
                  </span>
                </div>

                {/* Step 4: Disajikan */}
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-black transition-all ${
                      ord.step === 4
                        ? "bg-emerald-500 text-white shadow-xs"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    4
                  </div>
                  <span className={`text-[9px] font-black uppercase ${ord.step === 4 ? "text-amber-800" : "text-slate-400"}`}>
                    DISAJIKAN
                  </span>
                </div>
              </div>

              {/* Items Breakdown & Total */}
              <div className="border-t border-amber-50 pt-3 space-y-2 text-xs">
                {ord.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between font-bold text-slate-800">
                    <span>{item.name} ×{item.qty}</span>
                    <span className="text-slate-600">{formatPrice(item.price)}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-slate-100 pt-2 font-black">
                  <span className="text-slate-900">Total</span>
                  <span className="text-emerald-700 text-sm">{formatPrice(ord.total)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Button */}
        <div className="p-4 bg-[#fffdfa] border-t border-amber-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl bg-amber-600 py-3 text-xs font-black text-white hover:bg-amber-700 transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
