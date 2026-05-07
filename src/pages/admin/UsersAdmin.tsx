import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Role = "admin" | "editor" | "viewer";

interface UserRow {
  id: string;
  email: string | null;
  display_name: string | null;
  roles: Role[];
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
    // Remove existing roles, then insert new one (single role per user UI)
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
      <div>
        <h1 className="text-3xl font-bold text-foreground">Users & Roles</h1>
        <p className="text-muted-foreground">Manage who can access the admin and what they can do.</p>
      </div>

      <div className="space-y-2">
        {users.length === 0 && (
          <Card><CardContent className="p-6 text-center text-muted-foreground">No users yet.</CardContent></Card>
        )}
        {users.map((u) => {
          const currentRole = u.roles[0] ?? "viewer";
          return (
            <Card key={u.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="min-w-0">
                  <div className="font-medium text-foreground truncate">{u.display_name || u.email || u.id}</div>
                  <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                </div>
                <Select value={currentRole} onValueChange={(v) => setRole(u.id, v as Role)}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
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
