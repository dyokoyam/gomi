"use client";

import type { PropsWithChildren } from "react";

type TableProps = PropsWithChildren<{}>;

export function DataTable({ children }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        {children}
      </table>
    </div>
  );
}

export function THead({ children }: TableProps) {
  return <thead className="bg-gray-50">{children}</thead>;
}

export function TBody({ children }: TableProps) {
  return <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>;
}


