const testimonials = [
  {
    name: "Pak Budi",
    role: "Pemilik Warung Padang",
    avatar: "B",
    content: "Sejak pakai Restoku, laporan penjualan jadi gampang. Tidak perlu hitung manual lagi. Harganya juga pas di kantong warung.",
    rating: 5,
  },
  {
    name: "Ibu Dewi",
    role: "Manajer Restoran Seafood",
    avatar: "D",
    content: "Menu digitalnya keren! Pelanggan tinggal scan QR, pesan dari HP. Antrian jadi berkurang. Staff juga senang.",
    rating: 5,
  },
  {
    name: "Mas Rendi",
    role: "Koki di Restoran Keluarga",
    avatar: "R",
    content: "Pesanan masuk langsung ke layar dapur. Tidak perlu teriak-teriak lagi. Komunikasi jadi lebih mudah.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimoni" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Dipercaya oleh Ratusan Restoran
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Lihat apa kata mereka yang sudah menggunakan Restoku.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-emas-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cabe-100 text-cabe-600 flex items-center justify-center font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{testimonial.name}</div>
                  <div className="text-xs text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
