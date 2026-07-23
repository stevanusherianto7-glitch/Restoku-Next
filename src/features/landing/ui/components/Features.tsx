const features = [
  {
    icon: (
      <svg className="w-6 h-6 text-cabe-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    badge: "POS Cepat",
    title: "POS Kasir Transaksi 30 Detik",
    description: "Antarmuka kasir cepat & intuitif. Struk tercetak otomatis & mendukung transaksi offline tanpa koneksi.",
    accentColor: "border-cabe-500/20 bg-cabe-500/5 group-hover:border-cabe-500/50",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    badge: "Analitik Real-time",
    title: "Dashboard Laba Rugi & Omset",
    description: "Pantau arus kas, margin keuntungan, dan grafik tren hidangan terlaris secara live dari mana saja.",
    accentColor: "border-amber-500/20 bg-amber-500/5 group-hover:border-amber-500/50",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1M18 8h1M6 8H5M12 20v-1M18 16h1M6 16H5M12 12a4 4 0 100-8 4 4 0 000 8z" />
      </svg>
    ),
    badge: "QR Order",
    title: "Menu Digital Scan QR Code",
    description: "Tamu memindai QR code di meja untuk membuka e-menu dan memesan mandiri tanpa antre di kasir.",
    accentColor: "border-sky-500/20 bg-sky-500/5 group-hover:border-sky-500/50",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    badge: "Bahan Baku",
    title: "Manajemen Stok & Opname",
    description: "Potong stok otomatis sesuai resep hidangan. Notifikasi peringatan dini saat bahan baku mulai menipis.",
    accentColor: "border-emerald-500/20 bg-emerald-500/5 group-hover:border-emerald-500/50",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    badge: "Multi-Branch",
    title: "Multi-Outlet & Hak Akses Staf",
    description: "Kelola jaringan cabang restoran dalam satu dasbor terpusat lengkap dengan manajemen PIN wewenang kasir.",
    accentColor: "border-purple-500/20 bg-purple-500/5 group-hover:border-purple-500/50",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    badge: "Offline First",
    title: "Mode Resilience Tanpa Internet",
    description: "Tetap jualan meski koneksi internet mati. Data disimpan aman secara lokal dan otomatis tersinkronisasi.",
    accentColor: "border-orange-500/20 bg-orange-500/5 group-hover:border-orange-500/50",
  },
];

export function Features() {
  return (
    <section id="fitur" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-cabe-400 uppercase tracking-widest bg-cabe-500/10 px-3.5 py-1.5 rounded-full border border-cabe-500/20">
            Fitur Unggulan Restoku
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Semua Modul Restoran Lengkap dalam Satu Genggaman
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Dari meja kasir hingga layar dapur, Restoku menyederhanakan seluruh alur operasional restoran Anda.
          </p>
        </div>

        {/* 3-Column Bento Grid Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`group relative p-6 sm:p-8 rounded-3xl border bg-slate-950/70 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cabe-950/30 ${feature.accentColor}`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-900/90 px-2.5 py-1 rounded-full border border-slate-800">
                  {feature.badge}
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-white mb-2 group-hover:text-cabe-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Bottom Subtle Hover Line */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-cabe-400 transition-colors">
                <span>Pelajari Selengkapnya</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
