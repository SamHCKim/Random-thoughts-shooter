import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-5xl font-bold text-gray-200">404</p>
      <p className="text-lg text-gray-700">페이지를 찾을 수 없어요.</p>
      <Link
        href="/"
        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
      >
        홈으로
      </Link>
    </div>
  );
}
