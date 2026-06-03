import { useAuth } from "@/hooks/useAuth";
import { useMyDrafts } from "@/hooks/useCMS";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function MyWork() {
  const { user } = useAuth();
  const { data, isLoading } = useMyDrafts(user?.id);

  if (isLoading) return <Loader2 className="w-6 h-6 animate-spin text-primary" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My work</h1>
        <p className="text-muted-foreground">Your drafts and submissions in progress.</p>
      </div>
      <div className="space-y-2">
        {(!data || data.length === 0) && <Card><CardContent className="p-8 text-center text-muted-foreground">No active drafts.</CardContent></Card>}
        {data?.map((v) => (
          <Link key={v.id} to={`/admin/workspace/${v.item_id}`}>
            <Card className="hover:border-primary transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge>v{v.version_number}</Badge>
                    <Badge variant="secondary">{v.status}</Badge>
                  </div>
                  {v.note && <p className="text-sm text-foreground mt-1 truncate">{v.note}</p>}
                </div>
                <span className="text-xs text-muted-foreground">{new Date(v.updated_at).toLocaleString()}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
