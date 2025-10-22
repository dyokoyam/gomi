"use client";

type Props = {
  open: boolean;
  progress: number;
  text: string;
  onRetry?: () => void;
};

export default function JobProgressDialog({ open, progress, text, onRetry }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-center text-gray-700 mb-4">{text}</p>
        {onRetry && (
          <div className="text-center">
            <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700" onClick={onRetry}>再試行</button>
          </div>
        )}
      </div>
    </div>
  );
}


