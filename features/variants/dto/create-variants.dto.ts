import { z } from "zod";
import { variantSchema } from "./create-variant.dto";

export const variantsSchema = z.object({
  variants: z.array(variantSchema),
});

export type CreateVariantsDTO = z.infer<typeof variantsSchema>;
