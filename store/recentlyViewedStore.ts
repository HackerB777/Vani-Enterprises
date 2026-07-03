import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { IProduct } from '@/lib/models/Product';

const MAX_ITEMS = 10;

interface RecentlyViewedState {
  items: IProduct[];
  addProduct: (product: IProduct) => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],
      addProduct: (product) => {
        const withoutCurrent = get().items.filter((p) => p.slug !== product.slug);
        set({ items: [product, ...withoutCurrent].slice(0, MAX_ITEMS) });
      },
    }),
    {
      name: 'vani-recently-viewed-storage',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);
