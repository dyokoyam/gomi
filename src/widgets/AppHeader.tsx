"use client";

type Props = {
  title: string;
  onShowAdmin?: () => void;
  onShowSettings?: () => void;
  onStartNewProject?: () => void;
};

export function AppHeader({ title, onShowAdmin, onShowSettings, onStartNewProject }: Props) {
  return (
    <header className="flex justify-between items-center mb-8">
      <h1 id="page-title" className="text-3xl font-bold text-gray-800">{title}</h1>
      <div className="flex space-x-3">
        <button id="admin-btn" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors" onClick={onShowAdmin}>
          <i className="fas fa-users-cog mr-2"></i>管理画面
        </button>
        <button id="settings-btn" className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors" onClick={onShowSettings}>
          <i className="fas fa-cog mr-2"></i>設定
        </button>
        <button id="new-project-btn" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" onClick={onStartNewProject}>
          <i className="fas fa-plus mr-2"></i>プロジェクト作成
        </button>
      </div>
    </header>
  );
}

export default AppHeader;


