import { useState } from "react";

interface DineInVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export function DineInVerificationModal({
  isOpen,
  onClose,
  onVerified,
}: DineInVerificationModalProps) {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [gpsError, setGpsError] = useState("Anda berada di luar area restoran (120635m).");
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [pinError, setPinError] = useState("");

  if (!isOpen) return null;

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setPinError("");

    // Auto focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleDetectGps = () => {
    setIsDetectingGps(true);
    setGpsError("");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setIsDetectingGps(false);
          // Demo GPS verification success
          onVerified();
        },
        () => {
          setIsDetectingGps(false);
          setGpsError("Anda berada di luar area restoran (120635m).");
        },
        { timeout: 5000 }
      );
    } else {
      setIsDetectingGps(false);
      setGpsError("Browser tidak mendukung sensor GPS.");
    }
  };

  const handleVerifyPin = () => {
    const fullPin = pin.join("");
    if (fullPin.length !== 4) {
      setPinError("Masukkan 4 digit PIN harian.");
      return;
    }
    // Any 4 digit PIN is accepted for demo (or 3461)
    onVerified();
  };

  const isPinComplete = pin.join("").length === 4;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-[#141414] text-white p-6 shadow-2xl border border-amber-900/40 space-y-5 animate-fadeIn">
        {/* Top Shield Header */}
        <div className="flex items-start justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-950/60 border border-amber-600/40 text-amber-500 text-xl shadow-inner">
              🛡️
            </div>
            <div>
              <h3 className="text-xs font-black tracking-widest text-amber-400 uppercase">
                VERIFIKASI DINE-IN
              </h3>
              <p className="text-[10px] font-extrabold tracking-wider text-zinc-400 uppercase">
                PASTIKAN ANDA MEMESAN DI LOKASI
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-white transition-all"
          >
            ✕
          </button>
        </div>

        {/* Section 1: GPS Automatic Validation */}
        <div className="rounded-2xl bg-zinc-900/90 p-4 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-extrabold text-zinc-400">
            <span>📍</span> Validasi GPS Otomatis
          </div>

          {gpsError && (
            <div className="rounded-xl bg-rose-950/40 border border-rose-800/50 p-2.5 text-center text-[11px] font-bold text-rose-400">
              {gpsError}
            </div>
          )}

          <button
            type="button"
            onClick={handleDetectGps}
            disabled={isDetectingGps}
            className="w-full rounded-xl bg-amber-950/80 hover:bg-amber-900/90 text-amber-400 border border-amber-600/40 py-2.5 text-xs font-black tracking-wider uppercase transition-all"
          >
            {isDetectingGps ? "Mendeteksi..." : "DETEKSI ULANG LOKASI"}
          </button>
        </div>

        {/* Divider */}
        <div className="relative text-center my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <span className="relative bg-[#141414] px-3 text-[10px] font-black tracking-widest text-zinc-500 uppercase">
            ATAU
          </span>
        </div>

        {/* Section 2: Table PIN Verification */}
        <div className="text-center space-y-3">
          <div>
            <h4 className="text-xs font-black tracking-wider text-amber-100 uppercase">
              MASUKKAN PIN VERIFIKASI MEJA
            </h4>
            <p className="mt-1 text-[11px] font-medium text-zinc-400">
              Minta 4-digit PIN harian kepada pelayan kami di kedai.
            </p>
          </div>

          {/* 4 Digit Inputs */}
          <div className="flex justify-center gap-3 py-2">
            {pin.map((digit, idx) => (
              <input
                key={idx}
                id={`pin-input-${idx}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="h-12 w-12 rounded-xl bg-white text-center text-xl font-black text-slate-900 shadow-md focus:outline-none focus:ring-4 focus:ring-amber-500/50"
              />
            ))}
          </div>

          {pinError && (
            <p className="text-xs font-bold text-rose-400">{pinError}</p>
          )}

          {/* Verify PIN Button */}
          <button
            type="button"
            onClick={handleVerifyPin}
            className={`w-full rounded-2xl py-3.5 text-xs font-black tracking-wider uppercase transition-all shadow-lg ${
              isPinComplete
                ? "bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-orange-600/40 hover:opacity-95"
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50"
            }`}
          >
            VERIFIKASI PIN
          </button>
        </div>
      </div>
    </div>
  );
}
