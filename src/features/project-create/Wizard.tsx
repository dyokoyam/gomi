"use client";

import { useEffect, useMemo, useState } from "react";
import type { Project, AssessmentQuestion, SlideOutline } from "@/entities/project/model";
import { addProject } from "@/entities/project/api";
import Stepper from "@/widgets/Stepper";
import StepUpload from "@/features/project-create/StepUpload";
import StepAssessment from "@/features/project-create/StepAssessment";
import StepOutline from "@/features/project-create/StepOutline";
import StepGenerateSlides from "@/features/project-create/StepGenerateSlides";

type WizardProps = {
  initialStep?: number;
};

export default function Wizard({ initialStep = 1 }: WizardProps) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [currentProject, setCurrentProject] = useState<Project>({});
  const [selectedPageCount, setSelectedPageCount] = useState<number>(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [progressText, setProgressText] = useState<string>("スライドを作成しています...");
  const [generationDone, setGenerationDone] = useState<boolean>(false);

  const pushNotification = (message: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const titles = useMemo(
    () => ["参考資料入力", "アセスメント修正", "スライド設定", "骨子編集", "生成完了"],
    []
  );

  const nextStep = () => setCurrentStep((s) => Math.min(5, s + 1));
  const previousStep = () => setCurrentStep((s) => Math.max(1, s - 1));

  // Step1: 参考資料 submit → サンプルアセスメント生成
  const handleReferenceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("project-name") || "").trim();
    const file = formData.get("reference-file") as File | null;
    if (!name || !file) {
      pushNotification("プロジェクト名と参考資料ファイルを入力してください", "error");
      return;
    }
    const project: Project = { ...currentProject, name, createdAt: new Date().toISOString(), referenceFile: file };
    setCurrentProject(project);
    await generateAssessment(project);
    nextStep();
  };

  const generateAssessment = async (_project: Project) => {
    const sampleQuestions: AssessmentQuestion[] = [
      {
        id: 1,
        question: "この資料の主要なテーマは何ですか？",
        type: "multiple-choice",
        options: ["テーマA：基礎知識の習得", "テーマB：実践的スキル", "テーマC：理論的理解", "テーマD：応用力の向上"],
        correct: 0,
        points: 5,
        correctComment: "正解です！主要なテーマを正しく理解されています。",
        incorrectComment: "惜しい！資料をもう一度確認してテーマを整理してみましょう。",
      },
      {
        id: 2,
        question: "重要なポイントを3つ挙げてください。",
        type: "essay",
        points: 10,
        correctComment: "詳細な回答をありがとうございます。",
        incorrectComment: "もう少し具体的に説明してください。",
      },
      {
        id: 3,
        question: "次の記述で正しいものはどれですか？",
        type: "multiple-choice",
        options: ["記述1：基本概念の説明", "記述2：応用例の紹介", "記述3：実践方法の解説", "記述4：注意点の明示"],
        correct: 2,
        points: 5,
        correctComment: "素晴らしい！正しい記述を選択できました。",
        incorrectComment: "残念！各記述の内容をもう一度確認してください。",
      },
    ];
    setCurrentProject((p) => ({ ...p, assessment: sampleQuestions }));
  };

  const updateQuestion = (id: number, patch: Partial<AssessmentQuestion>) => {
    setCurrentProject((p) => ({
      ...p,
      assessment: (p.assessment || []).map((q) => (q.id === id ? { ...q, ...patch } : q)),
    }));
  };

  const confirmSlideSettings = () => {
    const purpose = (document.getElementById("slide-purpose") as HTMLTextAreaElement)?.value || "";
    if (!purpose || !selectedPageCount || !selectedTemplate) {
      pushNotification("すべての項目を入力・選択してください", "error");
      return;
    }
    const project = { ...currentProject, slidePurpose: purpose, pageCount: selectedPageCount, template: selectedTemplate };
    setCurrentProject(project);
    generateSlideOutline(project);
    nextStep();
  };

  const generateSlideOutline = (project: Project) => {
    const outline: SlideOutline[] = [];
    for (let i = 1; i <= (project.pageCount || 0); i++) {
      outline.push({
        pageNumber: i,
        title: i === 1 ? "タイトルスライド" : `スライド ${i}`,
        content: i === 1 ? "プレゼンテーションのタイトルと概要" : `ページ ${i} の内容を記載`,
        notes: `ページ ${i} の発表者ノート`,
      });
    }
    setCurrentProject((p) => ({ ...p, outline }));
  };

  const updateSlideContent = (index: number, content: string) => {
    setCurrentProject((p) => ({
      ...p,
      outline: (p.outline || []).map((s, i) => (i === index ? { ...s, content } : s)),
    }));
  };

  const generateSlides = async () => {
    nextStep();
    const steps = [
      { text: "スライドを作成しています...", progress: 20 },
      { text: "ノートを生成しています...", progress: 50 },
      { text: "スライドにノートを埋め込んでいます...", progress: 80 },
      { text: "最終処理中...", progress: 100 },
    ];
    for (const s of steps) {
      setProgressText(s.text);
      setProgress(s.progress);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 1000));
    }
    const completed: Project = { ...currentProject, status: "completed", completedAt: new Date().toISOString() };
    setCurrentProject(completed);
    addProject(completed);
    setGenerationDone(true);
    pushNotification("スライドとアセスメントの生成が完了しました！", "success");
  };

  useEffect(() => {
    // 初期ロード: ステップ指定がある場合は反映
    setCurrentStep(initialStep);
  }, [initialStep]);

  return (
    <div id="new-project-screen" className="screen">
      <Stepper currentStep={currentStep} titles={titles} />

      {currentStep === 1 && <StepUpload onSubmit={handleReferenceSubmit} />}

      {currentStep === 2 && (
        <StepAssessment
          assessment={currentProject.assessment || []}
          onChange={(next) => setCurrentProject((p) => ({ ...p, assessment: next }))}
          onBack={previousStep}
          onConfirm={nextStep}
        />
      )}

      {currentStep === 3 && (
        <div id="step-3" className="step-content bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">スライド設定</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">スライドの目的・用途</label>
              <textarea id="slide-purpose" placeholder="例：新入社員研修用の基礎知識習得スライド" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ページ数</label>
              <div className="grid grid-cols-4 gap-3">
                {[10, 15, 20, 25].map((n) => (
                  <button key={n} type="button" className={`page-count-btn border-2 rounded-lg p-3 text-center transition-colors ${selectedPageCount === n ? "border-blue-500 bg-blue-50" : "border-gray-300"}`} onClick={() => setSelectedPageCount(n)}>
                    <div className="text-2xl font-bold text-gray-700">{n}</div>
                    <div className="text-sm text-gray-500">ページ</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">テンプレート選択</label>
              <div className="grid grid-cols-2 gap-4">
                {["business", "education", "creative", "minimal"].map((t) => (
                  <div key={t} className={`template-option cursor-pointer ${selectedTemplate === t ? "ring-2 ring-blue-500" : ""}`} onClick={() => setSelectedTemplate(t)}>
                    <div className={`slide-template ${t}`}>
                      <i className={`fas ${t === "business" ? "fa-briefcase" : t === "education" ? "fa-graduation-cap" : t === "creative" ? "fa-palette" : "fa-circle"} text-3xl mb-2`}></i>
                      <h4 className="font-bold">{t === "business" ? "ビジネス" : t === "education" ? "教育" : t === "creative" ? "クリエイティブ" : "ミニマル"}</h4>
                      <p className="text-sm opacity-90">{t === "business" ? "プロフェッショナル向け" : t === "education" ? "学習・研修向け" : t === "creative" ? "創造性重視" : "シンプルデザイン"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between pt-6">
            <button type="button" className="step-back bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors" onClick={previousStep}>戻る</button>
            <button type="button" id="confirm-slide-settings" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors" onClick={confirmSlideSettings}>設定確定</button>
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <StepOutline
          outline={currentProject.outline || []}
          onChange={(next) => setCurrentProject((p) => ({ ...p, outline: next }))}
          onBack={previousStep}
          onGenerate={generateSlides}
        />
      )}

      {currentStep === 5 && (
        <StepGenerateSlides
          progress={progress}
          progressText={progressText}
          done={generationDone}
          onDownloadSlides={() => pushNotification("スライドのダウンロードが完了しました", "success")}
          onDownloadAssessment={() => pushNotification("アセスメントのダウンロードが完了しました", "success")}
        />
      )}

      {notification && (
        <div id="notification" className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${notification.type === "error" ? "bg-red-500 text-white" : notification.type === "info" ? "bg-blue-500 text-white" : "bg-green-500 text-white"}`}>
          <span id="notification-text">{notification.message}</span>
        </div>
      )}
    </div>
  );
}


