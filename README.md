# 📱 MobileSQL — The AI-Powered Mobile SQL IDE & Academy

[![CI Pipeline](https://github.com/mobilesql/mobilesql/actions/workflows/ci.yml/badge.svg)](https://github.com/mobilesql/mobilesql/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.0.0-blue.svg)](https://nodejs.org/)
[![TypeScript 5.8](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg)](https://www.typescriptlang.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-7.9-2D3748.svg)](https://www.prisma.io/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.1-38B2AC.svg)](https://tailwindcss.com/)
[![Docker Ready](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

> **MobileSQL** is an enterprise-grade, mobile-first SQL learning academy and real-time database workspace powered by Google Gemini AI. Learn complex querying, practice interactive challenges, design relational schemas, and profile SQL execution plans anywhere on any device.

---

## ⚡ Key Capabilities

* 🚀 **Mobile-First SQL Playground**: Zero-latency query execution, syntax highlighting, keyboard assist bar, pagination, and multi-dialect compatibility (PostgreSQL, SQLite, MySQL).
* 🤖 **Gemini AI Copilot**: Instant natural language to SQL translation, query EXPLAIN plan breakdown, AI-assisted index recommendation, and SQL syntax bug fixing.
* 🎓 **Interactive Academy Curriculum**: Step-by-step masterclasses from Fundamentals (SELECT, WHERE, JOINs) to Advanced (Window Functions, CTEs, Partitioning, Query Optimization).
* ⚔️ **Daily SQL Challenges & Global Leaderboard**: Real-time test-case assertion engine with percentile distributions, XP gamification, and daily streaks.
* 📊 **Analytics & Data Studio**: Build custom metric dashboards, query-to-chart rendering (Area, Bar, Line, Pie), and export dataset reports.
* 🛠️ **Dataset & Schema Builder**: Visual relationship mapper (1:1, 1:N, N:M), foreign key constraint visualizer, and synthetic data generator.
* 📜 **Verifiable Career Certificates**: Cryptographically verifiable completion certificates and competency roadmaps for data engineering roles.
* 🔒 **Hardened Security & Privacy**: JWT authentication, rate limiting, Content Security Policy (CSP), SQL query parameterization, and isolated Error Boundaries.

---

## 🏗️ Architecture Overview

```
 ┌───────────────────────────────────────────────────────────┐
 │                   MobileSQL Client (React 19)             │
 │   Zustand Stores  •  TanStack Query  •  Monaco Editor     │
 └─────────────────────────────┬─────────────────────────────┘
                               │  HTTPS / REST / WebSocket
 ┌─────────────────────────────▼─────────────────────────────┐
 │                Express 4 API Server (Node 22)             │
 │   Security Headers  •  Rate Limiting  •  Zod Validation   │
 └──────────────┬───────────────────────────────┬────────────┘
                │                               │
 ┌──────────────▼──────────────┐  ┌─────────────▼────────────┐
 │     Prisma ORM Client       │  │    Google Gemini 2.5     │
 │  PostgreSQL 16 Engine / DB  │  │   AI Copilot & Explainer │
 └─────────────────────────────┘  └──────────────────────────┘
```

---

## 🚀 Quickstart

### Prerequisites
* Node.js >= 22.0.0
* npm >= 10.0.0
* Docker & Docker Compose (Optional for local PostgreSQL)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/mobilesql/mobilesql.git
cd mobilesql
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Fill in GEMINI_API_KEY, DATABASE_URL, and JWT_SECRET
```

### 3. Generate Database Client & Seed
```bash
npx prisma generate
npx prisma db push
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Docker Deployment

To launch the full stack with PostgreSQL and Redis:
```bash
docker-compose up -d --build
```

---

## 🧪 Testing Suite

Run full unit, integration, and E2E test suites:
```bash
# Run unit & integration tests
npx vitest run --coverage

# Run Playwright mobile & desktop E2E tests
npx playwright test
```

---

## 📂 Project Structure

```
├── .github/              # CI/CD Workflows & Issue Templates
├── docs/                 # Architecture, API & Deployment Guides
├── e2e/                  # Playwright End-to-End Tests
├── prisma/               # Prisma Database Schema & Migrations
├── public/               # PWA Manifest, Robots, Sitemaps & Icons
├── src/
│   ├── components/       # Atomic UI & Domain Components
│   ├── data/             # Curriculum, Challenge & Seed Datasets
│   ├── server/           # Express REST API, Prisma Repositories & Middlewares
│   ├── services/         # API Client & React Query Hooks
│   ├── stores/           # Zustand State Stores
│   └── types/            # TypeScript Domain Definitions
├── server.ts             # Node.js Server & AI Copilot Entry Point
└── vite.config.ts        # Vite & Tailwind CSS Configuration
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
