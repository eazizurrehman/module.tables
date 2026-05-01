import type { ColumnDef, Table } from "@tanstack/react-table";

export function getSelectedRowIds<TData>(table: Table<TData>) {
  const { rows } = table.getFilteredSelectedRowModel();

  return rows.map((row) => row.id);
}

export function createColumns<T>(
  baseColumns: ColumnDef<T>[],
  insertions: Array<Partial<ColumnDef<T>> & { order?: number }>,
): ColumnDef<T>[] {
  const cols = [...baseColumns];

  for (const insertion of insertions) {
    const { order, ...rest } = insertion;

    if (typeof order === "number" && order > 0 && order <= cols.length + 1)
      cols.splice(order - 1, 0, rest as ColumnDef<T>);
    else cols.push(rest as ColumnDef<T>);
  }

  return cols;
}
