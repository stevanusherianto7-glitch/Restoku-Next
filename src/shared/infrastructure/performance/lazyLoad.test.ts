import { describe, it, expect, vi } from "vitest";
import { lazyLoad, createPrefetchLoader } from "@shared/infrastructure/performance/lazyLoad";

// Mock the Spinner component
vi.mock("@shared/ui/atoms/Spinner", () => ({
  Spinner: () => "LoadingSpinner",
}));

describe("Performance Utilities", () => {
  describe("lazyLoad", () => {
    it("should return a wrapped component function", () => {
      const factory = () =>
        Promise.resolve({ default: () => null });

      const result = lazyLoad(factory);

      expect(typeof result).toBe("function");
    });

    it("should accept custom fallback", () => {
      const factory = () =>
        Promise.resolve({ default: () => null });

      const result = lazyLoad(factory, { fallback: "Loading..." });

      expect(typeof result).toBe("function");
    });
  });

  describe("createPrefetchLoader", () => {
    it("should return load, onMouseEnter and onFocus handlers", () => {
      const factory = vi.fn().mockResolvedValue({ default: () => null });

      const loader = createPrefetchLoader(factory);

      expect(typeof loader.load).toBe("function");
      expect(typeof loader.onMouseEnter).toBe("function");
      expect(typeof loader.onFocus).toBe("function");
    });

    it("should call factory only once on multiple loads", async () => {
      const factory = vi.fn().mockResolvedValue({ default: () => null });
      const loader = createPrefetchLoader(factory);

      loader.load();
      loader.load();
      loader.load();

      expect(factory).toHaveBeenCalledTimes(1);
    });

    it("onMouseEnter and onFocus should trigger load", () => {
      const factory = vi.fn().mockResolvedValue({ default: () => null });
      const loader = createPrefetchLoader(factory);

      loader.onMouseEnter();

      expect(factory).toHaveBeenCalledTimes(1);
    });

    it("should not reload after factory resolves", async () => {
      const factory = vi.fn().mockResolvedValue({ default: () => null });
      const loader = createPrefetchLoader(factory);

      const promise = loader.load();
      await promise;

      loader.load();
      expect(factory).toHaveBeenCalledTimes(1);
    });
  });
});
