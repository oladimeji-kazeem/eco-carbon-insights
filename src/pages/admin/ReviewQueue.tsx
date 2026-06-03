import { Link } from "react-router-dom";
import { useReviewQueue, useCMSActions, ContentVersion } from "@/hooks/useCMS";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, Eye } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";

export default function ReviewQueue() {
  const { data, isLoading } = useReviewQueue();
  const { review, publish } = useCMSActions();
  const { canReview, canPublish } = useAuth();
  const [target, setTarget] = useState<ContentVersion | null>(null);
  const [comment, setComment] = useState("");
  const [mode, setMode] = useState<"approve" | "request_changes">("approve");

  const openDialog = (v: ContentVersion, m: "approve" | "request_changes") => {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Review queue</h1>
        <p className="text-muted-foreground">Submissions waiting for editorial review.</p>
      </div>

      {(!data || data.length === 0) && (
        <Card><CardContent className="p-8 text-center text-muted-foreground">Nothing waiting for review. Nice work.</CardContent></Card>
      )}

      <div className="space-y-2">
        {data?.map((v) => (
          <Card key={v.id}>
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Badge>v{v.version_number}</Badge>
                  <Badge variant="secondary">{v.status}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(v.updated_at).toLocaleString()}</span>
                </div>
                {v.note && <p className="text-sm text-foreground mt-1 truncate">{v.note}</p>}
                <p className="text-xs text-muted-foreground truncate">item: {v.item_id}</p>
              </div>
              <div className="flex items-center gap-1">
                <Link to={`/admin/workspace/${v.item_id}`}>
                  <Button variant="ghost" size="sm"><Eye className="w-4 h-4" />Open</Button>
                </Link>
                {canReview && (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => openDialog(v, "request_changes")}>
                      <XCircle className="w-4 h-4 text-destructive" />Changes
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openDialog(v, "approve")}>
                      <CheckCircle2 className="w-4 h-4 text-primary" />Approve
                    </Button>
                  </>
                )}
                {canPublish && (
                  <Button size="sm" onClick={async () => {
                    try { await publish.mutateAsync(v.id); toast.success("Published"); }
                    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
                  }}>Publish</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!target} onOpenChange={(o) => !o && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{mode === "approve" ? "Approve submission" : "Request changes"}</DialogTitle>
          </DialogHeader>
          <Textarea rows={4} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Optional comment for the author" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setTarget(null)}>Cancel</Button>
            <Button onClick={submit} disabled={review.isPending}>
              {review.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "approve" ? "Approve" : "Request changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
