"use client";

// 管理者ページ (ユーザー一覧＋プロンプト編集導線)
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getCompanies, saveCompanies } from "@/entities/user/api";
import type { Company } from "@/entities/user/model";
import UserRow from "@/entities/user/ui/UserRow";
import AppHeader from "@/widgets/AppHeader";
import { getProjects } from "@/entities/project/api";

export default function AdminPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const projects = getProjects();
  const [activeTab, setActiveTab] = useState<"users" | "materials">("users");

  const pushNotification = (message: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    setCompanies(getCompanies());
  }, []);

  const deleteUser = (index: number) => {
    const company = companies[index];
    if (typeof window !== "undefined" && window.confirm(`「${company.company_name}」を削除しますか？\nこの操作は取り消せません。`)) {
      const updated = companies.filter((_, i) => i !== index);
      setCompanies(updated);
      saveCompanies(updated);
      pushNotification("ユーザーを削除しました", "success");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <AppHeader
        title="管理画面"
        onShowAdmin={() => router.push("/admin")}
        onShowSettings={() => router.push("/settings")}
        onStartNewProject={() => router.push("/projects/new")}
      />
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button id="admin-users-tab" className={`px-6 py-2 rounded-lg transition-colors ${activeTab === "users" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-600 text-white hover:bg-gray-700"}`} onClick={() => setActiveTab("users")}>ユーザー管理</button>
            <button id="admin-materials-tab" className={`px-6 py-2 rounded-lg transition-colors ${activeTab === "materials" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-600 text-white hover:bg-gray-700"}`} onClick={() => setActiveTab("materials")}>教材管理</button>
          </div>
          <div className="flex space-x-3">
            <button id="add-user-btn" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors" onClick={() => router.push("/admin/users/new")}><i className="fas fa-user-plus mr-2"></i>ユーザー追加</button>
            <button id="back-to-home-admin" className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors" onClick={() => router.push("/")}>戻る</button>
          </div>
        </div>
      </div>

      {activeTab === "users" && (
      <div id="admin-users-content" className="admin-tab-content">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">ユーザー一覧</h3>
              <p className="text-sm text-gray-500 mt-1"><i className="fas fa-info-circle mr-1"></i>行をクリックで教材一覧を表示</p>
            </div>
            <div className="flex items-center space-x-3">
              <input type="text" id="user-search" placeholder="会社名で検索..." className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => {
                const term = e.target.value.toLowerCase();
                setCompanies((prev) => prev.slice().sort((a, b) => {
                  const am = a.company_name.toLowerCase().includes(term) ? 0 : 1;
                  const bm = b.company_name.toLowerCase().includes(term) ? 0 : 1;
                  return am - bm;
                }));
              }} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">会社ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">会社名</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">メールアドレス</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">購入クレジット数</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">登録日</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody id="users-table" className="bg-white divide-y divide-gray-200">
                {companies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      <i className="fas fa-users text-4xl mb-4"></i>
                      <p className="text-lg">ユーザーがありません</p>
                      <p className="text-sm">「ユーザー追加」ボタンから新しいユーザーを登録してください</p>
                    </td>
                  </tr>
                ) : (
                  companies.map((c, i) => (
                    <UserRow
                      key={c.id}
                      company={c}
                      onEdit={() => router.push(`/admin/users/${c.id}`)}
                      onDelete={() => deleteUser(i)}
                      onRowClick={() => router.push(`/admin/users/${c.id}/materials`)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}

      {/* 教材管理タブ */}
      {activeTab === "materials" && (
      <div id="admin-materials-content" className="admin-tab-content">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">全ユーザーの教材一覧</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">プロジェクト名</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">会社名</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作成者</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作成日時</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody id="all-materials-table" className="bg-white divide-y divide-gray-200">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      <i className="fas fa-folder-open text-4xl mb-4"></i>
                      <p className="text-lg">教材がありません</p>
                      <p className="text-sm">まだ教材が作成されていません</p>
                    </td>
                  </tr>
                ) : (
                  projects.map((p, i) => {
                    const company = companies.find((c) => c.id === p.company_id);
                    const createdDate = p.createdAt ? new Date(p.createdAt).toLocaleDateString("ja-JP") : "-";
                    const status = p.status === "completed" ? "完了" : "作成中";
                    return (
                      <tr key={(p.id || i).toString()} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{p.name || `プロジェクト${i + 1}`}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{company?.company_name || "不明"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{company?.contact_name || "不明"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{createdDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${p.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{status}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex flex-wrap gap-1">
                            <button className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded border border-blue-300 hover:bg-blue-50 text-xs whitespace-nowrap" onClick={() => p.company_id && router.push(`/admin/users/${p.company_id}/materials`)}>
                              <i className="fas fa-folder mr-1"></i>教材一覧
                            </button>
                            <button className="text-red-600 hover:text-red-800 px-2 py-1 rounded border border-red-300 hover:bg-red-50 text-xs whitespace-nowrap" onClick={() => {/* 省略: 管理からの削除は別要件 */}}>
                              <i className="fas fa-trash mr-1"></i>削除
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}

      {notification && (
        <div id="notification" className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${notification.type === "error" ? "bg-red-500 text-white" : notification.type === "info" ? "bg-blue-500 text-white" : "bg-green-500 text-white"}`}>
          <span id="notification-text">{notification.message}</span>
        </div>
      )}
    </div>
  );
}

