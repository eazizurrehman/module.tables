import type { SortingState, Updater } from "@tanstack/react-table";
import { parseAsJson, useQueryState } from "nuqs";

export function useTableSorting() {
  const [sortingState, setSortingState] = useQueryState<SortingState>(
    "sort",
    parseAsJson<SortingState>(() => []).withDefault([]),
  );

  const getSorting = () => sortingState || [];

  const setSorting = (updater: Updater<SortingState>) => {
    setSortingState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;

      return next;
    });
  };

  return {
    setSorting,
    getSorting,
  };
}
