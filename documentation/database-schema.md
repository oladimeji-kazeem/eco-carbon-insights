# Database Schema Documentation

The platform leverages **Supabase (PostgreSQL)** for its backend. This document captures the architecture of the primary tables, enums, and their relationships.

## Enums
- **`app_role`**: `admin`, `editor`, `viewer`, `reviewer`, `contributor`
- **`content_status`**: `draft`, `in_review`, `changes_requested`, `approved`, `scheduled`, `published`, `archived`
- **`content_type`**: `site_content`, `programme`, `page`

---

## 1. Auth & Identity

### `profiles`
Created automatically via an Auth Trigger upon user registration in Supabase.
- **id**: `uuid` (References `auth.users`, Primary Key)
- **email**: `text`
- **display_name**: `text`
- **created_at**, **updated_at**: `timestamptz`

---

## 2. Access Control & Roles

### `user_roles`
Tracks which users carry which elevated privileges within the platform.
- **id**: `uuid` 
- **user_id**: `uuid` (References `auth.users`)
- **role**: `app_role` (e.g. `admin`, `viewer`)

### `permissions` & `role_permissions_matrix`
Granular Role-Based Access Control matrix.
- `permissions`: List of all capabilities (`manage_users`, `manage_content`, `publish_content`, etc.)
- `role_permissions_matrix`: Junction table linking `app_role` with specific `permission_id`. 

*(Note: The system also leverages Row-Level Security (RLS) policies directly against `app_role` utilizing the PL/pgSQL function `public.has_role()`.)*

---

## 3. Content Management Ecosystem (CMS)

### `content_items`
The logical root for any piece of published content or page.
- **id**: `uuid`
- **type**: `content_type`
- **slug**: `text` (Unique per type)
- **title**: `text`
- **published_version_id**: `uuid` (References `content_versions`)
- **current_version_id**: `uuid` (References `content_versions`)
- **created_by**: `uuid` (References `auth.users`)

### `content_versions`
The versioned iterative history for content items, supporting drafts and scheduled reviews.
- **id**: `uuid`
- **item_id**: `uuid` (References `content_items`)
- **version_number**: `int`
- **status**: `content_status`
- **value**: `jsonb` (The actual content payload)
- **author_id**: `uuid`
- **note**: `text`
- **scheduled_for**, **published_at**: `timestamptz`

### `content_reviews`
Editorial tracking linking reviewers with decisions on specific versions.
- **id**: `uuid`
- **version_id**: `uuid` (References `content_versions`)
- **reviewer_id**: `uuid` (References `auth.users`)
- **decision**: `text` ('approve', 'request_changes', 'comment')
- **comment**: `text`

---

## 4. System Security & Audit

### `content_audit_log`
The system-wide immutable tracking mechanism for critical platform events.
- **id**: `uuid`
- **item_id**: `uuid` (Nullable, References `content_items`)
- **version_id**: `uuid` (Nullable, References `content_versions`)
- **actor_id**: `uuid` (References `auth.users`)
- **action**: `text`
- **meta**: `jsonb`

### `notifications`
System alerts directed to specific users.
- **user_id**: `uuid` (References `auth.users`)
- **kind**: `text`
- **title**: `text`
- **body**: `text`
- **read**: `boolean`
