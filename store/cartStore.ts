import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { IProduct } from '@/lib/models/Product';

const storage = typeof window !== 'undefined' ? window.localStorage : ({} as Storage);

export interface CartItem {
  product: IProduct;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: IProduct) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const existing = get().items.find((item) => item.product.slug === product.slug);
        if (existing) {
          set({
            items: get().items.map((item) =>
              item.product.slug === product.slug ? { ...item, quantity: item.quantity + 1 } : item
            ),
          });
          return;
        }

        set({ items: [...get().items, { product, quantity: 1 }] });
      },
      removeItem: (slug) => {
        set({ items: get().items.filter((item) => item.product.slug !== slug) });
      },
      updateQuantity: (slug, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((item) => item.product.slug !== slug) });
          return;
        }
        set({
          items: get().items.map((item) =>
            item.product.slug === slug ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'vani-cart-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);
