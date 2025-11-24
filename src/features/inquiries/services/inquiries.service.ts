import { supabase } from "@/integrations/supabase/client";

export interface Inquiry {
  inquiryid: number;
  inquirytype: string;
  fullname: string;
  email: string;
  countrycode: string;
  mobilenumber: string;
  servicetype: string;
  message: string;
  submittedat: string;
  status: string;
}

export interface CreateInquiryData {
  inquirytype: string;
  fullname: string;
  email: string;
  countrycode: string;
  mobilenumber: string;
  servicetype: string;
  message: string;
  user_id?: string | null;
}

export const inquiriesService = {
  async create(data: CreateInquiryData) {
    const { data: inquiry, error } = await supabase
      .from("inquiries")
      .insert(data)
      .select()
      .single();

    if (error) throw error;

    // Create notification for admins (non-blocking)
    if (inquiry) {
      supabase
        .from("notifications")
        .insert({
          type: "inquiry",
          reference_id: inquiry.inquiryid,
          message: `New ${inquiry.inquirytype} inquiry from ${inquiry.fullname}`,
          created_by: data.user_id,
          assigned_to: null,
        })
        .then(({ error: notifError }) => {
          if (notifError) console.error("Error creating notification:", notifError);
        });
    }

    return inquiry as Inquiry;
  },

  async getAll() {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("submittedat", { ascending: false });

    if (error) throw error;
    return data as Inquiry[];
  },

  async getById(inquiryid: number) {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .eq("inquiryid", inquiryid)
      .single();

    if (error) throw error;
    return data as Inquiry;
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .eq("user_id", userId)
      .order("submittedat", { ascending: false });

    if (error) throw error;
    return data as Inquiry[];
  },

  async updateStatus(inquiryid: number, status: string) {
    const { data, error } = await supabase
      .from("inquiries")
      .update({ status })
      .eq("inquiryid", inquiryid)
      .select()
      .single();

    if (error) throw error;
    return data as Inquiry;
  },

  async delete(inquiryid: number) {
    const { error } = await supabase
      .from("inquiries")
      .delete()
      .eq("inquiryid", inquiryid);

    if (error) throw error;
  },
};
