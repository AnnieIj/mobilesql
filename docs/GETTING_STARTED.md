# Getting Started with MobileSQL

Welcome to **MobileSQL**, the premier mobile-first SQL execution engine, interactive academy, and AI-powered database laboratory.

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js**: Version 22 LTS or newer
- **npm**: Version 10 or newer (or pnpm / yarn)
- **Docker** (Optional for containerized deployments)

### 2. Clone & Install
\`\`\`bash
# Clone the repository
git clone https://github.com/mobilesql/mobilesql.git
cd mobilesql

# Install dependencies using the synchronized lockfile
npm ci

# Generate the Prisma database client
npx prisma generate
\`\`\`

### 3. Environment Configuration
\`\`\`bash
# Copy example environment configuration
cp .env.example .env
\`\`\`

Configure your `.env` parameters:
\`\`\`env
# Core Server Configuration
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000

# Authentication Secret
JWT_SECRET="mobilesql_super_secret_jwt_key_2026"

# Optional Relational Database Connection (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mobilesql?schema=public"

# Optional Gemini AI API Key (for Copilot features)
GEMINI_API_KEY="your_api_key_here"
\`\`\`

### 4. Launch Development Server
\`\`\`bash
npm run dev
\`\`\`
Visit `http://localhost:3000` to interact with MobileSQL.

---

## 📱 Mobile Gestures & Ergonomics
- **Command Search**: Press `⌘ + K` or `Ctrl + K` to search all lessons, tables, and docs.
- **Instant Query Run**: Press `⌘ + Enter` to execute SQL immediately.
- **AI Copilot Drawer**: Press `⌘ + I` or tap the Copilot spark button.
- **Tactile Accessory Bar**: Use thumb quick-keys for `SELECT`, `FROM`, `WHERE`, `JOIN`, `GROUP BY`, and bracket balancing.
