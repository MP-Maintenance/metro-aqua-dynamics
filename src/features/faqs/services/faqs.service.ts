import { supabase } from "@/integrations/supabase/client";

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  is_published: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export const faqsService = {
  async getPublished() {
    const { data, error } = await supabase
      .from("faqs")
      .select("id, question, answer, category")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as FAQ[];
  },

  async getAll() {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as FAQ[];
  },
};
