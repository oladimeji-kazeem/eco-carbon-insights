import { useScheduled, useCMSActions } from "@/hooks/useCMS";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function Scheduled() {
  const { data, isLoading } = useScheduled();
  const { cancelSchedule } = useCMSActions();

  if (isLoading) return <Loader2 className="w-6 h-6 animate-spin text-primary" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Scheduled publishes</h1>
        <p className="text-muted-foreground">Versions queued to go live at a future time.</p>
      </div>
      <div className="space-y-2">
        {(!data || data.length === 0) && <Card><CardContent className="p-8 text-center text-muted-foreground">Nothing scheduled.</CardContent></Card>}
        {data?.map((v) => (
          <Card key={v.id}>
            <CardContent className="p-4 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Badge>v{v.version_number}</Badge>
                  <Badge variant="secondary">scheduled</Badge>
                </div>
                <p className="text-sm text-foreground mt-1">
                  Publishes at {v.scheduled_for ? new Date(v.scheduled_for).toLocaleString() : "—"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/admin/workspace/${v.item_id}`}><Button variant="ghost" size="sm">Open</Button></Link>
                <Button variant="ghost" size="sm" onClick={async () => {
                  try { await cancelSchedule.mutateAsync(v.id); toast.success("Cancelled"); }
                  catch (e) { toast.error((e as Error).message); }
                }}>
                  <X className="w-4 h-4" />Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
