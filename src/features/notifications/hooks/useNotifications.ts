import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsService, Notification } from "../services/notifications.service";
import { useNavigate } from "react-router-dom";

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: unreadNotifications = [], isLoading, error } = useQuery<Notification[], Error>({
    queryKey: ["notifications", "unread"],
    queryFn: () => notificationsService.getUnread(),
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 1, // Only retry once to avoid infinite loops
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      notificationsService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
    },
  });

  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Mark as read
      await markAsReadMutation.mutateAsync(notification.id);

      // Navigate to appropriate page
      const routes: Record<string, string> = {
        inquiry: `/admin/inquiries`,
        pre_consultation: `/admin/consultations`,
        quote_request: `/admin/quotes`,
        review: `/admin/reviews`,
      };

      const route = routes[notification.type];
      if (route) {
        navigate(route);
      }
    } catch (err) {
      console.error("Error handling notification click:", err);
    }
  };

  return {
    unreadNotifications,
    isLoading,
    error,
    unreadCount: unreadNotifications.length,
    handleNotificationClick,
  };
};
