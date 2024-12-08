import { IMedia } from "@/features/files/model/media.interface";
import { IProductVariant } from "@/features/variants/model/product-variant.interface";

export interface IProduct {
  product_id: string;
  name: string;
  base_price: number;
  thumbnail: IMedia;
  category_id: string;
  category_name: string;
  description: string;
  is_active: boolean;
  variants: IProductVariant[];
  created_at: number;
  updated_at: number;
}
