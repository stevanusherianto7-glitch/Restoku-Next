import { useState, useCallback, useEffect } from "react";

export interface CrudItem {
  id: string;
  [key: string]: unknown;
}

export interface UseCrudViewModelOptions<T extends CrudItem> {
  initialItems: T[];
  delayMs?: number;
}

/**
 * Generic CRUD view-model for the 17 placeholder features.
 * Keeps list/create/update/delete + loading state in one place (DRY).
 * NO `any` — generic T must extend CrudItem.
 */
export function useCrudViewModel<T extends CrudItem>(opts: UseCrudViewModelOptions<T>) {
  const [items, setItems] = useState<T[]>(opts.initialItems);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), opts.delayMs ?? 300);
    return () => clearTimeout(t);
  }, [opts.delayMs]);

  const addItem = useCallback((item: T) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const updateItem = useCallback((id: string, patch: Partial<T>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return { items, isLoading, addItem, updateItem, removeItem };
}
