import { useParams, Link } from "react-router-dom";
import { useContentItem, useContentVersions, useReviews, useCMSActions, ContentVersion } from "@/hooks/useCMS";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Send, CheckCircle2, Calendar, Undo2, ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const statusColor: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  in_review: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  changes_requested: "bg-destructive/15 text-destructive",
  approved: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  scheduled: "bg-purple-500/15 text-purple-700 dark:text-purple-300",
  published: "bg-primary/15 text-primary",
  archived: "bg-muted text-muted-foreground",
};

export default function ContentWorkspace() {
  const { id } = useParams<{ id: string }>();
  const { data: item, isLoading } = useContentItem(id);
  const { data: versions } = useContentVersions(id);
  const { user, canPublish, canReview, canEdit } = useAuth();
  const actions = useCMSActions();

  const latest = versions?.[0];
  const [draftJSON, setDraftJSON] = useState("");
  const [note, setNote] = useState("");
  const [scheduleAt, setScheduleAt] = useState("");
  const [selectedVerId, setSelectedVerId] = useState<string | null>(null);
  const selectedVersion: ContentVersion | undefined = useMemo(
    () => versions?.find((v) => v.id === selectedVerId) ?? latest,
    [versions, selectedVerId, latest],
  );
  const { data: reviews } = useReviews(selectedVersion?.id);

  useEffect(() => {
    if (latest) setDraftJSON(JSON.stringify(latest.value, null, 2));
  }, [latest?.id]);

  if (isLoading) return <Loader2 className="w-6 h-6 animate-spin text-primary" />;
  if (!item) return <div>Item not found.</div>;

  const parseDraft = () => {
    try { return JSON.parse(draftJSON || "{}"); }
    catch { toast.error("Invalid JSON"); throw new Error("invalid"); }
  };

  const saveDraft = async () => {
    try {
      const value = parseDraft();
      const editable = latest && (latest.status === "draft" || latest.status === "changes_requested") && latest.author_id === user?.id;
      if (editable) {
        await actions.updateDraft.mutateAsync({ version_id: latest!.id, value, note });
        toast.success("Draft saved");
      } else {
        await actions.createDraft.mutateAsync({ item_id: item.id, value, note });
        toast.success("New draft created");
      }
    } catch (e) { if ((e as Error).message !== "invalid") toast.error((e as Error).message); }
  };

  const submit = async () => {
    if (!latest) return toast.error("Save a draft first");
    try { await actions.submitForReview.mutateAsync(latest.id); toast.success("Submitted for review"); }
    catch (e) { toast.error((e as Error).message); }
  };

  const publishNow = async (vid: string) => {
    try { await actions.publish.mutateAsync(vid); toast.success("Published"); }
    catch (e) { toast.error((e as Error).message); }
  };

  const doSchedule = async () => {
    if (!latest || !scheduleAt) return;
    try {
      await actions.schedule.mutateAsync({ version_id: latest.id, when: new Date(scheduleAt).toISOString() });
      toast.success("Scheduled");
    } catch (e) { toast.error((e as Error).message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/admin/content-items" className="text-xs text-muted-foreground inline-flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3 h-3" /> Back
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{item.title || item.slug}</h1>
          <p className="text-xs text-muted-foreground">{item.type} · /{item.slug}</p>
        </div>
        {latest && (
          <Badge className={statusColor[latest.status]}>{latest.status}</Badge>
        )}
      </div>

      <Tabs defaultValue="edit">
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="history">History ({versions?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews?.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-4 mt-4">
          {canEdit ? (
            <>
              <div>
                <Label>Content (JSON)</Label>
                <Textarea rows={14} className="font-mono text-xs" value={draftJSON} onChange={(e) => setDraftJSON(e.target.value)} />
              </div>
              <div>
                <Label>Note for reviewers (optional)</Label>
                <Input value={note} onChange={(e) => setNote(e.target.value)} />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={saveDraft} disabled={actions.updateDraft.isPending || actions.createDraft.isPending}>
                  <Save className="w-4 h-4" /> Save draft
                </Button>
                <Button variant="secondary" onClick={submit} disabled={!latest || latest.status === "in_review"}>
                  <Send className="w-4 h-4" /> Submit for review
                </Button>
                {canPublish && latest && (
                  <Button variant="default" onClick={() => publishNow(latest.id)}>
                    <CheckCircle2 className="w-4 h-4" /> Publish now
                  </Button>
                )}
                {canPublish && latest && (
                  <div className="flex items-center gap-2">
                    <Input type="datetime-local" value={scheduleAt} onChange={(e) => setScheduleAt(e.target.value)} className="w-56" />
                    <Button variant="outline" onClick={doSchedule}><Calendar className="w-4 h-4" /> Schedule</Button>
                  </div>
                )}
              </div>
            </>
          ) : <p className="text-sm text-muted-foreground">Your role cannot edit content.</p>}
        </TabsContent>

        <TabsContent value="history" className="space-y-2 mt-4">
          {versions?.map((v) => (
            <Card key={v.id} className={selectedVerId === v.id ? "border-primary" : ""}>
              <CardContent className="p-3 flex items-center justify-between gap-2">
                <button className="text-left flex-1 min-w-0" onClick={() => setSelectedVerId(v.id)}>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">v{v.version_number}</Badge>
                    <Badge className={statusColor[v.status]}>{v.status}</Badge>
                    <span className="text-xs text-muted-foreground">{new Date(v.updated_at).toLocaleString()}</span>
                  </div>
                  {v.note && <p className="text-xs text-muted-foreground truncate mt-1">{v.note}</p>}
                </button>
                {canPublish && v.status !== "published" && (
                  <Button size="sm" variant="ghost" onClick={() => publishNow(v.id)}>
                    <Undo2 className="w-4 h-4" /> {v.status === "archived" ? "Rollback" : "Publish"}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="reviews" className="space-y-2 mt-4">
          {selectedVersion && (
            <p className="text-xs text-muted-foreground">For version v{selectedVersion.version_number}</p>
          )}
          {(!reviews || reviews.length === 0) && <p className="text-sm text-muted-foreground">No reviews yet.</p>}
          {reviews?.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant={r.decision === "approve" ? "default" : r.decision === "request_changes" ? "destructive" : "secondary"}>
                    {r.decision}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</span>
                </div>
                {r.comment && <p className="text-sm text-foreground mt-2">{r.comment}</p>}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
