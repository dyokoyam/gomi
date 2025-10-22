"use client";

// スライドプレビューページ (FR-004/024)
import { useParams } from "next/navigation";
import { getProjects } from "@/entities/project/api";
import { useRouter } from "next/navigation";
import AppHeader from "@/widgets/AppHeader";

export default function SlidePreviewPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const projects = getProjects();
  const idx = projects.findIndex((p, i) => (p.id || String(i)) === params.id);
  const project = idx >= 0 ? projects[idx] : null;
  if (!project) return <div className="container mx-auto p-6">プロジェクトが見つかりません。</div>;
  return (
    <div className="container mx-auto p-6">
      <AppHeader
        title="スライドプレビュー"
        onShowAdmin={() => router.push("/admin")}
        onShowSettings={() => router.push("/settings")}
        onStartNewProject={() => router.push("/projects/new")}
      />
      <h2 className="text-2xl font-bold mb-4">スライドプレビュー</h2>
      <div className="space-y-4">
        {(project.outline || []).map((s, i) => (
          <div key={i} className="border p-4 rounded bg-white">
            <div className="font-semibold mb-2">ページ {s.pageNumber}: {s.title}</div>
            <div className="text-gray-700 whitespace-pre-wrap">{s.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

