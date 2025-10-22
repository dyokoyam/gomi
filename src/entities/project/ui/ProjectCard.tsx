"use client";

import type { Project } from "../model";

type Props = {
  project: Project;
  onPreviewSlides?: () => void;
  onDownloadSlides?: () => void;
  onPreviewAssessment?: () => void;
  onDownloadAssessment?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function ProjectCard({ project, onPreviewSlides, onDownloadSlides, onPreviewAssessment, onDownloadAssessment, onEdit, onDelete }: Props) {
  const createdDate = project.createdAt ? new Date(project.createdAt).toLocaleDateString("ja-JP") : "-";
  const status = project.status === "completed" ? "完了" : "作成中";
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm font-medium text-gray-900">{project.name || "無題"}</div>
          <div className="text-sm text-gray-500">{status}・{createdDate}</div>
        </div>
        <div className="flex gap-2">
          {project.status === "completed" && (
            <button className="text-blue-600 hover:text-blue-800 text-sm" onClick={onEdit}><i className="fas fa-edit mr-1"></i>編集</button>
          )}
          <button className="text-red-600 hover:text-red-800 text-sm" onClick={onDelete}><i className="fas fa-trash mr-1"></i>削除</button>
        </div>
      </div>
      <div className="mt-3 flex gap-3">
        {project.status === "completed" ? (
          <>
            <button className="text-blue-600 hover:text-blue-800 text-sm" onClick={onPreviewSlides}><i className="fas fa-eye mr-1"></i>スライド</button>
            <button className="text-green-600 hover:text-green-800 text-sm" onClick={onDownloadSlides}><i className="fas fa-download mr-1"></i>スライドDL</button>
            <button className="text-blue-600 hover:text-blue-800 text-sm" onClick={onPreviewAssessment}><i className="fas fa-eye mr-1"></i>アセスメント</button>
            <button className="text-green-600 hover:text-green-800 text-sm" onClick={onDownloadAssessment}><i className="fas fa-download mr-1"></i>アセスメントDL</button>
          </>
        ) : (
          <span className="text-gray-400 text-sm">生成中...</span>
        )}
      </div>
    </div>
  );
}


