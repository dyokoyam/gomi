"use client";

// スライドページ (FR-020~024 骨子編集含む)
import Wizard from "@/features/project-create/Wizard";

export default function SlidesPage() {
  return (
    <div className="container mx-auto p-6">
      <Wizard initialStep={4} />
    </div>
  );
}
