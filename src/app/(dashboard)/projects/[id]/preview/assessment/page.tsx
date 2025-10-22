"use client";

// アセスメントプレビューページ (FR-006/025)
import { useParams } from "next/navigation";
import { getProjects } from "@/entities/project/api";

export default function AssessmentPreviewPage() {
  const params = useParams<{ id: string }>();
  const projects = getProjects();
  const idx = projects.findIndex((p, i) => (p.id || String(i)) === params.id);
  const project = idx >= 0 ? projects[idx] : null;
  if (!project) return <div className="container mx-auto p-6">プロジェクトが見つかりません。</div>;
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">アセスメントプレビュー</h2>
      <div className="space-y-4">
        {(project.assessment || []).map((q, i) => (
          <div key={q.id} className="border p-4 rounded bg-white">
            <div className="font-semibold mb-2">問題 {i + 1}</div>
            <div className="text-gray-800 mb-2">{q.question}</div>
            {q.type === "multiple-choice" ? (
              <ul className="list-disc ml-6 text-gray-700">
                {(q.options || []).map((opt, idx) => (
                  <li key={idx}>{opt}{idx === q.correct ? "（正解）" : ""}</li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-600">記述式</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

