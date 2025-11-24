import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: number;
  type: string;
  reference_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  created_by: string | null;
  assigned_to: string | null;
}

export const notificationsService = {
  async getUnread(): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("is_read", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    } catch (err) {
      console.error("Failed to fetch unread notifications:", err);
      return [];
    }
  },

  async markAsRead(id: number) {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  },
};
