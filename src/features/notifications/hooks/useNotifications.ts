import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsService } from "../services/notifications.service";
import { useNavigate } from "react-router-dom";
import type { Notification } from "../services/notifications.service";

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: unreadNotifications = [], isLoading } = useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: () => notificationsService.getUnread(),
    refetchInterval: 30000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: number) =>
      notificationsService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
    },
  });

  const handleNotificationClick = async (notification: Notification) => {
    await markAsReadMutation.mutateAsync(notification.id);

    const routes: Record<string, string> = {
      inquiry: `/admin/inquiries`,
      pre_consultation: `/admin/consultations`,
      quote_request: `/admin/quotes`,
      review: `/admin/reviews`,
    };

    const route = routes[notification.type];
    if (route) navigate(route);
  };

  return {
    unreadNotifications,
    isLoading,
    unreadCount: unreadNotifications.length,
    handleNotificationClick,
  };
};
