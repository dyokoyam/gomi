"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import AppHeader from "@/widgets/AppHeader";
import { getCompanies } from "@/entities/user/api";
import { getProjects } from "@/entities/project/api";

export default function AdminUserMaterialsPage() {
  const router = useRouter();
  const params = useParams<{ userId: string }>();
  const companies = getCompanies();
  const projects = getProjects();
  const company = useMemo(() => companies.find((c) => c.id === params.userId) || null, [companies, params.userId]);
  const userProjects = useMemo(() => projects.filter((p) => p.company_id === params.userId), [projects, params.userId]);

  return (
    <div className="container mx-auto p-6">
      <AppHeader
        title="ユーザー教材一覧"
        onShowAdmin={() => router.push("/admin")}
        onShowSettings={() => router.push("/settings")}
        onStartNewProject={() => router.push("/projects/new")}
      />

      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 id="user-materials-title" className="text-2xl font-bold text-gray-800">{company ? `${company.company_name}の教材一覧` : "ユーザー教材一覧"}</h2>
            <p id="user-materials-subtitle" className="text-gray-600 mt-1">{company ? `担当者: ${company.contact_name}` : "会社情報が見つかりません"}</p>
          </div>
          <button id="back-to-admin" className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors" onClick={() => router.push("/admin")}>
            管理画面に戻る
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">プロジェクト名</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作成日時</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ノート付きスライド</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">アセスメント</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody id="user-materials-table" className="bg-white divide-y divide-gray-200">
            {userProjects.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  <i className="fas fa-folder-open text-4xl mb-4"></i>
                  <p className="text-lg">教材がありません</p>
                  <p className="text-sm">このユーザーはまだ教材を作成していません</p>
                </td>
              </tr>
            ) : (
              userProjects.map((project, index) => {
                const createdDate = project.createdAt ? new Date(project.createdAt).toLocaleDateString("ja-JP") : "-";
                const status = project.status === "completed" ? "完了" : "作成中";
                return (
                  <tr key={(project.id || index).toString()} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{project.name || `プロジェクト${index + 1}`}</div>
                      <div className="text-sm text-gray-500">{status}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{createdDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {project.status === "completed" ? (
                        <>
                          <button className="text-blue-600 hover:text-blue-800 mr-2" onClick={() => router.push(`/projects/${project.id || String(index)}/preview/slides`)}>
                            <i className="fas fa-eye mr-1"></i>プレビュー
                          </button>
                          <button className="text-green-600 hover:text-green-800" onClick={() => {/* ダウンロードは現行のinfo通知仕様に合わせて省略 */}}>
                            <i className="fas fa-download mr-1"></i>ダウンロード
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-400">生成中...</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {project.status === "completed" ? (
                        <>
                          <button className="text-blue-600 hover:text-blue-800 mr-2" onClick={() => router.push(`/projects/${project.id || String(index)}/preview/assessment`)}>
                            <i className="fas fa-eye mr-1"></i>プレビュー
                          </button>
                          <button className="text-green-600 hover:text-green-800" onClick={() => {/* ダウンロードは現行のinfo通知仕様に合わせて省略 */}}>
                            <i className="fas fa-download mr-1"></i>ダウンロード
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-400">生成中...</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-red-600 hover:text-red-800 px-2 py-1 rounded border border-red-300 hover:bg-red-50 text-xs whitespace-nowrap" onClick={() => {/* 削除は別要件 */}}>
                        <i className="fas fa-trash mr-1"></i>削除
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


