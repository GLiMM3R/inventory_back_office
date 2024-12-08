import { IMedia } from "@/features/files/model/media.interface";

export interface IProductVariant {
  variant_id: string;
  sku: string;
  variant_name: string;
  additional_price: number;
  stock_quantity: number;
  restock_level: number;
  is_active: boolean;
  status: string;
  created_at: number;
  updated_at: number;
  image: IMedia;
  attributes: IAttribute[];
}

export interface IAttribute {
  attribute_name: string;
  attribute_value: string;
}
