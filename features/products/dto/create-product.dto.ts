import { IFileRequest } from "@/features/files/dto/file-request";
import { variantSchema } from "@/features/variants/dto/create-variant.dto";
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  category_id: z.string(),
  description: z.string().optional(),
  variants: z.array(variantSchema).optional(),
});

export type CreateProductSchema = z.infer<typeof productSchema>;

export type CreateProductDto = CreateProductSchema & {
  images: IFileRequest[];
};
