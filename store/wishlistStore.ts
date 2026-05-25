import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { IProduct } from '@/lib/models/Product';

const storage = typeof window !== 'undefined' ? window.localStorage : ({} as Storage);

interface WishlistState {
  items: IProduct[];
  toggleItem: (product: IProduct) => void;
  removeItem: (slug: string) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (product) => {
        const exists = get().items.some((item) => item.slug === product.slug);
        if (exists) {
          set({ items: get().items.filter((item) => item.slug !== product.slug) });
          return;
        }
        set({ items: [...get().items, product] });
      },
      removeItem: (slug) => {
        set({ items: get().items.filter((item) => item.slug !== slug) });
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'vani-wishlist-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);
