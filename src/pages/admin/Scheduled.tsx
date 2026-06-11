import { useScheduled, useCMSActions, ContentVersion } from "@/hooks/useCMS";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, X, Calendar as CalendarIcon, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Scheduled() {
  const { data, isLoading } = useScheduled();
  const { cancelSchedule, schedule } = useCMSActions();

  const [target, setTarget] = useState<ContentVersion | null>(null);
  const [newDate, setNewDate] = useState("");

  const openReschedule = (v: ContentVersion) => {
    // Attempt to convert the existing ISO string out so we can feed it into datetime-local natively if possible
    if (v.scheduled_for) {
      const d = new Date(v.scheduled_for);
      const isoStr = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
      setNewDate(isoStr);
    } else {
      setNewDate("");
    }
    setTarget(v);
  };

  const handleReschedule = async () => {
    if (!target || !newDate) return;
    try {
      await schedule.mutateAsync({ version_id: target.id, when: new Date(newDate).toISOString() });
      toast.success("Successfully rescheduled object runtime.");
      setTarget(null);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  if (isLoading) return <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mt-12" />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Deployment Pipeline</h1>
        <p className="text-muted-foreground mt-1">Staged operational states actively queued for future production release.</p>
      </div>

      <div className="space-y-4 relative">
        {(!data || data.length === 0) && (
          <Card className="border-dashed"><CardContent className="p-12 text-center text-muted-foreground flex flex-col items-center">
            <CalendarIcon className="w-8 h-8 mb-4 opacity-50" />
            There are no documents scheduled for operational release.
          </CardContent></Card>
        )}

        {data && data.length > 0 && (
          <div className="absolute left-[39px] top-6 bottom-6 w-0.5 bg-border -z-10 hidden md:block" />
        )}

        {data?.map((v) => (
          <div key={v.id} className="flex gap-6 relative">
            <div className="hidden md:flex flex-col items-center pt-5">
              <div className="w-5 h-5 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center relative z-10 shrink-0">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              </div>
            </div>

            <Card className="flex-1 group hover:border-primary/50 transition-colors shadow-sm">
              <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">Staged Build</Badge>
                    <Badge variant="outline" className="font-mono text-xs">v{v.version_number}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    {v.scheduled_for ? new Date(v.scheduled_for).toLocaleString(undefined, {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    }) : "Unknown target"}
                    <ArrowRight className="w-4 h-4 mx-1 text-muted-foreground" />
                    {/* We could join items title here, but if not available we display ID */}
                    <span className="text-muted-foreground truncate max-w-[200px] text-sm font-normal">Content ID: {v.item_id.split("-")[0]}...</span>
                  </h3>
                  <div className="text-xs text-muted-foreground ml-6">
                    Pipeline lock finalized correctly. Object awaits automated triggers.
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link to={`/admin/workspace/${v.item_id}`}>
                    <Button variant="outline" size="sm">Workspace</Button>
                  </Link>
                  <Button variant="secondary" size="sm" onClick={() => openReschedule(v)}>
                    <CalendarIcon className="w-4 h-4 mr-2" /> Shift Schedule
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-destructive/10 hover:text-destructive" onClick={async () => {
                    if (!confirm("Are you sure you want to pull this item completely off the deployment track?")) return;
                    try { await cancelSchedule.mutateAsync(v.id); toast.success("Deployment explicitly cancelled"); }
                    catch (e) { toast.error((e as Error).message); }
                  }}>
                    <X className="w-4 h-4" /> Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <Dialog open={!!target} onOpenChange={(o) => !o && setTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" /> Shift Deployment Schedule
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Target Target Datetime</Label>
              <Input type="datetime-local" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
              <p className="text-xs text-muted-foreground">The object will natively unlock and replace production nodes instantaneously at this explicit interval.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTarget(null)}>Abort</Button>
            <Button onClick={handleReschedule} disabled={schedule.isPending || !newDate}>
              {schedule.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Confirm Modification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
