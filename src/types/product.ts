export type ProductStatus = 'active' | 'soldout';

export interface Product {
  id: number;
  product_name: string;
  brand_name: string;
  discount: number;
  price: number;
  img: string;
  expireDate: string;
  status: ProductStatus;
  count: number;
}
