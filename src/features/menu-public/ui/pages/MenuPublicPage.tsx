import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@shared/infrastructure/http/apiClient";
import type { MenuItem } from "@features/menu/domain/entities/MenuItem";
import { MenuItemCard } from "@features/menu-public/ui/components/MenuItemCard";
import { CartDrawer } from "@features/menu-public/ui/components/CartDrawer";
import { OrderConfirmationModal } from "@features/menu-public/ui/components/OrderConfirmationModal";
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
  const tableNumber = Number(new URLSearchParams(window.location.search).get("table")) || 1;

  const { addItem, getItemCount, setRestaurant } = useCartStore();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

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

    if (selectedCategory) {
      menus = menus.filter((m) => m.category === selectedCategory);
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
    if (!data?.data.menus) return [];
    const cats = new Set(data.data.menus.filter((m) => m.status === "active").map((m) => m.category));
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cabe-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Menu tidak ditemukan</h1>
          <p className="mt-2 text-gray-600">Restoran ini belum tersedia</p>
        </div>
      </div>
    );
  }

  const restaurant = data.data.restaurant;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="sticky top-0 z-40 bg-white shadow">
        <div className="mx-auto max-w-lg px-4 py-4">
          <div className="flex items-center gap-4">
            {restaurant.logo_url ? (
              <img
                src={restaurant.logo_url}
                alt={restaurant.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cabe-100 text-cabe-600 font-bold">
                {restaurant.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-lg font-bold text-gray-900">{restaurant.name}</h1>
              <p className="text-sm text-gray-500">Meja {tableNumber}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="sticky top-[72px] z-30 bg-white border-b px-4 py-3">
        <div className="mx-auto max-w-lg">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari menu..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cabe-500 focus:outline-none focus:ring-1 focus:ring-cabe-500"
          />
        </div>
      </div>

      <div className="sticky top-[120px] z-20 bg-gray-50 px-4 py-3">
        <div className="mx-auto max-w-lg flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
              !selectedCategory
                ? "bg-cabe-600 text-white"
                : "bg-white text-gray-700 shadow-sm"
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium capitalize ${
                selectedCategory === cat
                  ? "bg-cabe-600 text-white"
                  : "bg-white text-gray-700 shadow-sm"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-lg px-4 py-4">
        {filteredMenus.length === 0 ? (
          <div className="py-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Menu tidak ditemukan</h3>
            <p className="mt-1 text-sm text-gray-500">Coba kata kunci lain</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredMenus.map((menu) => (
              <MenuItemCard
                key={menu.id}
                menu={menu}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </main>

      {getItemCount() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t p-4">
          <div className="mx-auto max-w-lg">
            <Button
              onClick={() => setIsCartOpen(true)}
              className="w-full"
            >
              Lihat Keranjang ({getItemCount()}) • {formatPrice(useCartStore.getState().getTotal())}
            </Button>
          </div>
        </div>
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />

      <OrderConfirmationModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </div>
  );
}
