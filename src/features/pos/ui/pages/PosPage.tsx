import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@shared/infrastructure/http/apiClient";
import type { MenuItem } from "@features/menu/domain/entities/MenuItem";
import { usePosCartStore } from "@features/pos/ui/stores/usePosCartStore";
import { formatPrice } from "@features/menu/domain/entities/MenuItem";
import { Button } from "@shared/ui/atoms/Button";
import { Input } from "@shared/ui/atoms/Input";
import { Badge } from "@shared/ui/atoms/Badge";
import { Card } from "@shared/ui/atoms/Card";
import { AdminLayout } from "@shared/ui/templates/AdminLayout";
import { useOfflineSync } from "@features/offline/ui/components/useOfflineSync";
import type { OrderStatus, CookingStatus } from "@features/pos/domain/entities/Order";
import { getCloudinaryUrl, MENU_IMAGE_FALLBACK } from "@shared/infrastructure/media/cloudinary";

interface MenuResponse {
  success: boolean;
  data: MenuItem[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

interface ActiveOrder {
  id: string;
  table_number: number;
  status: OrderStatus;
  items: Array<{ menu_name: string; quantity: number; cooking_status: CookingStatus }>;
  total: number;
  payment_status: string;
  created_at: string;
}

const PAYMENT_METHODS = [
  { value: "cash" as const, label: "Tunai", icon: "💵" },
  { value: "qris" as const, label: "QRIS", icon: "📱" },
  { value: "debit" as const, label: "Debit", icon: "💳" },
  { value: "ewallet" as const, label: "E-Wallet", icon: "📲" },
];

export function PosPage() {
  const {
    items, addItem, removeItem, updateQuantity, clearCart,
    getTotal, getTotalWithTax, getItemCount,
    tableNumber, setTableNumber, paymentMethod, setPaymentMethod,
    setLastOrder,
  } = usePosCartStore();

  const { saveOfflineOrder, syncStatus } = useOfflineSync();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showVoidModal, setShowVoidModal] = useState(false);
  const [voidOrderId, setVoidOrderId] = useState<string | null>(null);
  const [voidReason, setVoidReason] = useState("");
  const [managerPin, setManagerPin] = useState("");

  const { data: menuData, isLoading } = useQuery<MenuResponse>({
    queryKey: ["menus", "pos"],
    queryFn: () =>
      apiClient.get("/menus", { params: { per_page: 100, status: "active" } }).then((r) => r.data),
  });

  const { data: activeOrders } = useQuery<{ success: boolean; data: ActiveOrder[] }>({
    queryKey: ["orders", "active"],
    queryFn: () =>
      apiClient.get("/orders", { params: { status: "open", per_page: 10 } }).then((r) => r.data),
    refetchInterval: 15000,
  });

  const checkoutMutation = useMutation({
    mutationFn: () =>
      apiClient.post("/orders", {
        table_number: tableNumber || 1,
        items: items.map((item) => ({
          menu_id: item.menu.id, quantity: item.quantity, variant: item.variant, notes: item.notes,
        })),
        notes: null,
        payment_method: paymentMethod,
        idempotency_key: crypto.randomUUID(),
      }),
    onSuccess: (res) => {
      const orderId = res.data?.data?.id || "unknown";
      setLastOrder(orderId, "pending");
      setShowPaymentModal(true);
      clearCart();
    },
    onError: () => alert("Gagal membuat pesanan"),
  });

  const voidMutation = useMutation({
    mutationFn: () =>
      apiClient.post("/orders/void", {
        order_id: voidOrderId, reason: voidReason, manager_pin: managerPin || undefined,
      }),
    onSuccess: () => {
      setShowVoidModal(false);
      setVoidOrderId(null);
      setVoidReason("");
      setManagerPin("");
      alert("Pesanan berhasil dibatalkan");
    },
    onError: (error) => alert(error instanceof Error ? error.message : "Gagal membatalkan pesanan"),
  });

  const menus = menuData?.data || [];

  const filteredMenus = menus.filter((menu) => {
    const matchesSearch = !search || menu.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || menu.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(menus.map((m) => m.category))];

  const handleCheckout = () => {
    if (items.length === 0) return;

    if (!navigator.onLine) {
      saveOfflineOrder({
        tenantId: "current",
        tableId: String(tableNumber || 1),
        items: items.map((item) => ({
          menu_item_id: item.menu.id, name: item.menu.name,
          quantity: item.quantity, unit_price: item.menu.price,
          total_price: item.menu.price * item.quantity,
          variant: item.variant, notes: item.notes,
        })),
        totalAmount: getTotalWithTax(),
      }).then((localId) => {
        setLastOrder(localId, "pending");
        clearCart();
        alert("Pesanan disimpan offline, akan dikirim saat online kembali");
      });
      return;
    }

    checkoutMutation.mutate();
  };

  return (
    <AdminLayout title="POS Kasir (Point of Sale)">
      {!syncStatus.isOnline && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-700">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Mode Offline — {syncStatus.pendingCount > 0
            ? `${syncStatus.pendingCount} pesanan menunggu sinkronisasi`
            : "Pesanan akan disinkronkan saat online kembali"}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Side */}
        <div className="flex-1 w-full space-y-5">
          {/* Active Orders */}
          {activeOrders?.data && activeOrders.data.length > 0 && (
            <Card className="border-amber-200 bg-amber-50/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-subtitle font-bold text-slate-900">Pesanan Aktif</h3>
                <Badge variant="warning">{activeOrders.data.length}</Badge>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {activeOrders.data.map((order) => (
                  <div key={order.id} className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm">
                    <div>
                      <p className="text-caption font-bold text-slate-900">Meja {order.table_number}</p>
                      <p className="text-caption text-slate-500">{order.items.length} item</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={order.status === "cooking" ? "warning" : "info"}>
                        {order.status}
                      </Badge>
                      <button
                        onClick={() => { setVoidOrderId(order.id); setShowVoidModal(true); }}
                        className="rounded-lg px-2 py-1 text-caption text-rose-600 hover:bg-rose-50"
                      >
                        Void
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl bg-white p-4 shadow-sm border border-slate-200/80">
            <div className="w-full sm:flex-1">
              <Input
                placeholder="Cari nama menu hidangan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-600 pl-2">Meja:</span>
              <input
                type="number"
                value={tableNumber || ""}
                onChange={(e) => setTableNumber(Number(e.target.value) || null)}
                placeholder="No."
                className="w-20 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-900 focus:border-cabe-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button onClick={() => setSelectedCategory(null)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap ${!selectedCategory ? "bg-slate-900 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100"}`}>
              Semua Menu
              <span className={`rounded-md px-1.5 py-0.5 text-[10px] ${!selectedCategory ? "bg-white/20" : "bg-slate-100"}`}>{menus.length}</span>
            </button>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold capitalize whitespace-nowrap ${selectedCategory === cat ? "bg-cabe-600 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100"}`}>
                {cat}
                <span className="rounded-md px-1.5 py-0.5 text-[10px] bg-white/20 text-white">{menus.filter((m) => m.category === cat).length}</span>
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-white p-3 shadow-sm border border-slate-100">
                  <div className="aspect-square rounded-xl bg-slate-200" />
                  <div className="mt-3 h-4 w-3/4 rounded bg-slate-200" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-slate-200" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMenus.map((menu) => (
                <div key={menu.id} onClick={() => addItem(menu)}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md cursor-pointer">
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-100">
                    {menu.image_url ? (
                      <img
                        src={getCloudinaryUrl(menu.image_url, { width: 400, height: 400, crop: "fill" })}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = MENU_IMAGE_FALLBACK;
                        }}
                        alt={menu.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300">
                        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    )}
                    {menu.is_popular && <div className="absolute top-2 left-2"><Badge variant="secondary" size="sm">★ Terlaris</Badge></div>}
                  </div>
                  <div className="mt-3 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="line-clamp-1 text-xs font-bold text-slate-900 group-hover:text-cabe-600">{menu.name}</h3>
                      <p className="mt-0.5 text-[11px] font-medium text-slate-400 capitalize">{menu.category}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-extrabold text-slate-900">{formatPrice(menu.price)}</span>
                      <button className="flex h-8 w-8 items-center justify-center rounded-xl bg-cabe-50 text-cabe-600 font-bold hover:bg-cabe-600 hover:text-white transition-all shadow-sm">+</button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredMenus.length === 0 && (
                <div className="col-span-full py-16 text-center text-xs text-slate-400">Tidak ada menu ditemukan</div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Cart Panel */}
        <div className="w-full lg:w-96 shrink-0 rounded-2xl border border-slate-200/80 bg-white shadow-lg overflow-hidden lg:sticky lg:top-24">
          <div className="border-b border-slate-100 bg-slate-900 p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold">Struk Pesanan</h2>
                <p className="text-[11px] text-slate-400">{tableNumber ? `Meja No. ${tableNumber}` : "Pilih nomor meja di atas"}</p>
              </div>
              <Badge variant="primary" size="md">{getItemCount()} Item</Badge>
            </div>
          </div>

          {/* Payment Method */}
          {items.length > 0 && (
            <div className="border-b border-slate-100 p-3">
              <p className="text-caption font-semibold text-slate-600 mb-2">Metode Pembayaran</p>
              <div className="grid grid-cols-4 gap-1.5">
                {PAYMENT_METHODS.map((m) => (
                  <button key={m.value} onClick={() => setPaymentMethod(m.value)}
                    className={`rounded-xl p-2 text-center text-caption font-semibold transition-all ${
                      paymentMethod === m.value
                        ? "bg-cabe-50 text-cabe-700 border border-cabe-200"
                        : "bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100"
                    }`}>
                    <span className="block text-lg">{m.icon}</span>
                    <span className="text-[10px]">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="max-h-[320px] overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <svg className="h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="mt-3 text-xs font-semibold text-slate-500">Keranjang masih kosong</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={`${item.menu.id}-${item.variant}`} className="pt-3 first:pt-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-slate-900">{item.menu.name}</h4>
                      {item.variant && <p className="text-[10px] font-medium text-slate-400">{item.variant}</p>}
                      <p className="mt-0.5 text-xs font-extrabold text-cabe-600">{formatPrice(item.menu.price)}</p>
                    </div>
                    <button onClick={() => removeItem(item.menu.id)} className="text-slate-400 hover:text-rose-600 p-1">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-1">
                      <button onClick={() => updateQuantity(item.menu.id, item.quantity - 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-700 hover:bg-slate-200">-</button>
                      <span className="w-6 text-center text-xs font-extrabold text-slate-900">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.menu.id, item.quantity + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-700 hover:bg-slate-200">+</button>
                    </div>
                    <span className="text-xs font-black text-slate-900">{formatPrice(item.menu.price * item.quantity)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50/80 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">{formatPrice(getTotal())}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Pajak Resto (10%)</span>
                <span className="font-bold text-slate-900">{formatPrice(getTotal() * 0.1)}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Total</span>
                <span className="text-lg font-black text-cabe-600">{formatPrice(getTotalWithTax())}</span>
              </div>
              <Button onClick={handleCheckout} disabled={items.length === 0} className="w-full py-3" variant="primary">
                {checkoutMutation.isPending ? "Memproses..." : "Proses Pembayaran"}
              </Button>
              <button onClick={clearCart} className="w-full text-center text-[11px] font-bold text-slate-400 hover:text-rose-600">
                Kosongkan Keranjang
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Void Modal */}
      {showVoidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-h2 font-bold text-slate-900 mb-4">Batalkan Pesanan</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-caption font-semibold text-slate-600 mb-1">Alasan Pembatalan</label>
                <textarea
                  value={voidReason}
                  onChange={(e) => setVoidReason(e.target.value)}
                  placeholder="Contoh: Pesanan tidak jadi, pelanggan pergi..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-body focus:border-cabe-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-caption font-semibold text-slate-600 mb-1">
                  PIN Manager <span className="text-rose-500">*wajib jika sudah dimasak</span>
                </label>
                <Input
                  type="password"
                  value={managerPin}
                  onChange={(e) => setManagerPin(e.target.value)}
                  placeholder="Masukkan PIN manager"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button variant="ghost" onClick={() => setShowVoidModal(false)} className="flex-1">Batal</Button>
              <Button
                variant="danger"
                onClick={() => voidMutation.mutate()}
                disabled={!voidReason}
                className="flex-1"
              >
                {voidMutation.isPending ? "Memproses..." : "Ya, Batalkan"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Success Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-4 text-h2 font-bold text-slate-900">Pesanan Berhasil!</h3>
            <p className="mt-2 text-body text-slate-600">
              Pesanan meja {tableNumber} telah diproses dengan {paymentMethod === "cash" ? "pembayaran tunai" : paymentMethod.toUpperCase()}.
            </p>
            <Button onClick={() => setShowPaymentModal(false)} className="mt-6 w-full">Tutup</Button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
