import type { Company } from "@/entities/user/model";

export const sampleCompanies: Company[] = [
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


