"use client";

import type { Company } from "./model";
import { sampleCompanies } from "@/mocks/companies";

const COMPANIES_KEY = "educationMaterialCompanies";
const SHOULD_SEED_COMPANIES = process.env.NEXT_PUBLIC_SEED_COMPANIES === "true";

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function seedIfEmpty() {
  if (!isBrowser()) return;
  if (!SHOULD_SEED_COMPANIES) return;
  const saved = localStorage.getItem(COMPANIES_KEY);
  if (saved) return;
  localStorage.setItem(COMPANIES_KEY, JSON.stringify(sampleCompanies));
}

export function getCompanies(): Company[] {
  if (!isBrowser()) return [];
  seedIfEmpty();
  const raw = localStorage.getItem(COMPANIES_KEY);
  if (!raw) return [];
  try {
    const list = JSON.parse(raw) as Company[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveCompanies(companies: Company[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(COMPANIES_KEY, JSON.stringify(companies));
}


