import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFocusTrap, useAriaLivePolite, useKeyboardNavigation } from "@shared/infrastructure/accessibility/hooks";

describe("Accessibility Hooks", () => {
  describe("useFocusTrap", () => {
    it("should return a ref object", () => {
      const { result } = renderHook(() => useFocusTrap(false));
      expect(result.current).toBeDefined();
      expect(result.current.current).toBeNull();
    });

    it("should add keydown listener when active", () => {
      const addSpy = vi.spyOn(document, "addEventListener");
      renderHook(() => useFocusTrap(true));

      expect(addSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
      addSpy.mockRestore();
    });

    it("should remove keydown listener on cleanup", () => {
      const removeSpy = vi.spyOn(document, "removeEventListener");
      const { unmount } = renderHook(() => useFocusTrap(true));
      unmount();

      expect(removeSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
      removeSpy.mockRestore();
    });

    it("should not add listener when inactive", () => {
      const addSpy = vi.spyOn(document, "addEventListener");
      renderHook(() => useFocusTrap(false));

      const keydownCalls = addSpy.mock.calls.filter(
        (call) => call[0] === "keydown"
      );
      expect(keydownCalls).toHaveLength(0);
      addSpy.mockRestore();
    });
  });

  describe("useAriaLivePolite", () => {
    it("should return an announce function", () => {
      const { result } = renderHook(() => useAriaLivePolite());
      expect(typeof result.current.announce).toBe("function");
    });

    it("should set textContent of aria-live element", () => {
      const div = document.createElement("div");
      div.id = "aria-live-polite";
      document.body.appendChild(div);

      const { result } = renderHook(() => useAriaLivePolite());
      act(() => {
        result.current.announce("Item added to cart");
      });

      expect(div.textContent).toBe("Item added to cart");
      document.body.removeChild(div);
    });

    it("should handle missing aria-live element gracefully", () => {
      const { result } = renderHook(() => useAriaLivePolite());

      expect(() => {
        act(() => {
          result.current.announce("test");
        });
      }).not.toThrow();
    });
  });

  describe("useKeyboardNavigation", () => {
    it("should return getIndex function", () => {
      const onSelect = vi.fn();
      const { result } = renderHook(() =>
        useKeyboardNavigation(["a", "b", "c"], onSelect)
      );
      expect(typeof result.current.getIndex).toBe("function");
      expect(result.current.getIndex()).toBe(0);
    });

    it("should handle ArrowDown key", () => {
      const onSelect = vi.fn();
      renderHook(() => useKeyboardNavigation(["a", "b", "c"], onSelect));

      act(() => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      });

      expect(onSelect).toHaveBeenCalledWith(1);
    });

    it("should handle ArrowUp key", () => {
      const onSelect = vi.fn();
      renderHook(() => useKeyboardNavigation(["a", "b", "c"], onSelect));

      act(() => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
      });

      expect(onSelect).toHaveBeenCalledWith(2);
    });

    it("should handle Home key", () => {
      const onSelect = vi.fn();
      renderHook(() => useKeyboardNavigation(["a", "b", "c"], onSelect));

      act(() => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Home" }));
      });

      expect(onSelect).toHaveBeenCalledWith(0);
    });

    it("should handle End key", () => {
      const onSelect = vi.fn();
      renderHook(() => useKeyboardNavigation(["a", "b", "c"], onSelect));

      act(() => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "End" }));
      });

      expect(onSelect).toHaveBeenCalledWith(2);
    });

    it("should loop by default", () => {
      const onSelect = vi.fn();
      renderHook(() => useKeyboardNavigation(["a", "b"], onSelect));

      act(() => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      });
      act(() => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      });

      expect(onSelect).toHaveBeenLastCalledWith(0);
    });

    it("should not loop when loop is false", () => {
      const onSelect = vi.fn();
      renderHook(() => useKeyboardNavigation(["a", "b"], onSelect, { loop: false }));

      act(() => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
      });

      expect(onSelect).toHaveBeenCalledWith(0);
    });

    it("should not call onSelect for empty items", () => {
      const onSelect = vi.fn();
      renderHook(() => useKeyboardNavigation([], onSelect));

      act(() => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      });

      expect(onSelect).not.toHaveBeenCalled();
    });

    it("should remove listener on unmount", () => {
      const removeSpy = vi.spyOn(document, "removeEventListener");
      const onSelect = vi.fn();
      const { unmount } = renderHook(() =>
        useKeyboardNavigation(["a", "b"], onSelect)
      );

      unmount();
      expect(removeSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
      removeSpy.mockRestore();
    });
  });
});
