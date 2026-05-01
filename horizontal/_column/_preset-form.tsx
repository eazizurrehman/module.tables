import { useForm } from "@tanstack/react-form-nextjs";
import { Bookmark, Check, X } from "lucide-react";
import { useState } from "react";
import { AppButton } from "@/app/_components/button";
import { AppFieldGroup } from "@/app/_components/form/field-group";
import { AppInput } from "@/app/_components/form/input";
import { AppSubmitButton } from "@/app/_components/form/submit-button";
import { useColumnTable } from "@/app/_components/tables/horizontal/_column/_hook";
import { presetFormSchema } from "@/app/_components/tables/horizontal/_column/_preset-schema";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_shadcn/dialog";
import { Field } from "@/app/_shadcn/field";

export default function PresetForm() {
  const {
    getColumnVisibility,
    getColumnVisibilityLength,
    getIsNamePresentInColumnsPreset,
    getIsColumnsPresentInColumnsPreset,
    saveColumnsPreset,
  } = useColumnTable();
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      columnVisibility: getColumnVisibility(),
    },
    validators: {
      onSubmit: presetFormSchema({
        getIsNamePresentInColumnsPreset,
        getIsColumnsPresentInColumnsPreset,
      }),
    },
    onSubmit: ({ value: data }) => {
      saveColumnsPreset(data);
      form.reset();
      setOpen(false);
    },
  });

  return (
    <Dialog
      onOpenChange={() => {
        form.reset();
        setOpen((prev) => !prev);
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <AppButton
          disabled={
            getColumnVisibilityLength() === 0 ||
            getIsColumnsPresentInColumnsPreset()
          }
          size="sm"
        >
          <Bookmark />
          Save
        </AppButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bookmark width={20} />
            Save Columns Preset
          </DialogTitle>
        </DialogHeader>
        <form
          className="space-y-2"
          id="table-columns-preset-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <AppFieldGroup>
            <form.Field name="name">
              {(field) => <AppInput field={field} label="Name" />}
            </form.Field>
          </AppFieldGroup>
        </form>
        <DialogFooter>
          <Field orientation="horizontal">
            <AppSubmitButton form={form} formId="table-columns-preset-form">
              <Check /> Submit
            </AppSubmitButton>
            <AppButton onClick={() => form.reset()} variant="secondary">
              <X />
              Reset
            </AppButton>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
