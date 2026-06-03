import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type ContentStatus =
  | "draft" | "in_review" | "changes_requested" | "approved" | "scheduled" | "published" | "archived";

export type ContentType = "site_content" | "programme" | "page";

export interface ContentItem {
  id: string;
  type: ContentType;
  slug: string;
  title: string;
  published_version_id: string | null;
  current_version_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentVersion {
  id: string;
  item_id: string;
  version_number: number;
  status: ContentStatus;
  value: Record<string, unknown>;
  author_id: string | null;
  note: string | null;
  scheduled_for: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentReview {
  id: string;
  version_id: string;
  reviewer_id: string | null;
  decision: "approve" | "request_changes" | "comment";
  comment: string | null;
  created_at: string;
}

export interface AuditEntry {
  id: string;
  item_id: string | null;
  version_id: string | null;
  actor_id: string | null;
  action: string;
  meta: Record<string, unknown>;
  created_at: string;
}

export interface NotificationRow {
  id: string;
  user_id: string;
  kind: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
}

export const useContentItems = (type?: ContentType) =>
  useQuery({
    queryKey: ["content_items", type ?? "all"],
    queryFn: async () => {
      let q = supabase.from("content_items").select("*").order("updated_at", { ascending: false });
      if (type) q = q.eq("type", type);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as ContentItem[];
    },
  });

export const useContentItem = (id?: string) =>
  useQuery({
    enabled: !!id,
    queryKey: ["content_item", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("content_items").select("*").eq("id", id!).maybeSingle();
      if (error) throw error;
      return data as ContentItem | null;
    },
  });

export const useContentVersions = (itemId?: string) =>
  useQuery({
    enabled: !!itemId,
    queryKey: ["content_versions", itemId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_versions")
        .select("*")
        .eq("item_id", itemId!)
        .order("version_number", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ContentVersion[];
    },
  });

export const useReviewQueue = () =>
  useQuery({
    queryKey: ["review_queue"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_versions")
        .select("*")
        .in("status", ["in_review"])
        .order("updated_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as ContentVersion[];
    },
  });

export const useScheduled = () =>
  useQuery({
    queryKey: ["scheduled_versions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_versions")
        .select("*")
        .eq("status", "scheduled")
        .order("scheduled_for", { ascending: true });
      if (error) throw error;
      return (data ?? []) as ContentVersion[];
    },
  });

export const useMyDrafts = (userId?: string) =>
  useQuery({
    enabled: !!userId,
    queryKey: ["my_drafts", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_versions")
        .select("*")
        .eq("author_id", userId!)
        .in("status", ["draft", "changes_requested", "in_review"])
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ContentVersion[];
    },
  });

export const useAuditLog = (limit = 100) =>
  useQuery({
    queryKey: ["audit_log", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as AuditEntry[];
    },
  });

export const useReviews = (versionId?: string) =>
  useQuery({
    enabled: !!versionId,
    queryKey: ["reviews", versionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_reviews")
        .select("*")
        .eq("version_id", versionId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ContentReview[];
    },
  });

export const useNotifications = () => {
  const { user } = useAuth();
  return useQuery({
    enabled: !!user,
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return (data ?? []) as NotificationRow[];
    },
  });
};

// ----- Mutations -----

const audit = async (item_id: string | null, version_id: string | null, action: string, meta: Record<string, unknown> = {}) => {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return;
  await supabase.from("content_audit_log").insert({ item_id, version_id, actor_id: u.user.id, action, meta });
};

export const useCMSActions = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["content_versions"] });
    qc.invalidateQueries({ queryKey: ["review_queue"] });
    qc.invalidateQueries({ queryKey: ["scheduled_versions"] });
    qc.invalidateQueries({ queryKey: ["my_drafts"] });
    qc.invalidateQueries({ queryKey: ["audit_log"] });
    qc.invalidateQueries({ queryKey: ["content_items"] });
    qc.invalidateQueries({ queryKey: ["content_item"] });
  };

  const createDraft = useMutation({
    mutationFn: async (input: { item_id: string; value: Record<string, unknown>; note?: string }) => {
      if (!user) throw new Error("Not signed in");
      const { data: latest } = await supabase
        .from("content_versions").select("version_number").eq("item_id", input.item_id)
        .order("version_number", { ascending: false }).limit(1).maybeSingle();
      const next = (latest?.version_number ?? 0) + 1;
      const { data, error } = await supabase.from("content_versions").insert({
        item_id: input.item_id, version_number: next, status: "draft",
        value: input.value, note: input.note ?? null, author_id: user.id,
      }).select().single();
      if (error) throw error;
      await audit(input.item_id, data.id, "create_draft", { version_number: next });
      return data as ContentVersion;
    },
    onSuccess: invalidate,
  });

  const updateDraft = useMutation({
    mutationFn: async (input: { version_id: string; value: Record<string, unknown>; note?: string }) => {
      const { error } = await supabase.from("content_versions").update({
        value: input.value, note: input.note, status: "draft",
      }).eq("id", input.version_id);
      if (error) throw error;
      await audit(null, input.version_id, "edit_draft");
    },
    onSuccess: invalidate,
  });

  const submitForReview = useMutation({
    mutationFn: async (version_id: string) => {
      const { error } = await supabase.from("content_versions").update({ status: "in_review" }).eq("id", version_id);
      if (error) throw error;
      await audit(null, version_id, "submit_for_review");
    },
    onSuccess: invalidate,
  });

  const review = useMutation({
    mutationFn: async (input: { version_id: string; decision: "approve" | "request_changes" | "comment"; comment?: string }) => {
      if (!user) throw new Error("Not signed in");
      const { error: rErr } = await supabase.from("content_reviews").insert({
        version_id: input.version_id, reviewer_id: user.id, decision: input.decision, comment: input.comment ?? null,
      });
      if (rErr) throw rErr;
      if (input.decision === "approve") {
        await supabase.from("content_versions").update({ status: "approved" }).eq("id", input.version_id);
      } else if (input.decision === "request_changes") {
        await supabase.from("content_versions").update({ status: "changes_requested" }).eq("id", input.version_id);
      }
      await audit(null, input.version_id, `review_${input.decision}`, { comment: input.comment ?? null });
    },
    onSuccess: invalidate,
  });

  const publish = useMutation({
    mutationFn: async (version_id: string) => {
      const { error } = await supabase.rpc("publish_content_version", { _version_id: version_id });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const schedule = useMutation({
    mutationFn: async (input: { version_id: string; when: string }) => {
      const { error } = await supabase.from("content_versions").update({
        status: "scheduled", scheduled_for: input.when,
      }).eq("id", input.version_id);
      if (error) throw error;
      await audit(null, input.version_id, "schedule", { when: input.when });
    },
    onSuccess: invalidate,
  });

  const cancelSchedule = useMutation({
    mutationFn: async (version_id: string) => {
      const { error } = await supabase.from("content_versions").update({
        status: "approved", scheduled_for: null,
      }).eq("id", version_id);
      if (error) throw error;
      await audit(null, version_id, "cancel_schedule");
    },
    onSuccess: invalidate,
  });

  const rollback = useMutation({
    mutationFn: async (version_id: string) => {
      const { error } = await supabase.rpc("publish_content_version", { _version_id: version_id });
      if (error) throw error;
      await audit(null, version_id, "rollback");
    },
    onSuccess: invalidate,
  });

  const deleteVersion = useMutation({
    mutationFn: async (version_id: string) => {
      const { error } = await supabase.from("content_versions").delete().eq("id", version_id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const ensureItem = useMutation({
    mutationFn: async (input: { type: ContentType; slug: string; title: string }) => {
      const { data: existing } = await supabase.from("content_items").select("*")
        .eq("type", input.type).eq("slug", input.slug).maybeSingle();
      if (existing) return existing as ContentItem;
      const { data, error } = await supabase.from("content_items").insert({
        type: input.type, slug: input.slug, title: input.title, created_by: user?.id,
      }).select().single();
      if (error) throw error;
      return data as ContentItem;
    },
    onSuccess: invalidate,
  });

  return { createDraft, updateDraft, submitForReview, review, publish, schedule, cancelSchedule, rollback, deleteVersion, ensureItem };
};
