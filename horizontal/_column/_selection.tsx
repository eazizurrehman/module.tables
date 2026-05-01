import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { AppButton } from "@/app/_components/button";
import { useColumnTable } from "@/app/_modules/tables/horizontal/_column/_hook";
import PresetForm from "@/app/_modules/tables/horizontal/_column/_preset-form";
import { Checkbox } from "@/app/_shadcn/checkbox";
import { Label } from "@/app/_shadcn/label";

export function TableColumnsSelection<TData>({
  table,
}: {
  table: Table<TData>;
}) {
  const { setColumnVisibility, removeColumnVisibility } = useColumnTable();

  return (
    <>
      <ul>
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide(),
          )
          .map((column) => {
            const header =
              typeof column.columnDef.header === "string"
                ? column.columnDef.header
                : column.id;

            return (
              <div className="flex items-center" key={column.id}>
                <AppButton
                  className="size-8 shrink-0"
                  key={column.id}
                  size="icon"
                  variant="ghost"
                >
                  <Checkbox
                    checked={column.getIsVisible()}
                    className="capitalize"
                    id={column.id}
                    onCheckedChange={(value) =>
                      setColumnVisibility((prev) => ({
                        ...prev,
                        [column.id]: !!value,
                      }))
                    }
                  />
                </AppButton>
                <AppButton className="flex-1" variant="ghost">
                  <Label className="h-full w-full" htmlFor={column.id}>
                    {header}
                  </Label>
                </AppButton>
              </div>
            );
          })}
      </ul>
      <div className="flex items-center gap-2">
        <PresetForm />
        <AppButton onClick={removeColumnVisibility} variant="outline">
          <X />
          Reset
        </AppButton>
      </div>
    </>
  );
}
