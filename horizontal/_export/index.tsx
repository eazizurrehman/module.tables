import type { Table } from "@tanstack/react-table";
import { Download, X } from "lucide-react";
import { useState } from "react";
import { AppButton } from "@/app/_components/button";
import TableExportForm from "@/app/_modules/tables/horizontal/_export/_form";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/app/_shadcn/popover";

export function TableExport<TData>({
  table,
  title,
}: {
  table: Table<TData>;
  title: string | React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <AppButton className="relative" size="icon-sm" variant="outline">
          <Download className="size-4 text-muted-foreground" />
        </AppButton>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="max-h-[80dvh] w-xs max-w-(--radix-popover-content-available-width) space-y-2 overflow-y-auto"
      >
        <PopoverHeader className="flex flex-row items-center justify-between gap-2">
          <PopoverTitle className="font-semibold">Export Data</PopoverTitle>
          <AppButton
            className="size-8 shrink-0"
            onClick={() => setOpen(false)}
            size="icon-sm"
            variant="ghost"
          >
            <X />
          </AppButton>
        </PopoverHeader>
        <TableExportForm setOpen={setOpen} table={table} title={title} />
      </PopoverContent>
    </Popover>
  );
}
