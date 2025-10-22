export type Company = {
  id: string;
  company_id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  credits_purchased: number;
  credits_used: number;
  notes?: string;
  status: "active" | "inactive" | "suspended";
  created_at: string | Date;
  updated_at: string | Date;
};


