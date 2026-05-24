'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type Animation =
  | 'fade-up' | 'fade-in' | 'zoom-in' | 'bounce-in'
  | 'scale-in' | 'slide-in-left' | 'slide-in-right' | 'slide-up' | 'count-up';

interface Props {
  children: ReactNode;
  animation?: Animation;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
}

export function AnimateOnScroll({
  children,
  animation  = 'fade-up',
  delay      = 0,
  threshold  = 0.12,
  className  = '',
  once       = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.animationDelay    = `${delay}ms`;
          el.style.animationFillMode = 'both';
          el.classList.add(`animate-${animation}`);
          el.classList.remove('anim-hidden');
          if (once) observer.unobserve(el);
        } else if (!once) {
          el.classList.remove(`animate-${animation}`);
          el.classList.add('anim-hidden');
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animation, delay, threshold, once]);

  return (
    <div ref={ref} className={`anim-hidden ${className}`}>
      {children}
    </div>
  );
}

/* Staggered wrapper — animates children one-by-one */
export function StaggerChildren({
  children,
  animation = 'fade-up',
  stagger   = 80,
  className = '',
  threshold = 0.08,
}: {
  children: ReactNode[];
  animation?: Animation;
  stagger?: number;
  className?: string;
  threshold?: number;
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <AnimateOnScroll key={i} animation={animation} delay={i * stagger} threshold={threshold}>
          {child}
        </AnimateOnScroll>
      ))}
    </div>
  );
}
