# MobileSQL Project Roadmap

This document outlines the development status and roadmap for **MobileSQL**.

---

## 1. Completed Capabilities (Verified ✅)

The following features and foundational milestones have been implemented, tested, and verified in the codebase:

### Core SQL & AI Engine
- [x] **Mobile-First SQL Playground**: Zero-latency query runner with Monaco Editor, keyboard assist accessory bar, pagination, and multi-dialect compatibility.
- [x] **Google Gemini AI Copilot**: Natural language to SQL synthesis, query `EXPLAIN` breakdown, performance index suggestions, and syntax debugging.
- [x] **Interactive Academy Curriculum**: Multi-track SQL masterclasses ranging from basic `SELECT` to Window Functions, CTEs, and query optimization.
- [x] **Daily SQL Challenges & Assertions**: Real-time SQL assertion engine with percentile distributions, XP gamification, and streak tracking.
- [x] **Analytics & Data Studio**: Query result visualization (Line, Bar, Area, Pie) and dataset export.
- [x] **Visual Schema & Dataset Builder**: Entity-relationship modeler with synthetic mock data generation.

### Infrastructure & Engineering Baseline
- [x] **Test Infrastructure Restoration**: Restored Vitest unit and store test suites with 100% pass rate (`12/12 passing`).
- [x] **Database Schema & Migration Baseline**: Comprehensive Prisma schema with 34 relational models, 13 enums, baseline migration (`20260901000000_init`), and resilient in-memory fallback.
- [x] **CI/CD Quality Gates**: Synchronized lockfile dependencies and established automated GitHub Actions workflow (`ci.yml`) enforcing schema validation, typechecking, linting, unit testing, security auditing, and production builds.

---

## 2. Stabilization & Governance (Current Phase 🎯)

Current focus is on maintainer readiness, codebase reliability, and open-source governance preparation for stakeholder review:

- [x] **Open-Source Governance Baseline**: Comprehensive documentation including `README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, and issue/PR templates.
- [ ] **Docker & Production Deployment Hardening**: Multi-stage Alpine container build validation and local container orchestration testing.
- [ ] **Stakeholder Maintainership Review**: Evaluation and formal approval of maintainer governance structure and repository transfer.
- [ ] **E2E Test Suite Execution**: Verification of Playwright mobile and desktop viewport interaction tests in headless runner environments.

---

## 3. Planned Features (Future Releases 🚀)

*Note: Work on planned features will begin following formal maintainer approval and stakeholder sign-off.*

### Collaboration & Integrations
- [ ] **Team Workspaces**: Shared query collections, team permissions, and collaborative snippet libraries.
- [ ] **Cloud Database Connectors**: Direct tunnel connections to external analytical engines (Snowflake, Google BigQuery, ClickHouse).

### Native Mobile & Offline Capabilities
- [ ] **Offline-First SQLite Sync**: Local browser and client-side database caching with background cloud sync.
- [ ] **Native Mobile Shell**: Packaging for iOS and Android via Capacitor / React Native wrappers.

### Enterprise Security & Compliance
- [ ] **Enterprise SSO**: SAML 2.0 and OIDC authentication integration.
- [ ] **Fine-Grained Access Control**: Role-based access control (RBAC) and row-level security (RLS) enforcement.

