import { useState } from "react";
import { AdminLayout } from "@shared/ui/templates/AdminLayout";
import { Badge } from "@shared/ui/atoms/Badge";
import { Button } from "@shared/ui/atoms/Button";

interface KitchenTicketItem {
  name: string;
  qty: number;
  notes?: string;
}

interface KitchenOrderTicket {
  id: string;
  orderNumber: string;
  tableName: string;
  orderType: "Dine In" | "Take Away";
  elapsedMinutes: number;
  status: "new" | "cooking" | "ready";
  items: KitchenTicketItem[];
  createdAt: string;
}

const INITIAL_KITCHEN_ORDERS: KitchenOrderTicket[] = [
  {
    id: "k-101",
    orderNumber: "ORD-94812",
    tableName: "Meja A3",
    orderType: "Dine In",
    elapsedMinutes: 3,
    status: "new",
    items: [
      { name: "Bakmi Godog Jawa", qty: 2, notes: "Pedas sedang, tanpa daun bawang" },
      { name: "Soto Ayam Semarang", qty: 1, notes: "Kuah dipisah" },
    ],
    createdAt: "18:42 WIB",
  },
  {
    id: "k-102",
    orderNumber: "ORD-94811",
    tableName: "Meja B1",
    orderType: "Dine In",
    elapsedMinutes: 8,
    status: "cooking",
    items: [
      { name: "Nasi Goreng Mawut Semarang", qty: 1, notes: "Ekstra telur mata sapi" },
      { name: "Ayam Goreng Penyet Semarang", qty: 1 },
    ],
    createdAt: "18:37 WIB",
  },
  {
    id: "k-103",
    orderNumber: "ORD-94810",
    tableName: "Take Away #04",
    orderType: "Take Away",
    elapsedMinutes: 14,
    status: "cooking",
    items: [
      { name: "Rawon Semarang", qty: 2, notes: "Bungkus terpisah" },
      { name: "Tahu Gimbal Semarang", qty: 1 },
    ],
    createdAt: "18:31 WIB",
  },
  {
    id: "k-104",
    orderNumber: "ORD-94809",
    tableName: "Meja A1",
    orderType: "Dine In",
    elapsedMinutes: 18,
    status: "ready",
    items: [
      { name: "Roti Bakar Keju Karamel", qty: 1 },
      { name: "Es Teler Spesial", qty: 2 },
    ],
    createdAt: "18:27 WIB",
  },
];

export function KitchenPage() {
  const [tickets, setTickets] = useState<KitchenOrderTicket[]>(INITIAL_KITCHEN_ORDERS);
  const [filter, setFilter] = useState<"all" | "new" | "cooking" | "ready">("all");

  const updateTicketStatus = (id: string, newStatus: "new" | "cooking" | "ready") => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  const handleFinishTicket = (id: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTickets = tickets.filter((t) => filter === "all" || t.status === filter);

  const newCount = tickets.filter((t) => t.status === "new").length;
  const cookingCount = tickets.filter((t) => t.status === "cooking").length;
  const readyCount = tickets.filter((t) => t.status === "ready").length;

  return (
    <AdminLayout title="Monitor Dapur & Kitchen Display System (KDS)">
      {/* Top Banner Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 text-white p-5 shadow-lg border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 font-extrabold text-2xl border border-amber-500/30">
            🍳
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">Layar Display Tim Dapur (KDS)</h2>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black text-emerald-400 border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Order Stream
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Pantau antrean masuk, konfirmasi status memasak, dan beritahu pelayan saat makanan siap disajikan.
            </p>
          </div>
        </div>

        {/* Quick Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              filter === "all"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Semua ({tickets.length})
          </button>
          <button
            onClick={() => setFilter("new")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              filter === "new"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            ⏳ Baru ({newCount})
          </button>
          <button
            onClick={() => setFilter("cooking")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              filter === "cooking"
                ? "bg-sky-500 text-slate-950 shadow-md"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            🍳 Dimasak ({cookingCount})
          </button>
          <button
            onClick={() => setFilter("ready")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              filter === "ready"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            ✅ Siap ({readyCount})
          </button>
        </div>
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredTickets.map((ticket) => {
          const isNew = ticket.status === "new";
          const isCooking = ticket.status === "cooking";
          const isReady = ticket.status === "ready";

          return (
            <div
              key={ticket.id}
              className={`flex flex-col justify-between overflow-hidden rounded-3xl bg-white shadow-lg border transition-all ${
                isNew
                  ? "border-amber-400 ring-2 ring-amber-400/20"
                  : isCooking
                  ? "border-sky-400 ring-2 ring-sky-400/20"
                  : "border-emerald-400 ring-2 ring-emerald-400/20"
              }`}
            >
              {/* Ticket Header */}
              <div
                className={`p-4 text-white flex items-center justify-between ${
                  isNew
                    ? "bg-amber-600"
                    : isCooking
                    ? "bg-sky-700"
                    : "bg-emerald-600"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black">{ticket.tableName}</h3>
                    <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
                      {ticket.orderType}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold opacity-80 mt-0.5">
                    {ticket.orderNumber} · {ticket.createdAt}
                  </p>
                </div>
                <div className="text-right">
                  <span className="block text-xs font-black animate-pulse">
                    ⏱️ {ticket.elapsedMinutes} mnt lalu
                  </span>
                  <span className="text-[9px] uppercase font-bold tracking-wider opacity-90 block">
                    {isNew ? "MENUNGGU" : isCooking ? "SEDANG DIMASAK" : "SIAP DIANTAR"}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="p-4 space-y-3 flex-1 bg-[#fcfdfa]">
                {ticket.items.map((item, idx) => (
                  <div key={idx} className="border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-black text-slate-900 leading-tight">
                        <span className="inline-block min-w-[24px] text-cabe-600 font-extrabold">
                          {item.qty}x
                        </span>
                        {item.name}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="mt-1 text-[11px] font-bold text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200/80">
                        📌 Catatan: {item.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex gap-2">
                {isNew && (
                  <Button
                    onClick={() => updateTicketStatus(ticket.id, "cooking")}
                    className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black text-xs py-3"
                  >
                    🍳 Mulai Memasak
                  </Button>
                )}
                {isCooking && (
                  <Button
                    onClick={() => updateTicketStatus(ticket.id, "ready")}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3"
                  >
                    ✅ Tandai Siap Saji
                  </Button>
                )}
                {isReady && (
                  <Button
                    onClick={() => handleFinishTicket(ticket.id)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-3"
                  >
                    🍽️ Selesai & Selesai Diantar
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        {filteredTickets.length === 0 && (
          <div className="col-span-full py-20 text-center rounded-3xl bg-white border border-slate-200/80 shadow-xs">
            <div className="text-4xl mb-3">👨‍🍳</div>
            <h3 className="text-base font-black text-slate-800">Tidak ada antrean pesanan dapur</h3>
            <p className="text-xs text-slate-400 mt-1">Semua pesanan makanan telah selesai dimasak dan disajikan.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
