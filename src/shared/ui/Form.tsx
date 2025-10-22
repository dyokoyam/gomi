"use client";

import type { PropsWithChildren, FormHTMLAttributes } from "react";

type Props = PropsWithChildren<FormHTMLAttributes<HTMLFormElement>>;

export default function Form({ children, className = "", ...rest }: Props) {
  return (
    <form className={`space-y-4 ${className}`} {...rest}>
      {children}
    </form>
  );
}


