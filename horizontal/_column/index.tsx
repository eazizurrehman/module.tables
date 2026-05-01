import type { Table } from "@tanstack/react-table";
import { Settings2, X } from "lucide-react";
import { useState } from "react";
import { AppButton } from "@/app/_components/button";
import { useColumnTable } from "@/app/_components/tables/horizontal/_column/_hook";
import { TableSavedPresets } from "@/app/_components/tables/horizontal/_column/_saved-presets";
import { TableColumnsSelection } from "@/app/_components/tables/horizontal/_column/_selection";
import { Badge } from "@/app/_shadcn/badge";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/app/_shadcn/popover";

export function TableColumns<TData>({ table }: { table: Table<TData> }) {
  const [open, setOpen] = useState(false);

  const { getColumnVisibilityLength } = useColumnTable();

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <AppButton className="relative" size="icon-sm" variant="outline">
          <Settings2
            className={
              getColumnVisibilityLength() > 0
                ? "text-primary"
                : "text-muted-foreground"
            }
          />
          {getColumnVisibilityLength() > 0 && (
            <Badge
              className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-xs p-1.5 font-bold font-mono text-[10px] text-xs"
              variant="secondary"
            >
              {getColumnVisibilityLength()}
            </Badge>
          )}
        </AppButton>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="max-h-[80dvh] w-110 max-w-(--radix-popover-content-available-width) space-y-2 overflow-y-auto"
      >
        <PopoverHeader className="flex flex-row items-center justify-between gap-2">
          <PopoverTitle className="font-semibold">
            Columns Settings{" "}
            {getColumnVisibilityLength() > 0 &&
              `(${getColumnVisibilityLength()})`}
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
        <TableColumnsSelection table={table} />
        <TableSavedPresets />
      </PopoverContent>
    </Popover>
  );
}
