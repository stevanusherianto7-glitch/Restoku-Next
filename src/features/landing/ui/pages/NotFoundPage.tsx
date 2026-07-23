import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030303] p-4">
      <div className="w-full max-w-md rounded-2xl bg-white/5 p-8 text-center backdrop-blur-sm border border-white/10">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center">
          <span className="text-8xl font-black text-white/10">404</span>
        </div>
        <h2 className="mb-2 text-xl font-bold text-white">Halaman Tidak Ditemukan</h2>
        <p className="mb-6 text-sm text-slate-400">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Link
          to="/"
          className="inline-block rounded-lg bg-cabe-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-cabe-700 transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
