import { Product } from '@/lib/products';

export interface OrderItem {
  product: Product;
  quantity: number;
  total: number;
}

export interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  shippingCharge: number;
  tax: number;
  total: number;
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  createdAt: string;
  trackingId?: string;
  courier?: string;
  notes?: string;
}

export function calculateSubtotal(items: OrderItem[]) {
  return items.reduce((sum, item) => sum + item.total, 0);
}

export function createOrderPayload(
  items: OrderItem[],
  shippingAddress: ShippingAddress,
  paymentMethod: 'razorpay' | 'cod',
): Order {
  const subtotal       = calculateSubtotal(items);
  const shippingCharge = subtotal >= 999 ? 0 : 99;
  const tax            = Math.round(subtotal * 0.05);
  const total          = subtotal + shippingCharge + tax;

  return {
    id:            `VE-${Date.now()}`,
    items,
    subtotal,
    shippingCharge,
    tax,
    total,
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
    status:        'placed',
    shippingAddress,
    createdAt:     new Date().toISOString(),
  };
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  placed:           'Order Placed',
  confirmed:        'Confirmed',
  processing:       'Processing',
  shipped:          'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered:        'Delivered',
  cancelled:        'Cancelled',
  returned:         'Returned',
};

export const STATUS_FLOW: OrderStatus[] = [
  'placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered',
];
