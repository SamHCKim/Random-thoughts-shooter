'use client';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-lg text-gray-700">문제가 발생했어요.</p>
      <p className="text-sm text-gray-400">새로고침 해주세요.</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
      >
        다시 시도
      </button>
    </div>
  );
}
