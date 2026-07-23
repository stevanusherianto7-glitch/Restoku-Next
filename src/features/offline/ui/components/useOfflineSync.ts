import { useEffect, useCallback, useRef, useState } from "react";
import {
  offlineDB,
  type PendingOrder,
} from "@features/offline/infrastructure/adapters/offlineDB";
import { apiClient } from "@shared/infrastructure/http/apiClient";

interface SyncStatus {
  isOnline: boolean;
  pendingCount: number;
  isSyncing: boolean;
  lastSyncAt: string | null;
  failedCount: number;
}

interface SyncResult {
  success: boolean;
  syncedCount: number;
  failedCount: number;
  errors: string[];
}

const INITIAL_BACKOFF_MS = 1000;
const MAX_BACKOFF_MS = 30000;
const SYNC_INTERVAL_MS = 30000;

export function useOfflineSync() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    pendingCount: 0,
    isSyncing: false,
    lastSyncAt: null,
    failedCount: 0,
  });

  const isSyncingRef = useRef(false);

  const updateSyncStatus = useCallback((updates: Partial<SyncStatus>) => {
    setSyncStatus((prev) => ({ ...prev, ...updates }));
  }, []);

  const syncPendingOrders = useCallback(async (): Promise<SyncResult> => {
    if (isSyncingRef.current || !navigator.onLine) {
      return { success: false, syncedCount: 0, failedCount: 0, errors: ["Offline or already syncing"] };
    }

    isSyncingRef.current = true;
    updateSyncStatus({ isSyncing: true });

    const result: SyncResult = { success: true, syncedCount: 0, failedCount: 0, errors: [] };

    try {
      const unsyncedOrders = await offlineDB.getUnsyncedOrders();

      for (const order of unsyncedOrders) {
        try {
          const response = await apiClient.post(
            "/orders",
            {
              table_id: order.table_id,
              items: order.items,
              customer_name: order.customer_name,
              notes: order.notes,
              total_amount: order.total_amount,
              source: "pos",
            },
            {
              headers: {
                "X-Idempotency-Key": order.idempotency_key,
              },
            }
          );

          const serverId = response.data?.data?.id ?? order.id;
          await offlineDB.markOrderSynced(order.local_id, serverId);
          await offlineDB.deletePendingOrder(order.local_id);
          result.syncedCount++;
        } catch (error) {
          result.failedCount++;
          const errMsg = error instanceof Error ? error.message : "Unknown error";
          result.errors.push(`Order ${order.local_id}: ${errMsg}`);

          // Check if duplicate (409)
          if (
            error instanceof Error &&
            "response" in error &&
            (error as { response?: { status?: number } }).response?.status === 409
          ) {
            await offlineDB.markOrderSynced(order.local_id, "duplicate");
            await offlineDB.deletePendingOrder(order.local_id);
          }
        }
      }

      // Process sync queue items
      const queueItems = await offlineDB.getSyncQueue();
      for (const item of queueItems) {
        if (item.retries >= item.maxRetries) {
          await offlineDB.deleteFromSyncQueue(item.id);
          result.errors.push(`Queue item ${item.id}: max retries exceeded`);
          continue;
        }

        try {
          if (item.action === "create_order") {
            await apiClient.post("/orders", item.payload, {
              headers: { "X-Idempotency-Key": item.idempotency_key },
            });
          } else if (item.action === "void_order") {
            await apiClient.post("/orders/void", item.payload);
          }

          await offlineDB.deleteFromSyncQueue(item.id);
          result.syncedCount++;
        } catch {
          item.retries++;
          const backoff = Math.min(
            INITIAL_BACKOFF_MS * Math.pow(2, item.retries),
            MAX_BACKOFF_MS
          );
          item.createdAt = new Date(Date.now() + backoff).toISOString();
          await offlineDB.updateSyncQueueItem(item);
          result.failedCount++;
        }
      }

      updateSyncStatus({
        lastSyncAt: new Date().toISOString(),
        pendingCount: unsyncedOrders.length - result.syncedCount,
        failedCount: result.failedCount,
      });
    } catch (error) {
      result.success = false;
      result.errors.push(
        error instanceof Error ? error.message : "Sync failed"
      );
    } finally {
      isSyncingRef.current = false;
      updateSyncStatus({ isSyncing: false });
    }

    return result;
  }, [updateSyncStatus]);

  const saveOfflineOrder = useCallback(
    async (order: {
      tenantId: string;
      tableId: string;
      items: Array<{
        menu_item_id: string;
        name: string;
        quantity: number;
        unit_price: number;
        total_price: number;
        variant?: string;
        notes?: string;
      }>;
      totalAmount: number;
      customerName?: string;
      notes?: string;
    }): Promise<string> => {
      const localId = crypto.randomUUID();
      const idempotencyKey = crypto.randomUUID();

      const pendingOrder: PendingOrder = {
        id: localId,
        local_id: localId,
        server_id: null,
        tenant_id: order.tenantId,
        table_id: order.tableId,
        items: order.items,
        total_amount: order.totalAmount,
        customer_name: order.customerName,
        notes: order.notes,
        idempotency_key: idempotencyKey,
        synced: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await offlineDB.savePendingOrder(pendingOrder);

      await offlineDB.addToSyncQueue({
        action: "create_order",
        payload: pendingOrder,
        idempotency_key: idempotencyKey,
      });

      updateSyncStatus({
        pendingCount: syncStatus.pendingCount + 1,
      });

      if (navigator.onLine) {
        setTimeout(() => syncPendingOrders(), 100);
      }

      return localId;
    },
    [syncPendingOrders, syncStatus.pendingCount, updateSyncStatus]
  );

  useEffect(() => {
    const handleOnline = () => {
      updateSyncStatus({ isOnline: true });
      syncPendingOrders();
    };

    const handleOffline = () => {
      updateSyncStatus({ isOnline: false });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (navigator.onLine) {
      setTimeout(() => syncPendingOrders(), 0);
    }

    const intervalId = setInterval(() => {
      if (navigator.onLine && !isSyncingRef.current) {
        syncPendingOrders();
      }
    }, SYNC_INTERVAL_MS);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(intervalId);
    };
  }, [syncPendingOrders, updateSyncStatus]);

  return {
    syncStatus,
    saveOfflineOrder,
    syncPendingOrders,
  };
}
