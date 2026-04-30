'use client';

import { useEffect, useState } from 'react';
import { type OptimisticThought } from '@/lib/types';
import { pickBubbleColor, BUBBLE_COLOR_CLASS } from '@/lib/colors';
import { formatRelative, formatAbsolute } from '@/lib/time';

interface ThoughtBubbleProps {
  thought: OptimisticThought;
}

// Renders absolute time server-side, swaps to relative after mount.
// This prevents hydration mismatch without suppressHydrationWarning.
function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

export default function ThoughtBubble({ thought }: ThoughtBubbleProps) {
  const mounted = useMounted();
  const color = pickBubbleColor(thought.nickname);
  const bgClass = BUBBLE_COLOR_CLASS[color];
  const absolute = formatAbsolute(thought.created_at);
  const label = mounted ? formatRelative(thought.created_at) : absolute;

  return (
    <div className={`flex flex-col items-start mb-4 ${thought.pending ? 'opacity-60' : 'opacity-100'}`}>
      <span className="mb-1 ml-1 text-xs font-medium text-gray-500 truncate max-w-[90%]">
        {thought.nickname}
      </span>
      <div
        className={`${bgClass} max-w-[90%] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm`}
      >
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-800">
          {thought.content}
        </p>
        <time
          dateTime={thought.created_at}
          title={absolute}
          className="mt-1 block text-right text-[11px] text-gray-400"
        >
          {label}
        </time>
      </div>
    </div>
  );
}
