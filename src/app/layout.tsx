import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Random thoughts shooter',
  description: '친구용 실시간 생각 게시판',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css"
        />
      </head>
      <body className="font-pretendard antialiased">{children}</body>
    </html>
  );
}
