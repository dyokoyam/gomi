"use client";

type Props = {
  onDownloadSlides: () => void;
  onDownloadAssessment: () => void;
};

export default function SlideDownloadButtons({ onDownloadSlides, onDownloadAssessment }: Props) {
  return (
    <div className="flex justify-center space-x-4">
      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors" onClick={onDownloadSlides}>
        <i className="fas fa-download mr-2"></i>スライドをダウンロード
      </button>
      <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors" onClick={onDownloadAssessment}>
        <i className="fas fa-download mr-2"></i>アセスメントをダウンロード
      </button>
    </div>
  );
}


