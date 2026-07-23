import { useState } from "react";
import { HALAL_LOGO_URL } from "@shared/infrastructure/media/cloudinary";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableName: string;
  restaurantName: string;
  orderType: "dine-in" | "take-away";
  onOrderTypeChange: (type: "dine-in" | "take-away") => void;
}

export function WelcomeModal({
  isOpen,
  onClose,
  tableName,
  restaurantName,
  orderType,
  onOrderTypeChange,
}: WelcomeModalProps) {
  const [step, setStep] = useState<1 | 2>(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#fffdfa] shadow-2xl border border-amber-100 my-auto animate-fadeIn">
        {/* Top Decorative Gradient Line */}
        <div className="h-2 w-full bg-gradient-to-r from-purple-500 via-rose-500 to-amber-500" />

        {step === 1 ? (
          /* STEP 1: Welcome & Order Type Selection */
          <div className="p-6 text-center space-y-5">
            {/* Logo Badge Header */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-900 p-2 text-white font-black text-xs shadow-md border-2 border-amber-600/30">
                {restaurantName ? restaurantName.slice(0, 2).toUpperCase() : "KV"}
              </div>
              <img
                src={HALAL_LOGO_URL}
                alt="Halal Indonesia"
                className="h-12 w-auto object-contain"
              />
            </div>

            {/* Title & Description */}
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Selamat Datang di <br />
                <span className="text-amber-700">{restaurantName || "Kedai Elvera 57!"}</span>
              </h2>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed max-w-xs mx-auto font-medium">
                Sajian Otentik Khas Semarang yang kini hadir lebih dekat. Resmi bersertifikat <strong className="text-slate-900">Halal</strong> & Tanpa MSG. Selamat menikmati!
              </p>
            </div>

            {/* Table Number Verification Box */}
            <div className="flex items-center justify-between rounded-2xl bg-amber-100/60 p-4 border border-amber-200/80">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-200/80 text-amber-800">
                  📍
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-black tracking-wider text-amber-800 uppercase block">
                    NOMOR MEJA ANDA
                  </span>
                  <span className="text-base font-black text-amber-900">
                    {tableName}
                  </span>
                </div>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-extrabold text-emerald-700 border border-emerald-300/60">
                ✓ Terverifikasi
              </span>
            </div>

            {/* Order Type Selector */}
            <div className="space-y-2 text-left">
              <span className="text-[11px] font-black tracking-wider text-slate-500 uppercase block">
                PILIH TIPE PESANAN
              </span>
              <div className="grid grid-cols-2 gap-3">
                {/* Dine In */}
                <button
                  type="button"
                  onClick={() => onOrderTypeChange("dine-in")}
                  className={`group relative flex flex-col items-center justify-center rounded-2xl p-5 text-center transition-all ${
                    orderType === "dine-in"
                      ? "bg-gradient-to-br from-purple-600 via-rose-500 to-amber-500 text-white shadow-lg ring-4 ring-rose-400/30 scale-[1.02]"
                      : "bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className="text-3xl mb-2">🪑</span>
                  <span className="text-sm font-black">Dine In</span>
                  <span className={`text-[11px] font-medium mt-0.5 ${orderType === "dine-in" ? "text-amber-100" : "text-slate-500"}`}>
                    Makan di tempat
                  </span>
                  {orderType === "dine-in" && (
                    <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-rose-600 text-[10px] font-bold">
                      ✓
                    </div>
                  )}
                </button>

                {/* Take Away */}
                <button
                  type="button"
                  onClick={() => onOrderTypeChange("take-away")}
                  className={`group relative flex flex-col items-center justify-center rounded-2xl p-5 text-center transition-all ${
                    orderType === "take-away"
                      ? "bg-gradient-to-br from-purple-600 via-rose-500 to-amber-500 text-white shadow-lg ring-4 ring-rose-400/30 scale-[1.02]"
                      : "bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className="text-3xl mb-2">🛍️</span>
                  <span className="text-sm font-black">Take Away</span>
                  <span className={`text-[11px] font-medium mt-0.5 ${orderType === "take-away" ? "text-amber-100" : "text-slate-500"}`}>
                    Dibawa pulang
                  </span>
                  {orderType === "take-away" && (
                    <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-rose-600 text-[10px] font-bold">
                      ✓
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full rounded-2xl bg-amber-600 py-3.5 text-sm font-black text-white shadow-lg shadow-amber-600/30 hover:bg-amber-700 transition-all flex items-center justify-center gap-2"
            >
              Lanjut <span>›</span>
            </button>
          </div>
        ) : (
          /* STEP 2: Cara Memesan Instructions */
          <div className="p-6 text-center space-y-5">
            {/* Header Icon */}
            <img
              src={HALAL_LOGO_URL}
              alt="Halal Indonesia"
              className="mx-auto h-12 w-auto object-contain"
            />

            <div>
              <h2 className="text-lg font-black text-slate-900">Cara Memesan</h2>
              <p className="mt-1 text-xs text-slate-500 font-medium">
                Cukup 3 langkah mudah, pesanan langsung masuk dapur!
              </p>
            </div>

            {/* 3 Step Instructions */}
            <div className="space-y-3 text-left">
              {/* Step 1 */}
              <div className="flex items-start gap-3 rounded-2xl bg-indigo-50/60 p-3.5 border border-indigo-100">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-black text-white">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Pilih Menu Favorit</h4>
                  <p className="mt-0.5 text-[11px] font-medium text-slate-500 leading-tight">
                    Tekan menu yang kamu inginkan, lihat foto & harga lengkap.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 rounded-2xl bg-amber-50/60 p-3.5 border border-amber-100">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-600 text-xs font-black text-white">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Masuk ke Keranjang</h4>
                  <p className="mt-0.5 text-[11px] font-medium text-slate-500 leading-tight">
                    Tambah qty, tulis catatan khusus untuk chef jika perlu.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 rounded-2xl bg-emerald-50/60 p-3.5 border border-emerald-100">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-black text-white">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Kirim Pesanan</h4>
                  <p className="mt-0.5 text-[11px] font-medium text-slate-500 leading-tight">
                    Tekan 'Pesan Sekarang' — pesanan langsung diterima dapur!
                  </p>
                </div>
              </div>
            </div>

            {/* Selected Order Type Summary */}
            <div className="flex items-center justify-between rounded-xl bg-amber-50 p-3 border border-amber-200/80">
              <div className="flex items-center gap-2 text-left">
                <span className="text-lg">{orderType === "dine-in" ? "🪑" : "🛍️"}</span>
                <div>
                  <span className="text-[10px] font-medium text-slate-500 block">Tipe pesanan dipilih</span>
                  <span className="text-xs font-extrabold text-slate-900">
                    {orderType === "dine-in" ? "Dine In — Makan di tempat" : "Take Away — Dibawa pulang"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-extrabold text-amber-700 hover:underline"
              >
                Ubah
              </button>
            </div>

            {/* Start Ordering Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500 py-3.5 text-sm font-black text-white shadow-lg shadow-indigo-500/30 hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              ✨ Mulai Pesan Sekarang!
            </button>

            <p className="text-[10px] font-bold text-slate-400">
              {tableName} · {restaurantName || "Kedai Elvera 57"} · Semarang
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
