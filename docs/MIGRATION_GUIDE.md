# MobileSQL Database & Engine Migration Guide

This guide details migration paths for migrating data, schemas, and queries to MobileSQL v1.0.0-PROD.

---

## 🗄️ 1. Prisma Schema Migrations

### Applying Pending Migrations
\`\`\`bash
# Run migrations against your configured DATABASE_URL
npx prisma migrate deploy

# Generate updated Prisma client bindings
npx prisma generate
\`\`\`

### In-Memory Fallback Behavior
When `DATABASE_URL` is omitted or temporarily unreachable, MobileSQL utilizes its **Resilient Database Proxy Pattern**:
- Automatically initializes in-memory SQLite WASM mock structures.
- Eliminates cloud container cold-start failures.
- Preserves all client state in local key-value stores.

---

## 🔄 2. Exporting & Importing Custom Datasets
- MobileSQL supports importing JSON tables and CSV schemas directly via the **AI Dataset Builder** (`/dataset-builder`).
- Custom user schemas can be exported into portable `.sql` DDL dump files compatible with PostgreSQL 16 and SQLite 3.
