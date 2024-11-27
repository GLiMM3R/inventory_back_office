import { IImage } from "@/features/products/model/product.interface";

export interface IVariant {
  product_id: string;
  variant_id: string;
  sku: string;
  price: number;
  quantity: number;
  restock_level: number;
  attributes: IAttribute[];
  image: IImage;
  is_active: boolean;
  status: string;
  created_at: number;
  updated_at: number;
}

export interface IAttribute {
  attribute_id: string;
  attribute: string;
  value: string;
}
