import React, { useState } from 'react';
import {
  BookOpen,
  Terminal,
  Cpu,
  Layers,
  Server,
  Code2,
  GitBranch,
  HelpCircle,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  Search,
  Sparkles,
  Database,
  Shield,
  Zap,
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { Badge } from '../ui/Badge';
import { useUIStore } from '../../stores/useUIStore';

type DocSectionId =
  | 'getting-started'
  | 'architecture'
  | 'api-reference'
  | 'deployment'
  | 'contributing'
  | 'faq'
  | 'roadmap';

interface DocNavCategory {
  id: DocSectionId;
  label: string;
  icon: React.ElementType;
}

export const DocsHubView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<DocSectionId>('getting-started');
  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { setActiveTab } = useUIStore();

  const handleCopy = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeKey(key);
    setTimeout(() => setCopiedCodeKey(null), 2000);
  };

  const navItems: DocNavCategory[] = [
    { id: 'getting-started', label: '1. Getting Started', icon: BookOpen },
    { id: 'architecture', label: '2. Architecture', icon: Layers },
    { id: 'api-reference', label: '3. API Reference', icon: Code2 },
    { id: 'deployment', label: '4. Deployment Guide', icon: Server },
    { id: 'contributing', label: '5. Contributing Guide', icon: GitBranch },
    { id: 'faq', label: '6. Common FAQ', icon: HelpCircle },
    { id: 'roadmap', label: '7. 2026 Roadmap', icon: MapPin },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans text-[#FFFFFF]">
      {/* Top Docs Header */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#62DF7D]/15 border border-[#62DF7D]/40 text-[#62DF7D] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-[#FFFFFF]">MobileSQL Developer & Architecture Documentation</h1>
                <Badge variant="emerald">v1.0.0-PROD</Badge>
              </div>
              <p className="text-xs text-[#8A8A90] font-mono">
                Official specifications for database sandboxes, REST APIs, deployment pipelines, and contribution rubrics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('playground')}
              className="px-3.5 py-2 rounded-xl bg-[#62DF7D] text-[#131315] font-extrabold text-xs font-mono flex items-center gap-1.5 hover:bg-[#52ce6d] transition-all cursor-pointer"
            >
              <Terminal className="w-4 h-4" /> Launch Sandbox
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-[#8A8A90]">
              Documentation Index
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2.5',
                    isActive
                      ? 'bg-[#232326] text-[#62DF7D] font-bold border border-[#62DF7D]/30'
                      : 'text-[#8A8A90] hover:text-[#FFFFFF] hover:bg-[#131315]'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isActive ? 'text-[#62DF7D]' : 'text-[#8A8A90]')} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Support Badge */}
          <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-4 space-y-2 font-mono text-xs">
            <div className="flex items-center gap-2 text-[#62DF7D] font-bold text-[11px]">
              <Shield className="w-4 h-4" /> Enterprise Support
            </div>
            <p className="text-[11px] text-[#8A8A90] leading-relaxed">
              Need custom VPC endpoints or multi-tenant database sandbox isolation?
            </p>
            <a
              href="mailto:support@mobilesql.io"
              className="text-[11px] text-[#3B82F6] hover:underline flex items-center gap-1"
            >
              support@mobilesql.io <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Right Content Viewport */}
        <div className="lg:col-span-3 bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-6 shadow-xl leading-relaxed">
          {/* SECTION 1: GETTING STARTED */}
          {activeSection === 'getting-started' && (
            <div className="space-y-6">
              <div className="border-b border-[#2D2D31] pb-4">
                <h2 className="text-xl font-bold text-[#FFFFFF] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#62DF7D]" /> Getting Started with MobileSQL
                </h2>
                <p className="text-xs text-[#8A8A90] mt-1 font-mono">
                  Quick start guide for running your first interactive queries and navigating mobile workflows.
                </p>
              </div>

              <div className="space-y-4 text-xs text-[#C8C8CC]">
                <h3 className="text-sm font-bold text-[#FFFFFF]">1. Quick Installation & Local Setup</h3>
                <p>Clone the repository and install all locked dependencies using npm:</p>
                <div className="relative rounded-xl bg-[#131315] border border-[#2D2D31] p-4 font-mono text-xs text-[#62DF7D]">
                  <code>git clone https://github.com/mobilesql/mobilesql.git
cd mobilesql
npm ci
npx prisma generate
npm run dev</code>
                  <button
                    onClick={() => handleCopy('git clone https://github.com/mobilesql/mobilesql.git\ncd mobilesql\nnpm ci\nnpx prisma generate\nnpm run dev', 'git-clone')}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-[#1B1B1E] border border-[#2D2D31] text-[#8A8A90] hover:text-[#FFFFFF]"
                  >
                    {copiedCodeKey === 'git-clone' ? <Check className="w-3.5 h-3.5 text-[#62DF7D]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <h3 className="text-sm font-bold text-[#FFFFFF] pt-2">2. Environment Configuration</h3>
                <p>Copy the environment template and configure database connection parameters:</p>
                <div className="relative rounded-xl bg-[#131315] border border-[#2D2D31] p-4 font-mono text-xs text-[#C8C8CC]">
                  <code>cp .env.example .env
# Set DATABASE_URL and JWT_SECRET
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mobilesql?schema=public"
JWT_SECRET="mobilesql_super_secret_jwt_key_2026"
GEMINI_API_KEY="your_api_key_here"</code>
                </div>

                <h3 className="text-sm font-bold text-[#FFFFFF] pt-2">3. Mobile Ergonomics & Keyboard Shortcuts</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-[#8A8A90]">
                  <li><strong className="text-[#FFFFFF]">⌘ + K / Ctrl + K:</strong> Open Universal Command Search</li>
                  <li><strong className="text-[#FFFFFF]">⌘ + Enter:</strong> Execute SQL Statement instantly</li>
                  <li><strong className="text-[#FFFFFF]">⌘ + I:</strong> Toggle Gemini AI Copilot Drawer</li>
                  <li><strong className="text-[#FFFFFF]">Swipe Right:</strong> Reveal SQL Snippet Drawer</li>
                </ul>
              </div>
            </div>
          )}

          {/* SECTION 2: ARCHITECTURE */}
          {activeSection === 'architecture' && (
            <div className="space-y-6">
              <div className="border-b border-[#2D2D31] pb-4">
                <h2 className="text-xl font-bold text-[#FFFFFF] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#3B82F6]" /> System Architecture & Execution Engines
                </h2>
                <p className="text-xs text-[#8A8A90] mt-1 font-mono">
                  Hybrid client-server execution model with SQLite WASM and PostgreSQL 16 Proxies.
                </p>
              </div>

              <div className="space-y-4 text-xs text-[#C8C8CC]">
                <div className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] font-mono text-[11px] leading-relaxed">
                  <pre className="text-[#62DF7D]">
{`+-------------------------------------------------------------+
|                     Client Browser / PWA                     |
|  [React 19 SPA] + [Zustand Stores] + [TanStack React Query]  |
+------------------------------+------------------------------+
                               |
            +------------------+------------------+
            |                                     |
+-----------v-----------+             +-----------v-----------+
|  SQLite WASM Sandbox  |             |  Express 4 / Node 22  |
|  (In-Memory Offline)  |             |  (/api/v1 REST Routes)|
+-----------------------+             +-----------+-----------+
                                                  |
                               +------------------+------------------+
                               |                                     |
                     +---------v---------+                 +---------v---------+
                     |  Prisma ORM Proxy |                 |  Gemini 2.5 Flash |
                     |  PostgreSQL / SQL |                 |  AI Query Copilot |
                     +-------------------+                 +-------------------+`}
                  </pre>
                </div>

                <h3 className="text-sm font-bold text-[#FFFFFF]">Resilient Database Proxy Pattern</h3>
                <p>
                  MobileSQL eliminates cloud container cold-start failures through a resilient database proxy wrapper. If an external PostgreSQL instance is undergoing maintenance or starting up, the system gracefully proxies requests through structured in-memory datasets without interrupting the user session.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 3: API REFERENCE */}
          {activeSection === 'api-reference' && (
            <div className="space-y-6">
              <div className="border-b border-[#2D2D31] pb-4">
                <h2 className="text-xl font-bold text-[#FFFFFF] flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-[#A855F7]" /> REST API Specification (v1)
                </h2>
                <p className="text-xs text-[#8A8A90] mt-1 font-mono">
                  Standardized JSON endpoints with HMAC-SHA256 bearer token authentication.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {/* Endpoint 1 */}
                <div className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-2">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="px-2 py-0.5 rounded bg-[#22C55E]/20 text-[#22C55E] font-bold">GET</span>
                    <span className="text-[#FFFFFF]">/api/health</span>
                  </div>
                  <p className="text-[#8A8A90]">Returns container telemetry, uptime, memory metrics, and system status.</p>
                </div>

                {/* Endpoint 2 */}
                <div className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-2">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="px-2 py-0.5 rounded bg-[#3B82F6]/20 text-[#3B82F6] font-bold">POST</span>
                    <span className="text-[#FFFFFF]">/api/v1/auth/login</span>
                  </div>
                  <p className="text-[#8A8A90]">Authenticates user and returns JWT accessToken and refreshToken pair.</p>
                </div>

                {/* Endpoint 3 */}
                <div className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-2">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="px-2 py-0.5 rounded bg-[#3B82F6]/20 text-[#3B82F6] font-bold">POST</span>
                    <span className="text-[#FFFFFF]">/api/v1/query/execute</span>
                  </div>
                  <p className="text-[#8A8A90]">Executes a sanitized SQL query against target sandbox and returns execution time, rows, and columns.</p>
                </div>

                {/* Endpoint 4 */}
                <div className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-2">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="px-2 py-0.5 rounded bg-[#3B82F6]/20 text-[#3B82F6] font-bold">POST</span>
                    <span className="text-[#FFFFFF]">/api/copilot/explain</span>
                  </div>
                  <p className="text-[#8A8A90]">Invokes Gemini 2.5 Flash to generate structured query breakdown and indexing tips.</p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: DEPLOYMENT */}
          {activeSection === 'deployment' && (
            <div className="space-y-6">
              <div className="border-b border-[#2D2D31] pb-4">
                <h2 className="text-xl font-bold text-[#FFFFFF] flex items-center gap-2">
                  <Server className="w-5 h-5 text-[#F59E0B]" /> Enterprise Deployment Guide
                </h2>
                <p className="text-xs text-[#8A8A90] mt-1 font-mono">
                  Production deployment on Docker, Google Cloud Run, Render, and Railway.
                </p>
              </div>

              <div className="space-y-4 text-xs text-[#C8C8CC]">
                <h3 className="text-sm font-bold text-[#FFFFFF]">Docker Containerization</h3>
                <div className="relative rounded-xl bg-[#131315] border border-[#2D2D31] p-4 font-mono text-xs text-[#62DF7D]">
                  <code># Build container image
docker build -t mobilesql:latest .

# Run container on port 3000
docker run -p 3000:3000 --env-file .env mobilesql:latest</code>
                </div>

                <h3 className="text-sm font-bold text-[#FFFFFF] pt-2">Automated CI/CD Workflows</h3>
                <p className="text-[#8A8A90]">
                  Every commit triggers the GitHub Actions pipeline (`.github/workflows/ci.yml`), executing:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-[#8A8A90]">
                  <li>Node 22 LTS environment setup with npm cache</li>
                  <li>Prisma Client generation (`npx prisma generate`)</li>
                  <li>TypeScript strict typecheck (`tsc --noEmit`)</li>
                  <li>Vitest Unit & Integration Suites</li>
                  <li>Playwright Mobile & Desktop E2E Suites</li>
                  <li>Production bundle compilation (`npm run build`)</li>
                </ul>
              </div>
            </div>
          )}

          {/* SECTION 5: CONTRIBUTING */}
          {activeSection === 'contributing' && (
            <div className="space-y-6">
              <div className="border-b border-[#2D2D31] pb-4">
                <h2 className="text-xl font-bold text-[#FFFFFF] flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-[#22C55E]" /> Open Source Contributing Guide
                </h2>
                <p className="text-xs text-[#8A8A90] mt-1 font-mono">
                  Join our open-source community. Guidelines for pull requests, bug reports, and challenges.
                </p>
              </div>

              <div className="space-y-4 text-xs text-[#C8C8CC]">
                <h3 className="text-sm font-bold text-[#FFFFFF]">Contribution Process</h3>
                <ol className="list-decimal pl-5 space-y-2 text-[#8A8A90]">
                  <li>Fork the repository and create a feature branch (`git checkout -b feature/amazing-feature`)</li>
                  <li>Verify that tests pass locally: `npm run test` and `npm run lint`</li>
                  <li>Ensure all new components adhere to the locked Elegant Dark theme palette</li>
                  <li>Submit a Pull Request with description and test results</li>
                </ol>

                <h3 className="text-sm font-bold text-[#FFFFFF] pt-2">Good First Issues</h3>
                <p className="text-[#8A8A90]">
                  Check out the GitHub issue tracker for issues tagged with <span className="text-[#62DF7D] font-mono">good first issue</span> and <span className="text-[#3B82F6] font-mono">help wanted</span>.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 6: FAQ */}
          {activeSection === 'faq' && (
            <div className="space-y-6">
              <div className="border-b border-[#2D2D31] pb-4">
                <h2 className="text-xl font-bold text-[#FFFFFF] flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#3B82F6]" /> Technical Frequently Asked Questions
                </h2>
                <p className="text-xs text-[#8A8A90] mt-1 font-mono">
                  In-depth architectural questions and troubleshooting.
                </p>
              </div>

              <div className="space-y-4 text-xs text-[#C8C8CC]">
                <div className="space-y-1">
                  <h4 className="font-bold text-[#FFFFFF]">How is SQL executed securely without arbitrary shell escapes?</h4>
                  <p className="text-[#8A8A90]">
                    All SQL input is parsed and sanitized by dialect-specific parsers. In-memory execution takes place within an isolated WASM sandbox with zero disk or network access privileges.
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-[#FFFFFF]">How does the gamification XP and streak engine prevent clock spoofing?</h4>
                  <p className="text-[#8A8A90]">
                    Streaks are validated server-side by UTC timestamp checks in `userPrismaRepository.ts` preventing local system clock rollbacks.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: ROADMAP */}
          {activeSection === 'roadmap' && (
            <div className="space-y-6">
              <div className="border-b border-[#2D2D31] pb-4">
                <h2 className="text-xl font-bold text-[#FFFFFF] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#F59E0B]" /> 2026 Product & Architecture Roadmap
                </h2>
                <p className="text-xs text-[#8A8A90] mt-1 font-mono">
                  Upcoming capabilities planned for MobileSQL Community & Enterprise editions.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#62DF7D] font-mono">Q1 2026 • COMPLETED</span>
                    <Badge variant="emerald">Delivered</Badge>
                  </div>
                  <p className="text-[#8A8A90]">
                    Release v1.0.0-PROD: Mobile-first IDE, 12 Academy modules, AI Copilot, Visual EXPLAIN trees, and open-source release.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#3B82F6] font-mono">Q2 2026 • IN PROGRESS</span>
                    <Badge variant="info">Active Sprint</Badge>
                  </div>
                  <p className="text-[#8A8A90]">
                    DuckDB WASM Client Analytics Engine: Run OLAP aggregate queries directly against local Parquet files on mobile.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#A855F7] font-mono">Q3 2026 • UPCOMING</span>
                    <Badge variant="glow">Planned</Badge>
                  </div>
                  <p className="text-[#8A8A90]">
                    Multi-user Real-Time SQL Pair Programming: Live collaborative sessions with shared cursor and query outputs.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
