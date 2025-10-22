"use client";

type Props = {
  iconClass: string;
  title: string;
  description: string;
  colSpan?: number;
};

export default function EmptyState({ iconClass, title, description, colSpan = 1 }: Props) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-8 text-center text-gray-500">
        <i className={`${iconClass} text-4xl mb-4`}></i>
        <p className="text-lg">{title}</p>
        <p className="text-sm">{description}</p>
      </td>
    </tr>
  );
}


