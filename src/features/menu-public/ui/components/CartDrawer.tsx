import { useCartStore } from "@features/menu-public/ui/stores/useCartStore";
import { formatPrice } from "@features/menu/domain/entities/MenuItem";
import { Button } from "@shared/ui/atoms/Button";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getTotal, getItemCount, clearCart } =
    useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Keranjang ({getItemCount()})
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Keranjang kosong</h3>
              <p className="mt-1 text-sm text-gray-500">Tambahkan menu dari daftar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.menu.id}-${item.variant}`}
                  className="flex gap-4 rounded-lg border p-3"
                >
                  {/* Image */}
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {item.menu.image_url ? (
                      <img
                        src={item.menu.image_url}
                        alt={item.menu.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.menu.name}</h4>
                    {item.variant && (
                      <p className="text-sm text-gray-500">{item.variant}</p>
                    )}
                    <p className="text-sm font-semibold text-cabe-600">
                      {formatPrice(item.menu.price)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.menu.id, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.menu.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.menu.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-gray-600">Total</span>
              <span className="text-xl font-bold text-gray-900">{formatPrice(getTotal())}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={clearCart} className="flex-1">
                Kosongkan
              </Button>
              <Button onClick={onCheckout} className="flex-1">
                Pesan
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
