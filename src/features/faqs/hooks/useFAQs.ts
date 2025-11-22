import { useState, useEffect } from "react";
import { faqsService, type FAQ } from "../services/faqs.service";

export const useFAQs = (publishedOnly: boolean = true) => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadFAQs();
  }, [publishedOnly]);

  const loadFAQs = async () => {
    try {
      setLoading(true);
      const data = publishedOnly 
        ? await faqsService.getPublished()
        : await faqsService.getAll();
      setFaqs(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error("Error loading FAQs:", err);
    } finally {
      setLoading(false);
    }
  };

  return { faqs, loading, error, refreshFAQs: loadFAQs };
};
