import { useState, useEffect } from "react";
import { companyService, type CompanyDetails } from "../services/company.service";

export const useCompanyDetails = () => {
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadCompanyDetails();
  }, []);

  const loadCompanyDetails = async () => {
    try {
      setLoading(true);
      const data = await companyService.getDetails();
      setCompanyDetails(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error("Error loading company details:", err);
    } finally {
      setLoading(false);
    }
  };

  return { companyDetails, loading, error, refreshCompanyDetails: loadCompanyDetails };
};
