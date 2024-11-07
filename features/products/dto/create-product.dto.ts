import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  category_id: z.string(),
  images: z.array(z.string().optional()).optional(),
  variants: z.array(
    z.object({
      price: z.number().min(0, {
        message: "price must be a non-negative number.",
      }),
      attributes: z.array(
        z.object({
          attribute: z.string().min(1),
          value: z.string().min(1),
        })
      ),
    })
  ),
});

export type ProductForm = z.infer<typeof productSchema>;
