import { useParams, Link } from "react-router-dom";
import { useContentItem, useContentVersions, useReviews, useCMSActions, ContentVersion } from "@/hooks/useCMS";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, Send, Undo2, ArrowLeft, Lock, Users, ShieldAlert, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const workflowStages = [
  "1. Idea Creation", "2. Custodian Idea Review", "3. Development Assignment", "4. Copy Development",
  "5. Custodian Dev Review", "6. Quantification Assignment", "7. Savings Quantification", "8. Quantity Custodian Review",
  "9. Copy Editor Assignment", "10. Style Edits", "11. Curator Final Review", "12. PM Review", "13. Scheduled", "14. Published"
];

const statusColor: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  in_review: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  changes_requested: "bg-destructive/15 text-destructive",
  approved: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  scheduled: "bg-purple-500/15 text-purple-700 dark:text-purple-300",
  published: "bg-primary/15 text-primary",
  archived: "bg-muted text-muted-foreground",
};

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image', 'video'],
    ['clean']
  ],
};

export default function ContentWorkspace() {
  const { id } = useParams<{ id: string }>();
  const { data: item, isLoading } = useContentItem(id);
  const { data: versions } = useContentVersions(id);
  const { hasRole, isAdmin } = useAuth();
  const actions = useCMSActions();

  // Privileged Users get universal CRUD access at every stage
  const isPrivileged = hasRole("admin", "curator", "product_manager", "topic_lead");

  // Fine-Grained Field Level Roles
  const canEditCopy = isPrivileged || hasRole("developer", "copy_editor", "originator");
  const canEditQuantity = isPrivileged || hasRole("quantifier", "quantification_custodian");

  const latest = versions?.[0];
  const [copyHTML, setCopyHTML] = useState("");
  const [money, setMoney] = useState<number | "">("");
  const [carbon, setCarbon] = useState<number | "">("");
  const [note, setNote] = useState("");

  const [selectedVerId, setSelectedVerId] = useState<string | null>(null);
  const selectedVersion: ContentVersion | undefined = useMemo(
    () => versions?.find((v) => v.id === selectedVerId) ?? latest,
    [versions, selectedVerId, latest],
  );

  const currentStage = (item as any)?.workflow_stage ?? 1;

  useEffect(() => {
    if (latest) {
      setCopyHTML(latest.copy_text || (latest.value?.html) || "");
      setMoney(latest.annual_monetary_savings ?? "");
      setCarbon(latest.annual_carbon_savings ?? "");
    } else {
      setCopyHTML(""); setMoney(""); setCarbon("");
    }
  }, [latest?.id]);

  if (isLoading) return <Loader2 className="w-6 h-6 animate-spin text-primary" />;
  if (!item) return <div>Item not found.</div>;

  const saveDraft = async () => {
    // Validation: no slash rule just in case of strict business requirement
    if (copyHTML.includes("/")) {
      if (!hasRole("admin")) return toast.error("Copy text validation failed: Cannot include '/' characters.");
    }

    try {
      const payload = {
        value: { timestamp: new Date().toISOString() }, // Legacy compatibility
        copy_text: copyHTML,
        annual_monetary_savings: typeof money === "number" ? money : null,
        annual_carbon_savings: typeof carbon === "number" ? carbon : null,
      };

      const editable = isPrivileged || (latest && (latest.status === "draft" || latest.status === "changes_requested"));
      if (editable) {
        await actions.updateDraft.mutateAsync({ version_id: latest!.id, note, ...payload });
        toast.success("State securely updated.");
      } else {
        await actions.createDraft.mutateAsync({ item_id: item.id, note, ...payload });
        toast.success("New operational draft created.");
      }
    } catch (e) { toast.error((e as Error).message); }
  };

  const advanceStage = async () => {
    if (!latest) return toast.error("Save all fields before finalizing action.");
    try {
      // If we advance stage via the normal button, let's bump the current stage + 1
      const defaultAssignRole = "reviewer"; // fallback
      await actions.submitForReview.mutateAsync(latest.id);
      await actions.advancePipelineStage.mutateAsync({ item_id: item.id, new_stage: currentStage + 1, assigned_role: defaultAssignRole as any });
      toast.success("Assignment advanced to the next Stage Queue.");
    }
    catch (e) { toast.error((e as Error).message); }
  };

  const forceStage = async (stageVal: string) => {
    try {
      await actions.advancePipelineStage.mutateAsync({ item_id: item.id, new_stage: parseInt(stageVal) });
      toast.success(`Item forcefully transferred to Stage ${stageVal}.`);
    } catch (e) { toast.error((e as Error).message); }
  };

  const deleteItem = async () => {
    if (!confirm("Are you absolutely sure you want to permanently delete this content item and all associated versions?")) return;
    try {
      if (latest) {
        await actions.deleteVersion.mutateAsync(latest.id);
        toast.success("Latest version deleted.");
      }
    } catch (e) { toast.error((e as Error).message); }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between bg-card p-4 rounded-lg border border-border shadow-sm">
        <div>
          <Link to="/admin/content-items" className="text-xs text-muted-foreground inline-flex items-center gap-1 mb-2 hover:text-primary transition-colors">
            <ArrowLeft className="w-3 h-3" /> All Content
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{item.title || item.slug}</h1>
            <Badge variant="outline" className="bg-primary/5 border-primary text-primary text-xs">Stage {currentStage}: {workflowStages[currentStage - 1]}</Badge>
          </div>
        </div>
        {latest && <Badge variant={latest.status === 'in_review' ? 'secondary' : 'default'} className="px-3 py-1 capitalize">{latest.status.replace("_", " ")}</Badge>}
      </div>

      <Tabs defaultValue="workspace" className="bg-background rounded-lg">
        <TabsList className="bg-transparent border-b w-full justify-start rounded-none mb-4">
          <TabsTrigger value="workspace" className="data-[state=active]:bg-primary/10">Action Workspace</TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-primary/10">Pipeline History</TabsTrigger>
        </TabsList>

        <TabsContent value="workspace" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Primary Editorial Frame */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border shadow-sm overflow-hidden">
                <div className="bg-muted px-4 py-2 border-b flex justify-between items-center">
                  <span className="text-sm font-medium">Editorial Copy Details</span>
                  {!canEditCopy && <span className="flex items-center text-xs text-muted-foreground"><Lock className="w-3 h-3 mr-1" /> Protected Form</span>}
                </div>
                <CardContent className="p-0">
                  {canEditCopy ? (
                    <>
                      <ReactQuill theme="snow" value={copyHTML} onChange={setCopyHTML} modules={quillModules} className="bg-card text-foreground" />
                      <style>{`.ql-editor { min-height: 480px; font-size: 16px; line-height: 1.6; } .ql-toolbar { border-radius: 0; border-left: none; border-right: none; border-top: none; } .ql-container { border: none !important; }`}</style>
                    </>
                  ) : (
                    <div className="p-6 bg-muted/20 min-h-[480px] prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: copyHTML || "<i class='opacity-50'>No editorial copy provided yet.</i>" }} />
                  )}
                </CardContent>
              </Card>

              {/* Action Hand-off Panel */}
              <Card className="border-border">
                <div className="bg-muted px-4 py-2 border-b"><span className="text-sm font-medium">Stage Assignments & Notes</span></div>
                <CardContent className="p-4 space-y-4">
                  <Label>Hand-off Comments / Revisions requested</Label>
                  <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Type assignment instructions here..." />
                  <div className="flex gap-3 pt-2">
                    <Button onClick={saveDraft} disabled={actions.updateDraft.isPending || actions.createDraft.isPending} variant="secondary">
                      <Save className="w-4 h-4 mr-2" /> Commit Current State
                    </Button>
                    <Button onClick={advanceStage} disabled={!latest || latest.status === "in_review"}>
                      <Send className="w-4 h-4 mr-2" /> Assign Next Stage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Frame (Quantifications) */}
            <div className="space-y-6">
              <Card className="border-border shadow-sm">
                <div className="bg-amber-500/10 dark:bg-amber-500/20 px-4 py-2 border-b border-amber-500/20 flex justify-between items-center">
                  <span className="text-sm font-medium text-amber-900 dark:text-amber-200">Quantified LCA Data</span>
                  {!canEditQuantity && <span className="flex items-center text-xs opacity-60 text-amber-900"><Lock className="w-3 h-3 mr-1" /> Strictly Locked</span>}
                </div>
                <CardContent className="p-4 space-y-4">
                  <div>
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Annual Monetary Savings (£)</Label>
                    <Input
                      type="number" value={money} onChange={(e) => setMoney(e.target.value === "" ? "" : Number(e.target.value))}
                      disabled={!canEditQuantity} placeholder="0.00" className={!canEditQuantity ? "bg-muted/50 cursor-not-allowed" : ""}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Annual Carbon Savings (CO2)</Label>
                    <Input
                      type="number" value={carbon} onChange={(e) => setCarbon(e.target.value === "" ? "" : Number(e.target.value))}
                      disabled={!canEditQuantity} placeholder="0.00" className={!canEditQuantity ? "bg-muted/50 cursor-not-allowed" : ""}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground pt-2">
                    Only authorized Quantifiers can adjust metric baselines to preserve pipeline accounting.
                  </p>
                </CardContent>
              </Card>

              {/* Assignments Info View */}
              <Card className="border-border shadow-sm">
                <div className="bg-muted px-4 py-2 border-b flex items-center"><Users className="w-4 h-4 mr-2" /><span className="text-sm font-medium">Current Responsibilities</span></div>
                <CardContent className="p-4 space-y-2 text-sm text-foreground">
                  <div className="flex justify-between border-b pb-2"><span>Current Assignee:</span> <span className="font-mono text-muted-foreground">Unassigned</span></div>
                  <div className="flex justify-between pb-1"><span>Target Role:</span> <span className="font-mono text-muted-foreground">Any Reviewer</span></div>
                </CardContent>
              </Card>

              {/* Privileged Override Panel */}
              {isPrivileged && (
                <Card className="border-red-500/30 shadow-sm bg-red-500/5 dark:bg-red-500/10">
                  <div className="px-4 py-2 border-b border-red-500/20 flex items-center text-red-600 dark:text-red-400">
                    <ShieldAlert className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Privileged Controls</span>
                  </div>
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <Label className="text-xs font-bold text-muted-foreground mb-1 block">Force Workflow Stage</Label>
                      <Select value={currentStage.toString()} onValueChange={forceStage}>
                        <SelectTrigger className="w-full bg-background border-border">
                          <SelectValue placeholder="Select target stage" />
                        </SelectTrigger>
                        <SelectContent>
                          {workflowStages.map((s, i) => (
                            <SelectItem key={i} value={(i + 1).toString()}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-2 border-t border-red-500/20">
                      <Button variant="destructive" size="sm" className="w-full" onClick={deleteItem}>
                        <Trash2 className="w-4 h-4 mr-2" /> Delete Version
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

          </div>
        </TabsContent>

        <TabsContent value="history" className="p-4 space-y-3 bg-card border border-border rounded-lg mt-0">
          <div className="text-sm text-muted-foreground mb-4">Pipeline historical changes block.</div>
          {versions?.map((v) => (
            <Card key={v.id} className="border-border">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <Badge variant="outline" className="font-mono bg-muted/30">Version {v.version_number}</Badge>
                    <Badge className={statusColor[v.status]}>{v.status.replace("_", " ")}</Badge>
                    <span className="text-xs text-muted-foreground">{new Date(v.updated_at).toLocaleString()}</span>
                  </div>
                  {v.note && <p className="text-sm border-l-2 border-primary pl-2">{v.note}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
