"use client";

// スライドページ (FR-020~024 骨子編集含む)
import Wizard from "@/features/project-create/Wizard";
import { useRouter } from "next/navigation";
import AppHeader from "@/widgets/AppHeader";

export default function SlidesPage() {
  const router = useRouter();
  return (
    <div className="container mx-auto p-6">
      <AppHeader
        title="プロジェクト作成"
        onShowAdmin={() => router.push("/admin")}
        onShowSettings={() => router.push("/settings")}
        onStartNewProject={() => router.push("/projects/new")}
      />
      <Wizard initialStep={4} />
    </div>
  );
}
