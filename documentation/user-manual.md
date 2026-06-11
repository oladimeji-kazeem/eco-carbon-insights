# Platform User Manual

Welcome to the Carbon Insights platform! This guide demonstrates how users across all privilege levels interact with the system.

---

## 1. Getting Started (Registration & Login)
1. **Sign Up**: Navigate to `/signup`. Fill in your Display Name, Email, and Password. *Note: The very first user to register on a new backend installation is automatically granted super-admin privileges.*
2. **Standard Access**: Once authorized, standard users (`viewer` role) default to the user-facing **Dashboard** where they can engage with available Analytics, Operations tracking, and general Uploads.
3. **Session**: The platform remembers your session unless you click the "Sign out" button in the sidebar.

---

## 2. Standard User Access (App Module)
Found under the standard `/app` workflow:
- **Dashboards**: Visualize real-time trends regarding system operations and analytics. Contains interactive chart arrays.
- **Operations & Data Sources**: Interfaces to track origin datasets ensuring validity.
- **Settings**: Manage basic personal preferences.

---

## 3. Editorial Team Features
Targeted for users designated as `editor`, `reviewer`, or `contributor`. Found exclusively under `/admin`.
- **My Work**: The content repository showing drafted or in-progress articles, site components, and programmes you are working on.
- **All Content / Workspace**: A tabular breakdown of content items available in the CMS where users edit dynamic variables and markdown text.
- **Review Queue (Reviewers only)**: A staging area specifically for pending items requiring validation. Options exist to "Approve" (push to published/scheduled), "Request Changes", or "Comment" on a particular iteration.
- **Activity Log**: Specialized log tracking strictly editorial events (drafts, published items, modifications) for accountability.

---

## 4. Administration (Admins Only)
Admins have access to deep configuration capabilities across the entire application ecosystem via the Admin area.

### System Console
Central Hub for platform health:
- **Health Tab**: View connected database latency and active user counts. Controls for Maintenance Modes.
- **Audit Logs Tab**: Inspect the underlying `content_audit_log` fetching the latest critical 20 platform events including exact User ID assignments and modifications.
- **Data Management**: Quickly export `profiles` (User Data) or `content_items` (Site content Backup) locally as `.json` blob arrays strictly from the browser.

### Users & Roles
- Easily survey all registered users.
- Use the quick dropdown explicitly to bump a user's role (e.g. elevate a `viewer` to `editor`). 
- **Details Action**: Spawns an overlay inspecting individual properties and explicitly pulls the latest audit-recorded activities performed specifically by that individual.

### Rights Matrix
A visual grid system allowing Admins to assign or retract specific permissions (like `manage_content` or `publish_content`) to particular Roles, scaling accessibility naturally beyond initial templates.
