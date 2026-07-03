'use client';

import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';
import { ProductCard } from '@/components/store/ProductCard';

export function RecentlyViewed({ excludeSlug }: { excludeSlug?: string }) {
  const items = useRecentlyViewedStore((s) => s.items).filter((p) => p.slug !== excludeSlug);

  if (items.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="font-display text-2xl font-bold text-stone-900 mb-6">Recently Viewed</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.slice(0, 4).map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
