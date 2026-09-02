# 📱 MobileSQL — The AI-Powered Mobile SQL IDE & Academy

[![CI Pipeline](https://github.com/mobilesql/mobilesql/actions/workflows/ci.yml/badge.svg)](https://github.com/mobilesql/mobilesql/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.0.0-blue.svg)](https://nodejs.org/)
[![TypeScript 5.8](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg)](https://www.typescriptlang.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-7.9-2D3748.svg)](https://www.prisma.io/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.1-38B2AC.svg)](https://tailwindcss.com/)
[![Docker Ready](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)
[![Status](https://img.shields.io/badge/Status-Maintainer%20Review-orange.svg)](#-project-status)

> **MobileSQL** is a mobile-first SQL learning academy and database workspace powered by Google Gemini AI. Learn querying, practice interactive challenges, design relational schemas, profile SQL execution plans, and build query analytics on mobile and desktop devices.

---

![MobileSQL Hero Overview](docs/images/mobilesql-hero.jpg)

---

## 📌 Project Status

MobileSQL is currently undergoing **Stabilization & Open-Source Governance Review** in preparation for formal stakeholder evaluation and broader open-source participation. 

- **Test Infrastructure**: Restored Vitest test suite with 100% passing unit tests (`12/12 passed`).
- **Database Architecture**: Comprehensive Prisma schema (34 models, 13 enums) with baseline migration and resilient fallback.
- **CI/CD Quality Gates**: Enforced strict continuous integration covering schema validation, typechecking, linting, unit testing, security auditing, and production builds.
- **Maintainer Readiness**: Establishing transparent governance, reproducible local setup, issue templates, and contribution standards.

---

## ⚡ Key Capabilities

### 🚀 1. Mobile-First SQL Playground & AI Copilot
Zero-latency query execution, syntax highlighting via Monaco Editor, keyboard assist accessory bar, pagination, and multi-dialect compatibility (PostgreSQL, SQLite, MySQL) paired with natural language to SQL translation, query EXPLAIN plan breakdown, AI-assisted index recommendations, and SQL syntax bug fixing.

![MobileSQL Playground](docs/images/mobilesql-playground.jpg)

### 🎓 2. Interactive Academy & SQL Challenges
Step-by-step masterclasses ranging from Fundamentals (`SELECT`, `WHERE`, `JOIN`) to Advanced topics (Window Functions, CTEs, Partitioning, Query Optimization) combined with real-time test-case assertion engine with percentile distributions, XP gamification, and daily streaks.

![MobileSQL Academy Curriculum](docs/images/mobilesql-academy.jpg)

### 📊 3. Analytics Studio & Dataset Modeler
Custom metric dashboards, query-to-chart rendering (Area, Bar, Line, Pie), visual relationship mapper (1:1, 1:N, N:M), foreign key constraint visualizer, synthetic mock data generation, and downloadable dataset reports.

![MobileSQL Analytics Studio](docs/images/mobilesql-analytics.jpg)

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript 5.8, Tailwind CSS v4, Monaco Editor (`@monaco-editor/react`), Zustand 5, TanStack React Query 5, Motion |
| **Backend** | Node.js 22 LTS, Express 4, esbuild, Zod validation |
| **Database & ORM** | Prisma ORM 7.9, PostgreSQL 16 (optional), SQLite WASM In-Memory Fallback |
| **AI Integration** | Google GenAI SDK (`@google/genai` with Gemini models) |
| **Testing & Quality** | Vitest 4, Happy-DOM, TypeScript Compiler (`tsc`), Prisma CLI |
| **DevOps & Containers** | Docker (multi-stage `node:22-alpine`), Docker Compose, GitHub Actions CI/CD |

---

## 🏗️ Architecture Overview

![MobileSQL Architecture Diagram](docs/images/mobilesql-architecture.jpg)

```
 ┌───────────────────────────────────────────────────────────┐
 │                   MobileSQL Client (React 19)             │
 │   Zustand Stores  •  TanStack Query  •  Monaco Editor     │
 └─────────────────────────────┬─────────────────────────────┘
                               │  HTTPS / REST
 ┌─────────────────────────────▼─────────────────────────────┐
 │                Express 4 API Server (Node 22)             │
 │   Security Headers  •  Rate Limiting  •  Zod Validation   │
 └──────────────┬───────────────────────────────┬────────────┘
                │                               │
 ┌──────────────▼──────────────┐  ┌─────────────▼────────────┐
 │     Prisma ORM Client       │  │    Google Gemini AI      │
 │  PostgreSQL 16 Engine / DB  │  │   AI Copilot & Explainer │
 │  (or In-Memory Fallback)    │  │                          │
 └─────────────────────────────┘  └──────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: `>= 22.0.0` (LTS recommended)
* **npm**: `>= 10.0.0`
* **PostgreSQL**: `16+` (Optional — system automatically defaults to resilient in-memory storage if omitted)
* **Docker & Docker Compose**: (Optional — for containerized deployment)

### 1. Clone the Repository
```bash
git clone https://github.com/mobilesql/mobilesql.git
cd mobilesql
```

### 2. Install Dependencies
Install exact dependencies using the synchronized lockfile:
```bash
npm ci
```
*(Note: `prisma generate` will run automatically via the `postinstall` hook).*

### 3. Configure Environment Variables
Create a local `.env` file from the provided template:
```bash
cp .env.example .env
```

Key environment variables:
| Variable | Description | Default / Example |
|---|---|---|
| `PORT` | Local server port | `3000` |
| `NODE_ENV` | Runtime environment | `development` |
| `JWT_SECRET` | Secret key for JWT session signing | `your-secret-key-min-32-chars` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/mobilesql?schema=public` |
| `GEMINI_API_KEY` | Google Gemini API key (optional for AI Copilot) | `AIzaSy...` |

### 4. Database Setup & Migrations (Optional for PostgreSQL)
If using PostgreSQL, apply the baseline migration:
```bash
# Apply migrations to your PostgreSQL database
npx prisma migrate deploy

# (Optional) Seed initial users, academy tracks, and challenges
npx tsx src/server/database/seed.ts
```

> **Note on Resilient Fallback**: If `DATABASE_URL` is not provided or the PostgreSQL database is unreachable, MobileSQL seamlessly operates in standalone mode with client stores and in-memory mock repositories, enabling zero-configuration onboarding.

### 5. Launch the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Development & Quality Commands

All quality gates must pass prior to submitting changes:

| Command | Action |
|---|---|
| `npm run dev` | Start the local Express + Vite dev server on port 3000 |
| `npm test` | Run the Vitest unit test suite |
| `npm run typecheck` | Run TypeScript strict type verification (`tsc --noEmit`) |
| `npm run lint` | Run code quality checks (`tsc --noEmit`) |
| `npm run build` | Generate Prisma client and compile production frontend and server bundles |
| `npx prisma validate` | Validate the Prisma database schema |
| `npx prisma generate` | Regenerate Prisma client TypeScript bindings |

---

## 🐳 Docker Deployment

To launch the full stack in an isolated container environment:

```bash
# Build and run using Docker Compose
docker-compose up -d --build

# View container logs
docker-compose logs -f app
```

Alternatively, build and run the multi-stage Docker image directly:
```bash
# Build production image
docker build -t mobilesql:latest .

# Run container on port 3000
docker run -p 3000:3000 --env-file .env mobilesql:latest
```

---

## 🔄 CI/CD Pipeline

MobileSQL enforces automated quality verification via GitHub Actions (`.github/workflows/ci.yml`):
- **Validate Job**: Runs deterministic `npm ci`, Prisma schema validation (`npx prisma validate`), typechecking (`npm run typecheck`), linting (`npm run lint`), and dependency security auditing (`npm audit`).
- **Test Job**: Executes the unit test suite (`npm test`).
- **Build Job**: Executes the full production build pipeline (`npm run build`).

---

## 🔒 Security Policy

We treat security and data protection with high priority. Please review our [SECURITY.md](SECURITY.md) for details on supported versions and the vulnerability reporting process.

---

## 🤝 Contributing

We welcome contributions to MobileSQL. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for step-by-step guidance on setting up a local environment, coding standards, branch conventions, and pull request workflows.

Please note that MobileSQL enforces the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

