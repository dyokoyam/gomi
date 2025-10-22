"use client";

export type AssessmentQuestion = {
  id: number;
  question: string;
  type: "multiple-choice" | "essay";
  options?: string[];
  correct?: number;
  points: number;
  correctComment?: string;
  incorrectComment?: string;
};

export type SlideOutline = {
  pageNumber: number;
  title: string;
  content: string;
  notes: string;
};

export type Project = {
  id?: string;
  company_id?: string;
  name?: string;
  referenceFile?: File;
  reference_file_name?: string;
  createdAt?: string | Date;
  completedAt?: string | Date;
  status?: "creating" | "completed" | "error";
  slidePurpose?: string;
  pageCount?: number;
  template?: string;
  assessment?: AssessmentQuestion[];
  outline?: SlideOutline[];
  slideCount?: number;
};


