import type { ColumnDef } from "@tanstack/react-table";

export type TAppVerticalTableProps<TData extends { id: string }, TValue> = {
  title: string | React.ReactNode;
  buttons?: React.ReactNode;
  columns: ColumnDef<TData, TValue>[];
  data?: TData | null;
  className?: string;
  tableClassName?: string;
  hasHeader?: boolean;
  hasFooter?: boolean;
};
