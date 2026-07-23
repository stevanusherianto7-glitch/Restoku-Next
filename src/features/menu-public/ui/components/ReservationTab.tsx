import { useState } from "react";

export function ReservationTab() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [reservationType, setReservationType] = useState("Meja Makan Biasa");
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-5">
      {/* Header Info */}
      <div className="text-left">
        <h2 className="text-sm font-black tracking-wider text-amber-900 uppercase flex items-center gap-2">
          <span>📅</span> RESERVASI TEMPAT & ACARA
        </h2>
        <p className="mt-1 text-xs text-slate-600 leading-relaxed font-medium">
          Booking tempat untuk makan keluarga, pertemuan bisnis, ulang tahun, hingga pesta pernikahan di Kedai Elvera 57.
        </p>
      </div>

      {submitted ? (
        /* Success State */
        <div className="rounded-2xl bg-emerald-50 p-6 text-center space-y-3 border border-emerald-200 shadow-sm animate-fadeIn">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white text-2xl">
            ✓
          </div>
          <h3 className="text-base font-black text-slate-900">Pengajuan Reservasi Berhasil!</h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-xs mx-auto">
            Terima kasih <strong className="text-slate-900">{name}</strong>. Tim Kedai Elvera 57 akan menghubungi WhatsApp Anda (<strong>{phone}</strong>) untuk konfirmasi ketersediaan tempat.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setName("");
              setPhone("");
              setNotes("");
            }}
            className="mt-4 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-black text-white hover:bg-amber-700 transition-all"
          >
            + Buat Reservasi Lainnya
          </button>
        </div>
      ) : (
        /* Reservation Form */
        <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-5 shadow-sm border border-amber-100/90 space-y-4">
          {/* Nama Pemesan */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <span>👤</span> NAMA LENGKAP PEMESAN <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Masukkan nama lengkap Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-amber-600 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Nomor Telepon / WA */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <span>📞</span> NOMOR TELEPON / WHATSAPP <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="Contoh: 081234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-amber-600 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Jenis Reservasi & Jumlah Tamu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <span>✨</span> JENIS RESERVASI
              </label>
              <select
                value={reservationType}
                onChange={(e) => setReservationType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-amber-600 focus:bg-white focus:outline-none"
              >
                <option value="Meja Makan Biasa">Meja Makan Biasa</option>
                <option value="Perayaan Ulang Tahun">Perayaan Ulang Tahun</option>
                <option value="Gathering / Reuni">Gathering / Reuni</option>
                <option value="Corporate Dinner">Corporate Dinner</option>
                <option value="Wedding / Resepsi">Wedding / Resepsi</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <span>👥</span> JUMLAH TAMU <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={200}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-amber-600 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Tanggal & Jam Booking */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <span>📅</span> TANGGAL BOOKING <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-bold text-slate-900 focus:border-amber-600 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <span>🕒</span> JAM MULAI <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-bold text-slate-900 focus:border-amber-600 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Catatan Khusus */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <span>📝</span> CATATAN KHUSUS / PERMINTAAN (OPSIONAL)
            </label>
            <textarea
              rows={3}
              placeholder="Contoh: Butuh meja di dekat area musik live, request menu diet gluten-free, dekorasi kecil ultah, dll."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-medium text-slate-900 focus:border-amber-600 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-2xl bg-amber-600 py-3.5 text-sm font-black text-white shadow-lg shadow-amber-600/30 hover:bg-amber-700 transition-all flex items-center justify-center gap-2"
          >
            <span>📅</span> AJUKAN RESERVASI SEKARANG
          </button>
        </form>
      )}
    </div>
  );
}
