import { useState, useEffect } from "react";

interface DrinkTicketItem {
  name: string;
  qty: number;
  notes?: string;
  temperature?: "panas" | "dingin" | "biasa";
}

interface DrinkTicket {
  id: string;
  orderNumber: string;
  tableName: string;
  orderType: "Dine In" | "Take Away";
  elapsedSeconds: number;
  status: "new" | "making" | "ready";
  items: DrinkTicketItem[];
  createdAt: string;
}

const MOCK_DRINK_TICKETS: DrinkTicket[] = [
  {
    id: "w-001",
    orderNumber: "ORD-94812",
    tableName: "Meja A3",
    orderType: "Dine In",
    elapsedSeconds: 180,
    status: "new",
    items: [
      { name: "Es Teler Spesial", qty: 2, temperature: "dingin" },
      { name: "Jeruk Peras Segar", qty: 1, temperature: "dingin", notes: "Tanpa es, manis sekali" },
    ],
    createdAt: "18:42 WIB",
  },
  {
    id: "w-002",
    orderNumber: "ORD-94811",
    tableName: "Meja B1",
    orderType: "Dine In",
    elapsedSeconds: 480,
    status: "making",
    items: [
      { name: "Nipis Madu", qty: 2, temperature: "dingin" },
      { name: "Teh Poci Rempah", qty: 1, temperature: "panas", notes: "Gula batu dipisah" },
    ],
    createdAt: "18:37 WIB",
  },
  {
    id: "w-003",
    orderNumber: "ORD-94810",
    tableName: "Take Away #04",
    orderType: "Take Away",
    elapsedSeconds: 840,
    status: "making",
    items: [
      { name: "Jus Buah Naga", qty: 2, temperature: "dingin" },
      { name: "Jus Semangka", qty: 1, temperature: "dingin", notes: "Tambah madu" },
    ],
    createdAt: "18:31 WIB",
  },
  {
    id: "w-004",
    orderNumber: "ORD-94809",
    tableName: "Meja A1",
    orderType: "Dine In",
    elapsedSeconds: 1080,
    status: "ready",
    items: [
      { name: "Es Soda Gembira", qty: 2, temperature: "dingin" },
    ],
    createdAt: "18:27 WIB",
  },
];

function formatElapsed(seconds: number): string {
  if (seconds < 60) return `${seconds} dtk`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m} mnt ${s} dtk` : `${m} mnt`;
}

const TEMP_LABEL: Record<string, { label: string; color: string }> = {
  dingin: { label: "❄️ Dingin", color: "bg-sky-100 text-sky-700 border-sky-200" },
  panas: { label: "🔥 Panas", color: "bg-orange-100 text-orange-700 border-orange-200" },
  biasa: { label: "🌡️ Biasa", color: "bg-slate-100 text-slate-600 border-slate-200" },
};

export function WaiterBarPage() {
  const [tickets, setTickets] = useState<DrinkTicket[]>(MOCK_DRINK_TICKETS);
  const [filter, setFilter] = useState<"all" | "new" | "making" | "ready">("all");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [elapsed, setElapsed] = useState<Record<string, number>>(() =>
    Object.fromEntries(MOCK_DRINK_TICKETS.map((t) => [t.id, t.elapsedSeconds]))
  );

  // Live elapsed timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) =>
        Object.fromEntries(
          Object.entries(prev).map(([id, secs]) => [id, secs + 1])
        )
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const updateStatus = (id: string, status: DrinkTicket["status"]) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const finishTicket = (id: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTickets = tickets.filter((t) => filter === "all" || t.status === filter);
  const now = new Date();
  const dateStr = now.toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const newCount = tickets.filter((t) => t.status === "new").length;
  const makingCount = tickets.filter((t) => t.status === "making").length;
  const readyCount = tickets.filter((t) => t.status === "ready").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0d1b2a] to-slate-900 text-white font-sans">
      {/* TOP HEADER */}
      <div className="border-b border-white/10 bg-slate-950/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          {/* Left: Title & Date */}
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              🍹 Waiter &amp; Bar Display
            </h1>
            <p className="text-xs font-bold text-slate-400 mt-0.5">
              {dateStr} · Outlet Restoku Cabang Utama
            </p>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-3">
            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black border transition-all ${
                soundEnabled
                  ? "bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700"
              }`}
            >
              <span>{soundEnabled ? "🔊" : "🔇"}</span>
              Notifikasi Suara HP
            </button>

            {/* Live Badge */}
            <span className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>

            {/* Bell */}
            <button className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all">
              <svg className="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {newCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-cabe-600 text-[9px] font-black text-white flex items-center justify-center">
                  {newCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="max-w-7xl mx-auto mt-4 flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all border ${
              filter === "all"
                ? "bg-white text-slate-950 border-white shadow-md"
                : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
            }`}
          >
            Semua ({tickets.length})
          </button>
          <button
            onClick={() => setFilter("new")}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all border ${
              filter === "new"
                ? "bg-amber-500 text-slate-950 border-amber-500 shadow-md"
                : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
            }`}
          >
            ⏳ Antrean Baru ({newCount})
          </button>
          <button
            onClick={() => setFilter("making")}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all border ${
              filter === "making"
                ? "bg-sky-500 text-slate-950 border-sky-500 shadow-md"
                : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
            }`}
          >
            🍹 Sedang Dibuat ({makingCount})
          </button>
          <button
            onClick={() => setFilter("ready")}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all border ${
              filter === "ready"
                ? "bg-emerald-500 text-slate-950 border-emerald-500 shadow-md"
                : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
            }`}
          >
            ✅ Siap Diantar ({readyCount})
          </button>
        </div>
      </div>

      {/* TICKET GRID */}
      <main className="max-w-7xl mx-auto p-6">
        {filteredTickets.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="text-6xl mb-4 opacity-30">🥤</div>
            <h3 className="text-lg font-black text-white/40">Antrean Minuman Kosong</h3>
            <p className="text-sm text-slate-500 mt-1">Belum ada orderan minuman masuk dari pelanggan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredTickets.map((ticket) => {
              const isNew = ticket.status === "new";
              const isMaking = ticket.status === "making";
              const isReady = ticket.status === "ready";
              const ticketElapsed = elapsed[ticket.id] ?? ticket.elapsedSeconds;
              const isUrgent = ticketElapsed > 300 && !isReady; // > 5 min = urgent

              return (
                <div
                  key={ticket.id}
                  className={`flex flex-col rounded-3xl overflow-hidden border transition-all shadow-xl ${
                    isNew
                      ? "border-amber-500/50 bg-amber-500/5"
                      : isMaking
                      ? "border-sky-500/50 bg-sky-500/5"
                      : "border-emerald-500/50 bg-emerald-500/5"
                  } ${isUrgent ? "ring-2 ring-cabe-500/50 animate-pulse" : ""}`}
                >
                  {/* Card Header */}
                  <div
                    className={`px-4 py-3 flex items-start justify-between ${
                      isNew
                        ? "bg-amber-500/20 border-b border-amber-500/20"
                        : isMaking
                        ? "bg-sky-500/20 border-b border-sky-500/20"
                        : "bg-emerald-500/20 border-b border-emerald-500/20"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-white">{ticket.tableName}</h3>
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                            ticket.orderType === "Take Away"
                              ? "bg-purple-500/30 text-purple-300 border border-purple-500/30"
                              : "bg-white/10 text-white/70 border border-white/10"
                          }`}
                        >
                          {ticket.orderType}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/50 font-bold mt-0.5">
                        {ticket.orderNumber} · {ticket.createdAt}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={`block text-xs font-black ${
                          isUrgent ? "text-cabe-400 animate-pulse" : "text-white/60"
                        }`}
                      >
                        ⏱ {formatElapsed(ticketElapsed)}
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider ${
                          isNew
                            ? "text-amber-400"
                            : isMaking
                            ? "text-sky-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {isNew ? "MENUNGGU" : isMaking ? "DIBUAT" : "SIAP ANTAR"}
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="flex-1 p-4 space-y-3">
                    {ticket.items.map((item, idx) => (
                      <div key={idx} className="border-b border-white/5 pb-2.5 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <span className="text-sm font-black text-white">
                              <span className="text-amber-400 mr-1">{item.qty}x</span>
                              {item.name}
                            </span>
                            {item.temperature && (
                              <span
                                className={`ml-2 inline-block text-[9px] font-black px-1.5 py-0.5 rounded-full border ${TEMP_LABEL[item.temperature]?.color}`}
                              >
                                {TEMP_LABEL[item.temperature]?.label}
                              </span>
                            )}
                          </div>
                        </div>
                        {item.notes && (
                          <p className="mt-1.5 text-[11px] font-bold text-amber-300 bg-amber-500/10 p-1.5 rounded-xl border border-amber-500/20">
                            📌 {item.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Action Footer */}
                  <div className="p-3 border-t border-white/10">
                    {isNew && (
                      <button
                        onClick={() => updateStatus(ticket.id, "making")}
                        className="w-full py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-sky-500/20"
                      >
                        🍹 Mulai Buat Minuman
                      </button>
                    )}
                    {isMaking && (
                      <button
                        onClick={() => updateStatus(ticket.id, "ready")}
                        className="w-full py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-emerald-500/20"
                      >
                        ✅ Minuman Siap Diantar
                      </button>
                    )}
                    {isReady && (
                      <button
                        onClick={() => finishTicket(ticket.id)}
                        className="w-full py-2.5 rounded-2xl bg-slate-700 hover:bg-slate-600 text-white font-black text-xs transition-all"
                      >
                        🍽️ Selesai Diantar ke Meja
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
