"use client";

import { remainingCredits } from "@/entities/credit/model";

type Props = {
  purchased: number;
  used: number;
};

export default function CreditBadge({ purchased, used }: Props) {
  const rest = remainingCredits({ purchased, used });
  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
      <i className="fas fa-coins mr-2"></i>
      残り: {rest.toLocaleString()} / {purchased.toLocaleString()}
    </div>
  );
}


