import { useState, useMemo, useCallback } from "react";

interface UseClientInfiniteScrollOptions {
  initialBatchSize?: number;
  batchSize?: number;
  simulatedDelayMs?: number;
}

export function useClientInfiniteScroll<T>(
  items: T[],
  options: UseClientInfiniteScrollOptions = {},
) {
  const {
    initialBatchSize = 8,
    batchSize = 8,
    simulatedDelayMs = 150,
  } = options;

  const [visibleCount, setVisibleCount] = useState<number>(initialBatchSize);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [prevItems, setPrevItems] = useState<T[]>(items);

  // Reinicio cuando cambia el array de entrada (filtros, búsquedas)
  if (items !== prevItems) {
    setPrevItems(items);
    setVisibleCount(initialBatchSize);
    setIsLoadingMore(false);
  }

  const totalItems = items.length;
  const safeCount = Math.min(visibleCount, totalItems);
  const hasMore = safeCount < totalItems;

  const visibleItems = useMemo(() => {
    return items.slice(0, safeCount);
  }, [items, safeCount]);

  const loadMore = useCallback(() => {
    if (isLoadingMore) return;
    if (visibleCount >= items.length) return;

    if (simulatedDelayMs > 0) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setVisibleCount((prev) => Math.min(prev + batchSize, items.length));
        setIsLoadingMore(false);
      }, simulatedDelayMs);
    } else {
      setVisibleCount((prev) => Math.min(prev + batchSize, items.length));
    }
  }, [isLoadingMore, visibleCount, items.length, batchSize, simulatedDelayMs]);

  const reset = useCallback(() => {
    setVisibleCount(initialBatchSize);
    setIsLoadingMore(false);
  }, [initialBatchSize]);

  return {
    visibleItems,
    visibleCount: safeCount,
    totalItems,
    hasMore,
    isLoadingMore,
    loadMore,
    reset,
  };
}
