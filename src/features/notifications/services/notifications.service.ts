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
  async getUnread() {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("is_read", false)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Notification[];
  },

  async markAsRead(notificationId: number) {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (error) throw error;
  },

  async create(
    type: string,
    referenceId: number,
    message: string,
    userId: string | null = null
  ) {
    const { data, error } = await supabase
      .from("notifications")
      .insert({
        type,
        reference_id: referenceId,
        message,
        created_by: userId,
        assigned_to: null,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Notification;
  },
};
