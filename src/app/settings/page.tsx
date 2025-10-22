"use client";

// 設定ページ (テンプレ登録/クレジット残高 FR-002,027-029,019)
import { useRouter } from "next/navigation";
import AppHeader from "@/widgets/AppHeader";
export default function SettingsPage() {
  const router = useRouter();
  return (
    <div id="settings-screen" className="screen container mx-auto p-6">
      <AppHeader
        title="設定"
        onShowAdmin={() => router.push("/admin")}
        onShowSettings={() => router.push("/settings")}
        onStartNewProject={() => router.push("/projects/new")}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4"><i className="fas fa-palette mr-2"></i>カスタムテンプレート</h3>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input type="file" id="template-upload" accept=".pptx,.ppt" className="hidden" />
              <div className="cursor-pointer" onClick={() => document.getElementById("template-upload")?.click()}>
                <i className="fas fa-upload text-3xl text-gray-400 mb-2"></i>
                <p className="text-gray-600">PowerPointテンプレートをアップロード</p>
                <p className="text-sm text-gray-400">(.pptx, .ppt形式)</p>
              </div>
            </div>
            <div id="custom-templates" className="space-y-2"></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4"><i className="fas fa-coins mr-2"></i>クレジット残高</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2" id="credit-amount">1,250</div>
            <p className="text-gray-600 mb-4">クレジット</p>
            <div className="bg-blue-50 rounded-lg p-4 mb-4 text-left">
              <h4 className="font-semibold text-gray-800 mb-2">料金体系</h4>
              <div className="flex justify-between"><span className="text-gray-600">スライド生成:</span><span className="font-medium">1枚あたり 1クレジット</span></div>
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"><i className="fas fa-credit-card mr-2"></i>クレジットを購入</button>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <a href="/" id="back-to-home-settings" className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">ホームに戻る</a>
      </div>
    </div>
  );
}

