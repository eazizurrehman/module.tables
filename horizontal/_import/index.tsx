import { Upload, X } from "lucide-react";
import { useState } from "react";
import { AppButton } from "@/app/_components/button";
import TableImportForm from "@/app/_modules/tables/horizontal/_import/_form";
import type {
  TFormSchema,
  TImportTemplate,
} from "@/app/_modules/tables/horizontal/_types";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/app/_shadcn/popover";
import type { TActionFailure, TActionSuccess } from "@/lib/async-handlers";

export function TableImport<TData extends Record<string, unknown>>({
  title,
  action,
  importTemplate,
  formSchema,
}: {
  title: string | React.ReactNode;
  action: (args: {
    values: TData[];
  }) => Promise<TActionSuccess<unknown> | TActionFailure>;
  importTemplate?: TImportTemplate;
  formSchema?: TFormSchema<TData>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <AppButton className="relative" size="icon-sm" variant="outline">
          <Upload className="size-4 text-muted-foreground" />
        </AppButton>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="max-h-[80dvh] w-xs max-w-(--radix-popover-content-available-width) space-y-2 overflow-y-auto"
      >
        <PopoverHeader className="flex flex-row items-center justify-between gap-2">
          <PopoverTitle className="font-semibold">Import Data</PopoverTitle>
          <AppButton
            className="size-8 shrink-0"
            onClick={() => setOpen(false)}
            size="icon-sm"
            variant="ghost"
          >
            <X />
          </AppButton>
        </PopoverHeader>
        <TableImportForm
          action={action}
          formSchema={formSchema}
          importTemplate={importTemplate}
          setOpen={setOpen}
          title={title}
        />
      </PopoverContent>
    </Popover>
  );
}
