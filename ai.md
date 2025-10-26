# Pro-League AI Development Guide

## Project Overview

Pro-League is a full-stack tournament management system built with a modern monorepo architecture. The application allows users to create and manage tournaments, register players and teams, track matches and results, and handle bracket generation and standings.

## Technology Stack

### Frontend
- **Framework**: Next.js 15.5.3 with React 19 and Turbopack
- **UI Library**: Mantine v8.3.1 (complete suite including core, forms, hooks, modals, notifications, dropzone, charts, dates, carousel, code-highlight, tiptap, nprogress)
- **Icons**: Tabler Icons React
- **Rich Text Editor**: Tiptap with extensions (link, starter-kit)
- **Charts**: Recharts
- **Date Handling**: Day.js
- **Carousel**: Embla Carousel
- **State Management**: Mantine forms and hooks (useForm)
- **Testing**: Vitest with browser mode, coverage, and Playwright
- **Storybook**: Component development environment with accessibility addon
- **TypeScript**: v5 with strict type checking

### Backend
- **Framework**: AdonisJS v6.18.0
- **ORM**: Lucid ORM v21.6.1
- **Authentication**: AdonisJS Auth v9.4.0
- **Validation**: VineJS v3.0.1
- **Database**: MySQL with mysql2 driver
- **API Documentation**: Adonis AutoSwagger
- **CORS**: AdonisJS CORS
- **Testing**: Japa v4 with API client and AdonisJS plugin
- **TypeScript**: v5.8 with SWC compiler

### Shared
- **Package**: @pro-league/shared
- **Purpose**: Centralized TypeScript interfaces, types, and enums
- **Structure**: Organized with `/src/interfaces` and `/src/enums`
- **Exports**: Barrel index.ts for clean imports

### Infrastructure
- **Containerization**: Docker with docker-compose
- **Database**: MySQL (containerized)
- **Monorepo**: npm workspaces
- **Version Control**: Git

## Project Architecture

This is a **monorepo** with three main workspaces:
- `frontend/` - Next.js application
- `backend/` - AdonisJS API
- `shared/` - Shared TypeScript definitions

Each service has its own Dockerfile and can be run independently or together via docker-compose.

### Import Aliases
Each workspace has its own import alias configuration:

**Backend** (AdonisJS style with `#` prefix):
- `#controllers/*`, `#models/*`, `#services/*`, `#validators/*`, `#middleware/*`, etc.
- Example: `import Tournament from '#models/tournament'`

**Frontend** (Next.js style):
- `@frontend/*` for `./src/*`
- Example: `import { TournamentCard } from '@frontend/components/tournaments'`

**Shared** (internal use):
- `@shared/*` for internal references within the shared package
- External imports use: `import { ITournament } from '@pro-league/shared'`

## Code Quality Tools

### Linting
- **Frontend**: ESLint with Mantine, Next.js, and Prettier configs
- **Backend**: ESLint with AdonisJS config
- **Shared**: ESLint with consistent rules

### Formatting
- **All workspaces**: Prettier v3+ with consistent configuration
- **Backend**: Uses @adonisjs/prettier-config

### Type Checking
- All workspaces have dedicated `typecheck` scripts using TypeScript compiler

### Scripts
- `npm run lint` - Lint all workspaces sequentially
- `npm run lint:parallel` - Lint all workspaces concurrently
- `npm run format` - Format all workspaces
- `npm run build:all` - Build all workspaces

## AI Agent Assignment Guide

Use the following guidelines to route tasks to the appropriate AI agents:

### Backend Developer Agent
**Location**: `.ai/agents/backend-developer.md`

**Responsibilities**:
- AdonisJS controller, model, and middleware development
- Lucid ORM queries and database migrations
- Authentication and authorization logic
- VineJS validation schemas
- API endpoint creation and documentation
- Backend testing with Japa
- Database schema design
- Backend configuration files
- Backend-specific TypeScript interfaces

**Task Keywords**: API, endpoint, controller, model, migration, database, Lucid, AdonisJS, authentication, authorization, validation, VineJS, middleware, Japa test

### Frontend Developer Agent
**Location**: `.ai/agents/frontend-developer.md`

**Responsibilities**:
- Next.js page and component development
- Mantine component implementation and customization
- Form handling with Mantine forms
- Client-side state management
- React hooks and custom hooks
- Tiptap rich text editor integration
- Chart implementation with Recharts
- Responsive UI design
- Frontend routing and navigation
- Storybook story creation
- Frontend testing with Vitest and Playwright

**Task Keywords**: component, page, UI, form, Mantine, Next.js, React, hook, chart, Storybook, Vitest, Playwright, frontend test, styling

### Reviewer Agent
**Location**: `.ai/agents/reviewer.md`

**Responsibilities**:
- Code review for quality and best practices
- Security vulnerability assessment
- Performance optimization suggestions
- TypeScript type safety review
- Testing coverage evaluation
- Documentation completeness check
- Consistency with coding guidelines
- Architecture and design pattern review

**Task Keywords**: review, check, audit, security, performance, optimization, best practices, code quality

### Shared Types Agent
**Location**: `.ai/agents/shared-types.md` (optional)

**Responsibilities**:
- Creating and maintaining shared interfaces
- Managing shared enums and constants
- Ensuring type consistency across frontend and backend
- Updating barrel exports in index.ts

**Task Keywords**: interface, type, enum, shared, @pro-league/shared, type definition

## Common Development Workflows

### Adding a New Feature
1. **Backend Developer**: Create database migration, models, controllers, and validation
2. **Shared Types**: Define interfaces for data structures
3. **Frontend Developer**: Create UI components and pages that consume the API
4. **Reviewer**: Review all changes for quality and security

### Bug Fixes
1. Identify which layer has the bug (frontend/backend)
2. Route to appropriate agent
3. **Reviewer**: Verify the fix and check for regression

### Refactoring
1. **Reviewer**: Assess current code and provide refactoring plan
2. Appropriate agent implements changes
3. **Reviewer**: Verify improvements

## Important Notes

- **NO Tailwind CSS**: This project uses Mantine for styling, NOT Tailwind CSS
- **Type Safety**: Always use TypeScript with proper typing
- **Shared Types**: Use @pro-league/shared for types used by both frontend and backend
- **Testing**: Write tests for new features and bug fixes
- **Docker**: All services should work both locally and in Docker containers
- **API First**: Backend should expose RESTful APIs that frontend consumes
- **Consistent Formatting**: Always run format scripts before committing

## Getting Started

```bash
# Install dependencies
npm install

# Run all services in development mode
npm run dev

# Run with Docker
docker-compose up

# Run linting
npm run lint

# Run formatting
npm run format

# Build all workspaces
npm run build:all
```

For detailed coding guidelines, see `.ai/coding-guidelines.md`.
