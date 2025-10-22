"use client";

import { useRouter } from "next/navigation";

type Props = {
  progress: number;
  progressText: string;
  done: boolean;
  onDownloadSlides: () => void;
  onDownloadAssessment: () => void;
};

export default function StepGenerateSlides({ progress, progressText, done, onDownloadSlides, onDownloadAssessment }: Props) {
  const router = useRouter();
  return (
    <div id="step-5" className="step-content bg-white rounded-lg shadow-md p-6">
      <div className="text-center">
        {!done && (
          <div id="generation-progress" className="mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">スライドを生成中...</h3>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div id="progress-bar" className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
            <p id="progress-text" className="text-gray-600">{progressText}</p>
          </div>
        )}
        {done && (
          <div id="generation-complete">
            <i className="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">生成完了！</h3>
            <p className="text-gray-600 mb-6">ノート付きスライドとアセスメントが正常に作成されました。</p>
            <div className="flex justify-center space-x-4">
              <button id="download-slides" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors" onClick={onDownloadSlides}>
                <i className="fas fa-download mr-2"></i>スライドをダウンロード
              </button>
              <button id="download-assessment" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors" onClick={onDownloadAssessment}>
                <i className="fas fa-download mr-2"></i>アセスメントをダウンロード
              </button>
            </div>
            <div className="mt-6">
              <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors" onClick={() => router.push("/")}>ホームに戻る</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


