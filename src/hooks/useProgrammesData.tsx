import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ProgrammeRow {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  icon: string;
  mission: string;
  description: string;
  highlights: string[];
  pillars: string[];
  focus_areas: string[];
  cta_label: string | null;
  cta_href: string | null;
  external_url: string | null;
  sort_order: number;
  published: boolean;
}

export const getIcon = (name: string): LucideIcon => {
  const lib = Icons as unknown as Record<string, LucideIcon>;
  return lib[name] ?? Icons.Leaf;
};

export const useProgrammes = (includeUnpublished = false) => {
  return useQuery({
    queryKey: ["programmes", includeUnpublished],
    queryFn: async () => {
      let q = supabase.from("programmes").select("*").order("sort_order");
      if (!includeUnpublished) q = q.eq("published", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as ProgrammeRow[];
    },
  });
};

export const useProgramme = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["programme", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programmes")
        .select("*")
        .eq("slug", slug!)
        .maybeSingle();
      if (error) throw error;
      return data as ProgrammeRow | null;
    },
  });
};
