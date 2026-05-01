import * as z from "zod";

export const importFormSchema = z.object({
  files: z.array(z.instanceof(File)).min(1, { message: "File is required" }),
});

export type TImportFormSchema = z.infer<typeof importFormSchema>;
