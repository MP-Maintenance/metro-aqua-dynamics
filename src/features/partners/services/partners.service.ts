import { supabase } from "@/integrations/supabase/client";

export interface Partner {
  partnerid: number;
  name: string;
  tagline: string | null;
  country: string | null;
  description: string | null;
  logo: string | null;
  createdat: string;
  updatedat: string;
}

export const partnersService = {
  async getAll() {
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .order("createdat", { ascending: false });

    if (error) throw error;
    return data as Partner[];
  },

  async getById(id: number) {
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .eq("partnerid", id)
      .single();

    if (error) throw error;
    return data as Partner;
  },

  async create(partner: Omit<Partner, "partnerid" | "createdat" | "updatedat">) {
    const { data, error } = await supabase
      .from("partners")
      .insert(partner)
      .select()
      .single();

    if (error) throw error;
    return data as Partner;
  },

  async update(id: number, partner: Partial<Omit<Partner, "partnerid" | "createdat" | "updatedat">>) {
    const { data, error } = await supabase
      .from("partners")
      .update(partner)
      .eq("partnerid", id)
      .select()
      .single();

    if (error) throw error;
    return data as Partner;
  },

  async delete(id: number) {
    const { error } = await supabase
      .from("partners")
      .delete()
      .eq("partnerid", id);

    if (error) throw error;
  },
};
