const features = [
  {
    icon: "📱",
    title: "POS Cepat & Mudah",
    description: "Proses pesanan dalam 30 detik. Tampilan sederhana, tidak perlu pelatihan panjang.",
    color: "bg-cabe-50 text-cabe-600",
  },
  {
    icon: "📊",
    title: "Dashboard Real-time",
    description: "Pantau penjualan, pesanan, dan stok secara langsung dari mana saja.",
    color: "bg-emas-50 text-emas-600",
  },
  {
    icon: "🍽️",
    title: "Menu Digital (QR)",
    description: "Tamu scan QR, lihat menu, pesan langsung dari HP. Tidak perlu menu fisik.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: "📦",
    title: "Manajemen Stok",
    description: "Tracking bahan baku otomatis. Notifikasi saat stok menipis.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: "👥",
    title: "Multi-outlet",
    description: "Kelola banyak cabang dalam satu akun. Laporan terpusat.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: "💰",
    title: "Harga Terjangkau",
    description: "Mulai Rp 99rb/bulan. Cocok untuk warung & UMKM Indonesia.",
    color: "bg-cabe-50 text-cabe-600",
  },
];

export function Features() {
  return (
    <section id="fitur" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Fitur Lengkap untuk Restoran Anda
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Dari kasir hingga laporan, semuanya terintegrasi. Fokus pada makanan,
            biarkan Restoku mengurus sisanya.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center text-2xl mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
