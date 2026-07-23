const testimonials = [
  {
    name: "H. Budi Santoso",
    role: "Pemilik",
    restaurant: "Rumah Makan Padang Sederhana (3 Cabang)",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    content: "Sejak beralih ke Restoku, rekonsiliasi kasir harian jadi sangat cepat. Dulu butuh 2 jam tiap malam untuk hitung manual, sekarang cukup 5 menit dari HP. Fitur multi-outletnya sangat membantu!",
    rating: 5,
    highlight: "Sangat membantu multi-outlet",
    span: "lg:col-span-2",
  },
  {
    name: "Ibu Dewi Lestari",
    role: "Operational Manager",
    restaurant: "Seafood Resto & Cafe",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    content: "Menu QR Digital Restoku bikin antrean jam makan siang jauh lebih tertata. Tamu scan QR di meja, langsung pesan. Staf kami bisa fokus melayani meja daripada catat pesanan.",
    rating: 5,
    highlight: "Antrean berkurang 40%",
    span: "lg:col-span-1",
  },
  {
    name: "Chef Rendi Kurniawan",
    role: "Head Chef & Co-Owner",
    restaurant: "Bistro Nusantara",
    avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150&auto=format&fit=crop&q=80",
    content: "Layar Dapur (KDS) Restoku sangat responsif. Tiket pesanan dari kasir & QR meja langsung muncul tanpa kertas tiket fisik. Komunikasi dapur & pelayan jadi nol miskomunikasi.",
    rating: 5,
    highlight: "Nol Miskomunikasi Dapur",
    span: "lg:col-span-1",
  },
  {
    name: "Bapak Hendra Wijaya",
    role: "Franchise Owner",
    restaurant: "Kedai Kopi & Toast 78",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    content: "Mode Offline Restoku terbukti menyelamatkan kami pas mati listrik & jaringan internet down. Kasir tetap jalan seperti biasa, data tersimpan aman dan ter-sync saat internet kembali.",
    rating: 5,
    highlight: "Penyelamat Saat Internet Down",
    span: "lg:col-span-2",
  },
];

export function Testimonials() {
  return (
    <section id="testimoni" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20">
            Kisah Sukses Mitra
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Dipercaya oleh Ratusan Pemilik Restoran & Kuliner
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Lihat bagaimana Restoku membantu warung, kafe, hingga jaringan restoran berkembang pesat.
          </p>
        </div>

        {/* Bento Grid Testimonials */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className={`p-6 sm:p-8 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl flex flex-col justify-between hover:border-slate-700 transition-all duration-300 ${t.span}`}
            >
              <div>
                {/* Header Rating & Verified Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400 text-sm gap-0.5">
                    {"★".repeat(t.rating)}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                    ✓ Verified Partner
                  </span>
                </div>

                {/* Highlight Tag */}
                <h4 className="text-sm font-extrabold text-white mb-3">
                  "{t.highlight}"
                </h4>

                {/* Testimonial Quote */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 italic">
                  "{t.content}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3.5">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-cabe-500/50 shadow-md"
                />
                <div>
                  <h5 className="text-xs sm:text-sm font-extrabold text-white">{t.name}</h5>
                  <p className="text-[11px] font-semibold text-cabe-400">{t.role} • {t.restaurant}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
