"use client";

import type { SlideOutline } from "@/entities/project/model";
import OutlineEditor from "@/entities/outline/ui/OutlineEditor";

type Props = {
  outline: SlideOutline[];
  onChange: (next: SlideOutline[]) => void;
  onBack: () => void;
  onGenerate: () => void;
};

export default function StepOutline({ outline, onChange, onBack, onGenerate }: Props) {
  return (
    <div id="step-4" className="step-content bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">スライド骨子の編集</h3>
      <OutlineEditor outline={outline} onChange={onChange} />
      <div className="flex justify-between pt-6">
        <button type="button" className="step-back bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors" onClick={onBack}>戻る</button>
        <button type="button" id="generate-slides" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors" onClick={onGenerate}>
          <i className="fas fa-magic mr-2"></i>スライド作成開始
        </button>
      </div>
    </div>
  );
}


