"use client";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function SearchBox({ value, onChange }: Props) {
  return (
    <input
      type="text"
      id="search-input"
      placeholder="プロジェクト名で検索..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

export default SearchBox;


