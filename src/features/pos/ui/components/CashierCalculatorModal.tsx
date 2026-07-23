import { useState } from "react";
import { formatPrice } from "@features/menu/domain/entities/MenuItem";

interface CashierCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  paymentMethod: string;
  onConfirmPayment: (paidCash: number, change: number) => void;
}

export function CashierCalculatorModal({
  isOpen,
  onClose,
  totalAmount,
  paymentMethod,
  onConfirmPayment,
}: CashierCalculatorModalProps) {
  const [cashInput, setCashInput] = useState<string>("");

  if (!isOpen) return null;

  const currentPaid = Number(cashInput) || 0;
  const changeAmount = Math.max(0, currentPaid - totalAmount);
  const isInsufficient = currentPaid > 0 && currentPaid < totalAmount;

  const handleNumpadClick = (val: string) => {
    if (val === "BACKSPACE") {
      setCashInput((prev) => prev.slice(0, -1));
    } else {
      setCashInput((prev) => {
        if (prev === "0" && val !== "00" && val !== "000") return val;
        return prev + val;
      });
    }
  };

  const handlePresetClick = (amount: number) => {
    setCashInput(String(amount));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === "cash" && currentPaid < totalAmount) {
      alert(`Uang pembayaran kurang ${formatPrice(totalAmount - currentPaid)}`);
      return;
    }
    onConfirmPayment(currentPaid || totalAmount, changeAmount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 font-sans animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#141414] text-white shadow-2xl border border-slate-800 p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <span>🧮</span> Modul Kalkulator Kasir
            </h3>
            <p className="text-[11px] font-bold text-slate-400">
              Metode: <span className="uppercase text-amber-400">{paymentMethod}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            ✕
          </button>
        </div>

        {/* Total & Change Display */}
        <div className="rounded-2xl bg-slate-900/90 p-4 border border-slate-800/80 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400">
            <span>Total Harus Dibayar:</span>
            <span className="text-lg font-black text-amber-400">{formatPrice(totalAmount)}</span>
          </div>

          <div className="flex justify-between items-center text-xs font-bold text-slate-400 border-t border-slate-800 pt-2">
            <span>Uang Diterima (Tunai):</span>
            <span className="text-xl font-black text-white">
              {currentPaid > 0 ? formatPrice(currentPaid) : "Rp 0"}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs font-bold border-t border-slate-800 pt-2">
            <span>Kembalian Kasir:</span>
            <span
              className={`text-lg font-black ${
                isInsufficient
                  ? "text-rose-500"
                  : currentPaid >= totalAmount
                  ? "text-emerald-400"
                  : "text-slate-500"
              }`}
            >
              {isInsufficient
                ? `Kurang ${formatPrice(totalAmount - currentPaid)}`
                : formatPrice(changeAmount)}
            </span>
          </div>
        </div>

        {/* Quick Nominal Presets */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Nominal Cepat (Quick Cash)
          </p>
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handlePresetClick(totalAmount)}
              className="rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 py-2 text-xs font-black hover:bg-amber-500/30 transition-all"
            >
              Uang Pas
            </button>
            <button
              type="button"
              onClick={() => handlePresetClick(50000)}
              className="rounded-xl bg-slate-800 text-slate-200 border border-slate-700 py-2 text-xs font-bold hover:bg-slate-700 transition-all"
            >
              50k
            </button>
            <button
              type="button"
              onClick={() => handlePresetClick(100000)}
              className="rounded-xl bg-slate-800 text-slate-200 border border-slate-700 py-2 text-xs font-bold hover:bg-slate-700 transition-all"
            >
              100k
            </button>
            <button
              type="button"
              onClick={() => handlePresetClick(200000)}
              className="rounded-xl bg-slate-800 text-slate-200 border border-slate-700 py-2 text-xs font-bold hover:bg-slate-700 transition-all"
            >
              200k
            </button>
          </div>
        </div>

        {/* Interactive Interactive Numpad */}
        <div className="grid grid-cols-3 gap-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0", "000"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleNumpadClick(num)}
              className="rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 py-3 text-base font-black text-white shadow-xs transition-all active:scale-95"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleNumpadClick("BACKSPACE")}
            className="col-span-3 rounded-2xl bg-slate-800 hover:bg-rose-950/40 border border-slate-700 text-rose-400 py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <span>⌫ Hapus Angka Belakang</span>
          </button>
        </div>

        {/* Submit CTA */}
        <form onSubmit={handleSubmit} className="pt-2">
          <button
            type="submit"
            disabled={paymentMethod === "cash" && isInsufficient}
            className="w-full rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed py-3.5 text-xs font-black text-slate-950 uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all"
          >
            PROSES BAYAR & CETAK STRUK ({formatPrice(totalAmount)})
          </button>
        </form>
      </div>
    </div>
  );
}
