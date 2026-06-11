import { useAuth } from "@/hooks/useAuth";
import { useMyQueue } from "@/hooks/useCMS";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, ArrowRight, UserPlus, Inbox, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const workflowStages = [
  "1. Idea Creation", "2. Custodian Idea Review", "3. Development Assignment", "4. Copy Development",
  "5. Custodian Dev Review", "6. Quantification Assignment", "7. Savings Quantification", "8. Quantity Custodian Review",
  "9. Copy Editor Assignment", "10. Style Edits", "11. Curator Final Review", "12. PM Review", "13. Scheduled", "14. Published"
];

export default function MyWork() {
  const { user, role } = useAuth();
  const { data: queue, isLoading } = useMyQueue(user?.id, role);

  if (isLoading) return <Loader2 className="w-6 h-6 animate-spin text-primary" />;

  const directAssignments = queue?.filter((item) => item.assigned_to === user?.id) || [];
  const roleAssignments = queue?.filter((item) => item.assigned_to !== user?.id && item.assigned_role === role) || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Assignment Queue</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Automated 14-Step Workflow pipeline. Only items requiring your explicit operational role are highlighted here.
          </p>
        </div>
      </div>

      <Tabs defaultValue="direct" className="space-y-6">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="direct" className="relative data-[state=active]:bg-primary/10">
            Assigned Directly to Me
            {directAssignments.length > 0 && <Badge className="ml-2 bg-destructive">{directAssignments.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="role" className="data-[state=active]:bg-primary/10">
            Open Pool Tasks ({role?.replace("_", " ") || "No Role"})
            {roleAssignments.length > 0 && <Badge className="ml-2 bg-muted/80">{roleAssignments.length}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="direct" className="space-y-4">
          {directAssignments.length === 0 ? (
            <div className="py-24 text-center border-2 border-border border-dashed rounded-lg bg-card">
              <Inbox className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium">Your desk is clear!</h3>
              <p className="text-muted-foreground text-sm mt-1">You have no explicit assignments pending your action.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {directAssignments.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="role" className="space-y-4">
          <div className="bg-muted/30 border border-info px-4 py-3 rounded-lg text-sm text-muted-foreground flex items-center mb-4">
            <UserPlus className="w-4 h-4 mr-2" /> These items are assigned to the broader <strong>{role?.replace("_", " ")}</strong> pool and require someone to take ownership.
          </div>
          {roleAssignments.length === 0 ? (
            <div className="py-16 text-center border-2 border-border border-dashed rounded-lg bg-card">
              <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
              <h3 className="text-base font-medium">No Open Pool Tasks</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roleAssignments.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ItemCard({ item }: { item: any }) {
  // Extract latest version logic safely
  const latestVersion = item.content_versions && item.content_versions.length > 0
    ? [...item.content_versions].sort((a, b) => b.version_number - a.version_number)[0]
    : null;

  const stageInt = item.workflow_stage ?? 1;

  return (
    <Card className="flex flex-col hover:border-primary/50 transition-all shadow-sm border-border">
      <CardHeader className="pb-3 border-b bg-card rounded-t-xl">
        <div className="flex justify-between items-start gap-2 mb-2">
          <Badge variant="outline" className="shrink-0 font-mono text-[10px] bg-muted/40">
            {item.type || "unknown"}
          </Badge>
          <Badge className="bg-primary/10 text-primary text-[10px] uppercase truncate">Stage {stageInt}</Badge>
        </div>
        <CardTitle className="text-base leading-tight break-words">{item.title || "Untitled"}</CardTitle>
        <p className="text-xs text-muted-foreground font-mono truncate pt-1">/{item.slug}</p>
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs items-center gap-2">
            <span className="text-muted-foreground">Internal Phase:</span>
            <span className="font-semibold text-right truncate" title={workflowStages[stageInt - 1]}>{workflowStages[stageInt - 1]}</span>
          </div>
          {latestVersion && (
            <div className="flex justify-between text-xs items-center">
              <span className="text-muted-foreground">Version Track:</span>
              <span className="font-mono bg-muted px-1 rounded">v{latestVersion.version_number}</span>
            </div>
          )}
        </div>
        <Button asChild size="sm" className="w-full justify-between items-center group shadow-sm mt-2">
          <Link to={`/admin/workspace/${item.id}`}>
            Enter Workspace <ArrowRight className="w-3 h-3 opacity-70 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
