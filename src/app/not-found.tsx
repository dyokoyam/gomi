export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 text-gray-800">
      <h2 className="text-lg font-semibold">ページが見つかりませんでした。</h2>
      <p className="text-sm text-gray-600">
        入力したURLが正しいかを確認し、再度アクセスしてください。
      </p>
    </div>
  );
}

