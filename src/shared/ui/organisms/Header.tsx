import { useState } from "react";
import { useAuthStore } from "@features/auth/ui/stores/useAuthStore";
import { useOutletStore } from "@features/outlet/ui/stores/useOutletStore";
import { Button } from "@shared/ui/atoms/Button";
import { Badge } from "@shared/ui/atoms/Badge";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "Dashboard" }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const { outlets, selectedOutlet, selectOutlet } = useOutletStore();
  const [isOpenOutlet, setIsOpenOutlet] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 backdrop-blur-md">
      {/* Title / Breadcrumb */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">{title}</h1>
        <Badge variant={isStoreOpen ? "success" : "danger"} size="sm">
          <span className={`h-1.5 w-1.5 rounded-full ${isStoreOpen ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
          {isStoreOpen ? "Toko Buka" : "Toko Tutup"}
        </Badge>
      </div>

      {/* Right Action Tools */}
      <div className="flex items-center gap-4">
        {/* Store Open/Close Toggle */}
        <button
          onClick={() => setIsStoreOpen(!isStoreOpen)}
          className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all ${
            isStoreOpen
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              : "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <span>{isStoreOpen ? "Terima Pesanan" : "Jeda Pesanan"}</span>
        </button>

        {/* Outlet Switcher */}
        {outlets && outlets.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setIsOpenOutlet(!isOpenOutlet)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all"
            >
              <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>{selectedOutlet?.name || "Pilih Cabang"}</span>
              <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpenOutlet && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Daftar Cabang Restoran
                </div>
                {outlets.map((outlet) => (
                  <button
                    key={outlet.id}
                    onClick={() => {
                      selectOutlet(outlet);
                      setIsOpenOutlet(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium ${
                      selectedOutlet?.id === outlet.id
                        ? "bg-cabe-50 text-cabe-700 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{outlet.name}</span>
                    {selectedOutlet?.id === outlet.id && (
                      <span className="text-cabe-600 font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User Info & Logout */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-900">{user?.name || "Mitra Restoku"}</p>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              {user?.role || "Owner"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => logout()}
            className="text-xs"
          >
            Keluar
          </Button>
        </div>
      </div>
    </header>
  );
}
