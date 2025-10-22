"use client";

// アセスメントページ (FR-015~019)
import Wizard from "@/features/project-create/Wizard";

export default function AssessmentPage() {
  return (
    <div className="container mx-auto p-6">
      <Wizard initialStep={2} />
    </div>
  );
}
