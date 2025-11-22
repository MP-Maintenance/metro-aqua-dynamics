import { supabase } from "@/integrations/supabase/client";

export interface CompanyDetails {
  id: string;
  company_name: string;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  website_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  google_map_url: string | null;
  updated_at: string | null;
}

export const companyService = {
  async getDetails() {
    const { data, error } = await supabase
      .from("company_details")
      .select("*")
      .single();

    if (error) throw error;
    return data as CompanyDetails;
  },

  async update(updates: Partial<CompanyDetails>) {
    const { data, error } = await supabase
      .from("company_details")
      .update(updates)
      .select()
      .single();

    if (error) throw error;
    return data as CompanyDetails;
  },
};
