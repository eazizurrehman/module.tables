import type { PaginationState, Updater } from "@tanstack/react-table";
import { parseAsIndex, parseAsInteger, useQueryStates } from "nuqs";

export const PAGE_SIZES = [10, 20, 50, 100, 200] as const;

export function usePaginationTable() {
  const [paginationState, setPaginationState] = useQueryStates(
    {
      pageIndex: parseAsIndex.withDefault(0),
      pageSize: parseAsInteger.withDefault(10),
    },
    {
      urlKeys: {
        pageIndex: "page",
        pageSize: "perPage",
      },
    },
  );

  const getPagination = () => paginationState || { pageIndex: 0, pageSize: 10 };

  const setPagination = (updater: Updater<PaginationState>) => {
    setPaginationState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;

      return next;
    });
  };

  return {
    getPagination,
    setPagination,
  };
}
