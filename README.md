# starter-template

## Overview

This repository is a **starter template** using Yarn workspaces, designed to support both backend and frontend projects. Both the backend (`server`) and frontend (`portal`) are fully implemented.

---

## Technology Stack

### Backend (`server/`)

- **Framework:** [Hono](https://hono.dev/) (Node.js, lightweight, fast)
- **API Layer:** [tRPC](https://trpc.io/) (type-safe APIs)
- **Database ORM:** [Drizzle ORM](https://orm.drizzle.team/) (with PostgreSQL)
- **Database Migrations:** drizzle-kit
- **Authentication:** bcrypt (password hashing), JWT tokens
- **Validation:** zod (schema validation)
- **Date Utilities:** dayjs
- **Environment Management:** dotenv
- **Error Handling:** Custom CoreError system with protocol-agnostic design

### Frontend (`portal/`)

- **Framework:** [React](https://react.dev/) 19
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Router:** [TanStack Router](https://tanstack.com/router)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching:** [TanStack Query](https://tanstack.com/query)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/)
- **Form Handling:** [React Hook Form](https://react-hook-form.com/)
- **Type Safety:** Full TypeScript integration with tRPC

### Monorepo Management

- **Package Manager:** Yarn Workspaces
- **Development:** TypeScript, ESLint, Prettier
- **Local Development:** Docker Compose (for PostgreSQL)

---

## Quick Start

### Prerequisites

- Node.js (see `.nvmrc` in portal directory)
- Yarn
- Docker (for local PostgreSQL)

### Installation

```bash
# Install all dependencies
yarn install

# Start the database
yarn workspace server docker-compose up -d

# Start the backend (in one terminal)
yarn workspace server yarn dev

# Start the frontend (in another terminal)
yarn workspace portal yarn dev
```

The backend will be available at `http://localhost:3040` and the frontend at `http://localhost:5040`.

---

## Coding Guidelines

- **TypeScript:** Avoid using interface where using type is possible
- **Error Handling:** Use try-catch with `mapToTrpcError()` in all tRPC handlers
- **Validation:** Use zod schemas for input validation
- **Database:** Use transactions for multi-step operations
- **Frontend:** Use TanStack Router for routing and TanStack Query for data fetching

---

## Directory Structure

```
monorepo-starter-template/
  ├── package.json           # Monorepo config, workspaces
  ├── server/                # Backend service
  │   ├── package.json
  │   ├── README.md
  │   ├── docker-compose.yaml # Local PostgreSQL setup
  │   ├── drizzle/           # DB migrations & metadata
  │   ├── drizzle.config.ts  # Drizzle ORM config
  │   └── src/
  │       ├── index.ts       # Entry point, server bootstrap
  │       ├── env.config.ts  # Env variable loader
  │       ├── db/            # DB connection & schema
  │       ├── common/        # Shared utilities & error system
  │       │   ├── errors.ts  # Custom error classes & utilities
  │       │   └── utils/     # Date, OTP utilities
  │       ├── services/      # Business logic (e.g., user)
  │       ├── providers/     # External integrations (JWT, email)
  │       └── trpc/          # API routers, context, procedures
  │           ├── utils/     # Error mapping utilities
  │           └── routers/   # API endpoints
  ├── portal/                # Frontend application
  │   ├── package.json
  │   ├── README.md
  │   ├── index.html         # Entry HTML file
  │   ├── vite.config.ts     # Vite configuration
  │   ├── tsconfig.json      # TypeScript config
  │   ├── tailwind.config.js # Tailwind CSS config
  │   ├── public/            # Static assets
  │   └── src/
  │       ├── main.tsx       # Application entry point
  │       ├── routes/        # TanStack Router routes
  │       ├── components/    # React components
  │       │   ├── ui/        # Reusable UI components
  │       │   └── auth-provider.tsx # Authentication context
  │       ├── lib/           # Utilities and configurations
  │       │   ├── auth/      # Authentication utilities
  │       │   └── utils.ts   # General utilities
  │       ├── contracts/     # tRPC client configuration
  │       └── styles.css     # Global styles
  └── README.md              # Monorepo overview
```

---

## Backend Structure (`server/`)

### Entry Point

- `src/index.ts`: Bootstraps the Hono server, sets up tRPC, runs DB migrations, and starts listening.

### Database

- **ORM:** Drizzle ORM with PostgreSQL.
- **Schema:** Defined in `src/db/schema.ts`.
- **Migrations:** SQL files in `drizzle/`, managed by drizzle-kit.
- **Config:** `drizzle.config.ts` (uses env vars for DB credentials).

### Error Handling System

#### CoreError Classes (`src/common/errors.ts`)

The application uses a unified error handling system with custom error classes:

```typescript
// Base error class
abstract class CustomError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, any>;
}

// Specific error types
BadRequestError(400);
UnauthorisedError(401);
ForbiddenError(403);
NotFoundError(404);
ConflictError(409);
UnprocessableEntityError(422);
TooManyRequestsError(429);
InternalServerError(500);
BadGatewayError(502);
ServiceUnavailableError(503);
```

#### Domain-Specific Errors

```typescript
DatabaseError;
DatabaseConnectionError;
ValidationError;
AuthenticationError;
AuthorizationError;
BusinessLogicError;
ExternalServiceError;
```

#### Error Utilities

- `isOperationalError()`: Check if error is expected vs unexpected
- `getStatusCode()`: Extract HTTP status code from any error
- `createErrorResponse()`: Format errors for different protocols (tRPC, REST, GraphQL, gRPC)
- `ErrorCodes` enum: Centralized error codes

### API Layer

- **Framework:** tRPC, integrated with Hono.
- **Routers:** Defined in `src/trpc/routers/`
  - `user/`: User-related endpoints (registration, login, verification, profile)
  - `health/`: Health check endpoint
- **Procedures:** Use zod for input validation.
- **Error Handling:** All handlers use try-catch with `mapToTrpcError()`

#### tRPC Error Handling Pattern

All tRPC handlers follow this consistent pattern:

```typescript
export const handler = publicProcedure
  .input(schema)
  .mutation(async ({ input }) => {
    try {
      // Handler logic here
      return result;
    } catch (err) {
      throw mapToTrpcError(err);
    }
  });
```

### Utilities

- **Location:** `src/common/utils/`
- **Examples:** Date calculations (`date.ts`), OTP generation (`otp.ts`).

---

## Frontend Structure (`portal/`)

### Entry Point

- `src/main.tsx`: Bootstraps the React application with TanStack Router and Query providers.

### Routing

- **Framework:** TanStack Router with file-based routing
- **Routes:** Defined in `src/routes/` directory
- **Layout:** Root layout in `src/routes/__root.tsx`
- **Authentication:** Protected routes with auth provider

### State Management

- **Global State:** Zustand for application state
- **Server State:** TanStack Query for API data
- **Authentication:** Custom auth store with JWT token management

### UI Components

- **Base Components:** Radix UI primitives in `src/components/ui/`
- **Styling:** Tailwind CSS with custom design system
- **Forms:** React Hook Form with zod validation

### API Integration

- **tRPC Client:** Configured in `src/contracts/`
- **Type Safety:** Full end-to-end type safety with backend
- **Error Handling:** Integrated with backend error system

---

## Example: User Registration Flow

1. **Frontend:** User fills registration form in React component
2. **Validation:** Client-side validation with zod schemas
3. **API Call:** tRPC mutation to `user.registerV1`
4. **Backend Validation:** Server-side zod schema validation
5. **Service:** `createUser` handles:
   - Deleting unverified users
   - Checking email availability
   - Creating user (with hashed password)
   - Creating verification request (OTP)
6. **DB:** All actions in a transaction
7. **Response:** Verification request ID and validity
8. **Frontend:** Handle success/error states with TanStack Query

---

## Health Check

- **Endpoint:** `/trpc/health.check`
- **Response:** `{ status: "ok", timestamp, message }`

---

## Environment

### Backend (`server/`)

- **Variables:** Loaded via `src/env.config.ts` (e.g., DB credentials, PORT)
- **Local Dev:** Use `yarn dev` in `server/` directory

### Frontend (`portal/`)

- **Variables:** Environment variables for API endpoints
- **Local Dev:** Use `yarn dev` in `portal/` directory (runs on port 5040)

---

## Development Scripts

### Backend (`server/`)

```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
```

### Frontend (`portal/`)

```bash
yarn dev          # Start development server (port 5040)
yarn build        # Build for production
yarn serve        # Preview production build
yarn test         # Run tests
yarn lint         # Run ESLint
yarn format       # Run Prettier
yarn check        # Format and lint
```

---

## Extending the Codebase

### Backend

- Add new API endpoints by creating new routers/procedures in `src/trpc/routers/`
- Add new business logic in `src/services/`
- Add new DB tables in `src/db/schema.ts` and generate migrations with drizzle-kit

### Frontend

- Add new routes by creating files in `src/routes/`
- Add new components in `src/components/`
- Add new API calls using tRPC in `src/contracts/`
- Extend UI components in `src/components/ui/`

---

## Notes

- Both backend and frontend are fully implemented and integrated
- Full type safety between frontend and backend via tRPC
- Authentication system with JWT tokens and refresh mechanism
- Modern React patterns with hooks and functional components
- All code is written in TypeScript and uses ES modules
