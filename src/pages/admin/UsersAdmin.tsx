import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, User } from "lucide-react";

type Role = "admin" | "editor" | "reviewer" | "contributor" | "viewer";

interface UserRow {
  id: string;
  email: string | null;
  display_name: string | null;
  roles: Role[];
}

function UserDetailDialog({ u, currentRole }: { u: UserRow, currentRole: Role }) {
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    if (open) {
      setLoadingLogs(true);
      supabase.from("content_audit_log")
        .select("*")
        .eq("actor_id", u.id)
        .order("created_at", { ascending: false })
        .limit(5)
        .then(({ data }) => {
          if (data) setLogs(data);
          setLoadingLogs(false);
        });
    }
  }, [open, u.id]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Details</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>Extended attributes and activity for this user.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="text-sm">
            <span className="font-semibold block">User ID</span>
            <span className="text-muted-foreground break-all">{u.id}</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold block">Email Address</span>
            <span className="text-muted-foreground">{u.email || "N/A"}</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold block">Current Role</span>
            <span className="text-muted-foreground capitalize">{currentRole}</span>
          </div>
          <div className="text-sm border-t pt-4">
            <span className="font-semibold block mb-2">Recent Activity (Via DB)</span>
            {loadingLogs ? (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            ) : logs.length > 0 ? (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="text-xs bg-muted/30 p-2 rounded border border-border">
                    <span className="font-medium">{log.action}</span>
                    <div className="text-muted-foreground mt-1 opacity-70">
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">No recent loggable activities found.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function UsersAdmin() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <Loader2 className="w-6 h-6 animate-spin text-primary" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users & Roles</h1>
          <p className="text-muted-foreground">Manage who can access the admin and what they can do.</p>
        </div>
      </div>

      <div className="space-y-2">
        {users.length === 0 && (
          <Card><CardContent className="p-6 text-center text-muted-foreground">No users yet.</CardContent></Card>
        )}
        {users.map((u) => {
          const currentRole = u.roles[0] ?? "viewer";
          return (
            <Card key={u.id}>
              <CardContent className="flex items-center justify-between p-4 flex-wrap gap-4">
                <div className="min-w-0 flex items-center gap-3">
                  <div className="bg-muted w-10 h-10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground truncate">{u.display_name || u.email || u.id}</div>
                    <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Select value={currentRole} onValueChange={(v) => setRole(u.id, v as Role)}>
                    <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
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
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        New signups become viewers by default. The first registered user is automatically admin.
      </p>
    </div>
  );
}
