import { useState, useEffect } from "react";
import { reviewsService, type Review } from "../services/reviews.service";

export const useReviews = (approvedOnly: boolean = true) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadReviews();
  }, [approvedOnly]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = approvedOnly 
        ? await reviewsService.getApproved()
        : await reviewsService.getAll();
      setReviews(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error("Error loading reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  return { reviews, loading, error, refreshReviews: loadReviews };
};
