import { Link } from "react-router-dom";
import { useContentItems, ContentType } from "@/hooks/useCMS";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useCMSActions } from "@/hooks/useCMS";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function ContentItemsList() {
  const [type, setType] = useState<ContentType | "all">("all");
  const [search, setSearch] = useState("");
  const { data, isLoading } = useContentItems(type === "all" ? undefined : type);
  const { ensureItem } = useCMSActions();
  const { canEdit } = useAuth();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<{ type: ContentType; slug: string; title: string }>({ type: "page", slug: "", title: "" });
  const navigate = useNavigate();

  const filtered = (data ?? []).filter((i) =>
    !search || i.title.toLowerCase().includes(search.toLowerCase()) || i.slug.toLowerCase().includes(search.toLowerCase())
  );

  const createItem = async () => {
    if (!draft.slug || !draft.title) return toast.error("Slug and title required");
    try {
      const item = await ensureItem.mutateAsync(draft);
      setOpen(false);
      navigate(`/admin/workspace/${item.id}`);
    } catch (e) { toast.error((e as Error).message); }
  };

  if (isLoading) return <Loader2 className="w-6 h-6 animate-spin text-primary" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All content</h1>
          <p className="text-muted-foreground">Every piece of managed content with version status.</p>
        </div>
        {canEdit && (
          <Button onClick={() => setOpen(true)}><Plus className="w-4 h-4" /> New item</Button>
        )}
      </div>

      <div className="flex gap-2">
        <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={type} onValueChange={(v) => setType(v as ContentType | "all")}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="site_content">Site content</SelectItem>
            <SelectItem value="programme">Programme</SelectItem>
            <SelectItem value="page">Page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {filtered.map((i) => (
          <Link key={i.id} to={`/admin/workspace/${i.id}`}>
            <Card className="hover:border-primary transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground truncate">{i.title || i.slug}</span>
                    <Badge variant="outline">{i.type}</Badge>
                    {!i.published_version_id && <Badge variant="secondary">unpublished</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">/{i.slug}</p>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(i.updated_at).toLocaleDateString()}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
        {filtered.length === 0 && <Card><CardContent className="p-8 text-center text-muted-foreground">No items yet.</CardContent></Card>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New content item</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Type</Label>
              <Select value={draft.type} onValueChange={(v) => setDraft({ ...draft, type: v as ContentType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="page">Page</SelectItem>
                  <SelectItem value="site_content">Site content block</SelectItem>
                  <SelectItem value="programme">Programme</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Title</Label><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></div>
            <div><Label>Slug</Label><Input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} placeholder="hero.title or about-us" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={createItem} disabled={ensureItem.isPending}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
