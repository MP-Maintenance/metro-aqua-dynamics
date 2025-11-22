import { useState, useEffect } from "react";
import { categoriesService, type Category } from "../services/categories.service";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesService.getAll();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, error };
};
