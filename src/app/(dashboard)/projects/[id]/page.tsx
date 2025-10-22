"use client";

// 詳細ページ (プレビュー、再生成、削除)
import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProjects, saveProjects } from "@/entities/project/api";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const projects = getProjects();
  const project = useMemo(() => projects.find((p, i) => (p.id || String(i)) === params.id) || null, [projects, params.id]);

  if (!project) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-gray-600">プロジェクトが見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{project.name}</h2>
        <p className="text-gray-600">{project.status === "completed" ? "完了" : "作成中"}</p>
      </div>

      <div className="flex gap-3 mb-6">
        <button className="text-blue-600 hover:text-blue-800" onClick={() => router.push(`./${params.id}/preview/slides`)}>
          <i className="fas fa-eye mr-1"></i>スライドプレビュー
        </button>
        <button className="text-blue-600 hover:text-blue-800" onClick={() => router.push(`./${params.id}/preview/assessment`)}>
          <i className="fas fa-eye mr-1"></i>アセスメントプレビュー
        </button>
        <button className="text-red-600 hover:text-red-800" onClick={() => {
          if (typeof window !== "undefined" && window.confirm("このプロジェクトを削除しますか？")) {
            const next = projects.filter((p) => p !== project);
            saveProjects(next);
            router.push("/");
          }
        }}>
          <i className="fas fa-trash mr-1"></i>削除
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-700">テンプレート: {project.template || "-"}</p>
        <p className="text-gray-700">ページ数: {project.pageCount || "-"}</p>
        <p className="text-gray-700">目的: {project.slidePurpose || "-"}</p>
      </div>
    </div>
  );
}

