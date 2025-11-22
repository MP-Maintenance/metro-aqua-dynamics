import { useState, useEffect } from "react";
import { quotesService, type QuoteRequest } from "../services/quotes.service";

export const useQuoteRequests = (userId: string | undefined) => {
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (userId) {
      loadQuoteRequests();
    }
  }, [userId]);

  const loadQuoteRequests = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const data = await quotesService.getByUserId(userId);
      setQuoteRequests(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error("Error loading quote requests:", err);
    } finally {
      setLoading(false);
    }
  };

  return { quoteRequests, loading, error, refreshQuoteRequests: loadQuoteRequests };
};
