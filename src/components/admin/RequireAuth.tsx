import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth, AppRole } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface Props {
  children: ReactNode;
  requireAdmin?: boolean;
  requireEditor?: boolean;
  requireReviewer?: boolean;
  requireAnyRole?: AppRole[];
}

export default function RequireAuth({ children, requireAdmin, requireEditor, requireReviewer, requireAnyRole }: Props) {
  const { user, loading, role, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  const denied = (label: string, body: string) => (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-foreground mb-2">{label}</h1>
        <p className="text-muted-foreground">{body}</p>
      </div>
    </div>
  );

  if (requireAdmin && role !== "admin") return denied("Admin only", "You need admin access to view this page.");
  if (requireEditor && !hasRole("admin", "editor")) return denied("Editor access required", "Ask an admin to grant you editor permissions.");
  if (requireReviewer && !hasRole("admin", "editor", "reviewer")) return denied("Reviewer access required", "Ask an admin to grant you reviewer permissions.");
  if (requireAnyRole && !hasRole(...requireAnyRole)) return denied("Access denied", "Your role does not grant access to this section.");

  return <>{children}</>;
}
