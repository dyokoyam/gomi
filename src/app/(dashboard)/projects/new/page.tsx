"use client";

// ステッパー/ウィザードの親ページ
import Wizard from "@/features/project-create/Wizard";
import { useRouter } from "next/navigation";
import AppHeader from "@/widgets/AppHeader";

export default function NewProjectPage() {
  const router = useRouter();
  return (
    <div className="container mx-auto p-6">
      <AppHeader
        title="プロジェクト作成"
        onShowAdmin={() => router.push("/admin")}
        onShowSettings={() => router.push("/settings")}
        onStartNewProject={() => router.push("/projects/new")}
      />
      <Wizard />
    </div>
  );
}
