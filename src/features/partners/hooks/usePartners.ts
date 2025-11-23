import { useState, useEffect } from "react";
import { partnersService, type Partner } from "../services/partners.service";

export const usePartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      setLoading(true);
      const data = await partnersService.getAll();
      setPartners(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error("Error loading partners:", err);
    } finally {
      setLoading(false);
    }
  };

  return { partners, loading, error, refreshPartners: loadPartners };
};
