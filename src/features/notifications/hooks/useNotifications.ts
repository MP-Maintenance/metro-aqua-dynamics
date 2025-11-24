import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsService } from "../services/notifications.service";
import { useNavigate } from "react-router-dom";

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: unreadNotifications = [], isLoading } = useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: () => notificationsService.getUnread(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: number) =>
      notificationsService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
    },
  });

  const handleNotificationClick = async (notification: any) => {
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
  };

  return {
    unreadNotifications,
    isLoading,
    unreadCount: unreadNotifications.length,
    handleNotificationClick,
  };
};
