"use client";

import { useDirection } from "@radix-ui/react-direction";
import type { Table } from "@tanstack/react-table";
import type { ComponentProps } from "react";
import { TableSortingContent } from "@/app/_components/tables/horizontal/_sorting/_content";
import type { PopoverContent } from "@/app/_shadcn/popover";
import { Sortable, SortableOverlay } from "@/app/_shadcn/sortable";

interface TableSortingProps<TData>
  extends ComponentProps<typeof PopoverContent> {
  table: Table<TData>;
  disabled?: boolean;
}

export function TableSorting<TData>({ table }: TableSortingProps<TData>) {
  const dir = useDirection();

  const sorting = table.getState().sorting;
  const onSortingChange = table.setSorting;

  return (
    <Sortable
      getItemValue={(item) => item.id}
      onValueChange={onSortingChange}
      value={sorting}
    >
      <TableSortingContent table={table} />
      <SortableOverlay>
        <div className="flex items-center gap-2" dir={dir}>
          <div className="h-8 flex-1 rounded-sm bg-primary/10" />
          <div className="h-8 w-24 rounded-sm bg-primary/10" />
          <div className="size-8 shrink-0 rounded-sm bg-primary/10" />
          <div className="size-8 shrink-0 rounded-sm bg-primary/10" />
        </div>
      </SortableOverlay>
    </Sortable>
  );
}
