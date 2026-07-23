import { useState, useEffect } from "react";
import { offlineDB } from "@features/offline/infrastructure/adapters/offlineDB";

export function OnlineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check pending orders periodically
    const checkPending = async () => {
      const orders = await offlineDB.getUnsyncedOrders();
      setPendingCount(orders.length);
    };

    checkPending();
    const interval = setInterval(checkPending, 5000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (isOnline && pendingCount === 0) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg px-4 py-2 shadow-lg ${
        isOnline ? "bg-yellow-500 text-white" : "bg-red-500 text-white"
      }`}
    >
      <div
        className={`h-2 w-2 rounded-full ${
          isOnline ? "bg-yellow-200" : "bg-red-200"
        }`}
      />
      <span className="text-sm font-medium">
        {isOnline
          ? pendingCount > 0
            ? `Syncing ${pendingCount} order...`
            : "Online"
          : "Offline Mode"}
      </span>
      {!isOnline && pendingCount > 0 && (
        <span className="ml-2 rounded-full bg-red-600 px-2 py-0.5 text-xs">
          {pendingCount}
        </span>
      )}
    </div>
  );
}
