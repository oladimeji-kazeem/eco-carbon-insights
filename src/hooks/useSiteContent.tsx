import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteContentRow {
  id: string;
  section: string;
  key: string;
  value: unknown;
}

export const useSiteContent = (section?: string) => {
  return useQuery({
    queryKey: ["site_content", section ?? "all"],
    queryFn: async () => {
      let q = supabase.from("site_content").select("*");
      if (section) q = q.eq("section", section);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as SiteContentRow[];
    },
  });
};

export const contentMap = (rows: SiteContentRow[] | undefined) => {
  const map: Record<string, unknown> = {};
  rows?.forEach((r) => {
    map[r.key] = r.value;
  });
  return map;
};

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};
