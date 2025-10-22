"use client";

// ユーザー編集/削除ページ
import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Company } from "@/entities/user/model";
import { getCompanies, saveCompanies } from "@/entities/user/api";
import AppHeader from "@/widgets/AppHeader";

export default function AdminUserEditPage() {
  const router = useRouter();
  const params = useParams<{ userId: string }>();
  const companies = getCompanies();
  const current = useMemo(() => companies.find((c) => c.id === params.userId) || null, [companies, params.userId]);
  const [form, setForm] = useState<Partial<Company>>(current || {});
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const pushNotification = (message: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  if (!current) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-gray-600">ユーザーが見つかりませんでした。</p>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const list = getCompanies();
    const next = list.map((c) => (c.id === current.id ? {
      ...c,
      ...form,
      updated_at: new Date().toISOString(),
    } as Company : c));
    saveCompanies(next);
    pushNotification("ユーザー情報を更新しました", "success");
    router.push("/admin");
  };

  const doDelete = () => {
    if (typeof window !== "undefined" && window.confirm(`「${current.company_name}」を削除しますか？\nこの操作は取り消せません。`)) {
      const list = getCompanies();
      const next = list.filter((c) => c.id !== current.id);
      saveCompanies(next);
      router.push("/admin");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <AppHeader
        title="管理画面"
        onShowAdmin={() => router.push("/admin")}
        onShowSettings={() => router.push("/settings")}
        onStartNewProject={() => router.push("/projects/new")}
      />
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">ユーザー編集</h3>
        <form className="space-y-6" onSubmit={submit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">会社ID</label>
              <input defaultValue={current.company_id} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setForm({ ...form, company_id: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">会社名</label>
              <input defaultValue={current.company_name} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">担当者名</label>
              <input defaultValue={current.contact_name} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setForm({ ...form, contact_name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
              <input type="email" defaultValue={current.email} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">電話番号</label>
              <input defaultValue={current.phone} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">購入クレジット数</label>
              <input type="number" min={0} defaultValue={current.credits_purchased} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setForm({ ...form, credits_purchased: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">備考</label>
            <textarea rows={3} defaultValue={current.notes || ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setForm({ ...form, notes: e.target.value })}></textarea>
          </div>
          <div className="flex justify-between pt-4">
            <button type="button" className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors" onClick={doDelete}><i className="fas fa-trash mr-1"></i>削除</button>
            <div className="space-x-2">
              <button type="button" className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors" onClick={() => router.push("/admin")}>キャンセル</button>
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">更新</button>
            </div>
          </div>
        </form>
      </div>

      {notification && (
        <div id="notification" className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${notification.type === "error" ? "bg-red-500 text-white" : notification.type === "info" ? "bg-blue-500 text-white" : "bg-green-500 text-white"}`}>
          <span id="notification-text">{notification.message}</span>
        </div>
      )}
    </div>
  );
}
