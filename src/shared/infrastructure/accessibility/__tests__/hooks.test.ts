import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useFocusTrap, useKeyboardNavigation } from "../hooks";

describe("Accessibility Hooks", () => {
  describe("useFocusTrap", () => {
    it("should return a ref", () => {
      const { result } = renderHook(() => useFocusTrap(true));
      expect(result.current).toBeDefined();
    });

    it("should return ref with current property", () => {
      const { result } = renderHook(() => useFocusTrap(false));
      expect(result.current).toHaveProperty("current");
    });
  });

  describe("useKeyboardNavigation", () => {
    it("should return getIndex function", () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation(["item1", "item2"], () => {})
      );
      expect(typeof result.current.getIndex).toBe("function");
    });

    it("should return initial index 0", () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation(["item1", "item2"], () => {})
      );
      expect(result.current.getIndex()).toBe(0);
    });
  });
});
