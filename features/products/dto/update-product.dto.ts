import { z } from "zod";

export const productUpdateSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "name must be at least 2 characters.",
    })
    .optional(),
  category_id: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string().optional()).optional(),
  variants: z
    .array(
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
    )
    .optional(),
});

export type ProductUpdateDto = z.infer<typeof productUpdateSchema>;
