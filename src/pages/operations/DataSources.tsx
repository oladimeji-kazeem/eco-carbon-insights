import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Plus, Database, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { pipelineService } from "@/services/pipelineService";
import { toast } from "sonner";

export default function DataSources() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setIsUploading(true);
            toast.info("Upload started...");

            try {
                const result = await pipelineService.uploadFile(file);
                if (result.success) {
                    toast.success("File processed successfully!");
                } else {
                    toast.error("File processing failed. Check dashboard.");
                }
            } catch (error) {
                toast.error("Unexpected error during upload.");
            } finally {
                setIsUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Data Sources</h2>
                <p className="text-muted-foreground">Connect your accounts or upload files to track carbon emissions.</p>
            </div>

            <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="upload">Manual Upload</TabsTrigger>
                    <TabsTrigger value="integrations">Integrations</TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload Documents</CardTitle>
                            <CardDescription>
                                Upload utility bills, fuel invoices, or flight tickets. We process PDF, JPG, and PNG.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div
                                className="border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center gap-4 hover:bg-muted/50 transition-colors cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileSelect}
                                    accept=".pdf,.png,.jpg,.jpeg,.csv"
                                />
                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                    {isUploading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : <Upload className="h-6 w-6 text-muted-foreground" />}
                                </div>
                                <div className="text-center">
                                    <p className="font-medium">{isUploading ? "Processing..." : "Click to upload or drag and drop"}</p>
                                    <p className="text-sm text-muted-foreground">PDF, PNG, JPG up to 10MB</p>
                                </div>
                                <Button variant="secondary" disabled={isUploading}>
                                    {isUploading ? "Uploading..." : "Select Files"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="integrations" className="space-y-4 mt-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card className="flex flex-col justify-between">
                            <CardHeader>
                                <div className="h-10 w-10 rounded bg-[#2CA01C] flex items-center justify-center text-white font-bold mb-2">QB</div>
                                <CardTitle>QuickBooks</CardTitle>
                                <CardDescription>Sync invoices and expenses automatically.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full" variant="outline">Connect</Button>
                            </CardContent>
                        </Card>
                        <Card className="flex flex-col justify-between">
                            <CardHeader>
                                <div className="h-10 w-10 rounded bg-[#0075C9] flex items-center justify-center text-white font-bold mb-2">X</div>
                                <CardTitle>Xero</CardTitle>
                                <CardDescription>Import financial data for analysis.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full" variant="outline">Connect</Button>
                            </CardContent>
                        </Card>
                        <Card className="flex flex-col justify-between opacity-60">
                            <CardHeader>
                                <div className="h-10 w-10 rounded bg-slate-800 flex items-center justify-center text-white font-bold mb-2">
                                    <Database className="h-5 w-5" />
                                </div>
                                <CardTitle>Custom API</CardTitle>
                                <CardDescription>Enterprise plan only.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full" disabled>Contact Sales</Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
