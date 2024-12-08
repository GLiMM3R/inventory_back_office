import { IMedia } from "@/features/files/model/media.interface";

export interface IProducts {
  product_id: string;
  name: string;
  base_price: number;
  thumbnail: IMedia;
  category_name: string;
  description: string;
  is_active: boolean;
  created_at: number;
  updated_at: number;
}
