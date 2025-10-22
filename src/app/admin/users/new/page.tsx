"use client";

// 新規ユーザーページ (FR-029,033-038)
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Company } from "@/entities/user/model";
import { getCompanies, saveCompanies } from "@/entities/user/api";

export default function AdminUserNewPage() {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Company>>({});
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const pushNotification = (message: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company_id || !form.company_name || !form.contact_name || !form.email) {
      pushNotification("必須項目を入力してください", "error");
      return;
    }
    const list = getCompanies();
    const now = new Date().toISOString();
    const item: Company = {
      id: `company_${Date.now()}`,
      company_id: String(form.company_id),
      company_name: String(form.company_name),
      contact_name: String(form.contact_name),
      email: String(form.email),
      phone: String(form.phone || ""),
      credits_purchased: Number(form.credits_purchased || 0),
      credits_used: 0,
      notes: String(form.notes || ""),
      status: "active",
      created_at: now,
      updated_at: now,
    };
    saveCompanies([...list, item]);
    pushNotification("新規ユーザーを登録しました", "success");
    router.push("/admin");
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">新規ユーザー登録</h3>
        <form className="space-y-6" onSubmit={submit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">会社ID</label>
              <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="例: COMP001" onChange={(e) => setForm({ ...form, company_id: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">会社名</label>
              <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="例: 株式会社サンプル" onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">担当者名</label>
              <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="例: 山田太郎" onChange={(e) => setForm({ ...form, contact_name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
              <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="例: contact@sample.com" onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">電話番号</label>
              <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="例: 03-1234-5678" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">購入クレジット数</label>
              <input type="number" min={0} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="例: 1000" onChange={(e) => setForm({ ...form, credits_purchased: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">備考</label>
            <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="特記事項があれば記入してください" onChange={(e) => setForm({ ...form, notes: e.target.value })}></textarea>
          </div>
          <div className="flex justify-between pt-4">
            <button type="button" className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors" onClick={() => router.push("/admin")}>キャンセル</button>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">登録</button>
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
