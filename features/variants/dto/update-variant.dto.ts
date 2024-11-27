import { IFileRequest } from "@/features/files/dto/file-request";
import { CreateVariantSchema } from "./create-variant.dto";

export type UpdateVariantSchema = Partial<CreateVariantSchema> & {
  image?: IFileRequest;
};
