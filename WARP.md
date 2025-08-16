# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Start production server
pnpm start
```

### Code Quality
```bash
# Lint code (ESLint with Astro/TypeScript/Prettier plugins)
pnpm lint

# Format code (Prettier with Astro/Tailwind plugins)
pnpm format
```

### Package Management
```bash
# Install dependencies (uses pnpm, not npm)
pnpm install

# Add new dependency
pnpm add <package>

# Add dev dependency
pnpm add -D <package>
```

## Architecture Overview

### Technology Stack
This is an **Astro + React + Firebase** application for managing an audiovisual awards platform:

- **Frontend**: Astro (SSR) with React components for interactive elements
- **Styling**: Tailwind CSS v4 with custom color tokens (goldlight, golddark)
- **Backend**: Firebase (Firestore database, Authentication, Storage)
- **Deployment**: Vercel (configured with @astrojs/vercel adapter)
- **Package Manager**: pnpm (required - uses specific overrides and trusted dependencies)

### Application Structure

**User Roles & Authentication:**
- **Admin**: Full access to dashboard, jury management, project oversight, reports
- **Jurado (Jury)**: Access to assigned projects for voting within their categories
- **Public**: Can submit projects and view public pages

**Core Workflows:**
1. **Project Submission**: Public users submit audiovisual works via forms
2. **Jury Assignment**: Admins assign jury members to specific categories
3. **Voting Process**: Jury members rate projects in their assigned categories
4. **Results & Reports**: Admins generate reports and view aggregated results

### Key Architectural Patterns

**Route Protection (Middleware)**
- `src/middleware/index.ts` handles role-based access control
- Uses cookies (`userRole`) to enforce access to `/admin/*` and `/jurado/*` routes
- Redirects unauthorized users to appropriate pages

**Data Management**
- **Firestore Collections**:
  - `proyectos`: Submitted audiovisual works
  - `jurados`: Jury member profiles with assigned categories
  - `votaciones`: Individual votes/ratings from jury members
- **Local Storage Caching**: Dashboard components cache data to reduce Firestore queries
- **Role-based Data Filtering**: Jury members only see projects in their assigned categories

**Component Architecture**
- **Astro Components**: Server-side rendered layout and static content (`.astro`)
- **React Components**: Interactive dashboards, forms, and dynamic functionality (`.tsx`)
- **Hybrid Rendering**: Uses `client:load` directives for React components requiring client-side interactivity

### File Structure Patterns

```
src/
├── components/
│   ├── admin/           # Admin dashboard components
│   ├── Jurado/         # Jury dashboard components  
│   ├── auth/           # Authentication components
│   ├── proyecto/       # Project submission forms
│   └── ui/             # Reusable UI components
├── layouts/            # Astro layout templates
├── lib/                # Utilities and Firebase config
├── middleware/         # Route protection
└── pages/              # File-based routing (Astro)
    ├── admin/          # Admin-only pages
    ├── jurado/         # Jury-only pages
    └── api/            # Server endpoints
```

### Firebase Integration Patterns

**Authentication Flow**:
1. Firebase Auth handles login/logout
2. `getUserRole()` fetches user role from Firestore
3. Role stored in localStorage and cookies for SSR middleware
4. `authGuard.ts` provides client-side protection utilities

**Data Access Patterns**:
- **Efficient Queries**: Use Firestore `where()` clauses to filter by user categories
- **Batch Operations**: Admin dashboard loads all data in optimized batch queries
- **Real-time Updates**: Components can force refresh to get latest Firestore data
- **Local Caching**: Dashboard data cached in localStorage with timestamp-based invalidation

### Custom Configuration

**Tailwind CSS**: Uses custom color palette with `goldlight` and `golddark` color families for brand consistency

**pnpm Overrides**: Specific package overrides required for Firebase and build dependencies - do not modify without testing

**Vercel Configuration**: SSR setup with sitemap generation excluding admin/internal routes from public indexing

### Development Considerations

**Firebase Config**: Ensure `src/lib/firebaseConfig.ts` exists with proper Firebase project credentials

**Route Testing**: Test role-based access control when making changes to protected routes

**Category Management**: Awards categories defined in `src/lib/categories.ts` - used across project submission and jury assignment

**Data Consistency**: When modifying Firestore data structure, update interfaces in TypeScript components and ensure backward compatibility
