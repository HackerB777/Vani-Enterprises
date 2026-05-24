import mongoose from 'mongoose';

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  images: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isOnSale?: boolean;
  createdAt: string;
  updatedAt: string;
}

const schema = new mongoose.Schema<IProduct>({
  name:          { type: String, required: true },
  slug:          { type: String, required: true, unique: true },
  category:      { type: String, required: true },
  description:   String,
  price:         { type: Number, required: true },
  originalPrice: Number,
  stock:         Number,
  images:        [String],
  isFeatured:    Boolean,
  isBestSeller:  Boolean,
  isNewArrival:  Boolean,
  isOnSale:      Boolean,
  createdAt:     { type: String, default: () => new Date().toISOString() },
  updatedAt:     { type: String, default: () => new Date().toISOString() },
});

export const Product = (mongoose.models.Product as mongoose.Model<IProduct>) ||
  mongoose.model<IProduct>('Product', schema);
