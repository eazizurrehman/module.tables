import * as z from "zod";

export enum SelectionOptions {
  CurrentPage = "currentPage",
  RangedPages = "rangedPages",
  AllPages = "allPages",
}
export type TSelectionOptions = SelectionOptions;

export enum FormatOptions {
  Xlsx = "xlsx",
  Xlsm = "xlsm",
  Xls = "xls",
  Xla = "xla",
  Csv = "csv",
}

export type TFormatOptions = FormatOptions;

export const exportFormSchema = z.object({
  selection: z.enum(
    [
      SelectionOptions.CurrentPage,
      SelectionOptions.RangedPages,
      SelectionOptions.AllPages,
    ],
    {
      error: "Value must be either Current Page, Ranged Pages or All Pages",
    },
  ),
  format: z.enum(
    [
      FormatOptions.Xlsx,
      FormatOptions.Xlsm,
      FormatOptions.Xls,
      FormatOptions.Xla,
      FormatOptions.Csv,
    ],
    {
      error: "Value must be either xlsx, xlsm, xls, xla or csv",
    },
  ),
  pagesRange: z.tuple([z.number(), z.number()]),
});

export type TExportFormSchema = z.infer<typeof exportFormSchema>;
