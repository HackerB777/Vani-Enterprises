import mongoose from 'mongoose';
import type { Order } from '@/lib/orders';

const schema = new mongoose.Schema<Order>({
  id:              { type: String, required: true, unique: true },
  items:           { type: mongoose.Schema.Types.Mixed, required: true },
  subtotal:        Number,
  shippingCharge:  Number,
  tax:             Number,
  total:           Number,
  paymentMethod:   String,
  paymentStatus:   String,
  status:          String,
  shippingAddress: mongoose.Schema.Types.Mixed,
  createdAt:       String,
  trackingId:      String,
  courier:         String,
  notes:           String,
});

export const OrderModel = (mongoose.models.Order as mongoose.Model<Order>) ||
  mongoose.model<Order>('Order', schema);
