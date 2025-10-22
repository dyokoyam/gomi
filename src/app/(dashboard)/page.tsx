"use client";

// ダッシュボードページ
import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/widgets/AppHeader";
import { ProjectList } from "@/entities/project/ui/ProjectList";
import { getProjects, saveProjects } from "@/entities/project/api";
import type { Project } from "@/entities/project/model";
import { useRouter } from "next/navigation";
import SearchBox from "@/features/project-search/SearchBox";

type Notification = { message: string; type: "success" | "error" | "info" } | null;

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState<string>("");
  const [notification, setNotification] = useState<Notification>(null);

  const pushNotification = (message: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const deleteProject = (index: number) => {
    const filtered = projects.filter((p) => (p.name || "").toLowerCase().includes(search.toLowerCase()));
    const project = filtered[index];
    if (!project) return;
    if (typeof window !== "undefined" && window.confirm(`「${project.name}」を削除しますか？\nこの操作は取り消せません。`)) {
      const updated = projects.filter((p) => p !== project);
      setProjects(updated);
      saveProjects(updated);
      pushNotification("プロジェクトを削除しました", "success");
    }
  };

  const downloadSlides = (index: number) => {
    const filtered = projects.filter((p) => (p.name || "").toLowerCase().includes(search.toLowerCase()));
    const project = filtered[index];
    if (!project) return;
    pushNotification(`「${project.name}」のスライドをダウンロード中...`, "info");
    setTimeout(() => pushNotification("スライドのダウンロードが完了しました", "success"), 2000);
  };

  const downloadAssessment = (index: number) => {
    const filtered = projects.filter((p) => (p.name || "").toLowerCase().includes(search.toLowerCase()));
    const project = filtered[index];
    if (!project) return;
    pushNotification(`「${project.name}」のアセスメントをダウンロード中...`, "info");
    setTimeout(() => pushNotification("アセスメントのダウンロードが完了しました", "success"), 2000);
  };

  return (
    <div id="app" className="container mx-auto p-6">
      <AppHeader
        title="教材一覧"
        onShowAdmin={() => router.push("/admin")}
        onShowSettings={() => router.push("/settings")}
        onStartNewProject={() => router.push("/projects/new")}
      />

      <div id="home-screen" className="screen">
        <div className="mb-4">
          <div className="flex items-center space-x-3">
            <SearchBox value={search} onChange={setSearch} />
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
            <tbody id="projects-table" className="bg-white divide-y divide-gray-200">
              <ProjectList
                projects={projects}
                filter={search}
                onPreviewSlides={() => pushNotification("スライドプレビュー機能は開発中です", "info")}
                onDownloadSlides={downloadSlides}
                onPreviewAssessment={() => pushNotification("アセスメントプレビュー機能は開発中です", "info")}
                onDownloadAssessment={downloadAssessment}
                onEdit={(idx) => {
                  const filtered = projects.filter((p) => (p.name || "").toLowerCase().includes(search.toLowerCase()));
                  const project = filtered[idx];
                  if (!project) return;
                  const idOrIndex = project.id || String(projects.indexOf(project));
                  router.push(`/projects/new?source=${encodeURIComponent(idOrIndex)}&step=4`);
                }}
                onDelete={deleteProject}
                onNotify={pushNotification}
              />
            </tbody>
          </table>
        </div>
      </div>

      {notification && (
        <div
          id="notification"
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            notification.type === "error"
              ? "bg-red-500 text-white"
              : notification.type === "info"
              ? "bg-blue-500 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          <span id="notification-text">{notification.message}</span>
        </div>
      )}
    </div>
  );
}

