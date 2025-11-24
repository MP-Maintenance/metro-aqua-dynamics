import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { notificationsService, Notification } from "../services/notifications.service";

export const useNotifications = () => {
  const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    setLoading(true);
    const notifications = await notificationsService.getUnread();
    setUnreadNotifications(notifications);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();

    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = unreadNotifications.length;

  const handleNotificationClick = async (notification: Notification) => {
    try {
      await notificationsService.markAsRead(notification.id);
      setUnreadNotifications(prev => prev.filter(n => n.id !== notification.id));

      const routes: Record<string, string> = {
        inquiry: "/admin/inquiries",
        pre_consultation: "/admin/consultations",
        quote_request: "/admin/quotes",
        review: "/admin/reviews",
      };

      const route = routes[notification.type];
      if (route) navigate(route);
    } catch (err) {
      console.error("Error handling notification click:", err);
    }
  };

  return { unreadNotifications, unreadCount, handleNotificationClick, loading };
};
