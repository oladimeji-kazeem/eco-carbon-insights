-- 1. Upgrade the ENUM string to natively support the newly introduced 14-Step Pipeline operational roles
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'originator';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'developer';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'quantifier';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'custodian';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'quantification_custodian';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'copy_editor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'curator';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'topic_lead';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'product_manager';

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
