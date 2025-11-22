import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  created_at: string | null;
}

export const categoriesService = {
  async getAll() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return data as Category[];
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data as Category;
  },
};
