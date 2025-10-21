'use client';

import { useEffect } from 'react';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Global error boundary caught an error:', error);
  }, [error]);

  return (
    <html lang="ja">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 text-gray-800">
        <h2 className="text-lg font-semibold">予期せぬエラーが発生しました。</h2>
        <p className="text-sm text-gray-600">ページを再読み込みして再試行してください。</p>
        <button
          type="button"
          onClick={reset}
          className="rounded bg-black px-4 py-2 text-white transition hover:opacity-80"
        >
          再読み込み
        </button>
      </body>
    </html>
  );
}

