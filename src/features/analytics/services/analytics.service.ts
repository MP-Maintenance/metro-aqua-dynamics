import { supabase } from "@/integrations/supabase/client";

export interface ActivityEvent {
  event_type: string;
  event_category: string;
  event_data?: Record<string, any>;
  page_url?: string;
}

class AnalyticsService {
  private sessionId: string;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  async logEvent(event: ActivityEvent) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('user_activity_logs').insert({
        user_id: user?.id || null,
        session_id: this.sessionId,
        event_type: event.event_type,
        event_category: event.event_category,
        event_data: event.event_data || {},
        page_url: event.page_url || window.location.pathname,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
      });
    } catch (error) {
      console.error('Analytics logging error:', error);
    }
  }

  logProductView(productId: string, productName: string, category: string) {
    return this.logEvent({
      event_type: 'product_view',
      event_category: 'products',
      event_data: { product_id: productId, product_name: productName, category }
    });
  }

  logQuoteSubmitted(itemsCount: number, totalEstimate?: number) {
    return this.logEvent({
      event_type: 'quote_submitted',
      event_category: 'conversions',
      event_data: { items_count: itemsCount, total_estimate: totalEstimate }
    });
  }

  logSearch(query: string, resultsCount: number) {
    return this.logEvent({
      event_type: 'product_search',
      event_category: 'products',
      event_data: { query, results_count: resultsCount }
    });
  }

  logQuickView(productId: string, productName: string) {
    return this.logEvent({
      event_type: 'product_quick_view',
      event_category: 'products',
      event_data: { product_id: productId, product_name: productName }
    });
  }

  logAddToQuote(productId: string, productName: string) {
    return this.logEvent({
      event_type: 'product_add_to_quote',
      event_category: 'conversions',
      event_data: { product_id: productId, product_name: productName }
    });
  }
}

export const analyticsService = new AnalyticsService();
