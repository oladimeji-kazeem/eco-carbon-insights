import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, Boxes, Settings as SettingsIcon, Users, LogOut, ArrowLeft, Inbox, Layers, Calendar, History, ClipboardList, Server, Activity, Plus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useReviewQueue, useCMSActions, ContentType } from "@/hooks/useCMS";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const navGroups = [
  {
    label: "Overview",
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
      { to: "/admin/web-analytics", label: "Web Analytics", icon: Activity, adminOnly: true }
    ],
  },
  {
    label: "Editorial",
    items: [
      { to: "/admin/my-work", label: "My work", icon: ClipboardList },
      { to: "/admin/review", label: "Review queue", icon: Inbox, badgeKey: "review" as const, reviewer: true },
      { to: "/admin/scheduled", label: "Scheduled", icon: Calendar, reviewer: true },
      { to: "/admin/activity", label: "Activity log", icon: History, reviewer: true },
    ],
  },
  {
    label: "Content",
    items: [
      { to: "/admin/content-items", label: "All content", icon: Layers },
      { to: "/admin/content", label: "Homepage blocks", icon: FileText, editor: true },
      { to: "/admin/programmes", label: "Programmes", icon: Boxes, editor: true },
    ],
  },
  {
    label: "Settings",
    items: [
      { to: "/admin/settings", label: "Site settings", icon: SettingsIcon, adminOnly: true },
      { to: "/admin/users", label: "Users & roles", icon: Users, adminOnly: true },
      { to: "/admin/rights", label: "Rights matrix", icon: Boxes, adminOnly: true },
      { to: "/admin/system", label: "System Console", icon: Server, adminOnly: true },
    ],
  },
];

export default function AdminLayout() {
  const { user, role, hasRole, signOut, canEdit } = useAuth();
  const navigate = useNavigate();
  const { data: queue } = useReviewQueue();
  const { ensureItem } = useCMSActions();

  // Global Creation State
  const [openCreate, setOpenCreate] = useState(false);
  const [draft, setDraft] = useState<{ type: ContentType; slug: string; title: string }>({ type: "page", slug: "", title: "" });

  const isPrivileged = hasRole("admin", "curator", "product_manager", "topic_lead", "originator");

  const handleSignOut = async () => { await signOut(); navigate("/"); };

  const canSee = (item: Record<string, unknown>) => {
    if (item.adminOnly) return role === "admin";
    if (item.editor) return hasRole("admin", "editor");
    if (item.reviewer) return hasRole("admin", "editor", "reviewer");
    return true;
  };

  const handleCreateContent = async () => {
    if (!draft.slug || !draft.title) return toast.error("Slug and title required");
    try {
      const item = await ensureItem.mutateAsync(draft);
      setOpenCreate(false);
      navigate(`/admin/workspace/${item.id}`);
    } catch (e) { toast.error((e as Error).message); }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Eco Centre" className="w-8 h-8" />
            <div>
              <div className="font-bold text-foreground text-sm">Eco Centre</div>
              <div className="text-xs text-muted-foreground">CMS & Admin</div>
            </div>
          </Link>
        </div>

        {/* Global Create Actions for Pipeline Roles */}
        {(canEdit || isPrivileged) && (
          <div className="p-4 border-b border-border bg-muted/20">
            <Button className="w-full justify-start shadow-sm" onClick={() => setOpenCreate(true)}>
              <Plus className="w-4 h-4 mr-2" /> Quick Create
            </Button>
          </div>
        )}

        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          {navGroups.map((g) => {
            const items = g.items.filter((it) => canSee(it as unknown as Record<string, unknown>));
            if (items.length === 0) return null;
            return (
              <div key={g.label}>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground px-3 mb-1">{g.label}</div>
                <div className="space-y-1">
                  {items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={"end" in item ? item.end : false}
                      className={({ isActive }) =>
                        `flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`
                      }
                    >
                      <span className="flex items-center gap-2">
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </span>
                      {"badgeKey" in item && item.badgeKey === "review" && (queue?.length ?? 0) > 0 && (
                        <Badge variant="secondary" className="text-xs">{queue!.length}</Badge>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border space-y-2">
          <div className="px-2 py-2">
            <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
            {role && <Badge variant="secondary" className="mt-1 text-xs">{role}</Badge>}
          </div>
          <Link to="/" className="block">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <ArrowLeft className="w-4 h-4" /> View site
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" /> Sign out
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="container max-w-5xl mx-auto p-8">
          <Outlet />
        </div>
      </main>

      {/* Global Creation Dialog Hub */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent>
          <DialogHeader><DialogTitle>Rapid Content Generation</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Pipeline Type</Label>
              <Select value={draft.type} onValueChange={(v) => setDraft({ ...draft, type: v as ContentType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="page">Page</SelectItem>
                  <SelectItem value="site_content">Site content block</SelectItem>
                  <SelectItem value="programme">Programme</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Title (Idea Reference)</Label><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></div>
            <div><Label>System Slug</Label><Input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} placeholder="hero-title or about-us" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenCreate(false)}>Cancel</Button>
            <Button onClick={handleCreateContent} disabled={ensureItem.isPending}>Generate Pipeline Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
