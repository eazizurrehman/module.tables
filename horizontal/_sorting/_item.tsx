import type { ColumnSort, SortDirection } from "@tanstack/react-table";
import { ChevronsUpDown, GripVertical, Trash2 } from "lucide-react";
import { type KeyboardEvent, useState } from "react";
import { AppButton } from "@/app/_components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/_shadcn/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/_shadcn/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_shadcn/select";
import { SortableItem, SortableItemHandle } from "@/app/_shadcn/sortable";

export function TableSortingItem({
  sort,
  sortItemId,
  dir,
  columns,
  columnLabels,
  onSortUpdate,
  onSortRemove,
}: {
  sort: ColumnSort;
  sortItemId: string;
  dir: "ltr" | "rtl";
  columns: { id: string; label: string }[];
  columnLabels: Map<string, string>;
  onSortUpdate: (sortId: string, updates: Partial<ColumnSort>) => void;
  onSortRemove: (sortId: string) => void;
}) {
  const fieldListboxId = `${sortItemId}-field-listbox`;
  const fieldTriggerId = `${sortItemId}-field-trigger`;

  const [showFieldSelector, setShowFieldSelector] = useState(false);
  const [showDirectionSelector, setShowDirectionSelector] = useState(false);

  const onItemKeyDown = (event: KeyboardEvent<HTMLLIElement>) => {
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    if (showFieldSelector || showDirectionSelector) {
      return;
    }
  };

  return (
    <SortableItem asChild value={sort.id}>
      <li
        className="flex items-center gap-2"
        id={sortItemId}
        onKeyDown={onItemKeyDown}
        tabIndex={-1}
      >
        <Popover onOpenChange={setShowFieldSelector} open={showFieldSelector}>
          <PopoverTrigger asChild>
            <AppButton
              aria-controls={fieldListboxId}
              className="flex-1 justify-between rounded-sm font-normal"
              id={fieldTriggerId}
              size="sm"
              variant="outline"
            >
              <span className="truncate">{columnLabels.get(sort.id)}</span>
              <ChevronsUpDown className="opacity-50" />
            </AppButton>
          </PopoverTrigger>
          <PopoverContent
            className="w-(--radix-popover-trigger-width) rounded-sm p-0"
            dir={dir}
            id={fieldListboxId}
          >
            <Command>
              <CommandInput placeholder="Search fields..." />
              <CommandList>
                <CommandEmpty>No fields found</CommandEmpty>
                <CommandGroup>
                  {columns.map((column) => (
                    <CommandItem
                      key={column.id}
                      onSelect={(value) => onSortUpdate(sort.id, { id: value })}
                      value={column.id}
                    >
                      <span className="truncate">{column.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Select
          onOpenChange={setShowDirectionSelector}
          onValueChange={(value: SortDirection) =>
            onSortUpdate(sort.id, { desc: value === "desc" })
          }
          open={showDirectionSelector}
          value={sort.desc ? "desc" : "asc"}
        >
          <SelectTrigger className="w-24 rounded-sm" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectGroup>
              {["Asc", "Desc"].map((record) => (
                <SelectItem key={record} value={String(record.toLowerCase())}>
                  {record}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <AppButton
          aria-controls={sortItemId}
          className="size-8 shrink-0 rounded"
          onClick={() => onSortRemove(sort.id)}
          size="icon"
          variant="outline"
        >
          <Trash2 />
        </AppButton>
        <SortableItemHandle asChild>
          <AppButton
            className="size-8 shrink-0 rounded"
            size="icon"
            variant="outline"
          >
            <GripVertical />
          </AppButton>
        </SortableItemHandle>
      </li>
    </SortableItem>
  );
}
