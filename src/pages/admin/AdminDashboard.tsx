import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Boxes, Settings as SettingsIcon, Users } from "lucide-react";
import { useProgrammes } from "@/hooks/useProgrammesData";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useAuth } from "@/hooks/useAuth";

export default function AdminDashboard() {
  const { role } = useAuth();
  const { data: programmes } = useProgrammes(true);
  const { data: content } = useSiteContent();

  const cards = [
    { to: "/admin/content", label: "Homepage Content", icon: FileText, count: content?.length ?? 0, suffix: "blocks" },
    { to: "/admin/programmes", label: "Programmes", icon: Boxes, count: programmes?.length ?? 0, suffix: "total" },
    ...(role === "admin"
      ? [
          { to: "/admin/settings", label: "Site Settings", icon: SettingsIcon, count: 1, suffix: "config" },
          { to: "/admin/users", label: "Users & Roles", icon: Users, count: null, suffix: "" },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
        <p className="text-muted-foreground">Manage every part of your Eco Centre site from here.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {cards.map((c) => (
          <Link key={c.to} to={c.to}>
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{c.label}</CardTitle>
                <c.icon className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                {c.count !== null && (
                  <div className="text-2xl font-bold text-foreground">
                    {c.count} <span className="text-sm font-normal text-muted-foreground">{c.suffix}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
