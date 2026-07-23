import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@shared/infrastructure/http/apiClient";
import { useCartStore } from "@features/menu-public/ui/stores/useCartStore";
import { formatPrice } from "@features/menu/domain/entities/MenuItem";
import { Button } from "@shared/ui/atoms/Button";
import { useOfflineSync } from "@features/offline/ui/components/useOfflineSync";

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OrderConfirmationModal({ isOpen, onClose }: OrderConfirmationModalProps) {
  const { items, getTotal, restaurantId, tableNumber, clearCart } = useCartStore();
  const { saveOfflineOrder } = useOfflineSync();
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const orderMutation = useMutation({
    mutationFn: (orderData: typeof orderPayload) =>
      apiClient.post("/orders", orderData),
    onSuccess: () => {
      setIsSuccess(true);
      clearCart();
    },
  });

  if (!isOpen) return null;

  const orderPayload = {
    restaurant_id: restaurantId,
    table_number: tableNumber,
    items: items.map((item) => ({
      menu_id: item.menu.id,
      name: item.menu.name,
      quantity: item.quantity,
      price: item.menu.price,
      variant: item.variant,
      notes: item.notes,
    })),
    customer_name: customerName || undefined,
    notes: notes || undefined,
    total: getTotal(),
  };

  const handleSubmit = () => {
    if (!navigator.onLine) {
      saveOfflineOrder({
        tenantId: restaurantId ?? "unknown",
        tableId: String(tableNumber ?? ""),
        items: items.map((item) => ({
          menu_item_id: item.menu.id,
          name: item.menu.name,
          quantity: item.quantity,
          unit_price: item.menu.price,
          total_price: item.menu.price * item.quantity,
          variant: item.variant,
          notes: item.notes,
        })),
        totalAmount: getTotal(),
        customerName,
        notes,
      }).then(() => {
        setIsSuccess(true);
        setIsOffline(true);
        clearCart();
      });
      return;
    }

    orderMutation.mutate(orderPayload);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setCustomerName("");
    setNotes("");
    onClose();
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-4 text-h2 font-bold text-gray-900">Pesanan Berhasil!</h2>
          <p className="mt-2 text-body text-gray-600">
            {isOffline
              ? "Pesanan disimpan di perangkat dan akan dikirim saat koneksi tersambung kembali."
              : `Pesanan Anda telah dikirim ke dapur. Silakan tunggu di meja ${tableNumber}.`}
          </p>
          <Button onClick={handleClose} className="mt-6 w-full">
            Kembali ke Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
      <div className="w-full max-w-md rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-h2 font-bold text-gray-900">Konfirmasi Pesanan</h2>
          <button onClick={handleClose} className="rounded-full p-1 hover:bg-gray-100">
            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Order Items */}
        <div className="max-h-60 overflow-y-auto px-4 py-3">
          <p className="mb-2 text-body text-gray-500">Meja {tableNumber}</p>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={`${item.menu.id}-${item.variant ?? ""}`} className="flex justify-between">
                <div>
                  <span className="font-medium text-gray-900">{item.quantity}x {item.menu.name}</span>
                  {item.variant && <span className="ml-1 text-body text-gray-500">({item.variant})</span>}
                  {item.notes && <p className="text-caption text-gray-400">{item.notes}</p>}
                </div>
                <span className="font-medium text-gray-900">{formatPrice(item.menu.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t pt-3">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-cabe-600">{formatPrice(getTotal())}</span>
          </div>
        </div>

        {/* Form */}
        <div className="border-t px-4 py-3 space-y-3">
          <div>
            <label htmlFor="customerName" className="block text-body font-medium text-gray-700">Nama (opsional)</label>
            <input
              id="customerName"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nama Anda"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-body focus:border-cabe-500 focus:outline-none focus:ring-1 focus:ring-cabe-500"
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-body font-medium text-gray-700">Catatan (opsional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Tanpa pedas, ekstra sambal..."
              rows={2}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-body focus:border-cabe-500 focus:outline-none focus:ring-1 focus:ring-cabe-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="border-t px-4 py-4">
          <Button
            onClick={handleSubmit}
            disabled={orderMutation.isPending || items.length === 0}
            className="w-full"
          >
            {orderMutation.isPending ? "Mengirim Pesanan..." : `Pesan Sekarang • ${formatPrice(getTotal())}`}
          </Button>
          {orderMutation.isError && (
            <p className="mt-2 text-center text-body text-red-600">
              Gagal mengirim pesanan. Silakan coba lagi.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
