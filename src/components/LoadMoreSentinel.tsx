'use client';

import { useEffect, useRef } from 'react';

interface LoadMoreSentinelProps {
  onLoadMore: () => void;
  active: boolean;
}

export default function LoadMoreSentinel({ onLoadMore, active }: LoadMoreSentinelProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // root: null uses the viewport — the page scrolls, not an inner container
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && active) {
          onLoadMore();
        }
      },
      { root: null, threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [active, onLoadMore]);

  return <div ref={ref} className="h-px w-full" aria-hidden="true" />;
}
