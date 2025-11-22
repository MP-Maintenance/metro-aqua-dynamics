import { supabase } from "@/integrations/supabase/client";

export interface Review {
  id: number;
  name: string;
  role: string | null;
  rating: number | null;
  comment: string | null;
  created_at: string | null;
  is_approved: boolean | null;
  user_id: string | null;
}

export const reviewsService = {
  async getApproved() {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Review[];
  },

  async getAll() {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Review[];
  },

  async create(review: Omit<Review, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase
      .from("reviews")
      .insert(review)
      .select()
      .single();

    if (error) throw error;
    return data as Review;
  },
};
