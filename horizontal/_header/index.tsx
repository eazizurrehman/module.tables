"use client";

import type { Table } from "@tanstack/react-table";
import { FileArchive, FolderArchive } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppButton } from "@/app/_components/button";
import { TableBulkArchive } from "@/app/_components/tables/horizontal/_bulk/_archive";
import { TableBulkDelete } from "@/app/_components/tables/horizontal/_bulk/_delete";
import { TableBulkUnarchive } from "@/app/_components/tables/horizontal/_bulk/_unarchive";
import { TableExport } from "@/app/_components/tables/horizontal/_export";
import { TableImport } from "@/app/_components/tables/horizontal/_import";
import type {
  TAppHorizontalTableProps,
  TFormSchema,
} from "@/app/_components/tables/horizontal/_types";
import { Input } from "@/app/_shadcn/input";
import { Skeleton } from "@/app/_shadcn/skeleton";
import { cn } from "@/lib/utils";

export function AppTableHeaderSkeleton() {
  return (
    <div className="flex h-12 w-full items-center justify-between gap-2 border-b border-dashed py-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 bg-secondary" />
        <Skeleton className="h-8 w-72 bg-secondary" />
        <Skeleton className="h-8 w-8 bg-secondary" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 bg-secondary" />
        <Skeleton className="h-8 w-8 bg-secondary" />
        <Skeleton className="h-8 w-8 bg-secondary" />
      </div>
    </div>
  );
}

export function AppTableHeader<TData extends { id: string }, TValue>({
  title,
  table,
  archived = false,
  actions,
  importTemplate,
  formSchema,
}: {
  table: Table<TData>;
  formSchema?: TFormSchema<TData>;
} & Pick<
  TAppHorizontalTableProps<TData, TValue>,
  "title" | "archived" | "actions" | "importTemplate"
>) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex h-12 w-full shrink-0 items-center justify-between gap-5 border-x border-b border-dashed px-2",
      )}
    >
      <div className="flex grow items-center justify-start gap-2">
        {archived ? (
          <AppButton asChild size="icon-sm" variant="outline">
            <Link href={pathname.replace("/archived", "")}>
              <FolderArchive className="text-muted-foreground" />
            </Link>
          </AppButton>
        ) : (
          <AppButton asChild size="icon-sm" variant="outline">
            <Link href={`${pathname}/archived`}>
              <FileArchive className="text-muted-foreground" />
            </Link>
          </AppButton>
        )}
        <Input
          className="w-72"
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          placeholder="Search ..."
        />
        {actions && (
          <>
            {!archived && actions.archive && actions.unarchive && (
              <TableBulkArchive
                action={actions.archive}
                table={table}
                undo={actions.unarchive}
              />
            )}
            {archived && actions.unarchive && actions.archive && (
              <TableBulkUnarchive
                action={actions.unarchive}
                table={table}
                undo={actions.archive}
              />
            )}
            {archived && actions.delete && (
              <TableBulkDelete action={actions.delete} table={table} />
            )}
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        {!archived && actions?.import && formSchema && (
          <TableImport
            action={actions?.import}
            formSchema={formSchema}
            importTemplate={importTemplate}
            title={title}
          />
        )}
        <TableExport table={table} title={title} />
        {/* <TableColumns table={table} /> */}
        {/* <TableOptions action={actions?.purgeCache} /> */}
      </div>
    </div>
  );
}
