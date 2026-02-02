
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ArrowUpRight, CheckCircle2, AlertCircle, Clock, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { usePipelineStore } from "@/lib/pipelineStore";
import { formatDistanceToNow } from "date-fns";

export default function OperationsDashboard() {
    const { jobs, getPendingCount, getFailedCount } = usePipelineStore();
    const pendingCount = getPendingCount();
    const failedCount = getFailedCount();
    const isHealthy = failedCount === 0;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Operations</h2>
                    <p className="text-muted-foreground">Manage data ingestion and view processing health.</p>
                </div>
                <div className="flex gap-2">
                    <Link to="/app/operations/sources">
                        <Button>
                            <FileText className="mr-2 h-4 w-4" />
                            Manage Sources
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Health</CardTitle>
                        <CheckCircle2 className={`h-4 w-4 ${isHealthy ? "text-green-500" : "text-destructive"}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{isHealthy ? "Operational" : "Attention Needed"}</div>
                        <p className="text-xs text-muted-foreground">{isHealthy ? "All systems functioning normal" : `${failedCount} failed jobs detected`}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Processing</CardTitle>
                        <Clock className={`h-4 w-4 ${pendingCount > 0 ? "text-orange-500 animate-pulse" : "text-muted-foreground"}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingCount} Files</div>
                        <p className="text-xs text-muted-foreground">{pendingCount > 0 ? "Processing in background..." : "Queue is empty"}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Failed Items</CardTitle>
                        <AlertCircle className={`h-4 w-4 ${failedCount > 0 ? "text-destructive" : "text-muted-foreground"}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{failedCount}</div>
                        <p className="text-xs text-muted-foreground">Last 24 hours</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest data ingestion events.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {jobs.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">No recent activity.</p>
                            ) : (
                                jobs.slice(0, 5).map((job) => (
                                    <div key={job.id} className="flex items-center animate-fade-in">
                                        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${job.status === 'completed' ? 'bg-green-100' :
                                                job.status === 'failed' ? 'bg-red-100' : 'bg-blue-100'
                                            }`}>
                                            {job.status === 'completed' ? <CheckCircle2 className="h-4 w-4 text-green-600" /> :
                                                job.status === 'failed' ? <AlertCircle className="h-4 w-4 text-red-600" /> :
                                                    <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />}
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">{job.filename}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {job.status === 'pending' && 'Queued'}
                                                {job.status === 'scanning' && 'Scanning...'}
                                                {job.status === 'processing' && 'Extracting Data...'}
                                                {job.status === 'completed' && `Processed ${formatDistanceToNow(job.timestamp, { addSuffix: true })}`}
                                                {job.status === 'failed' && 'Failed'}
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium">
                                            <Badge variant={
                                                job.status === 'completed' ? 'default' :
                                                    job.status === 'failed' ? 'destructive' : 'secondary'
                                            }>
                                                {job.status === 'completed' ? 'Success' :
                                                    job.status === 'failed' ? 'Failed' : job.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Active Data Sources</CardTitle>
                        <CardDescription>Connected integrations and manual uploads.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded bg-[#2CA01C] flex items-center justify-center text-white font-bold">QB</div>
                                    <div>
                                        <p className="font-medium">QuickBooks Online</p>
                                        <p className="text-xs text-muted-foreground">Last sync: Today 10:00 AM</p>
                                    </div>
                                </div>
                                <Badge>Connected</Badge>
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded bg-orange-500 flex items-center justify-center text-white font-bold">U</div>
                                    <div>
                                        <p className="font-medium">Manual Uploads</p>
                                        <p className="text-xs text-muted-foreground">PDF, CSV, Excel supported</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">Upload</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
