import { useState, useEffect } from "react";
import { teamService, type TeamMember } from "../services/team.service";

export const useTeam = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    try {
      setLoading(true);
      const data = await teamService.getAll();
      setTeam(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error("Error loading team:", err);
    } finally {
      setLoading(false);
    }
  };

  return { team, loading, error, refreshTeam: loadTeam };
};
