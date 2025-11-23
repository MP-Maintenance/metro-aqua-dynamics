import { supabase } from "@/integrations/supabase/client";

export interface TeamMember {
  teamid: number;
  name: string;
  role: string;
  email: string;
  mobile: string;
  description: string | null;
  imageurl: string | null;
  createdat: string;
}

export const teamService = {
  async getAll() {
    const { data, error } = await supabase
      .from("team")
      .select("*")
      .order("createdat", { ascending: false });

    if (error) throw error;
    return data as TeamMember[];
  },

  async getById(id: number) {
    const { data, error } = await supabase
      .from("team")
      .select("*")
      .eq("teamid", id)
      .single();

    if (error) throw error;
    return data as TeamMember;
  },

  async create(member: Omit<TeamMember, "teamid" | "createdat">) {
    const { data, error } = await supabase
      .from("team")
      .insert(member)
      .select()
      .single();

    if (error) throw error;
    return data as TeamMember;
  },

  async update(id: number, member: Partial<Omit<TeamMember, "teamid" | "createdat">>) {
    const { data, error } = await supabase
      .from("team")
      .update(member)
      .eq("teamid", id)
      .select()
      .single();

    if (error) throw error;
    return data as TeamMember;
  },

  async delete(id: number) {
    const { error } = await supabase
      .from("team")
      .delete()
      .eq("teamid", id);

    if (error) throw error;
  },
};
