"use client";

type Props = {
  onClick?: () => void;
  disabled?: boolean;
};

export default function GenerateSlidesButton({ onClick, disabled }: Props) {
  return (
    <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60" onClick={onClick} disabled={disabled}>
      <i className="fas fa-magic mr-2"></i>スライド生成
    </button>
  );
}


