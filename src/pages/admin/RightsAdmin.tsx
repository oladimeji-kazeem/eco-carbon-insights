import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AppRole } from "@/hooks/useAuth";

const ROLES: AppRole[] = ["admin", "editor", "reviewer", "contributor", "viewer"];

type Permission = { id: string; name: string; description: string };
type MatrixItem = { role: string; permission_id: string };

export default function RightsAdmin() {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [matrix, setMatrix] = useState<MatrixItem[]>([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        const [permsRes, matrixRes] = await Promise.all([
            supabase.from("permissions").select("*").order("name"),
            supabase.from("role_permissions_matrix").select("*"),
        ]);

        if (permsRes.data) setPermissions(permsRes.data);
        if (matrixRes.data) setMatrix(matrixRes.data);
        setLoading(false);
    };

    useEffect(() => {
        load();
    }, []);

    const togglePermission = async (role: AppRole, permissionId: string, enabled: boolean) => {
        if (role === "admin") {
            toast.error("Admins have all permissions by default. This cannot be removed.");
            return;
        }

        try {
            if (enabled) {
                setMatrix((prev) => [...prev, { role, permission_id: permissionId }]);
                await supabase.from("role_permissions_matrix").insert({ role, permission_id: permissionId });
            } else {
                setMatrix((prev) => prev.filter((m) => !(m.role === role && m.permission_id === permissionId)));
                await supabase
                    .from("role_permissions_matrix")
                    .delete()
                    .eq("role", role)
                    .eq("permission_id", permissionId);
            }
            toast.success("Permissions updated");
        } catch (error: any) {
            toast.error(error.message);
            load(); // Reload on failure
        }
    };

    if (loading) return <Loader2 className="w-6 h-6 animate-spin text-primary" />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Rights & Privileges</h1>
                <p className="text-muted-foreground">Manage what each role can do across the platform.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Role Permissions Matrix</CardTitle>
                    <CardDescription>
                        Assign fine-grained abilities to different organizational roles.
                    </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 rounded-tl-md">Permission</th>
                                {ROLES.map((role) => (
                                    <th key={role} className="px-4 py-3 text-center">{role}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {permissions.map((p) => (
                                <tr key={p.id} className="border-b border-border hover:bg-muted/30">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-foreground">{p.name}</div>
                                        <div className="text-xs text-muted-foreground">{p.description}</div>
                                    </td>
                                    {ROLES.map((role) => {
                                        const hasPerm = role === "admin" || matrix.some((m) => m.role === role && m.permission_id === p.id);
                                        return (
                                            <td key={role} className="px-4 py-3 text-center align-middle">
                                                <Checkbox
                                                    checked={hasPerm}
                                                    disabled={role === "admin"}
                                                    onCheckedChange={(checked) => togglePermission(role, p.id, !!checked)}
                                                />
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
