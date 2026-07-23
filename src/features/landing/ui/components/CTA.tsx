import { Link } from "react-router-dom";
import { Button } from "@shared/ui/atoms/Button";

export function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cabe-600 to-cabe-700">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          Siap Kelola Restoran dengan Lebih Baik?
        </h2>
        <p className="text-lg text-cabe-100 mb-8 max-w-2xl mx-auto">
          Mulai gratis sekarang. Tanpa kartu kredit. Tanpa komitmen.
          Batalkan kapan saja.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register">
            <Button size="lg" className="bg-white text-cabe-600 hover:bg-gray-100 w-full sm:w-auto">
              Mulai Gratis Sekarang
            </Button>
          </Link>
          <a href="https://wa.me/6281234567890">
            <Button variant="ghost" size="lg" className="text-white border-white hover:bg-white/10 w-full sm:w-auto">
              Hubungi Sales
            </Button>
          </a>
        </div>

        {/* Trust */}
        <div className="mt-12 flex items-center justify-center gap-8 text-cabe-100 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Free trial 14 hari</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Tanpa kartu kredit</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Batalkan kapan saja</span>
          </div>
        </div>
      </div>
    </section>
  );
}
