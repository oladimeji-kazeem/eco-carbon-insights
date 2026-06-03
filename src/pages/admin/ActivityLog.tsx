import { useAuditLog } from "@/hooks/useCMS";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function ActivityLog() {
  const { data, isLoading } = useAuditLog(200);
  const [q, setQ] = useState("");

  if (isLoading) return <Loader2 className="w-6 h-6 animate-spin text-primary" />;

  const filtered = (data ?? []).filter((e) => !q || e.action.includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Activity log</h1>
        <p className="text-muted-foreground">Every editorial action across the site.</p>
      </div>
      <Input placeholder="Filter by action…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
      <div className="space-y-1">
        {filtered.map((e) => (
          <Card key={e.id}>
            <CardContent className="p-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Badge variant="outline">{e.action}</Badge>
                <span className="text-xs text-muted-foreground truncate">
                  item: {e.item_id?.slice(0, 8) ?? "—"} · version: {e.version_id?.slice(0, 8) ?? "—"}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()}</span>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No activity.</p>}
      </div>
    </div>
  );
}
