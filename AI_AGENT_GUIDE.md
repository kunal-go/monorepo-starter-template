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
- **Authentication:** bcrypt (password hashing)
- **Validation:** zod (schema validation)
- **Date Utilities:** dayjs
- **Environment Management:** dotenv
- **Other:** Typescript, tsx (for dev), Docker Compose (for local DB)

---

## Directory Structure

```
monorepo-starter-template/
  ├── package.json           # Monorepo config, workspaces
  ├── server/                # Backend service
  │   ├── package.json
  │   ├── README.md
  │   ├── drizzle/           # DB migrations & metadata
  │   ├── drizzle.config.ts  # Drizzle ORM config
  │   └── src/
  │       ├── index.ts       # Entry point, server bootstrap
  │       ├── env.config.ts  # Env variable loader
  │       ├── db/            # DB connection & schema
  │       ├── common/        # Shared utilities
  │       ├── services/      # Business logic (e.g., user)
  │       └── trpc/          # API routers, context, procedures
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

### API Layer

- **Framework:** tRPC, integrated with Hono.
- **Routers:** Defined in `src/trpc/routers/`
  - `user/`: User-related endpoints (e.g., registration).
  - `health/`: Health check endpoint.
- **Procedures:** Use zod for input validation.

### Services

- **Location:** `src/services/user/`
- **Responsibilities:** User creation, email availability check, verification request, cleanup of unverified users.

### Utilities

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
