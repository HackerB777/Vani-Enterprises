import { create } from 'zustand';
import type { CartItem } from '@/store/cartStore';

interface BuyNowState {
  item: CartItem | null;
  setBuyNow: (product: CartItem['product'], quantity?: number) => void;
  clearBuyNow: () => void;
}

/* Intentionally not persisted — a "Buy Now" selection is a one-shot
   checkout override and should not survive a refresh or linger after
   the user leaves the checkout page without completing the order. */
export const useBuyNowStore = create<BuyNowState>((set) => ({
  item: null,
  setBuyNow: (product, quantity = 1) => set({ item: { product, quantity } }),
  clearBuyNow: () => set({ item: null }),
}));
