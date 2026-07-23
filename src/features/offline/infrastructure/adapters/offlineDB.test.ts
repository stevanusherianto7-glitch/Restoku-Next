import { describe, it, expect, vi, beforeEach } from "vitest";

function createMockIDBRequest(result: unknown = undefined) {
  return {
    result,
    error: null,
    onsuccess: null as ((e: unknown) => void) | null,
    onerror: null as ((e: unknown) => void) | null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };
}

function createMockStore() {
  const data: Record<string, unknown> = {};

  return {
    put: vi.fn((value: { id: string; local_id?: string }) => {
      const key = value.local_id || value.id;
      data[key] = value;
      const req = createMockIDBRequest();
      setTimeout(() => req.onsuccess?.({}), 0);
      return req;
    }),
    get: vi.fn((id: string) => {
      const req = createMockIDBRequest(data[id]);
      setTimeout(() => req.onsuccess?.({}), 0);
      return req;
    }),
    getAll: vi.fn(() => {
      const req = createMockIDBRequest(Object.values(data));
      setTimeout(() => req.onsuccess?.({}), 0);
      return req;
    }),
    delete: vi.fn((id: string) => {
      delete data[id];
      const req = createMockIDBRequest();
      setTimeout(() => req.onsuccess?.({}), 0);
      return req;
    }),
    add: vi.fn((value: { id: string }) => {
      data[value.id] = value;
      const req = createMockIDBRequest();
      setTimeout(() => req.onsuccess?.({}), 0);
      return req;
    }),
    clear: vi.fn(() => {
      Object.keys(data).forEach((k) => delete data[k]);
      const req = createMockIDBRequest();
      setTimeout(() => req.onsuccess?.({}), 0);
      return req;
    }),
    index: vi.fn(() => ({
      getAll: vi.fn((range?: IDBKeyRange) => {
        void range;
        const items = Object.values(data).filter((item: unknown) => {
          const typedItem = item as { synced?: number };
          return typedItem.synced === 0;
        });
        const req = createMockIDBRequest(items);
        setTimeout(() => req.onsuccess?.({}), 0);
        return req;
      }),
    })),
    createIndex: vi.fn(),
    _data: data,
  };
}

function setupIndexedDBMock() {
  const stores: Record<string, ReturnType<typeof createMockStore>> = {
    "pending-orders": createMockStore(),
    "cached-menu": createMockStore(),
    "sync-queue": createMockStore(),
  };

  const mockDb = {
    transaction: vi.fn((storeName: string) => ({
      objectStore: vi.fn(() => stores[storeName]!),
    })),
    objectStoreNames: {
      contains: vi.fn().mockReturnValue(true),
    },
    createObjectStore: vi.fn((name: string) => {
      stores[name] = createMockStore();
      return stores[name];
    }),
    close: vi.fn(),
  };

  const mockOpen = createMockIDBRequest(mockDb);

  const indexedDBMock = {
    open: vi.fn(() => {
      setTimeout(() => {
        mockOpen.onsuccess?.({});
      }, 0);
      return { ...mockOpen, onupgradeneeded: null };
    }),
  };

  Object.defineProperty(globalThis, "indexedDB", {
    value: indexedDBMock,
    writable: true,
    configurable: true,
  });

  return { stores, mockDb };
}

describe("offlineDB", () => {
  let offlineDB: typeof import("@features/offline/infrastructure/adapters/offlineDB").offlineDB;

  beforeEach(async () => {
    setupIndexedDBMock();
    const module = await import("@features/offline/infrastructure/adapters/offlineDB");
    offlineDB = module.offlineDB;
  });

  it("should export all expected methods", () => {
    expect(typeof offlineDB.savePendingOrder).toBe("function");
    expect(typeof offlineDB.getPendingOrders).toBe("function");
    expect(typeof offlineDB.getUnsyncedOrders).toBe("function");
    expect(typeof offlineDB.markOrderSynced).toBe("function");
    expect(typeof offlineDB.deletePendingOrder).toBe("function");
    expect(typeof offlineDB.cacheMenu).toBe("function");
    expect(typeof offlineDB.getCachedMenu).toBe("function");
    expect(typeof offlineDB.addToSyncQueue).toBe("function");
    expect(typeof offlineDB.getSyncQueue).toBe("function");
    expect(typeof offlineDB.updateSyncQueueItem).toBe("function");
    expect(typeof offlineDB.deleteFromSyncQueue).toBe("function");
    expect(typeof offlineDB.clearSyncQueue).toBe("function");
  });

  it("should have exactly 12 public methods", () => {
    const methods = Object.keys(offlineDB);
    expect(methods).toHaveLength(12);
  });

  it("savePendingOrder should return a promise", () => {
    const result = offlineDB.savePendingOrder({
      id: "test-order",
      local_id: "test-order",
      server_id: null,
      tenant_id: "t1",
      table_id: "tb1",
      items: [],
      total_amount: 0,
      idempotency_key: "idem-1",
      synced: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    expect(result).toBeInstanceOf(Promise);
  });

  it("getPendingOrders should return a promise", () => {
    const result = offlineDB.getPendingOrders();
    expect(result).toBeInstanceOf(Promise);
  });

  it("getUnsyncedOrders should return a promise", () => {
    const result = offlineDB.getUnsyncedOrders();
    expect(result).toBeInstanceOf(Promise);
  });

  it("addToSyncQueue should return a promise", () => {
    const result = offlineDB.addToSyncQueue({
      action: "create_order",
      payload: { test: true },
      idempotency_key: "idem-key-1",
    });
    expect(result).toBeInstanceOf(Promise);
  });

  it("clearSyncQueue should return a promise", () => {
    const result = offlineDB.clearSyncQueue();
    expect(result).toBeInstanceOf(Promise);
  });

  it("deletePendingOrder should return a promise", () => {
    const result = offlineDB.deletePendingOrder("test-id");
    expect(result).toBeInstanceOf(Promise);
  });

  it("markOrderSynced should return a promise", () => {
    const result = offlineDB.markOrderSynced("test-id", "server-1");
    expect(result).toBeInstanceOf(Promise);
  });

  it("cacheMenu should return a promise", () => {
    const result = offlineDB.cacheMenu({ id: "menu-1", name: "Test" });
    expect(result).toBeInstanceOf(Promise);
  });

  it("getCachedMenu should return a promise", () => {
    const result = offlineDB.getCachedMenu("menu-1");
    expect(result).toBeInstanceOf(Promise);
  });

  it("getSyncQueue should return a promise", () => {
    const result = offlineDB.getSyncQueue();
    expect(result).toBeInstanceOf(Promise);
  });

  it("deleteFromSyncQueue should return a promise", () => {
    const result = offlineDB.deleteFromSyncQueue("queue-1");
    expect(result).toBeInstanceOf(Promise);
  });

  it("updateSyncQueueItem should return a promise", () => {
    const result = offlineDB.updateSyncQueueItem({
      id: "q1",
      action: "create_order",
      payload: {},
      idempotency_key: "ik1",
      createdAt: new Date().toISOString(),
      retries: 0,
      maxRetries: 5,
    });
    expect(result).toBeInstanceOf(Promise);
  });
});
