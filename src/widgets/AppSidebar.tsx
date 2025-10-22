"use client";

import Link from "next/link";

export default function AppSidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4 hidden md:block">
      <div className="font-bold text-gray-800 mb-4">メニュー</div>
      <nav className="space-y-2">
        <Link className="block px-3 py-2 rounded hover:bg-gray-100" href="/">ダッシュボード</Link>
        <Link className="block px-3 py-2 rounded hover:bg-gray-100" href="/(dashboard)/projects/new">新規作成</Link>
        <Link className="block px-3 py-2 rounded hover:bg-gray-100" href="/settings">設定</Link>
        <Link className="block px-3 py-2 rounded hover:bg-gray-100" href="/admin">管理</Link>
      </nav>
    </aside>
  );
}


