"use client";

import type { AssessmentQuestion } from "@/entities/project/model";

type Props = {
  questions: AssessmentQuestion[];
  onChange: (next: AssessmentQuestion[]) => void;
};

export default function AssessmentEditor({ questions, onChange }: Props) {
  const update = (id: number, patch: Partial<AssessmentQuestion>) => {
    const next = questions.map((q) => (q.id === id ? { ...q, ...patch } : q));
    onChange(next);
  };
  return (
    <div id="assessment-questions" className="space-y-4">
      {questions.map((q, index) => (
        <div key={q.id} className="question-card">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-semibold text-gray-800">問題 {index + 1}</h4>
            <span className="text-sm text-gray-500">{q.type === "multiple-choice" ? "選択式" : "記述式"}</span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">問題文</label>
              <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none" rows={3} defaultValue={q.question} onChange={(e) => update(q.id, { question: e.target.value })}></textarea>
            </div>
            {q.type === "multiple-choice" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">選択肢（正解にチェックを入れてください）</label>
                {(q.options || []).map((opt, i) => (
                  <div key={i} className="flex items-center space-x-2 mt-2">
                    <input type="radio" name={`q${q.id}`} value={i} defaultChecked={i === q.correct} className="text-blue-600" onChange={() => update(q.id, { correct: i })} />
                    <input type="text" defaultValue={opt} className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm" onChange={(e) => {
                      const next = [...(q.options || [])];
                      next[i] = e.target.value;
                      update(q.id, { options: next });
                    }} />
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">配点</label>
                <input type="number" defaultValue={q.points} min={1} max={100} className="w-full px-2 py-1 border border-gray-300 rounded" onChange={(e) => update(q.id, { points: parseInt(e.target.value, 10) })} />点
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">正解時のコメント</label>
              <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none" rows={2} defaultValue={q.correctComment || ""} onChange={(e) => update(q.id, { correctComment: e.target.value })}></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">不正解時のコメント</label>
              <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none" rows={2} defaultValue={q.incorrectComment || ""} onChange={(e) => update(q.id, { incorrectComment: e.target.value })}></textarea>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


