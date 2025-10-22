"use client";

import type { SlideOutline } from "@/entities/project/model";

type Props = {
  outline: SlideOutline[];
  onChange: (next: SlideOutline[]) => void;
};

export default function OutlineEditor({ outline, onChange }: Props) {
  const update = (index: number, content: string) => {
    const next = outline.map((s, i) => (i === index ? { ...s, content } : s));
    onChange(next);
  };
  return (
    <div id="slide-outline" className="space-y-4">
      {outline.map((slide, idx) => (
        <div key={idx} className="page-editor">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-gray-800">
              <i className="fas fa-file-powerpoint text-blue-600 mr-2"></i>
              ページ {slide.pageNumber}
            </h4>
            <span className="text-sm text-gray-500">内容編集</span>
          </div>
          <div>
            <textarea rows={6} defaultValue={slide.content} placeholder="スライドの内容を入力してください..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => update(idx, e.target.value)}></textarea>
          </div>
        </div>
      ))}
    </div>
  );
}


