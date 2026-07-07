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

export interface ParcelEvent {
  id: string;
  orderId: string;
  status: string;
  location?: string;
  description?: string;
  eventTimestamp: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  shipmentId?: string;
  courier: string;
  trackingUrl?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  status: string;
  rawData?: Record<string, unknown>;
  lastSyncedAt?: string;
  createdAt: string;
  updatedAt: string;
}

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
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  userId?: string;
}

export function calculateSubtotal(items: OrderItem[]) {
  return items.reduce((sum, item) => sum + item.total, 0);
}

export interface ShippingConfig {
  freeShippingEnabled: boolean;
  shippingCost: number;
}

export const DEFAULT_SHIPPING_CONFIG: ShippingConfig = { freeShippingEnabled: false, shippingCost: 99 };

export function createOrderPayload(
  items: OrderItem[],
  shippingAddress: ShippingAddress,
  paymentMethod: 'razorpay' | 'cod',
  discount = 0,
  shippingConfig: ShippingConfig = DEFAULT_SHIPPING_CONFIG,
): Order {
  const subtotal       = calculateSubtotal(items);
  const shippingCharge = shippingConfig.freeShippingEnabled ? 0 : shippingConfig.shippingCost;
  const tax            = Math.round(subtotal * 0.05);
  const total          = Math.max(0, subtotal + shippingCharge + tax - discount);

  return {
    id:            `VE-${Date.now()}`,
    items,
    subtotal,
    shippingCharge,
    tax,
    total,
    paymentMethod,
    paymentStatus: 'pending',
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

/* Customers may only self-cancel before the order ships — once it's in
   transit, cancellation has to go through support/logistics instead. */
export const CANCELLABLE_STATUSES: OrderStatus[] = ['placed', 'confirmed', 'processing'];
