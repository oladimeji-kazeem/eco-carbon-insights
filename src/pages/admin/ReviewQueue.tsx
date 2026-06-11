import { Link } from "react-router-dom";
import { useReviewQueue, useCMSActions, ContentVersion } from "@/hooks/useCMS";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, Eye, Inbox, Users } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

export default function ReviewQueue() {
  const { data, isLoading } = useReviewQueue();
  const { review, publish } = useCMSActions();
  const { canReview, canPublish, user, role: myRole } = useAuth();

  const [target, setTarget] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [mode, setMode] = useState<"approve" | "request_changes">("approve");

  const openDialog = (v: any, m: "approve" | "request_changes") => {
    setTarget(v); setMode(m); setComment("");
  };

  const submit = async () => {
    if (!target) return;
    try {
      await review.mutateAsync({ version_id: target.id, decision: mode, comment });
      toast.success(mode === "approve" ? "Approved" : "Changes requested");
      setTarget(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  };

  if (isLoading) return <Loader2 className="w-6 h-6 animate-spin text-primary" />;

  const items = data || [];

  // Awaiting My Action if it natively assigns to my exact UUID or my structural Role mapping
  const personalQueue = items.filter(v =>
    v.content_items?.assigned_to === user?.id ||
    v.content_items?.assigned_role === myRole
  );

  const renderQueue = (queue: any[], placeholder: string) => {
    if (queue.length === 0) return (
      <Card className="border-dashed"><CardContent className="p-12 text-center text-muted-foreground">{placeholder}</CardContent></Card>
    );

    return (
      <div className="space-y-3">
        {queue.map((v) => (
          <Card key={v.id} className="group hover:border-primary transition-colors hover:shadow-sm">
            <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="outline" className="font-mono bg-muted/50 border-primary/20 text-primary">v{v.version_number}</Badge>
                  {v.content_items?.workflow_stage && (
                    <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400">Stage {v.content_items.workflow_stage}</Badge>
                  )}
                  <span className="text-xs font-mono bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full capitalize">{v.status.replace("_", " ")}</span>
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-1">{v.content_items?.title || "Untitled Document"}</h3>
                <p className="text-sm text-muted-foreground truncate mb-2">{v.note || "No submission note provided."}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Last updated: {new Date(v.updated_at).toLocaleString()}</span>
                  {(v.content_items?.assigned_role || v.content_items?.assigned_to) && (
                    <span className="flex items-center font-mono text-primary/80">
                      <Users className="w-3 h-3 mr-1" />
                      Assigns: {v.content_items.assigned_role || "Specific Reviewer"}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link to={`/admin/workspace/${v.item_id}`}>
                  <Button variant="outline" size="sm" className="w-full md:w-auto"><Eye className="w-4 h-4 mr-2" />Workspace</Button>
                </Link>
                {canReview && (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => openDialog(v, "request_changes")} className="hover:bg-destructive/10 hover:text-destructive">
                      <XCircle className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openDialog(v, "approve")} className="hover:bg-primary/10 hover:text-primary">
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
                {canPublish && (
                  <Button size="sm" variant="default" onClick={async () => {
                    try { await publish.mutateAsync(v.id); toast.success("Published dynamically."); }
                    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
                  }}>Publish</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Review Pipeline</h1>
        <p className="text-muted-foreground mt-1">Manage global submissions, audit workflows, and finalize architectural publishing states.</p>
      </div>

      <Tabs defaultValue="my-action">
        <TabsList className="mb-4">
          <TabsTrigger value="my-action" className="flex items-center gap-2">
            <Inbox className="w-4 h-4" /> My Assignments
            {personalQueue.length > 0 && <Badge variant="default" className="ml-1 px-1.5 py-0 min-w-[20px]">{personalQueue.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="global" className="flex items-center gap-2">
            <Users className="w-4 h-4" /> Global Queue
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 min-w-[20px]">{items.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-action" className="mt-0">
          {renderQueue(personalQueue, "Your personalized pipeline is perfectly clear! Relax for now.")}
        </TabsContent>

        <TabsContent value="global" className="mt-0">
          {renderQueue(items, "The global pipeline contains no pending submissions.")}
        </TabsContent>
      </Tabs>

      <Dialog open={!!target} onOpenChange={(o) => !o && setTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {mode === "approve" ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <XCircle className="w-5 h-5 text-destructive" />}
              {mode === "approve" ? "Sign off & Approve" : "Request Revisions"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Textarea rows={4} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Attach a detailed comment for the internal pipeline audit log..." className="resize-none" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTarget(null)}>Cancel Action</Button>
            <Button onClick={submit} variant={mode === "approve" ? "default" : "destructive"} disabled={review.isPending}>
              {review.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {mode === "approve" ? "Confirm Approval" : "Send Back"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
