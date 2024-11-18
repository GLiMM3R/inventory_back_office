import { z } from "zod";

export const variantUpdateSchema = z.object({
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

export type VariantUpdateDto = z.infer<typeof variantUpdateSchema>;
