"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function StepUpload({ onSubmit }: Props) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const formatSize = (bytes: number) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"] as const;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div id="step-1" className="step-content bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">参考資料入力</h3>
      <form id="reference-form" className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">プロジェクト名</label>
          <input name="project-name" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">参考資料</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              name="reference-file"
              type="file"
              accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
              className="hidden"
              id="reference-file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
            <div className="cursor-pointer" onClick={() => document.getElementById("reference-file")?.click()}>
              <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-600">ファイルをドラッグ&ドロップまたはクリックして選択</p>
              <p className="text-sm text-gray-400 mt-2">PDF, Word, PowerPoint, テキストファイルに対応</p>
            </div>
            {selectedFile && (
              <div className="mt-4 text-left inline-flex items-start gap-3 bg-gray-50 p-3 rounded">
                <i className="fas fa-file text-blue-600 mt-1"></i>
                <div>
                  <div className="text-gray-800 font-medium">{selectedFile.name}</div>
                  <div className="text-gray-600 text-sm">{formatSize(selectedFile.size)}</div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between pt-4">
          <button type="button" className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors" onClick={() => router.push("/")}>戻る</button>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">次へ</button>
        </div>
      </form>
    </div>
  );
}


