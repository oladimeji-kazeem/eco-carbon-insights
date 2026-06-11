import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole =
  | "admin" | "editor" | "reviewer" | "contributor" | "viewer"
  | "originator" | "developer" | "quantifier" | "custodian" | "quantification_custodian"
  | "copy_editor" | "curator" | "topic_lead" | "product_manager";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: AppRole | null;
  roles: AppRole[];
  permissions: string[];
  hasRole: (...r: AppRole[]) => boolean;
  hasPermission: (p: string) => boolean;
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
  permissions: [],
  hasRole: () => false,
  hasPermission: () => false,
  canPublish: false,
  canReview: false,
  canEdit: false,
  signOut: async () => { },
});

const RANK: AppRole[] = [
  "admin",
  "product_manager",
  "curator",
  "topic_lead",
  "custodian",
  "quantification_custodian",
  "editor",
  "reviewer",
  "quantifier",
  "copy_editor",
  "developer",
  "originator",
  "contributor",
  "viewer"
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        setTimeout(() => fetchRolesAndPermissions(newSession.user.id), 0);
      } else {
        setRoles([]);
        setPermissions([]);
      }
    });

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) fetchRolesAndPermissions(currentSession.user.id);
      else setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRolesAndPermissions = async (userId: string) => {
    try {
      const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", userId);
      const userRoles = (roleData ?? []).map((r) => r.role as AppRole);
      setRoles(userRoles);

      if (userRoles.length > 0) {
        // Assume 'role' column is what role_permissions_matrix maps to
        const { data: perms } = await supabase
          .from("role_permissions_matrix")
          .select("permissions(name)")
          .in("role", userRoles);

        // Flatten the joined data
        const extracted = new Set<string>();
        perms?.forEach((p) => {
          // Depending on relationship, permissions might be single object or array
          const target = p.permissions;
          if (Array.isArray(target)) target.forEach((t: any) => extracted.add(t.name));
          else if (target && typeof target === 'object' && 'name' in target) extracted.add((target as any).name);
        });
        setPermissions(Array.from(extracted));
      } else {
        setPermissions([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => { await supabase.auth.signOut(); };

  const hasRole = (...r: AppRole[]) => r.some((x) => roles.includes(x));
  const hasPermission = (p: string) => permissions.includes(p) || hasRole("admin");
  const role = RANK.find((r) => roles.includes(r)) ?? null;
  const canPublish = hasPermission("publish_content");
  const canReview = hasPermission("review_content");
  const canEdit = hasPermission("manage_content");

  return (
    <AuthContext.Provider value={{ user, session, loading, role, roles, permissions, hasRole, hasPermission, canPublish, canReview, canEdit, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
