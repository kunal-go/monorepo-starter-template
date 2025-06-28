# AI_AGENT_GUIDE

## Overview

This repository is a **monorepo starter template** using Yarn workspaces, designed to support both backend and frontend projects. Currently, only the backend (`server`) is implemented.

---

## Technology Stack

- **Monorepo Management:** Yarn Workspaces
- **Backend Framework:** [Hono](https://hono.dev/) (Node.js, lightweight, fast)
- **API Layer:** [tRPC](https://trpc.io/) (type-safe APIs)
- **Database ORM:** [Drizzle ORM](https://orm.drizzle.team/) (with PostgreSQL)
- **Database Migrations:** drizzle-kit
- **Authentication:** bcrypt (password hashing), JWT tokens
- **Validation:** zod (schema validation)
- **Date Utilities:** dayjs
- **Environment Management:** dotenv
- **Error Handling:** Custom CoreError system with protocol-agnostic design
- **Other:** Typescript, tsx (for dev), Docker Compose (for local DB)

---

## Coding Guidelines

- **TypeScript:** Avoid using interface where using type is possible
- **Error Handling:** Use try-catch with `mapToTrpcError()` in all tRPC handlers
- **Validation:** Use zod schemas for input validation
- **Database:** Use transactions for multi-step operations

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

- **Location:** `src/common/utils/`
- **Examples:** Date calculations (`date.ts`), OTP generation (`otp.ts`).

---

## Example: User Registration Flow

1. **API Endpoint:** `POST /trpc/user.registerV1`
2. **Validation:** zod schema for email & password.
3. **Service:** `createUser` handles:
   - Deleting unverified users.
   - Checking email availability.
   - Creating user (with hashed password).
   - Creating verification request (OTP).
4. **DB:** All actions in a transaction.
5. **Response:** Verification request ID and validity.

---

## Health Check

- **Endpoint:** `/trpc/health.check`
- **Response:** `{ status: "ok", timestamp, message }`

---

## Environment

- **Variables:** Loaded via `src/env.config.ts` (e.g., DB credentials, PORT).
- **Local Dev:** Use `npm install` and `npm run dev` in `server/`.

---

## Extending the Codebase

- Add new API endpoints by creating new routers/procedures in `src/trpc/routers/`.
- Add new business logic in `src/services/`.
- Add new DB tables in `src/db/schema.ts` and generate migrations with drizzle-kit.

---

## Notes

- The `portal/` directory (frontend) is referenced but not present.
- All code is written in TypeScript and uses ES modules.
