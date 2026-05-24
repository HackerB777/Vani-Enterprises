interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
}

export function StarRating({ rating, reviewCount, size = 'sm' }: StarRatingProps) {
  const starSize = size === 'sm' ? 12 : 16;
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(rating);
    const partial = !filled && i < rating;
    const pct = partial ? Math.round((rating - Math.floor(rating)) * 100) : 0;
    return { filled, partial, pct };
  });

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {stars.map((star, i) => (
          <svg
            key={i}
            width={starSize}
            height={starSize}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {star.partial ? (
              <defs>
                <linearGradient id={`star-grad-${i}`}>
                  <stop offset={`${star.pct}%`} stopColor="#f59e0b" />
                  <stop offset={`${star.pct}%`} stopColor="#d6d3d1" />
                </linearGradient>
              </defs>
            ) : null}
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={
                star.filled
                  ? '#f59e0b'
                  : star.partial
                  ? `url(#star-grad-${i})`
                  : '#d6d3d1'
              }
            />
          </svg>
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className={`text-stone-500 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}
