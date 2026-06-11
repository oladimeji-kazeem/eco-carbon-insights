-- PART 1: Run this file entirely first, then run Part 2 once successful.
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
