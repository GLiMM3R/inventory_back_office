import { z } from "zod";
import { fileSchema } from "@/features/files/dto/file-schema";

export const variantSchema = z.object({
  variant_id: z.string().uuid().optional(),
  sku: z.string().min(1, {
    message: "sku must be a non-empty string.",
  }),
  variant_name: z.string().min(0),
  additional_price: z.number().min(0, {
    message: "additional price must be a non-negative number.",
  }),
  stock_quantity: z.number().int().min(0, {
    message: "stock quantity must be a non-negative integer.",
  }),
  restock_level: z.number().int().min(0, {
    message: "restock_level must be a non-negative integer.",
  }),
  attributes: z.array(
    z.object({
      variant_id: z.string().uuid().optional(),
      attribute_name: z.string().min(1),
      attribute_value: z.string().min(1),
    })
  ),
  image: fileSchema.optional(),
  is_active: z.boolean().default(true).optional(),
  status: z.string().default("active").optional(),
});

export type CreateVariantDTO = z.infer<typeof variantSchema>;
