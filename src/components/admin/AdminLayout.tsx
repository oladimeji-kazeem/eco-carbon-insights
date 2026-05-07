import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, Boxes, Settings as SettingsIcon, Users, LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import logo from "@/assets/logo.png";

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/content", label: "Homepage Content", icon: FileText },
  { to: "/admin/programmes", label: "Programmes", icon: Boxes },
  { to: "/admin/settings", label: "Site Settings", icon: SettingsIcon, adminOnly: true },
  { to: "/admin/users", label: "Users & Roles", icon: Users, adminOnly: true },
];

export default function AdminLayout() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Eco Centre" className="w-8 h-8" />
            <div>
              <div className="font-bold text-foreground text-sm">Eco Centre</div>
              <div className="text-xs text-muted-foreground">Admin</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems
            .filter((i) => !i.adminOnly || role === "admin")
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
        </nav>

        <div className="p-3 border-t border-border space-y-2">
          <div className="px-2 py-2">
            <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
            {role && <Badge variant="secondary" className="mt-1 text-xs">{role}</Badge>}
          </div>
          <Link to="/" className="block">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <ArrowLeft className="w-4 h-4" />
              View site
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="container max-w-5xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
