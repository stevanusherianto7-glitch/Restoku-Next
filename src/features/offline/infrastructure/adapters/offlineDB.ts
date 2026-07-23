const DB_NAME = "restoku-offline-db";
const DB_VERSION = 2;

const STORES = {
  PENDING_ORDERS: "pending-orders",
  CACHED_MENU: "cached-menu",
  SYNC_QUEUE: "sync-queue",
} as const;

interface PendingOrderItem {
  menu_item_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  variant?: string;
  notes?: string;
}

interface PendingOrder {
  id: string;
  local_id: string;
  server_id: string | null;
  tenant_id: string;
  table_id: string;
  items: PendingOrderItem[];
  total_amount: number;
  customer_name?: string;
  notes?: string;
  idempotency_key: string;
  synced: boolean | number;
  created_at: string;
  updated_at: string;
}

interface SyncQueueItem {
  id: string;
  action: "create_order" | "update_order" | "void_order";
  payload: unknown;
  idempotency_key: string;
  createdAt: string;
  retries: number;
  maxRetries: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORES.PENDING_ORDERS)) {
        const store = db.createObjectStore(STORES.PENDING_ORDERS, {
          keyPath: "local_id",
        });
        store.createIndex("synced", "synced", { unique: false });
        store.createIndex("idempotency_key", "idempotency_key", {
          unique: true,
        });
        store.createIndex("tenant_id", "tenant_id", { unique: false });
        store.createIndex("created_at", "created_at", { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.CACHED_MENU)) {
        db.createObjectStore(STORES.CACHED_MENU, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
        const store = db.createObjectStore(STORES.SYNC_QUEUE, {
          keyPath: "id",
        });
        store.createIndex("createdAt", "createdAt", { unique: false });
        store.createIndex("action", "action", { unique: false });
      }
    };
  });
}

export const offlineDB = {
  // === Pending Orders ===
  async savePendingOrder(order: PendingOrder): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.PENDING_ORDERS, "readwrite");
      const store = tx.objectStore(STORES.PENDING_ORDERS);
      const request = store.put(order);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async getPendingOrders(): Promise<PendingOrder[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.PENDING_ORDERS, "readonly");
      const store = tx.objectStore(STORES.PENDING_ORDERS);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async getUnsyncedOrders(): Promise<PendingOrder[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.PENDING_ORDERS, "readonly");
      const store = tx.objectStore(STORES.PENDING_ORDERS);
      const index = store.index("synced");
      const request = index.getAll(IDBKeyRange.only(0));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async markOrderSynced(localId: string, serverId: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.PENDING_ORDERS, "readwrite");
      const store = tx.objectStore(STORES.PENDING_ORDERS);
      const getReq = store.get(localId);
      getReq.onsuccess = () => {
        const order = getReq.result;
        if (order) {
          order.synced = 1;
          order.server_id = serverId;
          store.put(order);
        }
        resolve();
      };
      getReq.onerror = () => reject(getReq.error);
    });
  },

  async deletePendingOrder(localId: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.PENDING_ORDERS, "readwrite");
      const store = tx.objectStore(STORES.PENDING_ORDERS);
      const request = store.delete(localId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  // === Cached Menu ===
  async cacheMenu(menu: unknown): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.CACHED_MENU, "readwrite");
      const store = tx.objectStore(STORES.CACHED_MENU);
      const request = store.put(menu);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async getCachedMenu(id: string): Promise<unknown> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.CACHED_MENU, "readonly");
      const store = tx.objectStore(STORES.CACHED_MENU);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  // === Sync Queue ===
  async addToSyncQueue(
    item: Omit<SyncQueueItem, "id" | "createdAt" | "retries" | "maxRetries">
  ): Promise<void> {
    const db = await openDB();
    const queueItem: SyncQueueItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      retries: 0,
      maxRetries: 5,
    };
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SYNC_QUEUE, "readwrite");
      const store = tx.objectStore(STORES.SYNC_QUEUE);
      const request = store.add(queueItem);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SYNC_QUEUE, "readonly");
      const store = tx.objectStore(STORES.SYNC_QUEUE);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async updateSyncQueueItem(item: SyncQueueItem): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SYNC_QUEUE, "readwrite");
      const store = tx.objectStore(STORES.SYNC_QUEUE);
      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async deleteFromSyncQueue(id: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SYNC_QUEUE, "readwrite");
      const store = tx.objectStore(STORES.SYNC_QUEUE);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async clearSyncQueue(): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SYNC_QUEUE, "readwrite");
      const store = tx.objectStore(STORES.SYNC_QUEUE);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
};

export type { PendingOrder, PendingOrderItem, SyncQueueItem };
