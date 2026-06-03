## Comprehensive CMS with Approval Workflow

Extend the existing admin module into a full editorial CMS where multiple stakeholders can draft, review, approve, schedule, and publish content with full audit history.

### 1. Roles & permissions (expand existing `app_role`)

Add finer-grained roles to the existing `user_roles` table:

- `admin` — full control, manage users, settings, publish anything
- `editor` — create/edit any content, approve & publish
- `reviewer` — review submissions, approve or request changes (cannot publish settings)
- `contributor` — create & edit own drafts, submit for review
- `viewer` — read-only access to admin (audit, preview drafts)

Per-section permission helpers via `has_role()` security-definer function (already in place).

### 2. Versioned content model

Replace the current "live-only" `site_content` and `programmes` storage with a draft/published pattern:

- `content_items` — canonical row per piece of content (homepage block, programme, page, etc.). Holds `published_version_id` pointer.
- `content_versions` — every save creates a new immutable version with `status` (`draft`, `in_review`, `changes_requested`, `approved`, `scheduled`, `published`, `archived`), `value` (jsonb), `author_id`, `created_at`, optional `scheduled_for`.
- `content_reviews` — review actions log: reviewer, decision (approve / request_changes), comment, timestamp.
- `content_audit_log` — generic append-only log of who did what (create, edit, submit, approve, publish, rollback, delete).

Public site reads only the `published_version_id` of each item, so drafts never leak.

### 3. Editorial workflow

```text
draft → submit → in_review → ┬─ approved → publish now / schedule
                             └─ changes_requested → back to draft
published ↔ rollback to previous version
```

- Contributors can only edit their own drafts and submit.
- Reviewers/editors see a global review queue; approve or request changes with a comment.
- Editors/admins publish immediately or schedule a future publish time.
- Any published version can be rolled back to a prior version with one click.
- Scheduled posts go live via a `pg_cron`-triggered edge function that flips `published_version_id` when `scheduled_for <= now()`.

### 4. Admin UI additions (under `/admin`)

- **Review queue** (`/admin/review`) — list of items in `in_review`, filter by type/author, inline diff vs published, approve / request changes.
- **Content workspace** (`/admin/content/:type/:id`) — tabbed editor: Edit · History · Reviews · Preview. Diff viewer between versions. Status badge & action bar (Save draft, Submit, Approve, Publish, Schedule, Rollback).
- **My drafts** (`/admin/my-work`) — contributor home, shows own drafts and review feedback.
- **Activity log** (`/admin/activity`) — searchable audit trail.
- **Scheduled** (`/admin/scheduled`) — upcoming publishes with cancel/reschedule.
- Existing **Homepage Content** and **Programmes** editors refactored to use the new versioned model + status badges and "Submit for review" / "Publish" actions per their role.
- Existing **Users & Roles** gains the new roles and a "transfer ownership" action.

### 5. Notifications

In-app toast + a `notifications` table:
- Reviewer notified on new submission.
- Author notified on approval / changes requested / publish.
- Optional email via existing Resend connector (deferred unless requested).

### 6. Public site impact

`Hero`, `Features`, `CTA`, `ProgrammeDetail` queries switched from `site_content` / `programmes` to a `published_content` view that exposes only the currently published version. No visible change for end users; behaviour is identical until editors publish new versions.

---

### Technical details

- **Migrations**: new tables `content_items`, `content_versions`, `content_reviews`, `content_audit_log`, `notifications`, `scheduled_publishes`. New enum values for `app_role` (`reviewer`, `contributor`). New enum `content_status`. RLS via `has_role()` + ownership checks. GRANTs for `anon` (read published view only) and `authenticated` (scoped writes).
- **Data migration**: backfill `content_items` + one `published` `content_versions` row per existing `site_content` row and per `programmes` row, preserve current live content.
- **Edge function**: `publish-scheduled` cron'd every minute via `pg_cron` to promote due scheduled versions.
- **Frontend**: new `useContentItem`, `useContentVersions`, `useReviewQueue`, `useAuditLog` hooks. Diff rendering with a small JSON-diff helper. Permission gates derived from `useAuth().role`.
- **Backwards compat**: keep `site_content` / `programmes` tables temporarily as the source for the backfill, then point reads at the new `published_content` view; deprecate the old write paths.

### Out of scope (ask if wanted)

- Media library / image uploads
- Multi-language / i18n
- Public preview links for unauthenticated reviewers
- Email notifications (kept as a follow-up)
