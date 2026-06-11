CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.role_permissions_matrix (
    role public.app_role NOT NULL,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role, permission_id)
);

-- Note: We use `role` as part of the primary key instead of `id` for simplicity

-- Enable RLS
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions_matrix ENABLE ROW LEVEL SECURITY;

-- Policies (Only admins can manage permissions)
CREATE POLICY "Admins can manage permissions" ON public.permissions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Anyone can read permissions" ON public.permissions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage role_permissions_matrix" ON public.role_permissions_matrix FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Anyone can read role_permissions_matrix" ON public.role_permissions_matrix FOR SELECT TO authenticated USING (true);

-- Insert default permissions
INSERT INTO public.permissions (name, description) VALUES
('manage_users', 'Can manage users and their roles'),
('manage_roles', 'Can manage role privileges and permissions'),
('manage_content', 'Can create and edit content'),
('publish_content', 'Can publish approved content'),
('review_content', 'Can review and approve/reject content'),
('manage_settings', 'Can update global site settings'),
('view_analytics', 'Can view dashboards and analytics')
ON CONFLICT (name) DO NOTHING;

-- Map defaults (Admins get everything automatically, but let's seed explicit mapping to make it UI visible)
WITH perms AS (SELECT id, name FROM public.permissions)
INSERT INTO public.role_permissions_matrix (role, permission_id)
SELECT 'admin'::public.app_role, p.id FROM perms p
ON CONFLICT DO NOTHING;

WITH perms AS (SELECT id, name FROM public.permissions WHERE name IN ('manage_content', 'publish_content', 'review_content', 'view_analytics'))
INSERT INTO public.role_permissions_matrix (role, permission_id)
SELECT 'editor'::public.app_role, p.id FROM perms p
ON CONFLICT DO NOTHING;

WITH perms AS (SELECT id, name FROM public.permissions WHERE name IN ('manage_content', 'review_content', 'view_analytics'))
INSERT INTO public.role_permissions_matrix (role, permission_id)
SELECT 'reviewer'::public.app_role, p.id FROM perms p
ON CONFLICT DO NOTHING;

WITH perms AS (SELECT id, name FROM public.permissions WHERE name IN ('manage_content'))
INSERT INTO public.role_permissions_matrix (role, permission_id)
SELECT 'contributor'::public.app_role, p.id FROM perms p
ON CONFLICT DO NOTHING;

WITH perms AS (SELECT id, name FROM public.permissions WHERE name IN ('view_analytics'))
INSERT INTO public.role_permissions_matrix (role, permission_id)
SELECT 'viewer'::public.app_role, p.id FROM perms p
ON CONFLICT DO NOTHING;
