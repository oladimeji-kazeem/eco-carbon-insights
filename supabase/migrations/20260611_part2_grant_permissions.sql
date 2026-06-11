-- PART 2: Run this file ONLY AFTER Part 1 succeeds!
-- 2. Grant 'manage_content' permission securely onto the new Phase 5 Pipeline Roles
-- This safely unblocks the Backend Row Level Security denying Creation / Update operations

WITH perms AS (SELECT id, name FROM public.permissions WHERE name IN ('manage_content'))
INSERT INTO public.role_permissions_matrix (role, permission_id)
SELECT r, p.id FROM (VALUES 
  ('originator'::public.app_role), 
  ('developer'::public.app_role),
  ('quantifier'::public.app_role),
  ('custodian'::public.app_role),
  ('quantification_custodian'::public.app_role),
  ('copy_editor'::public.app_role),
  ('curator'::public.app_role),
  ('topic_lead'::public.app_role),
  ('product_manager'::public.app_role)
) AS v(r)
CROSS JOIN perms p
ON CONFLICT DO NOTHING;

-- Optionally, grant 'review_content' to the explicit phase validators
WITH perms AS (SELECT id, name FROM public.permissions WHERE name IN ('review_content'))
INSERT INTO public.role_permissions_matrix (role, permission_id)
SELECT r, p.id FROM (VALUES 
  ('custodian'::public.app_role),
  ('quantification_custodian'::public.app_role),
  ('curator'::public.app_role),
  ('product_manager'::public.app_role)
) AS v(r)
CROSS JOIN perms p
ON CONFLICT DO NOTHING;
