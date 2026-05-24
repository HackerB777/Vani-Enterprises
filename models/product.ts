export interface Product {
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  stock?: number;
  sku?: string;
}
