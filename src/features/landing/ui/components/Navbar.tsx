import { Link } from "react-router-dom";
import { Button } from "@shared/ui/atoms/Button";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cabe-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Restoku</span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#fitur" className="text-sm text-gray-600 hover:text-gray-900">Fitur</a>
            <a href="#harga" className="text-sm text-gray-600 hover:text-gray-900">Harga</a>
            <a href="#testimoni" className="text-sm text-gray-600 hover:text-gray-900">Testimoni</a>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Masuk</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Gratis Selamanya</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
