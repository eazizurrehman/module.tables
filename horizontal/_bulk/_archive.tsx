import { useHotkey } from "@tanstack/react-hotkeys";
import type { Table } from "@tanstack/react-table";
import { Archive } from "lucide-react";
import { useRef, useState } from "react";
import { AppSwapButton } from "@/app/_components/swap-button";
import type { TBulkAction } from "@/app/_components/tables/horizontal/_types";
import { getSelectedRowIds } from "@/app/_components/tables/horizontal/_utils";
import { clientAsyncHandler } from "@/lib/async-handlers";

export function TableBulkArchive<TData>({
  table,
  action: actionProp,
  undo,
}: {
  table: Table<TData>;
  action: TBulkAction<void>;
  undo: TBulkAction<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const ids = useRef<string[]>([]);

  const doAction = () => {
    if (isLoading) return;

    ids.current = getSelectedRowIds(table);

    if (ids.current.length === 0) return;

    clientAsyncHandler(
      () => {
        setIsLoading(true);
        return actionProp({ ids: ids.current });
      },
      {
        success: "Items archived successfully",
        failure: "Failed to archive items",
        actionOnClick: undoAction,
        callback: () => setIsLoading(false),
      },
    );
  };

  const undoAction = () => {
    if (ids.current.length === 0) return;

    clientAsyncHandler(() => undo({ ids: ids.current }), {
      success: "Undo successful",
      failure: "Failed to undo",
      preferLocalMessages: true,
      callback: () => {
        ids.current = [];
      },
    });
  };

  useHotkey("Shift+A", doAction);
  useHotkey("Mod+Z", undoAction);

  return (
    <AppSwapButton
      disabled={isLoading}
      isLoading={isLoading}
      onClick={doAction}
      size="icon-sm"
      variant="outline"
    >
      <Archive />
    </AppSwapButton>
  );
}
