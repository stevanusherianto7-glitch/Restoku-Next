import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@shared/ui/atoms/Button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-xs py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-cabe-500 to-cabe-700 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
              <span className="text-white font-extrabold text-xl tracking-wider">R</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1">
                Restoku
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cabe-500 animate-pulse"></span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 -mt-1 tracking-wider uppercase">
                POS & Management
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 backdrop-blur-md p-1.5 rounded-full border border-slate-200/60">
            <a
              href="#fitur"
              className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-full hover:bg-white transition-all duration-200"
            >
              Fitur Utama
            </a>
            <a
              href="#demo"
              className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-full hover:bg-white transition-all duration-200"
            >
              Interactive Demo
            </a>
            <a
              href="#harga"
              className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-full hover:bg-white transition-all duration-200"
            >
              Pilihan Harga
            </a>
            <a
              href="#testimoni"
              className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-full hover:bg-white transition-all duration-200"
            >
              Testimoni
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-bold text-slate-700 hover:text-cabe-600">
                Masuk
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="sm"
                className="bg-cabe-600 hover:bg-cabe-700 text-white font-bold rounded-xl shadow-md shadow-cabe-500/20 transition-all hover:shadow-lg hover:shadow-cabe-500/30 hover:-translate-y-0.5"
              >
                Mulai Gratis
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
