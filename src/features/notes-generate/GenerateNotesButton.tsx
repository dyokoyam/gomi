"use client";

type Props = {
  onClick?: () => void;
  disabled?: boolean;
};

export default function GenerateNotesButton({ onClick, disabled }: Props) {
  return (
    <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60" onClick={onClick} disabled={disabled}>
      <i className="fas fa-sticky-note mr-2"></i>ノート生成
    </button>
  );
}


