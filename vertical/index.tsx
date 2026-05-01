"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AppHeader } from "@/app/_components/header";
import type { TAppVerticalTableProps } from "@/app/_components/tables/vertical/_types";
import { Card, CardContent } from "@/app/_shadcn/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/app/_shadcn/table";
import CoreFooter from "@/app/(core)/_footer";
import { cn } from "@/lib/utils";

export default function AppVerticalTable<TData extends { id: string }, TValue>({
  title,
  buttons,
  columns = [],
  data,
  className,
  tableClassName,
  hasHeader = true,
  hasFooter = true,
}: TAppVerticalTableProps<TData, TValue>) {
  const table = useReactTable({
    columns,
    data: data ? [data] : [],
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      className={cn(
        "flex size-full flex-col border-x border-dashed",
        className,
      )}
    >
      {hasHeader && (
        <AppHeader
          className="h-12.25 border-b border-dashed"
          endSlot={buttons}
          title={title}
        />
      )}
      <div className="flex grow items-center justify-center">
        <Card className="w-full sm:max-w-md">
          <CardContent>
            <Table className={tableClassName}>
              <TableBody>
                {table.getHeaderGroups()[0].headers.map((header) => {
                  const cell = table
                    .getRowModel()
                    .rows[0].getVisibleCells()
                    .find((c) => c.column.id === header.column.id);

                  if (header.id === "select" || !cell) return null;

                  return (
                    <TableRow key={header.id}>
                      <TableHead>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                      <TableCell className="px-1 py-0">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      {hasFooter && <CoreFooter />}
    </div>
  );
}
