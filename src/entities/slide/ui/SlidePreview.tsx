"use client";

import type { SlideOutline } from "@/entities/project/model";

type Props = {
  outline: SlideOutline[];
};

export default function SlidePreview({ outline }: Props) {
  return (
    <div className="space-y-4">
      {outline.map((s, i) => (
        <div key={i} className="border p-4 rounded bg-white">
          <div className="font-semibold mb-2">ページ {s.pageNumber}: {s.title}</div>
          <div className="text-gray-700 whitespace-pre-wrap">{s.content}</div>
        </div>
      ))}
    </div>
  );
}


