import { z } from "@medusajs/framework/zod";

export const CalculatePriceSchema = z.object({
  product_id: z.string().min(1, "product_id ist erforderlich"),
  width: z.number().int().min(1, "Breite muss mindestens 1mm sein"),
  height: z.number().int().min(1, "Höhe muss mindestens 1mm sein"),
  selections: z.record(z.string(), z.string()),
});

export type CalculatePriceInput = z.infer<typeof CalculatePriceSchema>;
