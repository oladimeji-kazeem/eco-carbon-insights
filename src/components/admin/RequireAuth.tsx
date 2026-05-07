import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface Props {
  children: ReactNode;
  requireAdmin?: boolean;
  requireEditor?: boolean;
}

export default function RequireAuth({ children, requireAdmin, requireEditor }: Props) {
  const { user, loading, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-2">Admin only</h1>
          <p className="text-muted-foreground">
            You need admin access to view this page. Contact a site administrator.
          </p>
        </div>
      </div>
    );
  }

  if (requireEditor && role !== "admin" && role !== "editor") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-2">Editor access required</h1>
          <p className="text-muted-foreground">Ask an admin to grant you editor permissions.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
