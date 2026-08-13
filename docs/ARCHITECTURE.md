# System Architecture & Technical Design

## 1. System Overview

MobileSQL is built as a high-performance, single-container full-stack application pairing a React 19 single-page client with an Express 4 Node.js runtime and PostgreSQL 16 persistence via Prisma ORM.

```
                          ┌───────────────────────────┐
                          │   Client Browser / PWA    │
                          │   (Tailwind 4 + Lucide)   │
                          └─────────────┬─────────────┘
                                        │
                         HTTP / REST API (port 3000)
                                        │
                          ┌─────────────▼─────────────┐
                          │  Express 4 Reverse Engine │
                          │  - Security & Rate Limits │
                          │  - Zod Request Validation │
                          │  - JWT Middleware Auth    │
                          └──────┬──────────────┬─────┘
                                 │              │
                    ┌────────────▼────┐   ┌─────▼──────────┐
                    │  Prisma Client  │   │ Google Gemini  │
                    │  PostgreSQL 16  │   │ 2.5 Flash SDK  │
                    └─────────────────┘   └────────────────┘
```

## 2. Core Architectural Decisions

### 2.1 Resilient Data Layer with Lazy Connection Proxy
To avoid blocking container cold-starts during serverless scaling (such as Cloud Run or ephemeral preview containers), the Prisma database client is encapsulated within a lazy initialization proxy. If the database connection is temporarily delayed or offline, the API layer falls back to seeded repository collections without application crash.

### 2.2 Dual-Token JWT Authentication & Session Continuity
- **Access Tokens**: Short-lived (15 minutes) HMAC-SHA256 JWTs transmitted via HTTP `Authorization: Bearer <token>` headers.
- **Refresh Tokens**: Long-lived (30 days) cryptographically random tokens stored securely with rotation on each refresh.
- **Guest Session Sandboxing**: Immediate guest mode with zero friction; upon login or registration, the guest user's query history and academy progress are automatically merged into their persistent account.

### 2.3 State Management Philosophy
- **Client Workspace State (Zustand)**: Fast, non-blocking synchronous state for query editors, active tabs, modal overlays, and toast pipelines.
- **Server Cache & Async Sync (TanStack Query v5)**: Manages network cache invalidation, background refetching, and query deduplication with configurable stale-time policies.

### 2.4 Error Boundary & State Isolation
All primary UI viewports and the root application shell are wrapped in modular React 19 `ErrorBoundary` classes. When an isolated error occurs in a sub-view (such as invalid user-provided chart parameters), the error is isolated to that card, allowing the rest of the workspace to operate uninterrupted.
