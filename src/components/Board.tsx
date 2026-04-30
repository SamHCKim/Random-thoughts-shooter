'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { type Thought, type OptimisticThought } from '@/lib/types';
import { randomUUID } from '@/lib/uuid';
import ThoughtList from '@/components/ThoughtList';
import Composer from '@/components/Composer';
import ConnectionStatus from '@/components/ConnectionStatus';

interface BoardProps {
  initialThoughts: Thought[];
}

const PAGE_SIZE = 100;

function toOptimistic(t: Thought, pending = false): OptimisticThought {
  return { ...t, pending };
}

export default function Board({ initialThoughts }: BoardProps) {
  const [thoughts, setThoughts] = useState<OptimisticThought[]>(
    initialThoughts.map((t) => toOptimistic(t))
  );
  const [oldestLoadedAt, setOldestLoadedAt] = useState<string | null>(
    initialThoughts.length > 0
      ? initialThoughts[initialThoughts.length - 1].created_at
      : null
  );
  const [hasMore, setHasMore] = useState(initialThoughts.length >= PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    'connected' | 'connecting' | 'disconnected'
  >('connecting');

  // Keep a ref to access latest thoughts inside the channel callback without stale closure
  const thoughtsRef = useRef(thoughts);
  useEffect(() => {
    thoughtsRef.current = thoughts;
  }, [thoughts]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('thoughts-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'thoughts' },
        (payload) => {
          const incoming = payload.new as Thought;
          setThoughts((prev) => {
            const exists = prev.some((t) => t.id === incoming.id);
            if (exists) {
              // Upgrade optimistic row with server-confirmed data
              return prev.map((t) =>
                t.id === incoming.id ? { ...incoming, pending: false } : t
              );
            }
            // Row from another user — prepend
            return [toOptimistic(incoming), ...prev];
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected');
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          setConnectionStatus('disconnected');
        } else {
          setConnectionStatus('connecting');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubmit = useCallback(
    async (nickname: string, content: string): Promise<void> => {
      const id = randomUUID();
      const created_at = new Date().toISOString();
      const optimistic: OptimisticThought = {
        id,
        nickname,
        content,
        created_at,
        pending: true,
      };

      setThoughts((prev) => [optimistic, ...prev]);

      const supabase = createClient();
      const { error } = await supabase
        .from('thoughts')
        .insert({ id, nickname, content });

      if (error) {
        // Only roll back if the row is still pending (echo hasn't upgraded it yet)
        setThoughts((prev) =>
          prev.some((t) => t.id === id && t.pending)
            ? prev.filter((t) => t.id !== id)
            : prev
        );
        throw error;
      }
    },
    []
  );

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !oldestLoadedAt) return;
    setLoadingMore(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('thoughts')
        .select('*')
        .lt('created_at', oldestLoadedAt)
        .order('created_at', { ascending: false })
        .limit(PAGE_SIZE);

      if (error) {
        console.error('pagination fetch failed:', error);
        return;
      }

      const rows = (data ?? []) as Thought[];
      if (rows.length === 0) {
        setHasMore(false);
        return;
      }

      setThoughts((prev) => [...prev, ...rows.map((t) => toOptimistic(t))]);
      setOldestLoadedAt(rows[rows.length - 1].created_at);
      setHasMore(rows.length >= PAGE_SIZE);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, oldestLoadedAt]);

  return (
    <>
      <ConnectionStatus status={connectionStatus} />
      <main className="mx-auto max-w-2xl px-4 pt-6 pb-40">
        <ThoughtList
          thoughts={thoughts}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
        />
      </main>
      <Composer onSubmit={handleSubmit} />
    </>
  );
}
