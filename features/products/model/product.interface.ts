export interface IProduct {
  product_id: string;
  images?: string[];
  name: string;
  category_id: string;
  description: string;
  created_at: number;
  updated_at: number;
  deleted_at?: number;
  category: Category;
  varaints: Varaint[];
}

export interface Category {
  category_id: string;
  parent_category_id: string;
  name: string;
  created_at: number;
  updated_at: number;
}

export interface Varaint {
  variant_id: string;
  product_id: string;
  sku: string;
  image: string;
  status: string;
  created_at: number;
  updated_at: number;
  deleted_at?: number;
  attributes: Attribute[];
  price: Price[];
}

export interface Attribute {
  attribute_id: string;
  variant_id: string;
  attribute: string;
  value: string;
}

export interface Price {
  price_id: string;
  variant_id: string;
  new_price: number;
  old_price: number;
  effective_date: number;
  created_at: number;
  updated_at: number;
}
