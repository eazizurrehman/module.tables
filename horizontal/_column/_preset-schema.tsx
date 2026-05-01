import * as z from "zod";

export const presetFormSchema = ({
  getIsNamePresentInColumnsPreset,
  getIsColumnsPresentInColumnsPreset,
}: {
  getIsNamePresentInColumnsPreset: (name: string) => boolean;
  getIsColumnsPresentInColumnsPreset: (
    columns: Record<string, boolean>,
  ) => boolean;
}) =>
  z
    .object({
      name: z
        .string()
        .min(1, "Name is required")
        .max(30, "Name must be less than 30 characters")
        .refine(
          (value) => !getIsNamePresentInColumnsPreset(value),
          "Preset with this name exists",
        ),
      columnVisibility: z.record(z.string(), z.boolean()),
    })
    .superRefine((data, ctx) => {
      if (Object.keys(data.columnVisibility).length === 0)
        ctx.addIssue({
          path: ["name"],
          message: "Unselect at least one column",
          code: "custom",
        });

      if (getIsColumnsPresentInColumnsPreset(data.columnVisibility))
        ctx.addIssue({
          path: ["name"],
          message: "Preset with same columns exists",
          code: "custom",
        });

      if (!Object.values(data.columnVisibility).every((v) => v === false))
        ctx.addIssue({
          path: ["name"],
          message: "All columns must be hidden",
          code: "custom",
        });
    });

export type TPresetFormSchema = z.infer<typeof presetFormSchema>;
