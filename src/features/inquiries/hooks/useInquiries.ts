import { useState, useEffect } from "react";
import { inquiriesService, type Inquiry } from "../services/inquiries.service";

export const useInquiries = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const data = await inquiriesService.getAll();
      setInquiries(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error("Error loading inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  return { inquiries, loading, error, refreshInquiries: loadInquiries };
};
