import { z } from "zod";

export const fileSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(255),
  type: z.string().min(1).max(255),
  size: z.number().positive(),
  collection_type: z.string().min(1),
});

export type FileSchema = z.infer<typeof fileSchema>;
