import { useState, useMemo } from "react";

export function useClientPagination<T>(
  items: T[],
  initialPageSize: number = 20,
) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [prevItems, setPrevItems] = useState(items);

  if (items !== prevItems) {
    setPrevItems(items);
    setCurrentPage(1);
  }

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safePage, pageSize]);

  const startItem = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, totalItems);

  return {
    paginatedItems,
    currentPage: safePage,
    pageSize,
    totalItems,
    totalPages,
    startItem,
    endItem,
    setPage: setCurrentPage,
    setPageSize: (newSize: number) => {
      setPageSize(newSize);
      setCurrentPage(1);
    },
  };
}
