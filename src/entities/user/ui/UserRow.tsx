"use client";

import type { Company } from "../model";

type Props = {
  company: Company;
  onEdit: () => void;
  onDelete: () => void;
  onRowClick: () => void;
};

export function UserRow({ company, onEdit, onDelete, onRowClick }: Props) {
  const createdDate = new Date(company.created_at).toLocaleDateString("ja-JP");
  const remaining = company.credits_purchased - company.credits_used;

  return (
    <tr className="user-row-clickable" onClick={(e) => {
      if ((e.target as HTMLElement).closest(".action-buttons")) return;
      onRowClick();
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
          <button className="text-green-600 hover:text-green-800 px-2 py-1 rounded border border-green-300 hover:bg-green-50 text-xs whitespace-nowrap" onClick={(ev) => { ev.stopPropagation(); onEdit(); }}>
            <i className="fas fa-edit mr-1"></i>編集
          </button>
          <button className="text-red-600 hover:text-red-800 px-2 py-1 rounded border border-red-300 hover:bg-red-50 text-xs whitespace-nowrap" onClick={(ev) => { ev.stopPropagation(); onDelete(); }}>
            <i className="fas fa-trash mr-1"></i>削除
          </button>
        </div>
      </td>
    </tr>
  );
}

export default UserRow;


