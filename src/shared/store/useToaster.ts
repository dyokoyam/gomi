import { create } from "zustand";

export type Toast = { message: string; type?: "success" | "error" | "info" };

type ToasterState = {
  toast: Toast | null;
  push: (t: Toast) => void;
  clear: () => void;
};

export const useToaster = create<ToasterState>((set) => ({
  toast: null,
  push: (t) => set({ toast: { type: "success", ...t } }),
  clear: () => set({ toast: null }),
}));


