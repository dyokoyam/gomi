"use client";

// 独自プロンプト編集UIページ
import { useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/widgets/AppHeader";

export default function PromptEditorPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const pushNotification = (message: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <AppHeader
        title="管理画面"
        onShowAdmin={() => router.push("/admin")}
        onShowSettings={() => router.push("/settings")}
        onStartNewProject={() => router.push("/projects/new")}
      />
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">独自プロンプト編集</h3>
        <textarea rows={10} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="生成プロンプトを入力してください" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <div className="mt-4 flex justify-end">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors" onClick={() => pushNotification("プロンプトを保存しました", "success")}>保存</button>
        </div>
      </div>

      {notification && (
        <div id="notification" className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${notification.type === "error" ? "bg-red-500 text-white" : notification.type === "info" ? "bg-blue-500 text-white" : "bg-green-500 text-white"}`}>
          <span id="notification-text">{notification.message}</span>
        </div>
      )}
    </div>
  );
}
