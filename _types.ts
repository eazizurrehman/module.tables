import type { TAppHorizontalTableProps } from "@/app/_components/tables/horizontal/_types";
import type { TAppVerticalTableProps } from "@/app/_components/tables/vertical/_types";

export type TAppTableProps<TData extends { id: string }, TValue> =
  | (TAppHorizontalTableProps<TData, TValue> & {
      type?: "horizontal";
    })
  | (TAppVerticalTableProps<TData, TValue> & {
      type: "vertical";
    });
