
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full">
                <AppSidebar />
                <main className="flex-1 w-full">
                    <div className="p-4 border-b flex items-center gap-4 bg-background z-10 sticky top-0">
                        <SidebarTrigger />
                        <h2 className="font-semibold">Dashboard</h2>
                    </div>
                    <div className="p-6 bg-muted/20 min-h-[calc(100vh-65px)]">
                        <Outlet />
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
