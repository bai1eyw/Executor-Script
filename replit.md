# EXECUTOR - Script Automation Dashboard

## Overview

A script execution and automation management platform built with a modern full-stack architecture. Users can create, store, run, and monitor automation scripts in multiple languages (bash, python, nodejs, luau). The application features a dark-themed developer-focused UI with real-time execution monitoring via polling.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state, with automatic polling for execution updates
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with dark theme by default, custom CSS variables for theming
- **Fonts**: Inter (sans-serif) and JetBrains Mono (monospace) for terminal aesthetics
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schema validation
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Development**: Hot module replacement via Vite middleware in development mode

### Data Layer
- **Database**: PostgreSQL (connection via DATABASE_URL environment variable)
- **Schema Location**: `shared/schema.ts` using Drizzle table definitions
- **Migrations**: Drizzle Kit with `db:push` command for schema synchronization
- **Tables**:
  - `scripts`: Stores script metadata (name, content, language, description)
  - `executions`: Tracks script execution history (status, output, timestamps)

### API Structure
Routes are defined declaratively in `shared/routes.ts` with type-safe schemas:
- `GET /api/scripts` - List all scripts
- `GET /api/scripts/:id` - Get single script
- `POST /api/scripts` - Create new script
- `PUT /api/scripts/:id` - Update script
- `DELETE /api/scripts/:id` - Delete script
- `GET /api/scripts/:id/executions` - List executions for a script
- `POST /api/scripts/:id/run` - Execute a script
- `GET /api/executions/:id` - Get execution details

### Project Structure
```
├── client/           # Frontend React application
│   └── src/
│       ├── components/   # UI components including shadcn/ui
│       ├── hooks/        # Custom React hooks for API calls
│       ├── pages/        # Route page components
│       └── lib/          # Utilities and query client
├── server/           # Backend Express application
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route handlers
│   ├── storage.ts    # Database operations
│   └── db.ts         # Database connection
├── shared/           # Shared code between client/server
│   ├── schema.ts     # Drizzle database schema
│   └── routes.ts     # API route definitions with Zod
└── migrations/       # Database migrations (generated)
```

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, requires DATABASE_URL environment variable

### Key NPM Packages
- **drizzle-orm** + **drizzle-kit**: Database ORM and migration tooling
- **@tanstack/react-query**: Server state management with caching
- **zod** + **drizzle-zod**: Schema validation and type inference
- **date-fns**: Date formatting for execution logs
- **lucide-react**: Icon library
- **react-hook-form** + **@hookform/resolvers**: Form handling with Zod integration

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay in development
- **@replit/vite-plugin-cartographer**: Development tooling (dev only)