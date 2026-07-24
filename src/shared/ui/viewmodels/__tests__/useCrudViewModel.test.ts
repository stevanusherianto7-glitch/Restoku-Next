import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCrudViewModel } from "../useCrudViewModel";

interface Row extends Record<string, unknown> {
  id: string;
  name: string;
}

const seed: Row[] = [
  { id: "a1", name: "Alpha" },
  { id: "a2", name: "Beta" },
];

describe("useCrudViewModel", () => {
  it("starts loading then clears after delay", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useCrudViewModel<Row>({ initialItems: seed, delayMs: 100 }));
    expect(result.current.isLoading).toBe(true);
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.isLoading).toBe(false);
    vi.useRealTimers();
  });

  it("adds an item", () => {
    const { result } = renderHook(() => useCrudViewModel<Row>({ initialItems: seed }));
    act(() => result.current.addItem({ id: "a3", name: "Gamma" }));
    expect(result.current.items).toHaveLength(3);
    expect(result.current.items[2]!.name).toBe("Gamma");
  });

  it("updates an item by id", () => {
    const { result } = renderHook(() => useCrudViewModel<Row>({ initialItems: seed }));
    act(() => result.current.updateItem("a1", { name: "Alpha2" }));
    expect(result.current.items[0]!.name).toBe("Alpha2");
  });

  it("removes an item by id", () => {
    const { result } = renderHook(() => useCrudViewModel<Row>({ initialItems: seed }));
    act(() => result.current.removeItem("a2"));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]!.id).toBe("a1");
  });
});
