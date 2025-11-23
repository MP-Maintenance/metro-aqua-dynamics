import { useEffect } from 'react';
import { analyticsService } from '../services/analytics.service';

export const usePageView = () => {
  useEffect(() => {
    analyticsService.logEvent({
      event_type: 'page_view',
      event_category: 'navigation',
      page_url: window.location.pathname
    });
  }, []);
};

export const useAnalytics = () => {
  return analyticsService;
};
