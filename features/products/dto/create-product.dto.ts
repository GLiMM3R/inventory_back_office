import { fileSchema } from "@/features/files/dto/file-schema";
import { variantSchema } from "@/features/variants/dto/create-variant.dto";
import { z } from "zod";

export const productSchema = z.object({
  product_id: z.string().optional(),
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  category_id: z.string(),
  base_price: z.number().min(0, {
    message: "base price must be a non-negative number.",
  }),
  description: z.string().optional(),
  thumbnail: fileSchema.optional(),
  variants: z.array(variantSchema).optional(),
});

export type CreateProductDTO = z.infer<typeof productSchema>;
