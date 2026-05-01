import { Check, Pencil, Trash2 } from "lucide-react";
import { AppButton } from "@/app/_components/button";
import { ConfirmDeletion } from "@/app/_components/confirm-deletion";
import { useColumnTable } from "@/app/_modules/tables/horizontal/_column/_hook";
import { PopoverHeader, PopoverTitle } from "@/app/_shadcn/popover";
import { Separator } from "@/app/_shadcn/separator";

export function TableSavedPresets() {
  const {
    updateColumnVisibilityByPreset,
    getIsColumnsPresetActive,
    deleteColumnsPreset,
    getColumnsPresets,
    deleteAllColumnsPresets,
  } = useColumnTable();

  return (
    Object.keys(getColumnsPresets()).length > 0 && (
      <>
        <Separator />
        <PopoverHeader>
          <PopoverTitle className="font-semibold">Saved Presets</PopoverTitle>
        </PopoverHeader>
        <div>
          {Object.entries(getColumnsPresets()).map(([name], index) => (
            <div className="flex items-center" key={name}>
              <AppButton
                className="size-8 shrink-0"
                size="icon"
                variant="ghost"
              >
                {getIsColumnsPresetActive(name) ? (
                  <Check className="block h-full w-full text-primary" />
                ) : (
                  <span className="text-muted-foreground">{index + 1}</span>
                )}
              </AppButton>
              <AppButton
                className="flex-1 justify-start"
                onClick={() => updateColumnVisibilityByPreset(name)}
                size="sm"
                variant="ghost"
              >
                {name}
              </AppButton>
              <AppButton
                className="size-8 shrink-0"
                size="icon"
                variant="ghost"
              >
                <Pencil />
              </AppButton>
              <AppButton
                className="size-8 shrink-0 hover:text-destructive"
                onClick={() => deleteColumnsPreset(name)}
                size="icon"
                variant="ghost"
              >
                <Trash2 />
              </AppButton>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-2">
          <ConfirmDeletion onConfirm={deleteAllColumnsPresets} />
        </div>
      </>
    )
  );
}
