"use client";

import type { Company } from "./model";

const COMPANIES_KEY = "educationMaterialCompanies";

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function seedIfEmpty() {
  if (!isBrowser()) return;
  const saved = localStorage.getItem(COMPANIES_KEY);
  if (saved) return;
  const sampleCompanies: Company[] = [
    {
      id: "company_1",
      company_id: "COMP001",
      company_name: "サンプル株式会社",
      contact_name: "山田太郎",
      email: "yamada@sample.com",
      phone: "03-1234-5678",
      credits_purchased: 1000,
      credits_used: 250,
      notes: "VIP顧客",
      status: "active",
      created_at: new Date("2024-01-15").toISOString(),
      updated_at: new Date("2024-01-15").toISOString(),
    },
    {
      id: "company_2",
      company_id: "COMP002",
      company_name: "テスト商事株式会社",
      contact_name: "佐藤花子",
      email: "sato@test.co.jp",
      phone: "03-9876-5432",
      credits_purchased: 500,
      credits_used: 100,
      notes: "月次契約",
      status: "active",
      created_at: new Date("2024-02-10").toISOString(),
      updated_at: new Date("2024-02-10").toISOString(),
    },
  ];
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


