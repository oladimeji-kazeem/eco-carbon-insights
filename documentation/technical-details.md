# Technical Details & Architecture

## Overview
The platform represents a modern, statically compiled Single Page Application (SPA) utilizing contemporary React patterns, bundled with immense speed utilizing Vite, and strictly typed via TypeScript.

## Technology Stack

### Frontend Core
- **Framework**: React 18
- **Build Tool**: Vite (Lightning fast transpilation & HMR)
- **Language**: TypeScript 5+

### State Management & Data Fetching
- **Server State**: `@tanstack/react-query` - Powers asynchronous fetching, caching, and synchronization handling against the backend API.
- **Client State**: `zustand` - Used for lightweight, predictable global state elements.

### Styling & UI Architecture
- **Framework**: Tailwind CSS v3/v4 (Utility-first styling system)
- **Component Library**: `radix-ui` / shadcn/ui. Provides unstyled, accessible primitives that are wired locally within `src/components/ui/` giving the developers full control over standard DOM markup and styling.
- **Iconography**: `lucide-react`
- **Charting**: `recharts` (Used across Analytics & Dashboard pages)

### Identity & Backend
- **BaaS**: Supabase
- **Authentication**: `@supabase/supabase-js` wrapping `localStorage` configuration indicating token persistence.
- **Routing**: `react-router-dom` v6 for client-side routing.

---

## Codebase Structure

```bash
src/
├── assets/         # Static images, logos
├── components/     
│   ├── admin/      # Restrictive layouts and UI blocks tied to Administration
│   ├── dashboard/  # Sidebar, metric cards, layouts
│   └── ui/         # Core reusable, primitive Shadcn UI components
├── data/           # Mock fallbacks and structured offline JSON equivalents
├── hooks/          # Complex logic abstraction (e.g., useAuth.ts, useCMS.ts)
├── integrations/   # Connecting logic (currently exclusive to `supabase/client.ts` and TS Definitions)
├── lib/            # Utility formatters, constants
├── pages/          # Top-level Routing endpoints corresponding directly to `App.tsx`
```

---

## Architectural Patterns

1. **Authentication Wrapper**: 
   The application routing is intrinsically tied to `<AuthProvider>`. Access restrictions apply through the `<RequireAuth>` High-Order Component wrapping specialized administrative routes, ensuring UI fallback mechanisms when required privileges (`admin`, `editor`, `reviewer`) are unfulfilled.

2. **Supabase Zero-Server Fetching**: 
   Direct relational Database API queries dictate the data layer. Edge functions omit API routes entirely for standard CRUD, falling directly on PostgreSQL Row Level Security (RLS) to evaluate user privileges.

3. **Modularity**:
   Components remain strictly independent. The "System Console" directly queries the `content_audit_log`, while "UsersAdmin" manages identity roles via `user_roles` without conflating application states.
