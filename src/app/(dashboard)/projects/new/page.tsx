"use client";

// ステッパー/ウィザードの親ページ
import Wizard from "@/features/project-create/Wizard";

export default function NewProjectPage() {
  return (
    <div className="container mx-auto p-6">
      <Wizard />
    </div>
  );
}
