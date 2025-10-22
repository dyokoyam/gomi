"use client";

import { useCallback } from "react";

type Props = {
  accept?: string;
  onFile?: (file: File) => void;
};

export default function FileDropzone({ accept, onFile }: Props) {
  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) onFile?.(f);
  }, [onFile]);

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center" onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
      <input type="file" accept={accept} className="hidden" id="drop-file-input" onChange={(e) => {
        const f = e.target.files?.[0];
        if (f) onFile?.(f);
      }} />
      <div className="cursor-pointer" onClick={() => document.getElementById("drop-file-input")?.click()}>
        <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
        <p className="text-gray-600">ファイルをドラッグ&ドロップまたはクリックして選択</p>
        {accept && <p className="text-sm text-gray-400 mt-2">対応形式: {accept}</p>}
      </div>
    </div>
  );
}


