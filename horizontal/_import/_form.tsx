"use client";

import { useForm } from "@tanstack/react-form-nextjs";
import ExcelJS from "exceljs";
import { Check, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import z from "zod";
import { AppButton } from "@/app/_components/button";
import { AppFieldError } from "@/app/_components/form/field-error";
import { AppFieldGroup } from "@/app/_components/form/field-group";
import { AppFileUpload } from "@/app/_components/form/file-upload";
import { AppSubmitButton } from "@/app/_components/form/submit-button";
import { importFormSchema } from "@/app/_modules/tables/horizontal/_import/_schema";
import type {
  TFormSchema,
  TImportTemplate,
} from "@/app/_modules/tables/horizontal/_types";
import { Card, CardContent, CardFooter } from "@/app/_shadcn/card";
import { Field } from "@/app/_shadcn/field";
import {
  IMPORT_TEMPLATE_MAX_ROWS,
  IMPORT_TEMPLATE_ROWS_START,
} from "@/constants";
import {
  clientAsyncHandler,
  type TActionFailure,
  type TActionSuccess,
} from "@/lib/async-handlers";

const getHeadersMappingByName = (headersSheet: XLSX.WorkSheet | undefined) => {
  if (!headersSheet) return {};

  return (
    XLSX.utils.sheet_to_json(headersSheet, {
      header: 1,
    }) as unknown[][]
  )
    .slice(1)
    .reduce<
      Record<
        string,
        { id: string; type?: "number" | "boolean" | "date" | "time" }
      >
    >((acc, row) => {
      if (!Array.isArray(row)) return acc;

      const [id, label, type] = row as [
        string,
        string,
        "number" | "date" | "time" | undefined,
      ];

      if (label) acc[label] = { id, type };

      return acc;
    }, {});
};

async function getImportedRows<TData extends Record<string, unknown>>({
  file,
}: {
  file: File;
}): Promise<TData[]> {
  const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const allRows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
  });
  const headerRowIndex = IMPORT_TEMPLATE_ROWS_START - 2;
  const dataRowIndex = IMPORT_TEMPLATE_ROWS_START - 1;

  const dataRows: unknown[][] = Array.isArray(allRows)
    ? allRows.slice(dataRowIndex)
    : [];

  const headers: string[] = Array.isArray(allRows[headerRowIndex])
    ? (allRows[headerRowIndex] as string[]).slice(1)
    : [];

  const headersSheet = workbook.Sheets.headers;
  const headersMapping = getHeadersMappingByName(headersSheet);

  const getOptionsSheetName = (label: string) => {
    const safeSheetBase = label
      .toLowerCase()
      .replace(/[^a-z0-9_ ]/g, "")
      .trim()
      .replace(/\s+/g, "_");
    return `${safeSheetBase || "options"}_options`.slice(0, 31);
  };

  const optionsMappings = headers.reduce<
    Record<string, Record<string, string>>
  >((acc, headerLabel) => {
    const sheetName = getOptionsSheetName(headerLabel);
    const optionsSheet = workbook.Sheets[sheetName];
    if (!optionsSheet) return acc;

    const rows = XLSX.utils.sheet_to_json(optionsSheet, { header: 1 }) as
      | unknown[][]
      | undefined;
    if (!rows || rows.length <= 1) return acc;

    const mapping = rows
      .slice(1)
      .reduce<Record<string, string>>((mapAcc, row) => {
        if (!Array.isArray(row)) return mapAcc;
        const [value, label] = row as [string, string];
        if (label) mapAcc[label] = value;
        return mapAcc;
      }, {});

    acc[headerLabel] = mapping;
    return acc;
  }, {});

  const rows: Record<string, unknown>[] = dataRows
    .filter(
      (row: unknown[]) =>
        Array.isArray(row) &&
        row.length > 0 &&
        row.some(
          (cell) =>
            cell !== undefined &&
            cell !== "undefined" &&
            cell !== null &&
            cell !== "null" &&
            (typeof cell === "string" ? cell.trim() !== "" : cell !== ""),
        ),
    )
    .map((row: unknown[]) => {
      const obj: Record<string, unknown> = {};

      const mapOptionValue = (
        raw: unknown,
        optionsMap?: Record<string, string>,
      ) => {
        if (typeof raw !== "string" || !optionsMap) return raw;

        if (optionsMap[raw]) return optionsMap[raw];

        const normalizedLower = raw.toLowerCase();
        const matchedLabel = Object.keys(optionsMap).find(
          (label) => label.toLowerCase() === normalizedLower,
        );
        if (matchedLabel) return optionsMap[matchedLabel];

        return raw;
      };

      const toDate = (value: number) => {
        const parsed = XLSX.SSF.parse_date_code(value);
        return parsed ? new Date(parsed.y, parsed.m - 1, parsed.d) : value;
      };

      const toTimeString = (value: number) => {
        const totalMinutes = Math.round(value * 24 * 60);
        const safeMinutes = ((totalMinutes % 1440) + 1440) % 1440;
        const hours = Math.floor(safeMinutes / 60)
          .toString()
          .padStart(2, "0");
        const minutes = Math.floor(safeMinutes % 60)
          .toString()
          .padStart(2, "0");
        return `${hours}:${minutes}`;
      };

      headers.forEach((header: string, idx: number) => {
        if (!header) return;
        const rawValue = row[idx + 1];
        const mappedHeaderInfo = headersMapping[header];
        const mappedHeader = mappedHeaderInfo?.id ?? header;
        const optionsMap = optionsMappings[header];

        let mappedValue = mapOptionValue(rawValue, optionsMap);

        switch (mappedHeaderInfo?.type) {
          case "number":
            mappedValue =
              typeof mappedValue === "number"
                ? mappedValue
                : Number(mappedValue);
            break;
          case "boolean":
            if (mappedValue === "true") mappedValue = true;
            else if (mappedValue === "false") mappedValue = false;
            break;
          case "date":
            mappedValue = toDate(mappedValue as number);
            break;
          case "time":
            mappedValue = toTimeString(mappedValue as number);
            break;
          default:
            mappedValue = String(mappedValue);
        }

        if (
          mappedValue !== undefined &&
          mappedValue !== null &&
          mappedValue !== "" &&
          mappedValue !== "undefined" &&
          mappedValue !== "null"
        ) {
          obj[mappedHeader] = mappedValue;
        }
      });

      return obj;
    });

  return rows as TData[];
}

export async function validateTemplate(file: File): Promise<boolean> {
  if (!file) return false;

  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);

  const sheetName = "__system_template_marker__";

  if (!workbook.SheetNames.includes(sheetName)) return false;

  const sheet = workbook.Sheets[sheetName];
  const cell = sheet?.A1;

  return cell?.v === "__system_template_marker__";
}

export default function TableImportForm<TData extends Record<string, unknown>>({
  title: titleProp,
  action,
  setOpen,
  importTemplate,
  formSchema,
}: {
  title: string | React.ReactNode;
  action: (args: {
    values: TData[];
  }) => Promise<TActionSuccess<unknown> | TActionFailure>;
  setOpen: (open: boolean) => void;
  importTemplate?: TImportTemplate;
  formSchema?: TFormSchema<TData>;
}) {
  const pathname = usePathname();
  const [errors, setErrors] = useState<string[]>([]);

  const defaultValues = {
    files: [] as File[],
  };

  const form = useForm({
    defaultValues,
    validators: {
      onChange: importFormSchema,
    },
    onSubmit: async ({ value }) => {
      const file = value.files?.[0];
      if (!file) {
        setErrors(["Please upload an .xlsx file"]);
        return;
      }

      if (!formSchema) {
        setErrors(["Validation schema is not defined"]);
        return;
      }

      const isValidTemplate = await validateTemplate(file);
      if (!isValidTemplate) {
        setErrors(["Only system generated template is supported."]);
        return;
      }

      try {
        const rows = await getImportedRows<TData>({ file });

        if (rows.length === 0) {
          setErrors(["No data rows found in the file"]);
          return;
        }

        if (rows.length > IMPORT_TEMPLATE_MAX_ROWS) {
          setErrors([
            `A maximum ${IMPORT_TEMPLATE_MAX_ROWS} records can be imported at once`,
          ]);
          return;
        }

        const { success, data, error } = z.array(formSchema).safeParse(rows);

        if (!success) {
          const formattedErrors = error.issues.map((issue) => {
            const [rowIndex] = issue.path as [number];

            const rowNumber = rowIndex + IMPORT_TEMPLATE_ROWS_START;

            return `Row ${rowNumber} - ${issue.message}`;
          });

          setErrors(formattedErrors);
          return;
        }

        // TODO: remove assertion
        return clientAsyncHandler(() => action({ values: data as TData[] }), {
          success: "Imported successfully!",
          failure: "Failed to import.",
          callback: () => setOpen(false),
        });
      } catch (error) {
        console.error("Failed to read .xlsx:", error);
        toast.error("Failed to read .xlsx file.");
      }
    },
  });

  type WorksheetWithValidations = ExcelJS.Worksheet & {
    dataValidations: {
      add: (range: string, validation: ExcelJS.DataValidation) => void;
    };
  };

  function getColumnLetter(index: number) {
    let column = "";
    let current = index;

    while (current > 0) {
      const mod = (current - 1) % 26;
      column = String.fromCharCode(65 + mod) + column;
      current = Math.floor((current - 1) / 26);
    }

    return column;
  }

  async function downloadXlsxTemplate() {
    try {
      const templateEntries = importTemplate ?? [];
      const headers = templateEntries.map((template) => template.label);

      if (headers.length === 0) {
        toast.error("No import template configured.");
        return;
      }

      const instructions = [
        ["INSTRUCTIONS:"],
        ["1. Use this template only. Do not use other .xlsx files."],
        ["2. Keep the file in .xlsx format (CSV not supported)."],
        [
          "3. Do NOT delete, rename, or add sheets — only the first sheet is processed.",
        ],
        [
          "4. This template includes hidden lists for dropdowns — do not remove them.",
        ],
        [
          "5. Do not use other .xlsx files. Only this template includes the required lists.",
        ],
        [`6. Start entering data from CELL B${IMPORT_TEMPLATE_ROWS_START}.`],
        ["7. Do NOT change header names or order."],
        ["8. Fill in data exactly under the column headers."],
        ["9. Each row represents one item to be imported."],
        ["10. Do NOT leave empty rows between records."],
        [
          "11. Use dropdowns where available. Do not type custom values for dropdowns.",
        ],
        ["12. Leave optional fields blank. Do not enter N/A."],
        ["13. Use valid Excel date/time pickers where applicable."],
        ["14. Do not add formulas; paste values only."],
        ["15. Do not merge cells."],
        ["16. A maximum of 100 records can be added."],
        [""],
      ];

      const rows: (string | number)[][] = [...instructions];
      const headerRowIndex = IMPORT_TEMPLATE_ROWS_START - 1;

      while (rows.length < headerRowIndex - 1) rows.push([""]);

      rows.push(["", ...headers]);

      const workbook = new ExcelJS.Workbook();

      const title =
        typeof titleProp === "string"
          ? titleProp.toLowerCase().replace(/\s+/g, "_").replace(/[()]/g, "")
          : pathname.replace(/\//g, "_").replace(/^_/, "");
      const sheetName = `${title}_import_sample`;
      const fileName = `${sheetName}.xlsx`;

      const worksheet = workbook.addWorksheet(sheetName);
      worksheet.addRows(rows);

      const markerWorksheet = workbook.addWorksheet(
        "__system_template_marker__",
      );
      markerWorksheet.state = "veryHidden";
      markerWorksheet.addRow(["__system_template_marker__"]);

      const headersWorksheet = workbook.addWorksheet("headers");
      headersWorksheet.state = "veryHidden";
      headersWorksheet.addRow(["id", "label", "type"]);
      headersWorksheet.addRows(
        templateEntries.map((template) => [
          template.id,
          template.label,
          template.type,
        ]),
      );

      const startRow = IMPORT_TEMPLATE_ROWS_START;
      const endRow = IMPORT_TEMPLATE_ROWS_START + IMPORT_TEMPLATE_MAX_ROWS - 1;

      templateEntries.forEach((template, index) => {
        if (!template.options || template.options.length === 0) return;

        const options = template.options
          .map((option: string | { value: string; label: string }) =>
            typeof option === "string"
              ? { value: option, label: option }
              : { value: option.value, label: option.label },
          )
          .filter((option) => option.label !== "");

        if (options.length === 0) return;

        const columnLetter = getColumnLetter(index + 2);
        const range = `${columnLetter}${startRow}:${columnLetter}${endRow}`;

        const safeSheetBase = template.label
          .toLowerCase()
          .replace(/[^a-z0-9_ ]/g, "")
          .trim()
          .replace(/\s+/g, "_");
        const optionsSheetName = `${safeSheetBase || "options"}_options`.slice(
          0,
          31,
        );
        const optionsWorksheet = workbook.addWorksheet(optionsSheetName);
        optionsWorksheet.state = "veryHidden";
        optionsWorksheet.addRow(["value", "label"]);
        optionsWorksheet.addRows(
          options.map((option) => [option.value, option.label]),
        );

        const optionsSheetRef = optionsSheetName.includes(" ")
          ? `'${optionsSheetName}'`
          : optionsSheetName;
        const optionsRange = `${optionsSheetRef}!$B$2:$B$${options.length + 1}`;

        (worksheet as WorksheetWithValidations).dataValidations.add(range, {
          type: "list",
          allowBlank: true,
          formulae: [optionsRange],
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);

      setOpen(false);
    } catch (error) {
      console.error("Import failed:", error);
      toast.error("Failed to import data.");
    }
  }

  return (
    <Card className="w-full border-none p-0 shadow-none">
      <CardContent className="space-y-2 p-0">
        <div className="mb-2 flex items-center justify-between gap-2 text-sm">
          <p>Download template</p>
          <AppButton onClick={downloadXlsxTemplate} variant="ghost">
            .xlsx
          </AppButton>
        </div>
        <form
          className="space-y-2"
          id="import-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <AppFieldGroup>
            <form.Field name="files">
              {(field) => <AppFileUpload accept=".xlsx" field={field} />}
            </form.Field>
          </AppFieldGroup>
          {errors.length > 0 && (
            <AppFieldError errors={errors.map((e) => ({ message: e }))} />
          )}
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-y-4 p-0">
        <Field orientation="horizontal">
          <AppSubmitButton form={form} formId="import-form">
            <Check /> Submit
          </AppSubmitButton>
          <AppButton
            onClick={(e) => {
              e.preventDefault();
              form.reset();
            }}
            size="sm"
            type="button"
            variant="secondary"
          >
            <X />
            Reset
          </AppButton>
        </Field>
      </CardFooter>
    </Card>
  );
}
