"use client";

import { useMemo } from "react";
import type { Project } from "../model";

type Props = {
  projects: Project[];
  filter: string;
  onPreviewSlides?: (index: number) => void;
  onDownloadSlides?: (index: number) => void;
  onPreviewAssessment?: (index: number) => void;
  onDownloadAssessment?: (index: number) => void;
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
  onNotify?: (message: string, type?: "success" | "error" | "info") => void;
};

export function ProjectList({ projects, filter, onPreviewSlides, onDownloadSlides, onPreviewAssessment, onDownloadAssessment, onEdit, onDelete, onNotify }: Props) {
  const filtered = useMemo(() => {
    const q = filter.toLowerCase();
    return projects.filter((p) => (p.name || "").toLowerCase().includes(q));
  }, [projects, filter]);

  if (filtered.length === 0) {
    return (
      <tr>
        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
          <i className="fas fa-folder-open text-4xl mb-4"></i>
          <p className="text-lg">プロジェクトがありません</p>
          <p className="text-sm">「プロジェクト作成」ボタンから新しいプロジェクトを作成してください</p>
        </td>
      </tr>
    );
  }

  return (
    <>
      {filtered.map((project, idx) => {
        const createdDate = project.createdAt ? new Date(project.createdAt).toLocaleDateString("ja-JP") : "-";
        const status = project.status === "completed" ? "完了" : "作成中";
        return (
          <tr key={(project.id || idx).toString()} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">{project.name || `プロジェクト${idx + 1}`}</div>
              <div className="text-sm text-gray-500">{status}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{createdDate}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              {project.status === "completed" ? (
                <>
                  <button className="text-blue-600 hover:text-blue-800 mr-2" onClick={() => onNotify?.("スライドプレビュー機能は開発中です", "info") || onPreviewSlides?.(idx)}>
                    <i className="fas fa-eye mr-1"></i>プレビュー
                  </button>
                  <button className="text-green-600 hover:text-green-800" onClick={() => onDownloadSlides?.(idx)}>
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
                  <button className="text-blue-600 hover:text-blue-800 mr-2" onClick={() => onNotify?.("アセスメントプレビュー機能は開発中です", "info") || onPreviewAssessment?.(idx)}>
                    <i className="fas fa-eye mr-1"></i>プレビュー
                  </button>
                  <button className="text-green-600 hover:text-green-800" onClick={() => onDownloadAssessment?.(idx)}>
                    <i className="fas fa-download mr-1"></i>ダウンロード
                  </button>
                </>
              ) : (
                <span className="text-gray-400">生成中...</span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <div className="flex flex-wrap gap-1">
                {project.status === "completed" && (
                  <button className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded border border-blue-300 hover:bg-blue-50 text-xs whitespace-nowrap" onClick={() => onEdit?.(idx)}>
                    <i className="fas fa-edit mr-1"></i>編集
                  </button>
                )}
                <button className="text-red-600 hover:text-red-800 px-2 py-1 rounded border border-red-300 hover:bg-red-50 text-xs whitespace-nowrap" onClick={() => onDelete?.(idx)}>
                  <i className="fas fa-trash mr-1"></i>削除
                </button>
              </div>
            </td>
          </tr>
        );
      })}
    </>
  );
}

export default ProjectList;


