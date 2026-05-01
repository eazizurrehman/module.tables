import { useDirection } from "@radix-ui/react-direction";
import type { ColumnSort, Table } from "@tanstack/react-table";
import { ArrowDownUp, Plus, X } from "lucide-react";
import type { Popover as PopoverPrimitive } from "radix-ui";
import { useId, useState } from "react";
import { AppButton } from "@/app/_components/button";
import { TableSortingItem } from "@/app/_components/tables/horizontal/_sorting/_item";
import { Badge } from "@/app/_shadcn/badge";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/app/_shadcn/popover";
import { SortableContent } from "@/app/_shadcn/sortable";

export function TableSortingContent<TData>({
  table,
  disabled,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content> & {
  disabled?: boolean;
  table: Table<TData>;
}) {
  const dir = useDirection();
  const id = useId();
  const labelId = useId();
  const descriptionId = useId();
  const [open, setOpen] = useState(false);

  const sorting = table.getState().sorting;
  const onSortingChange = table.setSorting;

  const { columnLabels, columns } = (() => {
    const labels = new Map<string, string>();
    const sortingIds = new Set(sorting.map((s) => s.id));
    const availableColumns: { id: string; label: string }[] = [];

    for (const column of table.getAllColumns()) {
      if (!column.getCanSort()) continue;

      const label =
        typeof column.columnDef.header === "string"
          ? column.columnDef.header
          : column.id;

      labels.set(column.id, label);

      if (!sortingIds.has(column.id)) {
        availableColumns.push({ id: column.id, label });
      }
    }

    return {
      columnLabels: labels,
      columns: availableColumns,
    };
  })();

  const onSortAdd = () => {
    const firstColumn = columns[0];
    if (!firstColumn) return;

    onSortingChange((prevSorting) => [
      ...prevSorting,
      { id: firstColumn.id, desc: false },
    ]);
  };

  const onSortUpdate = (sortId: string, updates: Partial<ColumnSort>) => {
    onSortingChange((prevSorting) => {
      if (!prevSorting) return prevSorting;
      return prevSorting.map((sort) =>
        sort.id === sortId ? { ...sort, ...updates } : sort,
      );
    });
  };
  const onSortRemove = (sortId: string) => {
    onSortingChange((prevSorting) =>
      prevSorting.filter((item) => item.id !== sortId),
    );
  };

  const onSortingReset = () => onSortingChange(table.initialState.sorting);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <AppButton
          className="relative font-normal"
          dir={dir}
          disabled={disabled}
          size="icon-sm"
          variant="outline"
        >
          <ArrowDownUp
            className={
              sorting.length > 0 ? "text-primary" : "text-muted-foreground"
            }
          />
          {sorting.length > 0 && (
            <Badge
              className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-xs p-1.5 font-bold font-mono text-[10px] text-xs"
              variant="secondary"
            >
              {sorting.length}
            </Badge>
          )}
        </AppButton>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        aria-describedby={descriptionId}
        aria-labelledby={labelId}
        className="max-h-[80dvh] w-110 max-w-(--radix-popover-content-available-width) space-y-2 overflow-y-auto"
        {...props}
      >
        <PopoverHeader className="flex flex-row items-center justify-between gap-2">
          <PopoverTitle className="font-semibold" id={labelId}>
            Sort By {sorting.length > 0 && `(${sorting.length})`}
          </PopoverTitle>
          <AppButton
            className="size-8 shrink-0"
            onClick={() => setOpen(false)}
            size="icon-sm"
            variant="ghost"
          >
            <X />
          </AppButton>
        </PopoverHeader>

        {sorting.length > 0 && (
          <SortableContent asChild>
            <ul className="flex flex-col gap-2 overflow-y-auto">
              {sorting.map((sort) => (
                <TableSortingItem
                  columnLabels={columnLabels}
                  columns={columns}
                  dir={dir}
                  key={sort.id}
                  onSortRemove={onSortRemove}
                  onSortUpdate={onSortUpdate}
                  sort={sort}
                  sortItemId={`${id}-sort-${sort.id}`}
                />
              ))}
            </ul>
          </SortableContent>
        )}
        <div className="flex w-full items-center gap-2">
          <AppButton
            className="rounded-sm"
            disabled={columns.length === 0}
            onClick={onSortAdd}
            size="sm"
          >
            <Plus /> Add
          </AppButton>
          {sorting.length > 0 && (
            <AppButton
              className="rounded-sm"
              onClick={onSortingReset}
              size="sm"
              variant="secondary"
            >
              <X />
              Reset
            </AppButton>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
