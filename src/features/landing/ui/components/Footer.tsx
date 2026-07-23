import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Info (Spans 2 cols on md) */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-cabe-600 rounded-xl flex items-center justify-center font-black text-white text-lg">
                R
              </div>
              <span className="text-xl font-black text-white tracking-tight">Restoku</span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Sistem Point of Sale (POS) & Platform Manajemen Restoran Terintegrasi. Dirancang khusus untuk efisiensi warung, kafe, dan restoran modern di Indonesia.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Produk & Modul</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#fitur" className="hover:text-cabe-400 transition-colors">POS Kasir Cepat</a></li>
              <li><a href="#demo" className="hover:text-cabe-400 transition-colors">QR Menu Digital</a></li>
              <li><a href="#demo" className="hover:text-cabe-400 transition-colors">Layar Dapur (KDS)</a></li>
              <li><a href="#fitur" className="hover:text-cabe-400 transition-colors">Manajemen Stok & Opname</a></li>
              <li><a href="#fitur" className="hover:text-cabe-400 transition-colors">Laporan Laba Rugi</a></li>
            </ul>
          </div>

          {/* Perusahaan Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Perusahaan</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#tentang" className="hover:text-cabe-400 transition-colors">Tentang Restoku</a></li>
              <li><a href="#testimoni" className="hover:text-cabe-400 transition-colors">Kisah Mitra</a></li>
              <li><a href="#karir" className="hover:text-cabe-400 transition-colors">Karir <span className="text-[9px] bg-cabe-500/20 text-cabe-400 px-1.5 py-0.5 rounded font-mono">Hiring</span></a></li>
              <li><a href="#blog" className="hover:text-cabe-400 transition-colors">Blog & Panduan Bisnis</a></li>
            </ul>
          </div>

          {/* Dukungan & Legal Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Dukungan & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-cabe-400 transition-colors">Pusat Bantuan (Help Center)</a></li>
              <li><a href="#" className="hover:text-cabe-400 transition-colors">Dokumentasi API</a></li>
              <li><a href="#" className="hover:text-cabe-400 transition-colors">Kebijakan Privasi</a></li>
              <li><a href="#" className="hover:text-cabe-400 transition-colors">Syarat & Ketentuan Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500">
            © 2026 Restoku (PT Restoku Digital Indonesia). All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="#" className="hover:text-cabe-400 transition-colors">Instagram</a>
            <a href="#" className="hover:text-cabe-400 transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-cabe-400 transition-colors">YouTube</a>
            <a href="#" className="hover:text-cabe-400 transition-colors">WhatsApp Sales</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
