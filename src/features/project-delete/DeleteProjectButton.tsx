"use client";

type Props = {
  label?: string;
  onConfirm: () => void;
};

export function DeleteProjectButton({ label = "削除", onConfirm }: Props) {
  return (
    <button
      className="text-red-600 hover:text-red-800 px-2 py-1 rounded border border-red-300 hover:bg-red-50 text-xs whitespace-nowrap"
      onClick={() => onConfirm()}
    >
      <i className="fas fa-trash mr-1"></i>
      {label}
    </button>
  );
}

export default DeleteProjectButton;


