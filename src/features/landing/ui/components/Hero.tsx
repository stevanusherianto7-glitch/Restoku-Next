import { Link } from "react-router-dom";
import { Button } from "@shared/ui/atoms/Button";

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-cabe-50 to-white">
      <div className="max-w-7xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-cabe-100 text-cabe-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cabe-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cabe-500"></span>
          </span>
          Sudah digunakan 500+ restoran di Indonesia
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
          Kelola Restoran
          <br />
          <span className="text-cabe-600">Lebih Mudah</span> dengan Restoku
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Sistem POS & manajemen restoran all-in-one. Dari kasir hingga laporan,
          semuanya dalam satu genggaman. Harga terjangkau untuk warung & UMKM.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register">
            <Button size="lg" className="w-full sm:w-auto">
              Mulai Gratis Sekarang
            </Button>
          </Link>
          <a href="#demo">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Lihat Demo
            </Button>
          </a>
        </div>

        {/* Social Proof */}
        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-emas-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>4.9/5 rating</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cabe-500 font-semibold">500+</span>
            <span>restoran aktif</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cabe-500 font-semibold">10rb+</span>
            <span>transaksi/hari</span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mt-16 relative">
          <div className="bg-gray-900 rounded-2xl p-4 shadow-2xl">
            <div className="bg-gray-800 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-700">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="p-6 bg-gradient-to-br from-cabe-500 to-emas-500">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-left">
                    <div className="text-white/60 text-sm">Penjualan Hari Ini</div>
                    <div className="text-white text-2xl font-bold">Rp 2.450.000</div>
                    <div className="text-green-300 text-sm mt-1">↑ 12%</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-left">
                    <div className="text-white/60 text-sm">Pesanan Aktif</div>
                    <div className="text-white text-2xl font-bold">18</div>
                    <div className="text-yellow-300 text-sm mt-1">3 menunggu</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-left">
                    <div className="text-white/60 text-sm">Menu Terjual</div>
                    <div className="text-white text-2xl font-bold">67</div>
                    <div className="text-cabe-200 text-sm mt-1">Nasi Goreng #1</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative */}
          <div className="absolute -inset-4 bg-gradient-to-r from-cabe-500/20 to-emas-500/20 blur-3xl -z-10 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
