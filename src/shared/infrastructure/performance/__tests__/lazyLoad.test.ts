import { describe, it, expect } from "vitest";
import { lazyLoad, createPrefetchLoader } from "../lazyLoad";

describe("Performance Utilities", () => {
  describe("lazyLoad", () => {
    it("should return a component", () => {
      const LazyComponent = lazyLoad(() =>
        Promise.resolve({
          default: () => null,
        })
      );
      expect(LazyComponent).toBeDefined();
      expect(typeof LazyComponent).toBe("function");
    });
  });

  describe("createPrefetchLoader", () => {
    it("should return loader with load method", () => {
      const loader = createPrefetchLoader(() =>
        Promise.resolve({
          default: () => null,
        })
      );
      expect(typeof loader.load).toBe("function");
    });

    it("should return loader with event handlers", () => {
      const loader = createPrefetchLoader(() =>
        Promise.resolve({
          default: () => null,
        })
      );
      expect(typeof loader.onMouseEnter).toBe("function");
      expect(typeof loader.onFocus).toBe("function");
    });
  });
});
