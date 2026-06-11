import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Layers, Inbox, Calendar, History, ClipboardList, Users, Settings as SettingsIcon, Server } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useReviewQueue, useScheduled, useContentItems } from "@/hooks/useCMS";

export default function AdminDashboard() {
  const { role, canReview } = useAuth();
  const { data: items } = useContentItems();
  const { data: queue } = useReviewQueue();
  const { data: scheduled } = useScheduled();

  const cards = [
    { to: "/admin/my-work", label: "My work", icon: ClipboardList, hint: "Your drafts" },
    canReview && { to: "/admin/review", label: "Review queue", icon: Inbox, count: queue?.length ?? 0, hint: "Awaiting review" },
    canReview && { to: "/admin/scheduled", label: "Scheduled", icon: Calendar, count: scheduled?.length ?? 0, hint: "Upcoming publishes" },
    { to: "/admin/content-items", label: "All content", icon: Layers, count: items?.length ?? 0, hint: "Managed items" },
    canReview && { to: "/admin/activity", label: "Activity", icon: History, hint: "Editorial log" },
    role === "admin" && { to: "/admin/users", label: "Users & roles", icon: Users, hint: "Team" },
    role === "admin" && { to: "/admin/settings", label: "Site settings", icon: SettingsIcon, hint: "Branding & SEO" },
    role === "admin" && { to: "/admin/system", label: "System Console", icon: Server, hint: "Health & Logs" },
  ].filter(Boolean) as Array<{ to: string; label: string; icon: typeof Layers; count?: number; hint: string }>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
        <p className="text-muted-foreground">Plan, review, schedule, and publish content across Eco Centre.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link key={c.to} to={c.to}>
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{c.label}</CardTitle>
                <c.icon className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                {typeof c.count === "number" && (
                  <div className="text-2xl font-bold text-foreground">{c.count}</div>
                )}
                <CardDescription className="text-xs">{c.hint}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
