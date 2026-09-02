# Contributing to MobileSQL

Thank you for your interest in contributing to **MobileSQL**! 

MobileSQL is currently undergoing **maintainer governance and stabilization review** to establish standard practices for open-source collaboration. This guide outlines the development workflow, quality gates, coding conventions, and pull request expectations.

---

## 📋 Prerequisites

Ensure your local development environment meets the following requirements:
* **Node.js**: `>= 22.0.0` (LTS recommended)
* **npm**: `>= 10.0.0`
* **Git**: `>= 2.30.0`
* **PostgreSQL**: `16+` (Optional — local development automatically supports an in-memory database fallback when `DATABASE_URL` is omitted)
* **Docker & Docker Compose**: (Optional — for containerized services)

---

## 🛠️ Getting Started & Local Setup

### 1. Fork & Clone
```bash
git clone https://github.com/<your-username>/mobilesql.git
cd mobilesql
```

### 2. Install Dependencies
Always use `npm ci` to ensure dependencies match the synchronized lockfile exactly:
```bash
npm ci
```
*(The postinstall script will automatically trigger `npx prisma generate` to generate Prisma client bindings).*

### 3. Configure Environment Variables
Copy the template configuration file:
```bash
cp .env.example .env
```
Key variables:
* `PORT`: Server port (default `3000`)
* `JWT_SECRET`: Secret key for session tokens (e.g., `dev_secret_key_min_32_characters`)
* `DATABASE_URL`: *(Optional)* Connection string for PostgreSQL database
* `GEMINI_API_KEY`: *(Optional)* Google Gemini API key for AI Copilot features

### 4. Database Setup & Migrations (Optional)
If connecting to a live PostgreSQL instance:
```bash
# Apply existing migrations
npx prisma migrate deploy

# Seed baseline database records
npx tsx src/server/database/seed.ts
```

### 5. Launch the Local Development Server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to view the live application.

---

## 🧪 Quality Verification & Testing

Every change must pass all automated quality checks before a pull request can be merged:

```bash
# Run unit & integration test suites
npm test

# Run strict TypeScript type verification
npm run typecheck

# Run code style & lint checks
npm run lint

# Verify production build compilation
npm run build
```

---

## 🌿 Git & Branching Workflow

### Branch Naming Conventions
Create descriptive branches originating from `main`:
* `feat/<feature-name>` — New capabilities or enhancements
* `fix/<bug-description>` — Bug fixes
* `docs/<topic>` — Documentation improvements
* `test/<component>` — Adding or repairing tests
* `refactor/<scope>` — Code reorganization without functional changes
* `chore/<task>` — Maintenance tasks, dependencies, or tooling updates

*Example:* `git checkout -b fix/editor-line-numbering`

### Commit Message Guidelines
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```text
<type>(<optional scope>): <description in imperative mood>

[optional body explaining motivation and context]

[optional footer(s), e.g. Closes #123]
```

**Allowed Types:**
* `feat`: A new feature
* `fix`: A bug fix
* `docs`: Documentation only changes
* `style`: Changes that do not affect the meaning of the code (formatting, white-space)
* `refactor`: A code change that neither fixes a bug nor adds a feature
* `perf`: A code change that improves performance
* `test`: Adding missing tests or correcting existing tests
* `ci`: Changes to CI/CD configuration files and scripts
* `chore`: Maintenance, build process, or auxiliary tool updates

---

## 🗄️ Database Changes & Prisma Workflow

When modifying database schemas:

1. **Edit Schema**: Make changes inside `prisma/schema.prisma`.
2. **Validate Schema**:
   ```bash
   npx prisma validate
   ```
3. **Generate Migration**:
   ```bash
   npx prisma migrate dev --name <descriptive_name>
   ```
4. **Regenerate Client**:
   ```bash
   npx prisma generate
   ```
5. **Update Repository & Tests**: Ensure all corresponding Prisma repositories in `src/server/database/repositories/` and in-memory mock fallbacks remain in sync.

---

## 🎨 Code & Architectural Standards

* **TypeScript**: Strict mode is enforced. Avoid untyped `any` and write explicit interface contracts.
* **Component Architecture**: Keep UI modular, composable, and atomic. Sub-components must reside in dedicated directories under `src/components/`.
* **Styling**: Tailwind CSS utility classes exclusively. Adhere to the established design system tokens and responsive touch targets (minimum 44px on mobile).
* **State Management**: Zustand for client-side synchronous state; TanStack Query for asynchronous server state.
* **Error Handling**: Gracefully handle network and database errors using structured API responses and Error Boundaries.

---

## 📥 Submitting a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin fix/editor-line-numbering
   ```
2. Open a Pull Request targeting the `main` branch.
3. Fill out all sections of the [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md), including:
   - Summary and motivation
   - Implementation overview
   - Evidence of local testing
   - Database / migration impact (if applicable)
4. Ensure all GitHub Actions CI checks pass.
5. Address code review feedback promptly.

---

## 📜 Code of Conduct

All contributors and maintainers are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please report unacceptable behavior through established private reporting channels.
