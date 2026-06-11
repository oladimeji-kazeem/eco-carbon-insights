COMMIT;
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'originator';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'developer';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'quantifier';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'custodian';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'quantification_custodian';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'copy_editor';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'curator';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'topic_lead';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'product_manager';
BEGIN;

ALTER TABLE public.content_items
  ADD COLUMN IF NOT EXISTS workflow_stage INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS assigned_role app_role;

ALTER TABLE public.content_versions
  ADD COLUMN IF NOT EXISTS copy_text TEXT,
  ADD COLUMN IF NOT EXISTS annual_monetary_savings NUMERIC,
  ADD COLUMN IF NOT EXISTS annual_carbon_savings NUMERIC;

-- Fix the existing policy if needed, or create new ones later. 
-- For now, the existing RLS on content_items and versions allows editor/admin access. 
-- We will handle field-level restrictions in the UI directly.
