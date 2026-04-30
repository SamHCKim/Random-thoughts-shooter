'use client';

import { type OptimisticThought } from '@/lib/types';
import ThoughtBubble from '@/components/ThoughtBubble';
import EmptyState from '@/components/EmptyState';
import LoadMoreSentinel from '@/components/LoadMoreSentinel';

interface ThoughtListProps {
  thoughts: OptimisticThought[];
  hasMore: boolean;
  onLoadMore: () => void;
}

export default function ThoughtList({ thoughts, hasMore, onLoadMore }: ThoughtListProps) {
  if (thoughts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col">
      {thoughts.map((thought) => (
        <ThoughtBubble key={thought.id} thought={thought} />
      ))}
      <LoadMoreSentinel onLoadMore={onLoadMore} active={hasMore} />
    </div>
  );
}
