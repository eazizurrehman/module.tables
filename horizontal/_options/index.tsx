import { EllipsisVertical, RotateCw, X } from "lucide-react";
import { useState } from "react";
import { AppButton } from "@/app/_components/button";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/app/_shadcn/popover";
import {
  clientAsyncHandler,
  type TActionFailure,
  type TActionSuccess,
} from "@/lib/async-handlers";

export function TableOptions({
  action,
}: {
  action?: () => Promise<TActionSuccess<unknown> | TActionFailure>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <AppButton className="relative" size="icon-sm" variant="outline">
          <EllipsisVertical className="text-muted-foreground" />
        </AppButton>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="max-h-[80dvh] w-60 max-w-(--radix-popover-content-available-width) space-y-2 overflow-y-auto"
      >
        <PopoverHeader className="flex flex-row items-center justify-between gap-2">
          <PopoverTitle className="font-semibold">Options</PopoverTitle>
          <AppButton
            className="size-8 shrink-0"
            onClick={() => setOpen(false)}
            size="icon-sm"
            variant="ghost"
          >
            <X />
          </AppButton>
        </PopoverHeader>
        <div>
          {action && (
            <AppButton
              className="w-full shrink-0 justify-between"
              onClick={() =>
                clientAsyncHandler(() => action(), {
                  success: "Action completed successfully",
                  failure: "Failed to complete action",
                })
              }
              variant="ghost"
            >
              Purge Cache
              <RotateCw />
            </AppButton>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
