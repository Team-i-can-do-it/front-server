export type ProductStatus = 'active' | 'soldout';

export interface Product {
  id: number | string;
  product_name: string;
  brand_name: string;
  discount: number;
  price: number;
  img: string;
  expireDate: string;
  status: ProductStatus;
  count: number;
}
