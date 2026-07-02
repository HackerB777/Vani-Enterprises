export interface IProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory?: string;
  description?: string;
  details?: string[];
  rating?: number;
  reviewCount?: number;
  price: number;
  originalPrice?: number;
  stock?: number;
  images: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isOnSale?: boolean;
  isCodAvailable?: boolean;
  createdAt: string;
  updatedAt: string;
}
