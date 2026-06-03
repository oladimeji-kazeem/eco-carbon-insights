import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "editor" | "reviewer" | "contributor" | "viewer";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: AppRole | null;
  roles: AppRole[];
  hasRole: (...r: AppRole[]) => boolean;
  canPublish: boolean;
  canReview: boolean;
  canEdit: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
  role: null,
  roles: [],
  hasRole: () => false,
  canPublish: false,
  canReview: false,
  canEdit: false,
  signOut: async () => {},
});

const RANK: AppRole[] = ["admin", "editor", "reviewer", "contributor", "viewer"];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        setTimeout(() => fetchRoles(newSession.user.id), 0);
      } else {
        setRoles([]);
      }
    });

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) fetchRoles(currentSession.user.id);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRoles = async (userId: string) => {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    setRoles((data ?? []).map((r) => r.role as AppRole));
  };

  const signOut = async () => { await supabase.auth.signOut(); };

  const hasRole = (...r: AppRole[]) => r.some((x) => roles.includes(x));
  const role = RANK.find((r) => roles.includes(r)) ?? null;
  const canPublish = hasRole("admin", "editor");
  const canReview = hasRole("admin", "editor", "reviewer");
  const canEdit = hasRole("admin", "editor", "reviewer", "contributor");

  return (
    <AuthContext.Provider value={{ user, session, loading, role, roles, hasRole, canPublish, canReview, canEdit, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
