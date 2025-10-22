"use client";

import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: "primary" | "secondary" | "danger";
};

export default function Button({ children, className = "", variant = "primary", ...rest }: Props) {
  const base = "px-4 py-2 rounded-lg transition-colors";
  const map: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  return (
    <button className={`${base} ${map[variant]} ${className}`} {...rest}>{children}</button>
  );
}


