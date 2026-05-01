import type { ColumnDef } from "@tanstack/react-table";
import type { ZodType } from "zod/v4";
import type { TActionFailure, TActionSuccess } from "@/lib/async-handlers";

export type TBulkAction<TData> = ({
  ids,
}: {
  ids: string[];
}) => Promise<TActionSuccess<TData> | TActionFailure>;

export type TImportTemplate = {
  id: string;
  label: string;
  type?: "number" | "boolean" | "date" | "time";
  options?: (
    | string
    | {
        value: string;
        label: string;
      }
  )[];
}[];

export type TFormSchema<TData> = ZodType<
  Omit<TData, "id" | "archivedAt" | "createdAt" | "updatedAt">
>;

export type TAppHorizontalTableProps<TData extends { id: string }, TValue> = {
  title: string | React.ReactNode;
  buttons?: React.ReactNode;
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | null | undefined;
  className?: string;
  tableClassName?: string;
  archived?: boolean;
  actions?: {
    archive?: TBulkAction<void>;
    unarchive?: TBulkAction<void>;
    delete?: TBulkAction<void>;
    import?: (args: {
      values: TData[];
    }) => Promise<TActionSuccess<unknown> | TActionFailure>;
    purgeCache?: () => Promise<TActionSuccess<unknown> | TActionFailure>;
  };
  importTemplate?: TImportTemplate;
  formSchema?: TFormSchema<TData>;
};
