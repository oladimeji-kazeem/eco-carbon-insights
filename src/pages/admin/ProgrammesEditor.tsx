import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useProgrammes, ProgrammeRow } from "@/hooks/useProgrammesData";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

const empty: Partial<ProgrammeRow> = {
  slug: "",
  title: "",
  tagline: "",
  icon: "Leaf",
  mission: "",
  description: "",
  highlights: [],
  pillars: [],
  focus_areas: [],
  cta_label: "",
  cta_href: "",
  external_url: "",
  sort_order: 0,
  published: true,
};

export default function ProgrammesEditor() {
  const { data, isLoading } = useProgrammes(true);
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<ProgrammeRow>>(empty);
  const [saving, setSaving] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: ["programmes"] });

  const handleSave = async () => {
    if (!editing.slug || !editing.title) {
      toast.error("Slug and title are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        slug: editing.slug,
        title: editing.title,
        tagline: editing.tagline ?? "",
        icon: editing.icon ?? "Leaf",
        mission: editing.mission ?? "",
        description: editing.description ?? "",
        highlights: editing.highlights ?? [],
        pillars: editing.pillars ?? [],
        focus_areas: editing.focus_areas ?? [],
        cta_label: editing.cta_label ?? null,
        cta_href: editing.cta_href ?? null,
        external_url: editing.external_url ?? null,
        sort_order: editing.sort_order ?? 0,
        published: editing.published ?? true,
      };
      const { error } = editing.id
        ? await supabase.from("programmes").update(payload).eq("id", editing.id)
        : await supabase.from("programmes").insert(payload);
      if (error) throw error;
      toast.success("Programme saved");
      setOpen(false);
      setEditing(empty);
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("programmes").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Programme deleted");
      refresh();
    }
  };

  const openEdit = (p: ProgrammeRow) => {
    setEditing(p);
    setOpen(true);
  };

  const openNew = () => {
    setEditing(empty);
    setOpen(true);
  };

  const listInput = (label: string, key: "highlights" | "pillars" | "focus_areas") => (
    <div>
      <Label className="text-xs">{label} (one per line)</Label>
      <Textarea
        rows={3}
        value={(editing[key] as string[] ?? []).join("\n")}
        onChange={(e) => setEditing({ ...editing, [key]: e.target.value.split("\n").filter(Boolean) })}
      />
    </div>
  );

  if (isLoading) return <Loader2 className="w-6 h-6 animate-spin text-primary" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Programmes</h1>
          <p className="text-muted-foreground">Add, edit and reorder Eco Centre programmes.</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4" /> New programme
        </Button>
      </div>

      <div className="space-y-2">
        {data?.map((p) => (
          <Card key={p.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{p.title}</span>
                  {!p.published && <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">Draft</span>}
                </div>
                <p className="text-sm text-muted-foreground truncate">{p.tagline}</p>
                <p className="text-xs text-muted-foreground">/{p.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete "{p.title}"?</AlertDialogTitle>
                      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(p.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing.id ? "Edit programme" : "New programme"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label>Title</Label>
                <Input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Tagline</Label>
              <Input value={editing.tagline ?? ""} onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label>Icon (lucide name)</Label>
                <Input value={editing.icon ?? ""} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} placeholder="Leaf, Building2, MapPin..." />
              </div>
              <div>
                <Label>Sort order</Label>
                <Input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div>
              <Label>Mission</Label>
              <Textarea rows={2} value={editing.mission ?? ""} onChange={(e) => setEditing({ ...editing, mission: e.target.value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea rows={3} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </div>
            {listInput("Highlights", "highlights")}
            {listInput("Pillars (Inform / Inspire / Enable)", "pillars")}
            {listInput("Focus areas (Energy / Travel / Operations / Logistics)", "focus_areas")}
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label>CTA label</Label>
                <Input value={editing.cta_label ?? ""} onChange={(e) => setEditing({ ...editing, cta_label: e.target.value })} />
              </div>
              <div>
                <Label>CTA URL</Label>
                <Input value={editing.cta_href ?? ""} onChange={(e) => setEditing({ ...editing, cta_href: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>External URL (read more)</Label>
              <Input value={editing.external_url ?? ""} onChange={(e) => setEditing({ ...editing, external_url: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={editing.published ?? true} onCheckedChange={(v) => setEditing({ ...editing, published: v })} />
              <Label>Published</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
