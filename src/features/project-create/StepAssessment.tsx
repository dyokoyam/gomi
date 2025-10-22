"use client";

import type { AssessmentQuestion } from "@/entities/project/model";
import AssessmentEditor from "@/entities/assessment/ui/AssessmentEditor";

type Props = {
  assessment: AssessmentQuestion[];
  onChange: (next: AssessmentQuestion[]) => void;
  onBack: () => void;
  onConfirm: () => void;
};

export default function StepAssessment({ assessment, onChange, onBack, onConfirm }: Props) {
  return (
    <div id="step-2" className="step-content bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">アセスメント内容の修正</h3>
      <AssessmentEditor questions={assessment} onChange={onChange} />
      <div className="flex justify-between pt-4">
        <button type="button" className="step-back bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors" onClick={onBack}>戻る</button>
        <button type="button" id="confirm-assessment" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors" onClick={onConfirm}>アセスメント確定</button>
      </div>
    </div>
  );
}


