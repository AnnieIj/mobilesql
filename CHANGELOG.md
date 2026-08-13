# Changelog

All notable changes to **MobileSQL** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-08-13

### Added
- **Interactive SQL Playground**: Multi-dialect SQL execution (PostgreSQL, SQLite, MySQL) with pagination, sorting, and CSV/JSON export.
- **Academy Masterclasses**: Structured learning tracks from beginner syntax to advanced analytical window functions.
- **Gemini AI Copilot**: Context-aware SQL generation, syntax debugging, and execution plan optimization.
- **Competitive Arena**: Daily challenges, XP progression, and live global rankings.
- **Dataset Builder**: Visual relational table designer with foreign key mapping.
- **Analytics Studio**: Query-to-chart visualization studio with multi-chart layout.
- **Career Roadmaps**: Assessment tracks and verifiable credential generation.
- **Production Infrastructure**: Multi-stage Dockerfile, NGINX proxy, CI/CD GitHub Actions, and Vitest/Playwright test suites.

### Security
- Added Helmet Content Security Policy (CSP) and HTTP security headers.
- Sliding-window rate limiter on all API and authentication endpoints.
- Isolated Error Boundary fault protections.
