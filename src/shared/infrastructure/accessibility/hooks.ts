import { useEffect, useRef, useCallback } from "react";

export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isActive || !containerRef.current) return;

      if (event.key === "Tab") {
        const focusableElements = containerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            event.preventDefault();
          }
        }
      }

      if (event.key === "Escape") {
        event.preventDefault();
      }
    },
    [isActive]
  );

  useEffect(() => {
    if (isActive) {
      document.addEventListener("keydown", handleKeyDown);
      containerRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive, handleKeyDown]);

  return containerRef;
}

export function useAriaLivePolite() {
  const announce = useCallback((message: string) => {
    const element = document.getElementById("aria-live-polite");
    if (element) {
      element.textContent = message;
    }
  }, []);

  return { announce };
}

export function useKeyboardNavigation(
  items: unknown[],
  onSelect: (index: number) => void,
  options: { loop?: boolean } = {}
) {
  const { loop = true } = options;
  const currentIndexRef = useRef(0);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (items.length === 0) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          currentIndexRef.current = loop
            ? (currentIndexRef.current + 1) % items.length
            : Math.min(currentIndexRef.current + 1, items.length - 1);
          onSelect(currentIndexRef.current);
          break;
        case "ArrowUp":
          event.preventDefault();
          currentIndexRef.current = loop
            ? (currentIndexRef.current - 1 + items.length) % items.length
            : Math.max(currentIndexRef.current - 1, 0);
          onSelect(currentIndexRef.current);
          break;
        case "Home":
          event.preventDefault();
          currentIndexRef.current = 0;
          onSelect(0);
          break;
        case "End":
          event.preventDefault();
          currentIndexRef.current = items.length - 1;
          onSelect(items.length - 1);
          break;
      }
    },
    [items, onSelect, loop]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return { getIndex: () => currentIndexRef.current };
}
