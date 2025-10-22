"use client";

type Props = {
  onUploaded?: (file: File) => void;
};

export default function TemplateUpload({ onUploaded }: Props) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <input type="file" id="template-upload" accept=".pptx,.ppt" className="hidden" onChange={(e) => {
        const f = e.target.files?.[0];
        if (f) onUploaded?.(f);
      }} />
      <div className="cursor-pointer" onClick={() => document.getElementById("template-upload")?.click()}>
        <i className="fas fa-upload text-3xl text-gray-400 mb-2"></i>
        <p className="text-gray-600">PowerPointテンプレートをアップロード</p>
        <p className="text-sm text-gray-400">(.pptx, .ppt形式)</p>
      </div>
    </div>
  );
}


