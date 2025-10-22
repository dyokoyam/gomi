"use client";

type Props = {
  onClick?: () => void;
  disabled?: boolean;
};

export default function GenerateAssessmentButton({ onClick, disabled }: Props) {
  return (
    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60" onClick={onClick} disabled={disabled}>
      <i className="fas fa-bolt mr-2"></i>アセスメント生成
    </button>
  );
}


