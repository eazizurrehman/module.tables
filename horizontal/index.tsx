"use client";

import { useHotkey } from "@tanstack/react-hotkeys";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { AppHeader } from "@/app/_components/header";
import { AppTableHeader } from "@/app/_components/tables/horizontal/_header";
import { PAGE_SIZES } from "@/app/_components/tables/horizontal/_pagination/_hook";
import type { TAppHorizontalTableProps } from "@/app/_components/tables/horizontal/_types";
import { buttonVariants } from "@/app/_shadcn/button";
import { Input } from "@/app/_shadcn/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/app/_shadcn/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_shadcn/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_shadcn/table";
import { cn } from "@/lib/utils";

export default function AppHorizontalTable<
  TData extends { id: string },
  TValue,
>({
  title,
  columns = [],
  data = [],
  buttons,
  className,
  tableClassName,
  archived = false,
  actions,
  importTemplate,
  formSchema,
}: TAppHorizontalTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnVisibility, setColumnVisibility] = useState({});

  const table = useReactTable({
    columns,
    data: data || [],
    getRowId: (row) => row.id,
    state: {
      pagination: pagination,
      columnVisibility: columnVisibility,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
  });

  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;

  const onPageFirst = () => {
    if (!table.getCanPreviousPage()) return;
    table.toggleAllPageRowsSelected(false);
    table.setPageIndex(0);
  };
  const onPagePrev = () => {
    if (!table.getCanPreviousPage()) return;
    table.toggleAllPageRowsSelected(false);
    table.previousPage();
  };
  const onPageNext = () => {
    if (!table.getCanNextPage()) return;
    table.toggleAllPageRowsSelected(false);
    table.nextPage();
  };
  const onPageLast = () => {
    if (!table.getCanNextPage()) return;
    table.toggleAllPageRowsSelected(false);
    table.setPageIndex(pageCount - 1);
  };

  useHotkey("Mod+ArrowLeft", onPageFirst);
  useHotkey("ArrowLeft", onPagePrev);
  useHotkey("ArrowRight", onPageNext);
  useHotkey("Mod+ArrowRight", onPageLast);

  useHotkey("Mod+A", () => {
    table.toggleAllPageRowsSelected(!table.getIsAllPageRowsSelected());
  });

  return (
    <div
      className={cn(
        "relative flex h-dvh w-full flex-col rounded-none",
        className,
      )}
    >
      <AppHeader
        className="h-12.25 border-x border-b border-dashed"
        endSlot={buttons}
        title={title}
      />
      <AppTableHeader
        actions={actions}
        archived={archived}
        formSchema={formSchema}
        importTemplate={importTemplate}
        table={table}
        title={title}
      />
      <div
        className={cn(
          "relative flex grow flex-col overflow-auto border-x border-dashed px-2",
          tableClassName,
        )}
      >
        <Table>
          <TableHeader className="sticky top-0 left-0 z-20 bg-background">
            {table.getHeaderGroups().map((group) => (
              <TableRow className="border-b border-dashed" key={group.id}>
                {group.headers.map((header) => {
                  const sort = header.column.getIsSorted() as string;
                  return (
                    <TableHead
                      className="px-1 py-0 font-semibold"
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      {sort === "asc" ? (
                        <ChevronUp
                          className="ml-2 inline text-muted-foreground"
                          width={16}
                        />
                      ) : sort === "desc" ? (
                        <ChevronDown
                          className="ml-2 inline text-muted-foreground"
                          width={16}
                        />
                      ) : null}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length > 0 &&
              table.getRowModel().rows.map((row) => (
                <TableRow
                  data-state={row.getIsSelected() && "selected"}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="px-1 py-0" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {table.getRowModel().rows?.length > 0 && (
              <TableRow>
                <TableCell
                  className="h-1"
                  colSpan={table.getAllColumns().length}
                />
              </TableRow>
            )}
          </TableBody>
        </Table>
        {!table.getRowModel().rows?.length && (
          <div className="mb-2 flex h-full w-full items-center justify-center border-t">
            <p>No records found</p>
          </div>
        )}
      </div>
      <div
        className={cn(
          "bottom-0 flex h-12.25 w-full shrink-0 items-center justify-between gap-5 border-x border-t border-dashed px-2",
        )}
      >
        <div className="flex items-center gap-2">
          {table.getRowCount() > 0 ? (
            <span className="text-muted-foreground text-xs md:text-sm">
              {(() => {
                const total = table.getRowCount();
                const start = total === 0 ? 0 : pageIndex * pageSize + 1;
                const end = Math.min((pageIndex + 1) * pageSize, total);
                return `${start.toLocaleString()} - ${end.toLocaleString()} of ${total.toLocaleString()} records`;
              })()}
            </span>
          ) : (
            <span className="text-muted-foreground text-xs md:text-sm">
              No records found
            </span>
          )}
          <span
            className={cn(
              "text-muted-foreground text-xs md:text-sm",
              table.getFilteredSelectedRowModel().rows.length === 0 && "hidden",
            )}
          >
            ({table.getFilteredSelectedRowModel().rows.length.toLocaleString()}{" "}
            of {table.getFilteredRowModel().rows.length.toLocaleString()}{" "}
            selected)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex shrink-0 items-center gap-2">
            {table.getPageCount() > 0 ? (
              <span className="text-muted-foreground text-xs md:text-sm">
                {`Page ${pageIndex + 1} of ${table.getPageCount().toLocaleString()}`}
              </span>
            ) : (
              <span className="text-muted-foreground text-xs md:text-sm">
                No pages found
              </span>
            )}
            <Pagination className="w-fit">
              <PaginationContent className="flex gap-2">
                <PaginationItem>
                  <PaginationLink
                    aria-disabled={table.getCanPreviousPage()}
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                        size: "icon-sm",
                      }),
                      !table.getCanPreviousPage() &&
                        "pointer-events-none opacity-50",
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      onPageFirst();
                    }}
                    tabIndex={!table.getCanPreviousPage() ? -1 : 0}
                  >
                    <ChevronsLeft />
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    aria-disabled={!table.getCanPreviousPage()}
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                        size: "icon-sm",
                      }),
                      !table.getCanPreviousPage() &&
                        "pointer-events-none opacity-50",
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      onPagePrev();
                    }}
                    tabIndex={!table.getCanPreviousPage() ? -1 : 0}
                  >
                    <ChevronLeft />
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <Input
                    aria-label="Go to page"
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                        size: "sm",
                      }),
                      "w-17 text-center",
                    )}
                    disabled={table.getPageCount() === 0}
                    max={table.getPageCount()}
                    min="1"
                    onChange={(e) => {
                      const { value } = e.target;
                      const page = value ? Number(e.target.value) - 1 : 0;
                      table.setPageIndex(page);
                    }}
                    type="number"
                    value={pageIndex + 1}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    aria-disabled={!table.getCanNextPage()}
                    className={cn(
                      "[&>span]:sm:hidden",
                      buttonVariants({
                        variant: "outline",
                        size: "icon-sm",
                      }),
                      !table.getCanNextPage() &&
                        "pointer-events-none opacity-50",
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      onPageNext();
                    }}
                    tabIndex={!table.getCanNextPage() ? -1 : 0}
                  >
                    <ChevronRight />
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    aria-disabled={!table.getCanNextPage()}
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                        size: "icon-sm",
                      }),
                      !table.getCanNextPage() &&
                        "pointer-events-none opacity-50",
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      onPageLast();
                    }}
                    tabIndex={!table.getCanNextPage() ? -1 : 0}
                  >
                    <ChevronsRight />
                  </PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <Select
              disabled={table.getPageCount() === 0 || table.getRowCount() === 0}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
              value={String(pageSize)}
            >
              <SelectTrigger
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "sm",
                  }),
                  "flex w-21 justify-between",
                )}
              >
                <SelectValue placeholder="Rows per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {PAGE_SIZES.map((record: number) => (
                    <SelectItem key={record} value={String(record)}>
                      {record}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
