import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  availability: string | null;
  image_url: string | null;
  price: number | null;
  created_at: string;
}

export const productsService = {
  async getAll() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Product[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Product;
  },

  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Product[];
  },

  async update(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  },
};
