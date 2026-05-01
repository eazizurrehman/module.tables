"use client";

import { useForm } from "@tanstack/react-form-nextjs";
import { flexRender, type Row, type Table } from "@tanstack/react-table";
import { Check } from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { utils as xlsxUtils, writeFile as xlsxWriteFile } from "xlsx";
import { AppCombobox } from "@/app/_components/form/combobox";
import { AppFieldGroup } from "@/app/_components/form/field-group";
import { AppSlider } from "@/app/_components/form/slider";
import { AppSubmitButton } from "@/app/_components/form/submit-button";
import {
  exportFormSchema,
  FormatOptions,
  SelectionOptions,
  type TFormatOptions,
} from "@/app/_modules/tables/horizontal/_export/_schema";
import { Card, CardContent, CardFooter } from "@/app/_shadcn/card";
import { Field } from "@/app/_shadcn/field";
import { toOrdinal } from "@/lib";

export default function TableExportForm<TData>({
  table,
  title: titleProp,
  setOpen,
}: {
  table: Table<TData>;
  title: string | React.ReactNode;
  setOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();

  const defaultValues = {
    selection: SelectionOptions.CurrentPage,
    format: FormatOptions.Xlsx,
    pagesRange: [1, table.getPageCount()] as [number, number],
  };

  const form = useForm({
    defaultValues,
    validators: {
      onChange: exportFormSchema,
    },
    onSubmit: ({ value }) => {
      handleExport(value);
    },
  });

  function getVisibleTableDataAndHeaders({
    selection,
    pagesRange,
  }: {
    selection: SelectionOptions;
    pagesRange: [number, number];
  }) {
    const visibleColumns = table
      .getAllColumns()
      .filter(
        (column) =>
          typeof column.accessorFn !== "undefined" && column.getCanHide(),
      );

    const headerGroup = table.getHeaderGroups()[0];
    const headers = headerGroup.headers
      .filter(
        (header) =>
          !header.isPlaceholder &&
          visibleColumns.some((col) => col.id === header.column.id),
      )
      .map((header) => {
        const headerVal = header.column.columnDef.header;
        return typeof headerVal === "string"
          ? headerVal
          : flexRender(headerVal, header.getContext());
      });

    let rawRows: Row<TData>[] = [];

    switch (selection) {
      case SelectionOptions.CurrentPage:
        rawRows = table.getRowModel().rows;
        break;
      case SelectionOptions.RangedPages: {
        const pageSize = table.getState().pagination.pageSize;
        const startIndex = (pagesRange[0] - 1) * pageSize;
        const endIndex = pagesRange[1] * pageSize;
        rawRows = table.getCoreRowModel().rows.slice(startIndex, endIndex);
        break;
      }
      case SelectionOptions.AllPages:
        rawRows = table.getCoreRowModel().rows;
        break;
    }

    const rows = rawRows.map((row) => {
      return row
        .getVisibleCells()
        .filter((cell) =>
          visibleColumns.some((col) => col.id === cell.column.id),
        )
        .map((cell) => cell.getValue());
    });

    return { headers, rows };
  }

  function handleExport({
    selection,
    format,
    pagesRange,
  }: {
    selection: SelectionOptions;
    format: TFormatOptions;
    pagesRange: [number, number];
  }) {
    try {
      if (!xlsxWriteFile || !xlsxUtils) return;

      const { headers, rows } = getVisibleTableDataAndHeaders({
        selection,
        pagesRange,
      });

      const aoa = [headers, ...rows];
      const worksheet = xlsxUtils.aoa_to_sheet(aoa);
      const workbook = xlsxUtils.book_new();

      let page: string = "";
      switch (selection) {
        case SelectionOptions.CurrentPage: {
          const pageIndex = table.getState().pagination.pageIndex + 1;
          page = `page_${pageIndex.toString().padStart(3, "0")}`;
          break;
        }
        case SelectionOptions.RangedPages: {
          const start = pagesRange[0].toString().padStart(3, "0");
          const end = pagesRange[1].toString().padStart(3, "0");
          if (start !== end) page = `page_${start}_to_${end}`;
          else page = `page_${start}`;
          break;
        }
        case SelectionOptions.AllPages: {
          page = `all_${table.getPageCount().toLocaleString()}_pages`;
          break;
        }
      }

      const title =
        typeof titleProp === "string"
          ? titleProp.toLowerCase().replace(/\s+/g, "_").replace(/[()]/g, "")
          : pathname.replace(/\//g, "_").replace(/^_/, "");
      const sheetName = `${title}_${page}`;
      const fileName = `${sheetName}.${format}`;

      xlsxUtils.book_append_sheet(workbook, worksheet, sheetName);

      xlsxWriteFile(workbook, fileName, { bookType: format });
      setOpen(false);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export data.");
    }
  }

  return (
    <Card className="w-full border-none p-0">
      <CardContent className="p-0">
        <form
          className="space-y-2"
          id="export-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <AppFieldGroup>
            <form.Subscribe selector={({ values }) => values.pagesRange}>
              {(pagesRange) => (
                <form.Field name="selection">
                  {(field) => (
                    <AppCombobox
                      field={field}
                      options={[
                        {
                          label: `${toOrdinal(table.getState().pagination.pageIndex + 1)} Page Only`,
                          value: SelectionOptions.CurrentPage,
                        },
                        {
                          label: `Ranged Pages (${pagesRange[0]} - ${pagesRange[1]})`,
                          value: SelectionOptions.RangedPages,
                        },
                        {
                          label: `All ${table.getPageCount().toLocaleString()} Pages`,
                          value: SelectionOptions.AllPages,
                        },
                      ]}
                    />
                  )}
                </form.Field>
              )}
            </form.Subscribe>
            <form.Field name="format">
              {(field) => (
                <AppCombobox
                  field={field}
                  options={Object.values(FormatOptions)}
                />
              )}
            </form.Field>
            <form.Subscribe selector={({ values }) => values.selection}>
              {(selection) =>
                selection === SelectionOptions.RangedPages && (
                  <form.Field name="pagesRange">
                    {(field) => (
                      <AppSlider
                        field={field}
                        max={table.getPageCount()}
                        min={1}
                      />
                    )}
                  </form.Field>
                )
              }
            </form.Subscribe>
          </AppFieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-y-4 p-0">
        <Field orientation="horizontal">
          <AppSubmitButton form={form} formId="export-form">
            <Check /> Submit
          </AppSubmitButton>
        </Field>
      </CardFooter>
    </Card>
  );
}
