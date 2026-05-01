"use client";

import type { TAppTableProps } from "@/app/_components/tables/_types";
import AppHorizontalTable from "@/app/_components/tables/horizontal";
import type { TAppHorizontalTableProps } from "@/app/_components/tables/horizontal/_types";
import AppVerticalTable from "@/app/_components/tables/vertical";
import type { TAppVerticalTableProps } from "@/app/_components/tables/vertical/_types";

export default function AppTable<TData extends { id: string }, TValue>({
  type = "horizontal",
  ...props
}: TAppTableProps<TData, TValue>) {
  if (type === "vertical")
    return (
      <AppVerticalTable {...(props as TAppVerticalTableProps<TData, TValue>)} />
    );

  return (
    <AppHorizontalTable
      {...(props as TAppHorizontalTableProps<TData, TValue>)}
    />
  );
}
