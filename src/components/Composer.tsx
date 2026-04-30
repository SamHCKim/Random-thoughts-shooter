'use client';

import { useEffect, useRef, useState } from 'react';

interface ComposerProps {
  onSubmit: (nickname: string, content: string) => Promise<void>;
}

const NICKNAME_MAX = 30;
const CONTENT_MAX = 500;

export default function Composer({ onSubmit }: ComposerProps) {
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isComposingRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Auto-grow textarea up to ~4 rows
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const lineHeight = 24; // px, approximate
    const maxHeight = lineHeight * 4 + 16; // 4 rows + padding
    el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px';
  }, [content]);

  const trimmedNickname = nickname.trim();
  const trimmedContent = content.trim();
  const canSubmit =
    trimmedNickname.length > 0 &&
    trimmedNickname.length <= NICKNAME_MAX &&
    trimmedContent.length > 0 &&
    trimmedContent.length <= CONTENT_MAX &&
    !submitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    // Clear content immediately for snappy feel
    setContent('');
    setError(null);
    try {
      await onSubmit(trimmedNickname, trimmedContent);
    } catch {
      setError('전송 실패. 다시 시도해주세요.');
      // Restore content so user can retry
      setContent(trimmedContent);
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => setError(null), 4000);
    } finally {
      setSubmitting(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      // During Korean IME composition, don't submit
      if (isComposingRef.current) return;
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)]"
    >
      {error && (
        <div className="px-4 py-2 text-sm text-red-600 bg-red-50 border-b border-red-100">
          {error}
        </div>
      )}
      <div className="flex flex-col gap-2 px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={NICKNAME_MAX}
            placeholder="닉네임"
            className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          />
          <span
            className={`shrink-0 text-xs tabular-nums ${
              nickname.length >= NICKNAME_MAX ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            {nickname.length}/{NICKNAME_MAX}
          </span>
        </div>
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => { isComposingRef.current = true; }}
            onCompositionEnd={() => { isComposingRef.current = false; }}
            maxLength={CONTENT_MAX}
            placeholder="생각을 입력하세요… (Enter 전송, Shift+Enter 줄바꿈)"
            rows={1}
            className="min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm leading-6 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          />
          <div className="flex shrink-0 flex-col items-end gap-1">
            <span
              className={`text-xs tabular-nums ${
                content.length >= CONTENT_MAX ? 'text-red-500' : 'text-gray-400'
              }`}
            >
              {content.length}/{CONTENT_MAX}
            </span>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white transition-opacity hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
