import { describe, it, expect, vi } from "vitest";

describe("offlineDB", () => {
  it("should export all expected methods", async () => {
    const mockStore = {
      put: vi.fn(),
      get: vi.fn(),
      getAll: vi.fn(),
      delete: vi.fn(),
      add: vi.fn(),
      clear: vi.fn(),
      index: vi.fn(() => ({ getAll: vi.fn() })),
      createIndex: vi.fn(),
    };
    const mockDB = {
      transaction: vi.fn(() => ({ objectStore: vi.fn(() => mockStore) })),
      objectStoreNames: { contains: vi.fn(() => true) },
      createObjectStore: vi.fn(() => mockStore),
    };
    const openRequest = {
      result: mockDB,
      onsuccess: null as ((e: unknown) => void) | null,
      onerror: null,
      onupgradeneeded: null,
    };

    Object.defineProperty(globalThis, "indexedDB", {
      value: {
        open: vi.fn(() => {
          setTimeout(() => openRequest.onsuccess?.({}), 0);
          return openRequest;
        }),
      },
      writable: true,
      configurable: true,
    });

    const { offlineDB } = await import(
      "@features/offline/infrastructure/adapters/offlineDB"
    );

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

  it("should have exactly 12 public methods", async () => {
    const mockStore = {
      put: vi.fn(),
      get: vi.fn(),
      getAll: vi.fn(),
      delete: vi.fn(),
      add: vi.fn(),
      clear: vi.fn(),
      index: vi.fn(() => ({ getAll: vi.fn() })),
      createIndex: vi.fn(),
    };
    const mockDB = {
      transaction: vi.fn(() => ({ objectStore: vi.fn(() => mockStore) })),
      objectStoreNames: { contains: vi.fn(() => true) },
      createObjectStore: vi.fn(() => mockStore),
    };
    const openRequest = {
      result: mockDB,
      onsuccess: null as ((e: unknown) => void) | null,
      onerror: null,
      onupgradeneeded: null,
    };
    Object.defineProperty(globalThis, "indexedDB", {
      value: {
        open: vi.fn(() => {
          setTimeout(() => openRequest.onsuccess?.({}), 0);
          return openRequest;
        }),
      },
      writable: true,
      configurable: true,
    });

    const { offlineDB } = await import(
      "@features/offline/infrastructure/adapters/offlineDB"
    );
    expect(Object.keys(offlineDB)).toHaveLength(12);
  });
});
