import type { Table } from "@tanstack/react-table";
import { Info, Trash2, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { ConfirmDeletion } from "@/app/_components/confirm-deletion";
import { AppSwapButton } from "@/app/_components/swap-button";
import type { TBulkAction } from "@/app/_modules/tables/horizontal/_types";
import { getSelectedRowIds } from "@/app/_modules/tables/horizontal/_utils";

export function TableBulkDelete<TData>({
  table,
  action,
}: {
  table: Table<TData>;
  action: TBulkAction<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ConfirmDeletion
      className="sm:max-w-lg"
      confirmationText="delete permanently"
      description={
        <div className="space-y-4 text-sm">
          <p className="text-primary">
            This will delete all the related data permanently.
          </p>
          <p className="my-4 flex items-center gap-2 rounded-sm bg-orange-500/30 p-2">
            <TriangleAlert className="shrink-0" size={16} />
            Unexpected bad thing will happen if you don't read this.
          </p>
          <p className="my-4 flex items-center gap-2 rounded-sm bg-destructive/30 p-2">
            <Info className="shrink-0" size={16} />
            This action is risky and not reversible. Please be certain.
          </p>
        </div>
      }
      onConfirm={async () => {
        setIsLoading(true);

        await action({ ids: getSelectedRowIds(table) }).finally(() =>
          setIsLoading(false),
        );
      }}
      title={
        <>
          <Trash2 />
          Delete Permanently
        </>
      }
      trigger={
        <AppSwapButton isLoading={isLoading} size="icon-sm" variant="outline">
          <Trash2 />
        </AppSwapButton>
      }
    />
  );
}
