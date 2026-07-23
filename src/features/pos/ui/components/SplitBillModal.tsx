import { useState } from "react";
import { formatPrice } from "@features/menu/domain/entities/MenuItem";
import type { PosCartItem } from "@features/pos/ui/stores/usePosCartStore";

interface SplitBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: PosCartItem[];
  totalWithTax: number;
  onConfirmSplitPayment: (splitAmount: number, description: string) => void;
}

export function SplitBillModal({
  isOpen,
  onClose,
  items,
  totalWithTax,
  onConfirmSplitPayment,
}: SplitBillModalProps) {
  const [splitMode, setSplitMode] = useState<"equal" | "itemized">("equal");
  const [peopleCount, setPeopleCount] = useState<number>(2);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const equalShare = Math.round(totalWithTax / peopleCount);

  const toggleItemSelection = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const itemizedTotal = items
    .filter((item) => selectedItemIds.includes(item.menu.id))
    .reduce((sum, item) => sum + item.menu.price * item.quantity * 1.1, 0);

  const handlePaySplit = () => {
    if (splitMode === "equal") {
      onConfirmSplitPayment(
        equalShare,
        `Bagi Rata (${peopleCount} Orang) · Rp ${equalShare.toLocaleString("id-ID")}`
      );
    } else {
      if (selectedItemIds.length === 0) {
        alert("Pilih minimal 1 item untuk pembayaran bagian ini");
        return;
      }
      onConfirmSplitPayment(
        Math.round(itemizedTotal),
        `Bayar ${selectedItemIds.length} Item Terpilih · Rp ${Math.round(
          itemizedTotal
        ).toLocaleString("id-ID")}`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 font-sans animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#141414] text-white shadow-2xl border border-slate-800 p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <span>🔀</span> Fitur Split Bill (Pisah Tagihan)
            </h3>
            <p className="text-[11px] font-bold text-slate-400">
              Total Tagihan Usaha: <span className="text-amber-400 font-black">{formatPrice(totalWithTax)}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            ✕
          </button>
        </div>

        {/* Split Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setSplitMode("equal")}
            className={`py-2 text-xs font-black rounded-xl transition-all ${
              splitMode === "equal"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            ⚖️ Bagi Rata (Equal)
          </button>
          <button
            type="button"
            onClick={() => setSplitMode("itemized")}
            className={`py-2 text-xs font-black rounded-xl transition-all ${
              splitMode === "itemized"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            📋 Per Item Menu
          </button>
        </div>

        {splitMode === "equal" ? (
          /* EQUAL SPLIT MODE */
          <div className="space-y-4 rounded-2xl bg-slate-900/90 p-4 border border-slate-800">
            <p className="text-xs font-bold text-slate-400">Pilih Jumlah Orang Split Bill:</p>
            <div className="grid grid-cols-5 gap-2">
              {[2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPeopleCount(num)}
                  className={`py-2.5 rounded-xl font-black text-xs transition-all border ${
                    peopleCount === num
                      ? "bg-emerald-500 text-white border-emerald-400 shadow-md"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  {num} Pria/Wanita
                </button>
              ))}
            </div>

            <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-xs font-bold">
              <span className="text-slate-400">Nominal per Orang ({peopleCount} orang):</span>
              <span className="text-xl font-black text-emerald-400">
                {formatPrice(equalShare)}
              </span>
            </div>
          </div>
        ) : (
          /* ITEMIZED SPLIT MODE */
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-400">Pilih Item Menu yang Dibayar Orang Ini:</p>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {items.map((item) => {
                const isSelected = selectedItemIds.includes(item.menu.id);
                return (
                  <div
                    key={item.menu.id}
                    onClick={() => toggleItemSelection(item.menu.id)}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-amber-500/10 border-amber-500/50 text-white"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="h-4 w-4 rounded accent-amber-500"
                      />
                      <div>
                        <p className="text-xs font-black text-white">{item.menu.name}</p>
                        <p className="text-[10px] text-slate-400">
                          {item.quantity} x {formatPrice(item.menu.price)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-amber-400">
                      {formatPrice(item.menu.price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-xs font-bold">
              <span className="text-slate-400">Total Item Terpilih:</span>
              <span className="text-lg font-black text-amber-400">
                {formatPrice(Math.round(itemizedTotal))}
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          type="button"
          onClick={handlePaySplit}
          className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 py-3.5 text-xs font-black text-white uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all"
        >
          BAYAR BAGIAN INI ({splitMode === "equal" ? formatPrice(equalShare) : formatPrice(Math.round(itemizedTotal))})
        </button>
      </div>
    </div>
  );
}
