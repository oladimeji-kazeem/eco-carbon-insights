import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, User, Search, Activity, ShieldCheck, Mail } from "lucide-react";

type Role = "admin" | "editor" | "reviewer" | "contributor" | "viewer";

interface UserRow {
  id: string;
  email: string | null;
  display_name: string | null;
  roles: Role[];
  is_active?: boolean;
}

function UserDetailDialog({ u, currentRole }: { u: UserRow, currentRole: Role }) {
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [privs, setPrivs] = useState<any[]>([]);
  const [loadingPrivs, setLoadingPrivs] = useState(false);

  useEffect(() => {
    if (open) {
      setLoadingLogs(true);
      setLoadingPrivs(true);

      supabase.from("content_audit_log")
        .select("*")
        .eq("actor_id", u.id)
        .order("created_at", { ascending: false })
        .limit(10)
        .then(({ data }) => {
          if (data) setLogs(data);
          setLoadingLogs(false);
        });

      supabase.from("role_permissions_matrix")
        .select("permissions(name, description)")
        .eq("role", currentRole)
        .then(({ data }) => {
          if (data) setPrivs(data);
          setLoadingPrivs(false);
        });
    }
  }, [open, u.id, currentRole]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Details</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>Extended attributes and capabilities for this user.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4 bg-muted/30 p-4 rounded-md border text-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">User ID</span>
            <span className="text-muted-foreground text-xs">{u.id}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Email</span>
            <span className="text-muted-foreground">{u.email || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Role assignment</span>
            <Badge variant="outline" className="capitalize">{currentRole}</Badge>
          </div>
        </div>

        <Tabs defaultValue="activity" className="mt-4">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="activity"><Activity className="w-4 h-4 mr-2" /> Timeline Logs</TabsTrigger>
            <TabsTrigger value="privilege"><ShieldCheck className="w-4 h-4 mr-2" /> Permissions Matrix</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="mt-4">
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {loadingLogs ? (
                <div className="flex justify-center p-4"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <div key={log.id} className="text-xs bg-muted/40 p-3 rounded-md border border-border">
                    <div className="font-semibold mb-1 flex items-center justify-between">
                      <span className="text-primary">{log.action}</span>
                      <span className="text-muted-foreground font-normal">{new Date(log.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm text-center p-4 italic">No recent loggable activities found.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="privilege" className="mt-4">
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {loadingPrivs ? (
                <div className="flex justify-center p-4"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>
              ) : privs.length > 0 ? (
                privs.map((p, i) => (
                  <div key={i} className="text-sm border-l-2 border-primary pl-3 py-1 my-2">
                    <span className="font-medium flex items-center gap-2">
                      {p.permissions?.name}
                    </span>
                    <span className="text-xs text-muted-foreground block mt-1">{p.permissions?.description}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm text-center p-4 italic">This role carries no extended privileges.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default function UsersAdmin() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const load = async () => {
    setLoading(true);
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id, email, display_name"),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    const merged = (profiles ?? []).map((p) => ({
      ...p,
      roles: (roles ?? []).filter((r) => r.user_id === p.id).map((r) => r.role as Role),
    }));
    setUsers(merged);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setRole = async (userId: string, newRole: Role) => {
    await supabase.from("user_roles").delete().eq("user_id", userId);
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: newRole });
    if (error) toast.error(error.message);
    else {
      toast.success("Role updated");
      load();
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch = (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.display_name || "").toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;
      const role = u.roles[0] ?? "viewer";
      if (activeTab === "admins" && role !== "admin") return false;
      if (activeTab === "staff" && (role === "admin" || role === "viewer")) return false;
      if (activeTab === "viewers" && role !== "viewer") return false;
      return true;
    });
  }, [users, search, activeTab]);

  if (loading) return <Loader2 className="w-6 h-6 animate-spin text-primary" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users & Roles</h1>
          <p className="text-muted-foreground mt-1">Comprehensive overview of platform access and privileges.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 pt-4 pb-2 flex flex-col md:flex-row justify-between gap-4 border-b">
            <TabsList className="bg-transparent space-x-2">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                All Users <Badge variant="secondary" className="ml-2 bg-background/50">{users.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="admins" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Admins
              </TabsTrigger>
              <TabsTrigger value="staff" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Editorial Staff
              </TabsTrigger>
              <TabsTrigger value="viewers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Viewers
              </TabsTrigger>
            </TabsList>
            <div className="relative w-full md:w-64 shrink-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search email or name..."
                className="w-full bg-background pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="p-4 space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground flex flex-col items-center">
                <Search className="w-8 h-8 mb-4 opacity-50" />
                <p>No users correspond to this specific filter/search combination.</p>
              </div>
            ) : (
              filteredUsers.map((u) => {
                const currentRole = u.roles[0] ?? "viewer";
                return (
                  <Card key={u.id} className="shadow-none border-border/60 hover:border-primary/40 transition-colors">
                    <CardContent className="flex items-center justify-between p-4 flex-wrap gap-4">
                      <div className="min-w-0 flex items-center gap-3">
                        <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground truncate">{u.display_name || u.email || u.id}</div>
                          <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <Select value={currentRole} onValueChange={(v) => setRole(u.id, v as Role)}>
                          <SelectTrigger className="w-[140px] bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="reviewer">Reviewer</SelectItem>
                            <SelectItem value="contributor">Contributor</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>

                        <UserDetailDialog u={u} currentRole={currentRole} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </Tabs>
      </div>

      <p className="text-xs text-muted-foreground px-2">
        Changes to roles propagate instantly and impact user routing and access capabilities across the platform.
      </p>
    </div>
  );
}
