import { Link } from "react-router-dom";
import { Button } from "@shared/ui/atoms/Button";

export function CTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white relative overflow-hidden">
      {/* Ambient Glow Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-cabe-950/80 via-slate-950 to-orange-950/60 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cabe-600/20 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative max-w-5xl mx-auto text-center border border-slate-800/90 rounded-3xl p-8 sm:p-14 bg-slate-900/60 backdrop-blur-2xl shadow-2xl">
        <span className="text-xs font-mono uppercase tracking-widest text-cabe-400 bg-cabe-500/10 px-3 py-1 rounded-full border border-cabe-500/20">
          Digitalisasi Restoran Anda Hari Ini
        </span>
        <h2 className="mt-4 text-xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-extrabold text-white tracking-tight leading-tight whitespace-normal md:whitespace-nowrap">
          Siap Tingkatkan Omset & Efisiensi Restoran Anda?
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Bergabunglah dengan 500+ restoran dan UMKM kuliner di Indonesia. Setup dalam 5 menit, tanpa instalasi rumit.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-cabe-600 hover:bg-cabe-500 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-cabe-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Mulai Free Trial 14 Hari
            </Button>
          </Link>
          <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-7 py-4 rounded-2xl transition-all"
            >
              💬 Konsultasi via WhatsApp
            </Button>
          </a>
        </div>

        {/* Guarantees */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-400 border-t border-slate-800/80 pt-6">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Tanpa Kartu Kredit</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Setup 5 Menit</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Bebas Batalkan Kapan Saja</span>
          </div>
        </div>
      </div>
    </section>
  );
}
