import { create } from "zustand";

type WizardState = {
  step: number;
  setStep: (n: number) => void;
};

export const useWizardStore = create<WizardState>((set) => ({
  step: 1,
  setStep: (n) => set({ step: n }),
}));


