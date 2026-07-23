import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@shared/ui/atoms/Button";

type DemoTab = "pos" | "analytics" | "kds" | "qr";

export function Hero() {
  const [activeTab, setActiveTab] = useState<DemoTab>("pos");

  return (
    <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-950 text-white">
      {/* Dynamic Background Gradients (Stripe/Linear Ambient Glow) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cabe-600/30 rounded-full blur-[128px]"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[128px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-cabe-600/20 via-orange-500/10 to-amber-500/20 rounded-full blur-[160px]"></div>
      </div>

      {/* Grid Overlay Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"
      ></div>

      <div className="relative max-w-7xl mx-auto text-center">
        {/* Release Announcement Pill */}
        <div className="inline-flex items-center gap-2 bg-slate-900/90 border border-slate-800 text-slate-300 px-4 py-2 rounded-full text-xs font-semibold mb-8 backdrop-blur-md shadow-inner hover:border-cabe-500/50 transition-colors cursor-pointer">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cabe-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cabe-500"></span>
          </span>
          <span className="text-cabe-400 font-bold">Restoku 2.0</span>
          <span className="text-slate-600">|</span>
          <span>Sudah dipercaya 500+ Restoran & UMKM Kuliner</span>
          <svg className="w-3.5 h-3.5 text-slate-400 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Persuasive Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] max-w-5xl mx-auto">
          Kelola Restoran & Warung
          <br />
          <span className="bg-gradient-to-r from-cabe-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
            Lebih Mudah & Cerdas
          </span>
        </h1>

        {/* Concise Sub-headline */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-normal">
          Sistem POS Kasir, QR Menu Digital, KDS Dapur, hingga Laporan Keuangan Laba Rugi terintegrasi dalam satu platform offline-first. Tanpa lisensi mahal.
        </p>

        {/* Prominent CTA Group */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-cabe-600 to-cabe-500 hover:from-cabe-500 hover:to-cabe-600 text-white font-extrabold px-8 py-4 rounded-2xl shadow-xl shadow-cabe-600/30 hover:shadow-cabe-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Mulai Gratis 14 Hari
            </Button>
          </Link>
          <a href="#demo" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold px-7 py-4 rounded-2xl backdrop-blur-md transition-all"
            >
              <svg className="w-5 h-5 mr-2 text-cabe-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Lihat Demo Interaktif
            </Button>
          </a>
        </div>

        {/* Social Proof Trust Bar */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-slate-400">
          <div className="flex items-center gap-2 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800/80">
            <div className="flex text-amber-400">
              {"★".repeat(5)}
            </div>
            <span className="text-white font-bold">4.9/5</span>
            <span className="text-slate-500">(1.2k+ Review)</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800/80">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span className="text-emerald-400 font-bold">500+</span>
            <span>Restoran & Outlet</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800/80">
            <span className="text-cabe-400 font-bold">10 Juta+</span>
            <span>Pesanan Diproses</span>
          </div>
        </div>

        {/* Interactive App Mockup Preview (Linear/Stripe Style Window) */}
        <div id="demo" className="mt-16 relative mx-auto max-w-6xl">
          {/* Outer Window Container */}
          <div className="relative rounded-3xl border border-slate-800/90 bg-slate-900/90 p-3 sm:p-4 shadow-2xl shadow-cabe-950/40 backdrop-blur-2xl">
            {/* Window Top Controls & Tab Switcher */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <span className="ml-2 text-xs font-mono text-slate-500 hidden sm:inline">restoku.com/app</span>
              </div>

              {/* Interactive Demo Tabs */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto">
                <button
                  onClick={() => setActiveTab("pos")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === "pos"
                      ? "bg-cabe-600 text-white shadow-md"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  📱 POS Kasir
                </button>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === "analytics"
                      ? "bg-cabe-600 text-white shadow-md"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  📊 Live Analytics
                </button>
                <button
                  onClick={() => setActiveTab("kds")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === "kds"
                      ? "bg-cabe-600 text-white shadow-md"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  👨‍🍳 Layar Dapur (KDS)
                </button>
                <button
                  onClick={() => setActiveTab("qr")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === "qr"
                      ? "bg-cabe-600 text-white shadow-md"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  📲 QR Menu Digital
                </button>
              </div>
            </div>

            {/* Dynamic Screen Contents */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 p-6 text-left border border-slate-800/60 min-h-[380px]">
              {/* TAB 1: POS KASIR */}
              {activeTab === "pos" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white">Pilih Menu Hidangan</h3>
                      <span className="text-xs text-cabe-400 bg-cabe-500/10 px-2.5 py-1 rounded-md border border-cabe-500/20 font-mono">Meja No. 05</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl hover:border-cabe-500/50 cursor-pointer transition-all">
                        <div className="text-2xl mb-1">🍲</div>
                        <p className="text-xs font-bold text-white">Nasi Goreng Spesial</p>
                        <p className="text-xs font-extrabold text-cabe-400 mt-1">Rp 25.000</p>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl hover:border-cabe-500/50 cursor-pointer transition-all">
                        <div className="text-2xl mb-1">🍗</div>
                        <p className="text-xs font-bold text-white">Ayam Bakar Madu</p>
                        <p className="text-xs font-extrabold text-cabe-400 mt-1">Rp 28.000</p>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl hover:border-cabe-500/50 cursor-pointer transition-all">
                        <div className="text-2xl mb-1">🥤</div>
                        <p className="text-xs font-bold text-white">Es Teh Manis Jumbo</p>
                        <p className="text-xs font-extrabold text-cabe-400 mt-1">Rp 7.000</p>
                      </div>
                    </div>
                  </div>
                  {/* Cart Panel */}
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Struk Pesanan (3 Item)</h4>
                      <div className="space-y-2 text-xs divide-y divide-slate-800">
                        <div className="pt-2 flex justify-between text-slate-200">
                          <span>1x Nasi Goreng Spesial</span>
                          <span className="font-bold">Rp 25.000</span>
                        </div>
                        <div className="pt-2 flex justify-between text-slate-200">
                          <span>1x Ayam Bakar Madu</span>
                          <span className="font-bold">Rp 28.000</span>
                        </div>
                        <div className="pt-2 flex justify-between text-slate-200">
                          <span>2x Es Teh Manis</span>
                          <span className="font-bold">Rp 14.000</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Total (inc. Pajak 10%)</span>
                        <span className="text-sm font-black text-cabe-400">Rp 73.700</span>
                      </div>
                      <button className="w-full bg-cabe-600 hover:bg-cabe-500 text-white font-bold py-2.5 rounded-lg text-xs transition-all shadow-md shadow-cabe-600/30">
                        Proses Pembayaran (QRIS / Tunai)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ANALYTICS */}
              {activeTab === "analytics" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <p className="text-xs font-medium text-slate-400">Total Omset Hari Ini</p>
                      <p className="text-2xl font-black text-emerald-400 mt-1">Rp 4.850.000</p>
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded mt-2 inline-block">↑ 24% vs kemarin</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <p className="text-xs font-medium text-slate-400">Total Transaksi</p>
                      <p className="text-2xl font-black text-amber-400 mt-1">142 Pesanan</p>
                      <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded mt-2 inline-block">Rata-rata 12 pesanan/jam</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <p className="text-xs font-medium text-slate-400">Menu Terlaris</p>
                      <p className="text-2xl font-black text-cabe-400 mt-1">Nasi Goreng #1</p>
                      <span className="text-[10px] font-bold text-cabe-400 bg-cabe-500/10 px-2 py-0.5 rounded mt-2 inline-block">68 Porsi Terjual</span>
                    </div>
                  </div>
                  {/* Chart Visual Simulation */}
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-slate-300">Grafik Penjualan Per Jam (08:00 - 21:00)</h4>
                      <span className="text-[10px] text-slate-500">Live Update</span>
                    </div>
                    <div className="h-28 flex items-end justify-between gap-2 pt-4">
                      {[35, 45, 60, 95, 80, 70, 100, 85, 65, 40].map((h, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                          <div
                            style={{ height: `${h}%` }}
                            className="w-full bg-gradient-to-t from-cabe-700 to-cabe-500 rounded-t group-hover:from-cabe-600 group-hover:to-orange-400 transition-all"
                          ></div>
                          <span className="text-[9px] font-mono text-slate-500">{idx + 12}:00</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: KITCHEN DISPLAY */}
              {activeTab === "kds" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeIn">
                  <div className="bg-slate-900 border-2 border-amber-500/60 p-4 rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-1 rounded">#ORD-108 • Meja 03</span>
                      <span className="text-[10px] font-mono text-amber-300">03m 12s</span>
                    </div>
                    <ul className="text-xs space-y-1 text-slate-200 font-semibold">
                      <li>• 2x Ayam Goreng Lengkuas</li>
                      <li>• 1x Cah Kangkung Terasi</li>
                      <li>• 2x Es Jeruk Peras</li>
                    </ul>
                    <button className="w-full bg-amber-500 text-slate-950 font-bold py-2 rounded text-xs hover:bg-amber-400">
                      Mulai Memasak
                    </button>
                  </div>
                  <div className="bg-slate-900 border-2 border-cabe-500/60 p-4 rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-cabe-400 bg-cabe-500/10 px-2 py-1 rounded">#ORD-109 • Meja 07</span>
                      <span className="text-[10px] font-mono text-cabe-300">08m 45s</span>
                    </div>
                    <ul className="text-xs space-y-1 text-slate-200 font-semibold">
                      <li>• 1x Sop Buntut Sapi</li>
                      <li>• 1x Nasi Putih</li>
                    </ul>
                    <button className="w-full bg-cabe-600 text-white font-bold py-2 rounded text-xs hover:bg-cabe-500">
                      Tandai Siap Saji
                    </button>
                  </div>
                  <div className="bg-slate-900 border border-emerald-500/40 p-4 rounded-xl space-y-3 opacity-80">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">#ORD-107 • Takeaway</span>
                      <span className="text-[10px] font-mono text-emerald-400">Selesai</span>
                    </div>
                    <ul className="text-xs space-y-1 text-slate-400 font-semibold line-through">
                      <li>• 3x Bebek Goreng Madura</li>
                    </ul>
                    <div className="text-center text-xs font-bold text-emerald-400 py-1">
                      ✓ Diantar ke Kasir
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: QR MENU */}
              {activeTab === "qr" && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 animate-fadeIn">
                  <div className="space-y-3 max-w-md">
                    <span className="text-xs font-bold text-cabe-400 bg-cabe-500/10 px-3 py-1 rounded-full border border-cabe-500/20">Guest Self-Ordering</span>
                    <h4 className="text-lg font-extrabold text-white">Tamu Scan QR Code & Pesan dari HP</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Tanpa install aplikasi. Tamu cukup memindai QR code di meja untuk membuka e-menu digital, memilih varian hidangan, dan membayar via QRIS.
                    </p>
                    <div className="flex gap-2 pt-2">
                      <span className="text-[11px] bg-slate-900 text-slate-300 px-2.5 py-1 rounded border border-slate-800">⚡ Hemat Waiter</span>
                      <span className="text-[11px] bg-slate-900 text-slate-300 px-2.5 py-1 rounded border border-slate-800">📱 Support QRIS All Bank</span>
                    </div>
                  </div>
                  <div className="w-44 h-44 bg-white p-3 rounded-2xl shadow-xl border-4 border-cabe-600 flex flex-col items-center justify-center text-center">
                    <div className="w-28 h-28 bg-slate-900 rounded-lg flex items-center justify-center text-white font-mono text-xs font-bold tracking-widest">
                      [ QR CODE ]
                    </div>
                    <span className="text-[10px] font-bold text-slate-900 mt-2">Scan Meja 05</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ambient Glow Drop Shadow behind Window */}
          <div className="absolute -inset-4 bg-gradient-to-r from-cabe-600/20 via-orange-500/15 to-amber-500/20 blur-3xl -z-10 rounded-[40px]"></div>
        </div>
      </div>
    </section>
  );
}
