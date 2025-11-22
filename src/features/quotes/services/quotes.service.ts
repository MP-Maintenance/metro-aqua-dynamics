import { supabase } from "@/integrations/supabase/client";

export interface QuoteRequest {
  id: string;
  user_id: string;
  items: any;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuoteRequestLine {
  id: number;
  quote_request_id: string | null;
  product_id: string;
  product_name: string;
  quantity: number | null;
  created_at: string | null;
}

export const quotesService = {
  async create(userId: string, items: any[]) {
    const { data, error } = await supabase
      .from("quote_requests")
      .insert({
        user_id: userId,
        items: items,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;
    return data as QuoteRequest;
  },

  async createLines(quoteRequestId: string, items: any[]) {
    const lines = items.map(item => ({
      quote_request_id: quoteRequestId,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
    }));

    const { data, error } = await supabase
      .from("quote_request_lines")
      .insert(lines)
      .select();

    if (error) throw error;
    return data as QuoteRequestLine[];
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from("quote_requests")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as QuoteRequest[];
  },

  async getLines(quoteRequestId: string) {
    const { data, error } = await supabase
      .from("quote_request_lines")
      .select("*")
      .eq("quote_request_id", quoteRequestId);

    if (error) throw error;
    return data as QuoteRequestLine[];
  },
};
