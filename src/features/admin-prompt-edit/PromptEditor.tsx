"use client";

import { useState } from "react";

export default function PromptEditor() {
  const [prompt, setPrompt] = useState("");
  const [saved, setSaved] = useState(false);
  return (
    <div>
      <textarea rows={10} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="生成プロンプトを入力してください" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <div className="mt-4 flex justify-end">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors" onClick={() => setSaved(true)}>保存</button>
      </div>
      {saved && <div className="text-green-600 mt-2">保存しました。</div>}
    </div>
  );
}


