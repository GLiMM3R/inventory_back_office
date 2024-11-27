import { IVariant } from "@/features/variants/model/variant.interface";

export interface IProduct {
  product_id: string;
  name: string;
  images: IImage[];
  category_id: string;
  category: string;
  description: string;
  variants: IVariant[];
  created_at: number;
  updated_at: number;
}

export interface IImage {
  media_id: string;
  file_url: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  media_type: string;
  description: string;
  created_at: number;
  updated_at: number;
}
