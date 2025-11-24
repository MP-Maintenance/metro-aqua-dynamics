import { supabase } from "@/integrations/supabase/client";
import type { Notification } from "./notifications.service";

// src/features/notifications/services/notifications.service.ts
export interface Notification {
  id: number; // matches your bigint PK
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
    const { data, error } = await supabase
      .from<Notification>("notifications")
      .select("*")
      .eq("is_read", false)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async markAsRead(notificationId: number) {
    const { error } = await supabase
      .from<Notification>("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (error) throw error;
  },

  async create(
    type: string,
    referenceId: number,
    message: string,
    userId: string | null = null
  ): Promise<Notification> {
    const { data, error } = await supabase
      .from<Notification>("notifications")
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
    return data;
  },
};
