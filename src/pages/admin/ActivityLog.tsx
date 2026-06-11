import { useAuditLog } from "@/hooks/useCMS";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Filter, History, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

// Mapping colors for visual hierarchy in logs
const ActionColors: Record<string, string> = {
  create_draft: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  edit_draft: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  submit_for_review: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  review_approve: "bg-emerald-500/20 text-emerald-700 border-emerald-500/30",
  review_request_changes: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  advance_stage: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  schedule: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  cancel_schedule: "bg-red-500/10 text-red-600 border-red-500/20",
  publish: "bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-800"
};

export default function ActivityLog() {
  const { data, isLoading } = useAuditLog(500); // Expanded limit for rigorous auditing
  const [q, setQ] = useState("");
  const [filterAction, setFilterAction] = useState<string>("all");

  const uniqueActions = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.map(d => d.action))).sort();
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((e) => {
      const matchQ = !q || e.item_id?.toLowerCase().includes(q.toLowerCase()) || e.actor_id?.toLowerCase().includes(q.toLowerCase());
      const matchA = filterAction === "all" || e.action === filterAction;
      return matchQ && matchA;
    });
  }, [data, q, filterAction]);

  if (isLoading) return <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mt-12" />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">System Audit Log</h1>
          <p className="text-muted-foreground mt-1">Immutable cryptographic history of all operational events across the deployment pipeline.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 bg-muted/30 p-3 rounded-lg border border-border">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by User UUID or Object UUID..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
        <div className="relative w-full sm:w-64">
          <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="all">All Operations</option>
            {uniqueActions.map(a => (
              <option key={a} value={a}>{a.replace(/_/g, ' ').toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((e) => (
          <Card key={e.id} className="group hover:bg-muted/10 transition-colors shadow-sm overflow-hidden">
            <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <History className="w-4 h-4 text-muted-foreground" />
                </div>

                <div className="space-y-1 w-full min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className={`capitalize font-medium ${ActionColors[e.action] || 'bg-muted/50'}`}>
                      {e.action.replace(/_/g, " ")}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm mt-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-muted-foreground w-12 shrink-0 text-xs">Actor:</span>
                      <span className="font-mono text-xs bg-muted/40 px-1.5 py-0.5 rounded truncate">
                        {e.actor_id || "System Default"}
                      </span>
                    </div>
                    {e.item_id && (
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-muted-foreground w-12 shrink-0 text-xs">Object:</span>
                        <span className="font-mono text-xs bg-muted/40 px-1.5 py-0.5 rounded truncate">
                          {e.item_id}
                        </span>
                      </div>
                    )}
                    {e.version_id && (
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-muted-foreground w-12 shrink-0 text-xs">State:</span>
                        <span className="font-mono text-xs bg-muted/40 px-1.5 py-0.5 rounded truncate">
                          {e.version_id}
                        </span>
                      </div>
                    )}
                  </div>

                  {e.meta && Object.keys(e.meta).length > 0 && (
                    <div className="mt-3 bg-muted/20 border border-border/50 rounded p-2 text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre">
                      {JSON.stringify(e.meta, null, 2)}
                    </div>
                  )}
                </div>
              </div>

              {e.item_id && (
                <div className="shrink-0 flex self-start md:self-center">
                  <Link to={`/admin/workspace/${e.item_id}`} className="flex items-center text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                    Inspect Array <ChevronRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-muted-foreground border border-dashed rounded-lg">
            <History className="w-8 h-8 opacity-20 mx-auto mb-3" />
            <p>No systemic operational history matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
