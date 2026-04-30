'use client';

interface ConnectionStatusProps {
  status: 'connected' | 'connecting' | 'disconnected';
}

export default function ConnectionStatus({ status }: ConnectionStatusProps) {
  if (status === 'connected') return null;

  const isConnecting = status === 'connecting';

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium shadow-md ${
          isConnecting
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            isConnecting ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
          }`}
        />
        {isConnecting ? '재접속 중…' : '오프라인 — 재접속 중'}
      </div>
    </div>
  );
}
