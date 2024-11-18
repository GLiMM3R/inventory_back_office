import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(3).max(255),
  parent_category_id: z.string().nullable(),
  image: z.string().nullable(),
});

export type CategoryForm = z.infer<typeof categorySchema>;
