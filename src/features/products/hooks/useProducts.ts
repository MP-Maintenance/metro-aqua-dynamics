import { useState, useEffect } from "react";
import { productsService, type Product } from "../services/products.service";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsService.getAll();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts = () => {
    loadProducts();
  };

  return { products, loading, error, refreshProducts };
};
