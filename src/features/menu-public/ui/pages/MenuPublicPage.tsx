import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@shared/infrastructure/http/apiClient";
import type { MenuItem } from "@features/menu/domain/entities/MenuItem";
import { MenuItemCard } from "@features/menu-public/ui/components/MenuItemCard";
import { CartDrawer } from "@features/menu-public/ui/components/CartDrawer";
import { OrderConfirmationModal } from "@features/menu-public/ui/components/OrderConfirmationModal";
import { WelcomeModal } from "@features/menu-public/ui/components/WelcomeModal";
import { GalleryTab } from "@features/menu-public/ui/components/GalleryTab";
import { ReservationTab } from "@features/menu-public/ui/components/ReservationTab";
import { useCartStore } from "@features/menu-public/ui/stores/useCartStore";
import { formatPrice } from "@features/menu/domain/entities/MenuItem";
import { Button } from "@shared/ui/atoms/Button";

interface Restaurant {
  id: string;
  name: string;
  logo_url: string | null;
}

interface PublicMenuResponse {
  success: boolean;
  data: {
    restaurant: Restaurant;
    menus: MenuItem[];
  };
}

export function MenuPublicPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const rawTable = new URLSearchParams(window.location.search).get("table") || "1";
  const tableNumber = Number(rawTable) || 1;
  const tableName = isNaN(Number(rawTable)) ? `Meja ${rawTable}` : `Meja ${tableNumber}`;

  const { addItem, getItemCount, setRestaurant, clearCart } = useCartStore();

  const [activeTab, setActiveTab] = useState<"menu" | "gallery" | "reservation">("menu");
  const [orderType, setOrderType] = useState<"dine-in" | "take-away">("dine-in");
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>("makanan");
  const [search, setSearch] = useState("");
  const [isOfflineMode] = useState(false);

  const { data, isLoading, error } = useQuery<PublicMenuResponse>({
    queryKey: ["public-menu", restaurantId],
    queryFn: () => apiClient.get(`/public/menu/${restaurantId}`).then((res) => res.data),
    enabled: !!restaurantId,
  });

  useState(() => {
    if (restaurantId) {
      setRestaurant(restaurantId, tableNumber);
    }
  });

  const filteredMenus = useMemo(() => {
    if (!data?.data.menus) return [];

    let menus = data.data.menus.filter((m) => m.status === "active");

    if (selectedCategory && selectedCategory !== "semua") {
      menus = menus.filter(
        (m) => m.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      menus = menus.filter(
        (m) =>
          m.name.toLowerCase().includes(searchLower) ||
          m.description?.toLowerCase().includes(searchLower)
      );
    }

    return menus;
  }, [data, selectedCategory, search]);

  const categories = useMemo(() => {
    if (!data?.data.menus) return ["makanan", "snack", "minuman"];
    const cats = new Set(
      data.data.menus.filter((m) => m.status === "active").map((m) => m.category.toLowerCase())
    );
    return Array.from(cats);
  }, [data]);

  const handleAddToCart = (menu: MenuItem) => {
    addItem(menu);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsOrderModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fcf9f2]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-600 border-t-transparent" />
          <span className="text-xs font-black text-amber-900">Memuat Buku Menu Digital...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fcf9f2] p-4">
        <div className="text-center rounded-3xl bg-white p-8 shadow-sm border border-amber-100 max-w-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 text-2xl">
            🍽️
          </div>
          <h1 className="mt-4 text-lg font-black text-slate-900">Menu tidak ditemukan</h1>
          <p className="mt-2 text-xs text-slate-500 font-medium">
            Restoran tidak tersedia atau sedang offline.
          </p>
        </div>
      </div>
    );
  }

  const restaurant = data.data.restaurant;

  return (
    <div className="min-h-screen bg-[#fcf9f2] text-slate-900 pb-28 font-sans">
      {/* Welcome Onboarding Modal */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        tableName={tableName}
        restaurantName={restaurant.name}
        orderType={orderType}
        onOrderTypeChange={setOrderType}
      />

      {/* Top Offline Warning Banner */}
      {isOfflineMode && (
        <div className="bg-amber-700/90 py-2 px-4 text-center text-xs font-extrabold text-amber-50 flex items-center justify-center gap-2">
          <span>⚠️</span> Menampilkan Menu Offline (Koneksi Terputus/Lambat)
        </div>
      )}

      {/* Main Header (Kedai Elvera 57 & Halal Logo) */}
      <header className="sticky top-0 z-40 bg-[#fffdfa]/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
        <div className="mx-auto max-w-md px-4 py-3.5 flex items-center justify-between">
          {/* Logo & Restaurant Info */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-900 text-amber-100 font-black text-xs shadow-xs border border-amber-700/40">
              {restaurant.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black text-slate-900 leading-tight">
                  {restaurant.name}
                </h1>
              </div>
              <p className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                <span>{tableName}</span> · <span>Scan & Order</span>
              </p>
            </div>
          </div>

          {/* Halal Logo & Orders Pill */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex flex-col items-center justify-center rounded-xl bg-emerald-50 px-2.5 py-1 border border-emerald-200 text-emerald-800 text-[9px] font-black leading-tight">
              <span>HALAL</span>
              <span className="text-[7px] text-emerald-600">INDONESIA</span>
            </div>

            {getItemCount() > 0 && (
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-black text-amber-900 border border-amber-200/80 shadow-2xs hover:bg-amber-200 transition-all"
              >
                <span>⏱️</span> {getItemCount()} Pesanan
              </button>
            )}

            <button
              type="button"
              onClick={clearCart}
              title="Kosongkan Keranjang"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all border border-amber-100"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Top Navigation Tabs: MENU, GALERI, RESERVASI */}
        <div className="border-t border-amber-100/70 bg-[#fffdfa]">
          <div className="mx-auto max-w-md grid grid-cols-3 px-4 py-2 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("menu")}
              className={`flex items-center justify-center gap-1.5 rounded-2xl py-2 text-xs font-black transition-all ${
                activeTab === "menu"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                  : "bg-amber-50/60 text-slate-600 hover:bg-amber-100/60"
              }`}
            >
              <span>📖</span> MENU
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("gallery")}
              className={`flex items-center justify-center gap-1.5 rounded-2xl py-2 text-xs font-black transition-all ${
                activeTab === "gallery"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                  : "bg-amber-50/60 text-slate-600 hover:bg-amber-100/60"
              }`}
            >
              <span>📷</span> GALERI
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reservation")}
              className={`flex items-center justify-center gap-1.5 rounded-2xl py-2 text-xs font-black transition-all ${
                activeTab === "reservation"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                  : "bg-amber-50/60 text-slate-600 hover:bg-amber-100/60"
              }`}
            >
              <span>📅</span> RESERVASI
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-md px-4 py-4 space-y-4">
        {activeTab === "menu" && (
          <>
            {/* Search Input Bar */}
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari menu otentik..."
                className="w-full rounded-2xl border border-amber-200/80 bg-white px-4 py-2.5 pl-10 text-xs font-bold text-slate-900 shadow-2xs focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
              <span className="absolute left-3.5 top-3 text-slate-400 text-xs">🔍</span>
            </div>

            {/* Sub Category Filter Pills (Makanan, Snack, Minuman, Paket) */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={`shrink-0 rounded-full px-5 py-2 text-xs font-black transition-all capitalize ${
                  selectedCategory === null
                    ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                    : "bg-amber-100/60 text-slate-700 hover:bg-amber-200/60"
                }`}
              >
                Semua
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 rounded-full px-5 py-2 text-xs font-black transition-all capitalize ${
                    selectedCategory === cat
                      ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                      : "bg-amber-100/60 text-slate-700 hover:bg-amber-200/60"
                  }`}
                >
                  {cat === "makanan" ? "Makanan" : cat === "minuman" ? "Minuman" : cat === "snack" ? "Snack" : cat}
                </button>
              ))}
            </div>

            {/* Menu Items Grid */}
            {filteredMenus.length === 0 ? (
              <div className="rounded-3xl bg-white p-8 text-center border border-amber-100">
                <svg className="mx-auto h-12 w-12 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-3 text-sm font-black text-slate-900">Menu tidak ditemukan</h3>
                <p className="mt-1 text-xs text-slate-500 font-medium">Coba kata kunci lain atau pilih kategori Semua.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3.5">
                {filteredMenus.map((menu) => (
                  <MenuItemCard
                    key={menu.id}
                    menu={menu}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* GALERI Tab */}
        {activeTab === "gallery" && <GalleryTab />}

        {/* RESERVASI Tab */}
        {activeTab === "reservation" && <ReservationTab />}
      </main>

      {/* Floating Bottom Cart Bar */}
      {getItemCount() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#fffdfa]/95 backdrop-blur-md border-t border-amber-200/80 p-3.5 shadow-2xl">
          <div className="mx-auto max-w-md">
            <Button
              onClick={() => setIsCartOpen(true)}
              className="w-full rounded-2xl bg-amber-600 py-3.5 text-xs font-black text-white shadow-lg shadow-amber-600/30 hover:bg-amber-700 transition-all flex items-center justify-between px-5"
            >
              <span className="flex items-center gap-2">
                <span>🛒</span> Lihat Keranjang ({getItemCount()} Item)
              </span>
              <span>{formatPrice(useCartStore.getState().getTotal())} ↗</span>
            </Button>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </div>
  );
}
