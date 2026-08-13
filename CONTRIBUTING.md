# Contributing to MobileSQL

Thank you for your interest in contributing to MobileSQL! We welcome bug fixes, performance optimizations, and documentation improvements.

---

## Development Workflow

1. **Fork & Clone**
   ```bash
   git clone https://github.com/your-username/mobilesql.git
   cd mobilesql
   ```

2. **Install Dependencies**
   ```bash
   npm install
   npx prisma generate
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b fix/query-profiler-latency
   ```

4. **Run Validation & Tests**
   ```bash
   npm run lint
   npx vitest run
   ```

5. **Submit a Pull Request**
   - Provide a clear, concise description of your changes.
   - Reference any related issues (e.g. `Fixes #42`).
   - Ensure all CI checks pass.

---

## Coding Standards

- **TypeScript**: Strict typing without `any` where possible.
- **Styling**: Tailwind CSS utility classes; adhere to the locked **Elegant Dark** design system (`#0D0D0E`, `#131315`, `#1B1B1E`, `#62DF7D`).
- **Icons**: Exclusively use `lucide-react`.
- **State**: Use Zustand for client state; TanStack React Query for async server data.
