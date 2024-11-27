import { z } from "zod";

export const variantSchema = z.object({
  variant_id: z.string().uuid().optional(),
  sku: z.string().min(1, {
    message: "sku must be a non-empty string.",
  }),
  price: z.number().min(0, {
    message: "price must be a non-negative number.",
  }),
  quantity: z.number().int().min(0, {
    message: "quantity must be a non-negative integer.",
  }),
  restock_level: z.number().int().min(0, {
    message: "restock_level must be a non-negative integer.",
  }),
  attributes: z.array(
    z.object({
      attribute_id: z.string().uuid().optional(),
      attribute: z.string().min(1),
      value: z.string().min(1),
    })
  ),
  is_active: z.boolean().default(true).optional(),
  status: z.string().default("active").optional(),
});

export type CreateVariantSchema = z.infer<typeof variantSchema>;
