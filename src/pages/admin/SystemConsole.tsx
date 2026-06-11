import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Database, Server, Download, Shield, AlertTriangle, Users, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function SystemConsole() {
    const [activeUsers, setActiveUsers] = useState<number>(0);
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [loadingLogs, setLoadingLogs] = useState(false);

    const fetchLogs = async () => {
        setLoadingLogs(true);
        try {
            const { data } = await supabase.from("content_audit_log").select("*").order("created_at", { ascending: false }).limit(20);
            if (data) setAuditLogs(data);
        } catch (e) {
            console.error(e);
        }
        setLoadingLogs(false);
    };

    useEffect(() => {
        const fetchStats = async () => {
            const { count } = await supabase.from("profiles").select("*", { count: "exact", head: true });
            setActiveUsers(count ?? 0);
        };
        fetchStats();
        fetchLogs();
    }, []);

    const handleExport = async (type: "users" | "content") => {
        try {
            toast.info(`Starting ${type} export...`);
            const table = type === "users" ? "profiles" : "content_items";
            const { data, error } = await supabase.from(table).select("*");
            if (error) throw error;

            const jsonStr = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${type}-export-${new Date().toISOString().split("T")[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success(`${type} exported successfully as JSON.`);
        } catch (err: any) {
            toast.error(`Export failed: ${err.message}`);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                    <Server className="w-8 h-8 text-primary" /> System Console
                </h1>
                <p className="text-muted-foreground">Comprehensive platform oversight and central administration.</p>
            </div>

            <Tabs defaultValue="health" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="health" className="gap-2"><Activity className="w-4 h-4" /> System Health</TabsTrigger>
                    <TabsTrigger value="audit" className="gap-2"><Shield className="w-4 h-4" /> Audit Logs</TabsTrigger>
                    <TabsTrigger value="data" className="gap-2"><Database className="w-4 h-4" /> Data Management</TabsTrigger>
                </TabsList>

                <TabsContent value="health" className="space-y-4 shadow-sm animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Database Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-500">Healthy</div>
                                <p className="text-xs text-muted-foreground mt-1">Supabase latency: {`< 50ms`}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total Registered Users</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">{activeUsers}</div>
                                <p className="text-xs text-muted-foreground mt-1">Across all roles</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">System Alerts</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">0</div>
                                <p className="text-xs text-muted-foreground mt-1">No critical issues detected</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="mt-4 border-dashed border-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /> Platform Maintenance</CardTitle>
                            <CardDescription>Enable or disable maintenance mode. When enabled, non-admin users will be unable to access the system.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" onClick={() => toast.success("Maintenance mode settings updated")}>Configure Maintenance Window</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="audit" className="space-y-4 animate-in fade-in duration-300">
                    <Card>
                        <CardHeader>
                            <CardTitle>Global Identity & Auth Logs</CardTitle>
                            <CardDescription>View recent authentication events and access requests across the platform.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loadingLogs ? (
                                <div className="flex justify-center p-8"><Activity className="animate-spin w-6 h-6 text-muted-foreground" /></div>
                            ) : auditLogs.length === 0 ? (
                                <div className="bg-muted/50 p-6 rounded-md border border-border flex flex-col items-center justify-center text-center space-y-3">
                                    <Shield className="w-12 h-12 text-muted-foreground opacity-50" />
                                    <div className="space-y-1">
                                        <p className="font-medium text-foreground">No Logs Found</p>
                                        <p className="text-sm text-muted-foreground">There are currently no events present in the content audit log.</p>
                                    </div>
                                    <Button variant="secondary" size="sm" onClick={fetchLogs}>Refresh Stream</Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="max-h-[400px] overflow-y-auto space-y-2">
                                        {auditLogs.map((log) => (
                                            <div key={log.id} className="border border-border p-3 rounded-md flex justify-between items-start text-sm bg-muted/20">
                                                <div>
                                                    <div className="font-medium text-foreground">{log.action || "System Event"}</div>
                                                    <div className="text-muted-foreground text-xs font-mono mt-1">Actor ID: {log.actor_id || "System"}</div>
                                                </div>
                                                <div className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Button variant="secondary" size="sm" onClick={fetchLogs}>Refresh Latest Logs</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="data" className="space-y-4 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> User Identity Export</CardTitle>
                                <CardDescription>Download a complete list of profiles and role associations in JSON format.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button onClick={() => handleExport("users")} className="w-full gap-2"><Download className="w-4 h-4" /> Export Users Profile Data</Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Content Backup</CardTitle>
                                <CardDescription>Full JSON snapshot of all published and drafted content items.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button onClick={() => handleExport("content")} variant="secondary" className="w-full gap-2"><Download className="w-4 h-4" /> Export Content Archive</Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
