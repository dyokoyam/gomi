"use client";

import { useEffect, useMemo, useState } from "react";

type AssessmentQuestion = {
  id: number;
  question: string;
  type: "multiple-choice" | "essay";
  options?: string[];
  correct?: number;
  points: number;
  correctComment?: string;
  incorrectComment?: string;
};

type SlideOutline = {
  pageNumber: number;
  title: string;
  content: string;
  notes: string;
};

type Project = {
  id?: string;
  company_id?: string;
  name?: string;
  referenceFile?: File;
  reference_file_name?: string;
  createdAt?: string | Date;
  completedAt?: string | Date;
  status?: "creating" | "completed" | "error";
  slidePurpose?: string;
  pageCount?: number;
  template?: string;
  assessment?: AssessmentQuestion[];
  outline?: SlideOutline[];
  slideCount?: number;
};

type Company = {
  id: string;
  company_id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  credits_purchased: number;
  credits_used: number;
  notes?: string;
  status: "active" | "inactive" | "suspended";
  created_at: string | Date;
  updated_at: string | Date;
};

type Screen = "home" | "new-project" | "settings" | "admin" | "user-form" | "user-materials";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [currentProject, setCurrentProject] = useState<Project>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [selectedPageCount, setSelectedPageCount] = useState<number>(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentEditingUser, setCurrentEditingUser] = useState<Company | null>(null);
  const [currentViewingUser, setCurrentViewingUser] = useState<Company | null>(null);
  const [search, setSearch] = useState<string>("");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // 初期ロード
  useEffect(() => {
    const savedProjects = typeof window !== "undefined" ? localStorage.getItem("educationMaterialProjects") : null;
    const parsedProjects: Project[] = savedProjects ? JSON.parse(savedProjects) : [];
    if (parsedProjects.length === 0 && !savedProjects) {
      const samples: Project[] = [
        { name: "サンプルプロジェクト1", createdAt: new Date("2024-01-15").toISOString(), status: "completed", slideCount: 15, template: "business" },
        { name: "サンプルプロジェクト2", createdAt: new Date("2024-02-10").toISOString(), status: "completed", slideCount: 20, template: "education" }
      ];
      localStorage.setItem("educationMaterialProjects", JSON.stringify(samples));
      setProjects(samples);
    } else {
      setProjects(parsedProjects);
    }

    const savedCompanies = typeof window !== "undefined" ? localStorage.getItem("educationMaterialCompanies") : null;
    const parsedCompanies: Company[] = savedCompanies ? JSON.parse(savedCompanies) : [];
    if (parsedCompanies.length === 0 && !savedCompanies) {
      const sampleCompanies: Company[] = [
        {
          id: "company_1",
          company_id: "COMP001",
          company_name: "サンプル株式会社",
          contact_name: "山田太郎",
          email: "yamada@sample.com",
          phone: "03-1234-5678",
          credits_purchased: 1000,
          credits_used: 250,
          notes: "VIP顧客",
          status: "active",
          created_at: new Date("2024-01-15").toISOString(),
          updated_at: new Date("2024-01-15").toISOString(),
        },
        {
          id: "company_2",
          company_id: "COMP002",
          company_name: "テスト商事株式会社",
          contact_name: "佐藤花子",
          email: "sato@test.co.jp",
          phone: "03-9876-5432",
          credits_purchased: 500,
          credits_used: 100,
          notes: "月次契約",
          status: "active",
          created_at: new Date("2024-02-10").toISOString(),
          updated_at: new Date("2024-02-10").toISOString(),
        },
      ];
      localStorage.setItem("educationMaterialCompanies", JSON.stringify(sampleCompanies));
      setCompanies(sampleCompanies);
    } else {
      setCompanies(parsedCompanies);
    }
  }, []);

  // 画面切替
  const showScreen = (name: Screen) => setCurrentScreen(name);

  const titles: Record<Screen, string> = useMemo(
    () => ({
      home: "教材一覧",
      "new-project": "プロジェクト作成",
      settings: "設定",
      admin: "管理画面",
      "user-form": "ユーザー管理",
      "user-materials": "ユーザー教材一覧",
    }),
    []
  );

  // 通知
  const pushNotification = (message: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Step遷移
  const showStep = (n: number) => setCurrentStep(n);
  const nextStep = () => setCurrentStep((s) => Math.min(5, s + 1));
  const previousStep = () => setCurrentStep((s) => Math.max(1, s - 1));

  const startNewProject = () => {
    setCurrentProject({});
    setSelectedPageCount(0);
    setSelectedTemplate("");
    setCurrentStep(1);
    showScreen("new-project");
  };

  // 参考資料Submit -> サンプルアセスメント生成
  const handleReferenceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("project-name") || "").trim();
    const file = (formData.get("reference-file") as File) ?? (currentProject.referenceFile as File | undefined);
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

  // アセスメント編集
  const updateQuestion = (id: number, patch: Partial<AssessmentQuestion>) => {
    setCurrentProject((p) => ({
      ...p,
      assessment: (p.assessment || []).map((q) => (q.id === id ? { ...q, ...patch } : q)),
    }));
  };

  // スライド設定
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
        content: i === 1 ? "プレゼンテーションのタイトルと概要" : `ページ ${i} の内容を記載` ,
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

  // 生成
  const generateSlides = async () => {
    nextStep();
    // 疑似プログレス
    const steps = [
      { text: "スライドを作成しています...", progress: 20 },
      { text: "ノートを生成しています...", progress: 50 },
      { text: "スライドにノートを埋め込んでいます...", progress: 80 },
      { text: "最終処理中...", progress: 100 },
    ];
    for (const s of steps) {
      setProgressText(s.text);
      setProgress(s.progress);
      // 1秒待機
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 1000));
    }
    const completed: Project = { ...currentProject, status: "completed", completedAt: new Date().toISOString() };
    setCurrentProject(completed);
    saveProject(completed);
    setGenerationDone(true);
    pushNotification("スライドとアセスメントの生成が完了しました！", "success");
  };

  const saveProject = (project: Project) => {
    const updated = [...projects, project];
    setProjects(updated);
    localStorage.setItem("educationMaterialProjects", JSON.stringify(updated));
  };

  // ホームテーブル
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => (p.name || "").toLowerCase().includes(search.toLowerCase()));
  }, [projects, search]);

  const deleteProject = (index: number) => {
    const project = filteredProjects[index];
    if (!project) return;
    // window.confirm
    if (typeof window !== "undefined" && window.confirm(`「${project.name}」を削除しますか？\nこの操作は取り消せません。`)) {
      const updated = projects.filter((p) => p !== project);
      setProjects(updated);
      localStorage.setItem("educationMaterialProjects", JSON.stringify(updated));
      pushNotification("プロジェクトを削除しました", "success");
    }
  };

  const editProject = (index: number) => {
    const project = filteredProjects[index];
    if (!project) return;
    setCurrentProject(project);
    setCurrentStep(4);
    showScreen("new-project");
  };

  const downloadSlides = (index?: number) => {
    const project = typeof index === "number" ? filteredProjects[index] : currentProject;
    if (!project) return;
    pushNotification(`「${project.name}」のスライドをダウンロード中...`, "info");
    setTimeout(() => pushNotification("スライドのダウンロードが完了しました", "success"), 2000);
  };
  const downloadAssessment = (index?: number) => {
    const project = typeof index === "number" ? filteredProjects[index] : currentProject;
    if (!project) return;
    pushNotification(`「${project.name}」のアセスメントをダウンロード中...`, "info");
    setTimeout(() => pushNotification("アセスメントのダウンロードが完了しました", "success"), 2000);
  };

  // 管理者: ユーザー一覧
  const renderUsersTableRows = () => {
    if (companies.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
            <i className="fas fa-users text-4xl mb-4"></i>
            <p className="text-lg">ユーザーがありません</p>
            <p className="text-sm">「ユーザー追加」ボタンから新しいユーザーを登録してください</p>
          </td>
        </tr>
      );
    }
    return companies.map((company, idx) => {
      const createdDate = new Date(company.created_at).toLocaleDateString("ja-JP");
      const remaining = company.credits_purchased - company.credits_used;
      return (
        <tr key={company.id} className="user-row-clickable" onClick={(e) => {
          if ((e.target as HTMLElement).closest(".action-buttons")) return;
          showUserMaterials(company.id);
        }}>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{company.company_id}</td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-medium text-gray-900">{company.company_name}</div>
            <div className="text-sm text-gray-500">{company.status === "active" ? "有効" : "無効"}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{company.email}</td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">{company.credits_purchased.toLocaleString()}クレジット</div>
            <div className="text-sm text-gray-500">残り: {remaining.toLocaleString()}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{createdDate}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            <div className="flex flex-wrap gap-1 action-buttons">
              <button className="text-green-600 hover:text-green-800 px-2 py-1 rounded border border-green-300 hover:bg-green-50 text-xs whitespace-nowrap" onClick={(ev) => { ev.stopPropagation(); editUser(idx); }}>
                <i className="fas fa-edit mr-1"></i>編集
              </button>
              <button className="text-red-600 hover:text-red-800 px-2 py-1 rounded border border-red-300 hover:bg-red-50 text-xs whitespace-nowrap" onClick={(ev) => { ev.stopPropagation(); deleteUser(idx); }}>
                <i className="fas fa-trash mr-1"></i>削除
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

  const editUser = (index: number) => {
    setCurrentEditingUser(companies[index]);
    showScreen("user-form");
  };

  const deleteUser = (index: number) => {
    const company = companies[index];
    if (typeof window !== "undefined" && window.confirm(`「${company.company_name}」を削除しますか？\nこの操作は取り消せません。`)) {
      const updated = companies.filter((_, i) => i !== index);
      setCompanies(updated);
      localStorage.setItem("educationMaterialCompanies", JSON.stringify(updated));
      pushNotification("ユーザーを削除しました", "success");
    }
  };

  const showUserMaterials = (companyId: string) => {
    const company = companies.find((c) => c.id === companyId) || null;
    if (!company) return;
    setCurrentViewingUser(company);
    showScreen("user-materials");
  };

  const renderUserMaterialsRows = (companyId: string) => {
    const userProjects = projects.filter((p) => p.company_id === companyId);
    if (userProjects.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
            <i className="fas fa-folder-open text-4xl mb-4"></i>
            <p className="text-lg">教材がありません</p>
            <p className="text-sm">このユーザーはまだ教材を作成していません</p>
          </td>
        </tr>
      );
    }
    return userProjects.map((project, idx) => {
      const createdDate = project.createdAt ? new Date(project.createdAt).toLocaleDateString("ja-JP") : "-";
      const status = project.status === "completed" ? "完了" : "作成中";
      return (
        <tr key={(project.id || idx).toString()} className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-medium text-gray-900">{project.name || `プロジェクト${idx + 1}`}</div>
            <div className="text-sm text-gray-500">{status}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{createdDate}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            {project.status === "completed" ? (
              <>
                <button className="text-blue-600 hover:text-blue-800 mr-2">
                  <i className="fas fa-eye mr-1"></i>プレビュー
                </button>
                <button className="text-green-600 hover:text-green-800">
                  <i className="fas fa-download mr-1"></i>ダウンロード
                </button>
              </>
            ) : (
              <span className="text-gray-400">生成中...</span>
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            {project.status === "completed" ? (
              <>
                <button className="text-blue-600 hover:text-blue-800 mr-2">
                  <i className="fas fa-eye mr-1"></i>プレビュー
                </button>
                <button className="text-green-600 hover:text-green-800">
                  <i className="fas fa-download mr-1"></i>ダウンロード
                </button>
              </>
            ) : (
              <span className="text-gray-400">生成中...</span>
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            <button className="text-red-600 hover:text-red-800 px-2 py-1 rounded border border-red-300 hover:bg-red-50 text-xs whitespace-nowrap">
              <i className="fas fa-trash mr-1"></i>削除
            </button>
          </td>
        </tr>
      );
    });
  };

  // 進捗
  const [progress, setProgress] = useState<number>(0);
  const [progressText, setProgressText] = useState<string>("スライドを作成しています...");
  const [generationDone, setGenerationDone] = useState<boolean>(false);

  // ユーザーフォームSubmit
  const handleUserSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const userData: Omit<Company, "created_at" | "updated_at"> & { created_at?: string; updated_at?: string } = {
      id: currentEditingUser?.id || `company_${Date.now()}`,
      company_id: String(fd.get("user-company-id") || ""),
      company_name: String(fd.get("user-company-name") || ""),
      contact_name: String(fd.get("user-contact-name") || ""),
      email: String(fd.get("user-email") || ""),
      phone: String(fd.get("user-phone") || ""),
      credits_purchased: parseInt(String(fd.get("user-credits") || "0"), 10) || 0,
      credits_used: currentEditingUser?.credits_used ?? 0,
      notes: String(fd.get("user-notes") || ""),
      status: "active",
    };
    if (currentEditingUser) {
      const next = companies.map((c) => (c.id === currentEditingUser.id ? { ...c, ...userData, updated_at: new Date().toISOString() } : c));
      setCompanies(next);
      pushNotification("ユーザー情報を更新しました", "success");
    } else {
      const newUser: Company = { ...userData, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as Company;
      setCompanies((cs) => [...cs, newUser]);
      pushNotification("新規ユーザーを登録しました", "success");
    }
    localStorage.setItem("educationMaterialCompanies", JSON.stringify(currentEditingUser ? companies.map((c) => (c.id === userData.id ? { ...c, ...userData } as Company : c)) : [...companies, userData]));
    showScreen("admin");
  };

  const projectsTable = () => {
    if (filteredProjects.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
            <i className="fas fa-folder-open text-4xl mb-4"></i>
            <p className="text-lg">プロジェクトがありません</p>
            <p className="text-sm">「プロジェクト作成」ボタンから新しいプロジェクトを作成してください</p>
          </td>
        </tr>
      );
    }
    return filteredProjects.map((project, idx) => {
      const createdDate = project.createdAt ? new Date(project.createdAt).toLocaleDateString("ja-JP") : "-";
      const status = project.status === "completed" ? "完了" : "作成中";
      return (
        <tr key={(project.id || idx).toString()} className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-medium text-gray-900">{project.name || `プロジェクト${idx + 1}`}</div>
            <div className="text-sm text-gray-500">{status}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{createdDate}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            {project.status === "completed" ? (
              <>
                <button className="text-blue-600 hover:text-blue-800 mr-2" onClick={() => pushNotification("スライドプレビュー機能は開発中です", "info")}>
                  <i className="fas fa-eye mr-1"></i>プレビュー
                </button>
                <button className="text-green-600 hover:text-green-800" onClick={() => downloadSlides(idx)}>
                  <i className="fas fa-download mr-1"></i>ダウンロード
                </button>
              </>
            ) : (
              <span className="text-gray-400">生成中...</span>
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            {project.status === "completed" ? (
              <>
                <button className="text-blue-600 hover:text-blue-800 mr-2" onClick={() => pushNotification("アセスメントプレビュー機能は開発中です", "info")}>
                  <i className="fas fa-eye mr-1"></i>プレビュー
                </button>
                <button className="text-green-600 hover:text-green-800" onClick={() => downloadAssessment(idx)}>
                  <i className="fas fa-download mr-1"></i>ダウンロード
                </button>
              </>
            ) : (
              <span className="text-gray-400">生成中...</span>
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            <div className="flex flex-wrap gap-1">
              {project.status === "completed" && (
                <button className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded border border-blue-300 hover:bg-blue-50 text-xs whitespace-nowrap" onClick={() => editProject(idx)}>
                  <i className="fas fa-edit mr-1"></i>編集
                </button>
              )}
              <button className="text-red-600 hover:text-red-800 px-2 py-1 rounded border border-red-300 hover:bg-red-50 text-xs whitespace-nowrap" onClick={() => deleteProject(idx)}>
                <i className="fas fa-trash mr-1"></i>削除
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <div id="app" className="container mx-auto p-6">
      {/* ヘッダー */}
      <header className="flex justify-between items-center mb-8">
        <h1 id="page-title" className="text-3xl font-bold text-gray-800">{titles[currentScreen]}</h1>
        <div className="flex space-x-3">
          <button id="admin-btn" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors" onClick={() => { showScreen("admin"); }}>
            <i className="fas fa-users-cog mr-2"></i>管理画面
          </button>
          <button id="settings-btn" className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors" onClick={() => showScreen("settings")}>
            <i className="fas fa-cog mr-2"></i>設定
          </button>
          <button id="new-project-btn" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" onClick={startNewProject}>
            <i className="fas fa-plus mr-2"></i>プロジェクト作成
          </button>
        </div>
      </header>

      {/* ホーム */}
      {currentScreen === "home" && (
        <div id="home-screen" className="screen">
          <div className="mb-4">
            <div className="flex items-center space-x-3">
              <input type="text" id="search-input" placeholder="プロジェクト名で検索..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">プロジェクト名</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作成日時</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ノート付きスライド</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">アセスメント</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody id="projects-table" className="bg-white divide-y divide-gray-200">
                {projectsTable()}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 新規プロジェクト */}
      {currentScreen === "new-project" && (
        <div id="new-project-screen" className="screen">
          {/* 工程表 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">作成工程</h2>
            <div className="flex items-center justify-between" id="progress-steps">
              {[1, 2, 3, 4, 5].map((n) => (
                <div className="flex items-center" key={n}>
                  <div className="flex items-center flex-col">
                    <div className={`w-8 h-8 ${n <= currentStep ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"} rounded-full flex items-center justify-center text-sm font-bold step-circle`} data-step={n}>{n}</div>
                    <span className="text-sm text-gray-600 mt-2">{["参考資料入力","アセスメント修正","スライド設定","骨子編集","生成完了"][n-1]}</span>
                  </div>
                  {n < 5 && <div className={`w-16 h-1 ${n < currentStep ? "bg-blue-600" : "bg-gray-300"} mx-2 step-line`} data-step={n}></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1 */}
          {currentStep === 1 && (
            <div id="step-1" className="step-content bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">参考資料入力</h3>
              <form id="reference-form" className="space-y-4" onSubmit={handleReferenceSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">プロジェクト名</label>
                  <input name="project-name" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">参考資料</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input name="reference-file" type="file" accept=".pdf,.doc,.docx,.txt,.ppt,.pptx" className="hidden" id="reference-file" />
                    <div className="cursor-pointer" onClick={() => document.getElementById("reference-file")?.click()}>
                      <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                      <p className="text-gray-600">ファイルをドラッグ&ドロップまたはクリックして選択</p>
                      <p className="text-sm text-gray-400 mt-2">PDF, Word, PowerPoint, テキストファイルに対応</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <button type="button" className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors" onClick={() => showScreen("home")}>戻る</button>
                  <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">次へ</button>
                </div>
              </form>
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <div id="step-2" className="step-content bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">アセスメント内容の修正</h3>
              <div id="assessment-questions" className="space-y-4">
                {(currentProject.assessment || []).map((q, index) => (
                  <div key={q.id} className="question-card">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-gray-800">問題 {index + 1}</h4>
                      <span className="text-sm text-gray-500">{q.type === "multiple-choice" ? "選択式" : "記述式"}</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">問題文</label>
                        <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none" rows={3} defaultValue={q.question} onChange={(e) => updateQuestion(q.id, { question: e.target.value })}></textarea>
                      </div>
                      {q.type === "multiple-choice" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">選択肢（正解にチェックを入れてください）</label>
                          {(q.options || []).map((opt, i) => (
                            <div key={i} className="flex items-center space-x-2 mt-2">
                              <input type="radio" name={`q${q.id}`} value={i} defaultChecked={i === q.correct} className="text-blue-600" onChange={() => updateQuestion(q.id, { correct: i })} />
                              <input type="text" defaultValue={opt} className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm" onChange={(e) => {
                                const next = [...(q.options || [])];
                                next[i] = e.target.value;
                                updateQuestion(q.id, { options: next });
                              }} />
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">配点</label>
                          <input type="number" defaultValue={q.points} min={1} max={100} className="w-full px-2 py-1 border border-gray-300 rounded" onChange={(e) => updateQuestion(q.id, { points: parseInt(e.target.value, 10) })} />点
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">正解時のコメント</label>
                        <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none" rows={2} defaultValue={q.correctComment || ""} onChange={(e) => updateQuestion(q.id, { correctComment: e.target.value })}></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">不正解時のコメント</label>
                        <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none" rows={2} defaultValue={q.incorrectComment || ""} onChange={(e) => updateQuestion(q.id, { incorrectComment: e.target.value })}></textarea>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-4">
                <button type="button" className="step-back bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors" onClick={previousStep}>戻る</button>
                <button type="button" id="confirm-assessment" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors" onClick={nextStep}>アセスメント確定</button>
              </div>
            </div>
          )}

          {/* Step 3 */}
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
                    {[10,15,20,25].map((n) => (
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
                    {["business","education","creative","minimal"].map((t) => (
                      <div key={t} className={`template-option cursor-pointer ${selectedTemplate===t ? "ring-2 ring-blue-500" : ""}`} onClick={() => setSelectedTemplate(t)}>
                        <div className={`slide-template ${t}`}>
                          <i className={`fas ${t==="business"?"fa-briefcase":t==="education"?"fa-graduation-cap":t==="creative"?"fa-palette":"fa-circle"} text-3xl mb-2`}></i>
                          <h4 className="font-bold">{t==="business"?"ビジネス":t==="education"?"教育":t==="creative"?"クリエイティブ":"ミニマル"}</h4>
                          <p className="text-sm opacity-90">{t==="business"?"プロフェッショナル向け":t==="education"?"学習・研修向け":t==="creative"?"創造性重視":"シンプルデザイン"}</p>
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

          {/* Step 4 */}
          {currentStep === 4 && (
            <div id="step-4" className="step-content bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">スライド骨子の編集</h3>
              <div id="slide-outline" className="space-y-4">
                {(currentProject.outline || []).map((slide, idx) => (
                  <div key={idx} className="page-editor">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-800">
                        <i className="fas fa-file-powerpoint text-blue-600 mr-2"></i>
                        ページ {slide.pageNumber}
                      </h4>
                      <span className="text-sm text-gray-500">内容編集</span>
                    </div>
                    <div>
                      <textarea rows={6} defaultValue={slide.content} placeholder="スライドの内容を入力してください..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => updateSlideContent(idx, e.target.value)}></textarea>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-6">
                <button type="button" className="step-back bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors" onClick={previousStep}>戻る</button>
                <button type="button" id="generate-slides" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors" onClick={generateSlides}>
                  <i className="fas fa-magic mr-2"></i>スライド作成開始
                </button>
              </div>
            </div>
          )}

          {/* Step 5 */}
          {currentStep === 5 && (
            <div id="step-5" className="step-content bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                {!generationDone && (
                  <div id="generation-progress" className="mb-6">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">スライドを生成中...</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div id="progress-bar" className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p id="progress-text" className="text-gray-600">{progressText}</p>
                  </div>
                )}
                {generationDone && (
                  <div id="generation-complete">
                    <i className="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">生成完了！</h3>
                    <p className="text-gray-600 mb-6">ノート付きスライドとアセスメントが正常に作成されました。</p>
                    <div className="flex justify-center space-x-4">
                      <button id="download-slides" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors" onClick={() => downloadSlides()}>
                        <i className="fas fa-download mr-2"></i>スライドをダウンロード
                      </button>
                      <button id="download-assessment" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors" onClick={() => downloadAssessment()}>
                        <i className="fas fa-download mr-2"></i>アセスメントをダウンロード
                      </button>
                    </div>
                    <div className="mt-6">
                      <button id="back-to-home-final" className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors" onClick={() => showScreen("home")}>
                        ホームに戻る
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 設定 */}
      {currentScreen === "settings" && (
        <div id="settings-screen" className="screen">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* カスタムテンプレート */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4"><i className="fas fa-palette mr-2"></i>カスタムテンプレート</h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input type="file" id="template-upload" accept=".pptx,.ppt" className="hidden" />
                  <div className="cursor-pointer" onClick={() => document.getElementById("template-upload")?.click()}>
                    <i className="fas fa-upload text-3xl text-gray-400 mb-2"></i>
                    <p className="text-gray-600">PowerPointテンプレートをアップロード</p>
                    <p className="text-sm text-gray-400">(.pptx, .ppt形式)</p>
                  </div>
                </div>
                <div id="custom-templates" className="space-y-2"></div>
              </div>
            </div>

            {/* クレジット残高 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4"><i className="fas fa-coins mr-2"></i>クレジット残高</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2" id="credit-amount">1,250</div>
                <p className="text-gray-600 mb-4">クレジット</p>
                <div className="bg-blue-50 rounded-lg p-4 mb-4 text-left">
                  <h4 className="font-semibold text-gray-800 mb-2">料金体系</h4>
                  <div className="flex justify-between"><span className="text-gray-600">スライド生成:</span><span className="font-medium">1枚あたり 1クレジット</span></div>
                </div>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"><i className="fas fa-credit-card mr-2"></i>クレジットを購入</button>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <button id="back-to-home-settings" className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors" onClick={() => showScreen("home")}>ホームに戻る</button>
          </div>
        </div>
      )}

      {/* 管理者 */}
      {currentScreen === "admin" && (
        <div id="admin-screen" className="screen">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button id="admin-users-tab" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">ユーザー管理</button>
                <button id="admin-materials-tab" className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors" onClick={() => { /* 省略: 同一UI内切替可 */ }}>教材管理</button>
              </div>
              <div className="flex space-x-3">
                <button id="add-user-btn" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors" onClick={() => { setCurrentEditingUser(null); showScreen("user-form"); }}><i className="fas fa-user-plus mr-2"></i>ユーザー追加</button>
                <button id="back-to-home-admin" className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors" onClick={() => showScreen("home")}>戻る</button>
              </div>
            </div>
          </div>
          {/* ユーザー管理タブ */}
          <div id="admin-users-content" className="admin-tab-content">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">ユーザー一覧</h3>
                  <p className="text-sm text-gray-500 mt-1"><i className="fas fa-info-circle mr-1"></i>行をクリックで教材一覧を表示</p>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="text" id="user-search" placeholder="会社名で検索..." className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => {
                    const term = e.target.value.toLowerCase();
                    setCompanies((prev) => prev.slice().sort((a, b) => {
                      const am = a.company_name.toLowerCase().includes(term) ? 0 : 1;
                      const bm = b.company_name.toLowerCase().includes(term) ? 0 : 1;
                      return am - bm;
                    }));
                  }} />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">会社ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">会社名</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">メールアドレス</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">購入クレジット数</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">登録日</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody id="users-table" className="bg-white divide-y divide-gray-200">
                    {renderUsersTableRows()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ユーザー登録/編集 */}
      {currentScreen === "user-form" && (
        <div id="user-form-screen" className="screen">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 id="user-form-title" className="text-xl font-bold text-gray-800 mb-6">{currentEditingUser ? "ユーザー編集" : "新規ユーザー登録"}</h3>
              <form id="user-form" className="space-y-6" onSubmit={handleUserSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">会社ID</label>
                    <input name="user-company-id" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="例: COMP001" defaultValue={currentEditingUser?.company_id || ""} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">会社名</label>
                    <input name="user-company-name" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="例: 株式会社サンプル" defaultValue={currentEditingUser?.company_name || ""} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">担当者名</label>
                    <input name="user-contact-name" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="例: 山田太郎" defaultValue={currentEditingUser?.contact_name || ""} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
                    <input name="user-email" type="email" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="例: contact@sample.com" defaultValue={currentEditingUser?.email || ""} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">電話番号</label>
                    <input name="user-phone" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="例: 03-1234-5678" defaultValue={currentEditingUser?.phone || ""} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">購入クレジット数</label>
                    <input name="user-credits" type="number" min={0} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="例: 1000" defaultValue={currentEditingUser?.credits_purchased ?? 0} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">備考</label>
                  <textarea name="user-notes" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="特記事項があれば記入してください" defaultValue={currentEditingUser?.notes || ""}></textarea>
                </div>
                <div className="flex justify-between pt-4">
                  <button type="button" id="cancel-user-form" className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors" onClick={() => showScreen("admin")}>キャンセル</button>
                  <button type="submit" id="submit-user-form" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">{currentEditingUser ? "更新" : "登録"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ユーザー教材一覧 */}
      {currentScreen === "user-materials" && currentViewingUser && (
        <div id="user-materials-screen" className="screen">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 id="user-materials-title" className="text-2xl font-bold text-gray-800">{currentViewingUser.company_name}の教材一覧</h2>
                <p id="user-materials-subtitle" className="text-gray-600 mt-1">担当者: {currentViewingUser.contact_name}</p>
              </div>
              <button id="back-to-admin" className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors" onClick={() => showScreen("admin")}>管理画面に戻る</button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">プロジェクト名</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作成日時</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ノート付きスライド</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">アセスメント</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody id="user-materials-table" className="bg-white divide-y divide-gray-200">
                {renderUserMaterialsRows(currentViewingUser.id)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 通知 */}
      {notification && (
        <div id="notification" className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${notification.type === "error" ? "bg-red-500 text-white" : notification.type === "info" ? "bg-blue-500 text-white" : "bg-green-500 text-white"}`}>
          <span id="notification-text">{notification.message}</span>
        </div>
      )}
    </div>
  );
}
