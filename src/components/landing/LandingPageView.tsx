import React, { useState } from 'react';
import {
  Terminal,
  Sparkles,
  BookOpen,
  Zap,
  Activity,
  Award,
  ShieldCheck,
  Smartphone,
  Layers,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Database,
  Cpu,
  Star,
  Users,
  Code2,
  Lock,
  Play,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/cn';

export const LandingPageView: React.FC = () => {
  const { setActiveTab, setCopilotOpen } = useUIStore();
  const { loadDemoPersona, isDemoMode } = useAuthStore();

  const [activeTourStep, setActiveTourStep] = useState(0);
  const [activePreviewTab, setActivePreviewTab] = useState<'playground' | 'explain' | 'academy' | 'analytics'>('playground');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const tourSteps = [
    {
      title: '1. Instant Mobile SQL Editor',
      description: 'Run native PostgreSQL 16, SQLite WASM, and MySQL queries with intelligent autocomplete and tactile mobile quick-keys.',
      icon: Terminal,
      tab: 'playground' as const,
    },
    {
      title: '2. Visual EXPLAIN Plan Analyzer',
      description: 'Inspect execution bottlenecks, sequential vs index scans, join cost metrics, and memory buffers visually.',
      icon: Activity,
      tab: 'sql-lab' as const,
    },
    {
      title: '3. Gamified Interactive Academy',
      description: 'Master 12 progressive curriculum modules with live code challenges, test suites, and verifiable credentials.',
      icon: BookOpen,
      tab: 'academy' as const,
    },
    {
      title: '4. Gemini AI Database Copilot',
      description: 'Convert natural language prompts into optimized SQL, generate schemas, and diagnose slow queries.',
      icon: Sparkles,
      tab: 'copilot' as const,
    },
  ];

  const faqs = [
    {
      q: 'Does MobileSQL require an active server connection to practice?',
      a: 'No! MobileSQL includes client-side SQLite WASM in-memory databases that execute SQL entirely in your browser offline. For PostgreSQL and MySQL features, queries are proxied securely to isolated sandboxes.',
    },
    {
      q: 'Can I connect my own cloud production databases?',
      a: 'Yes. MobileSQL Pro supports connecting custom PostgreSQL, Supabase, Neon, AWS RDS, and Google Cloud SQL connection strings with SSL encryption and query sanitization.',
    },
    {
      q: 'Are certificates verifiable by employers?',
      a: 'Yes. Every certificate earned in MobileSQL Academy includes a cryptographic SHA-256 verification hash and public URL that recruiters can inspect directly.',
    },
    {
      q: 'What makes MobileSQL different from standard desktop SQL IDEs?',
      a: 'MobileSQL is purpose-built with mobile-first ergonomics: thumb-accessible query action triggers, custom SQL keyboard bars, gesture navigation, and zero-clutter execution outputs.',
    },
    {
      q: 'Is MobileSQL open source?',
      a: 'Yes, MobileSQL is fully open source under the MIT License, featuring an automated CI/CD pipeline, comprehensive Vitest/Playwright suites, and Docker container support.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Staff Analytics Engineer',
      company: 'FinTech Global',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      comment: 'MobileSQL completely transformed how I review complex analytics queries on the go. The visual EXPLAIN plan on my iPhone is genuinely faster than my desktop tools.',
      rating: 5,
    },
    {
      name: 'Marcus Vance',
      role: 'Senior Data Platform Architect',
      company: 'CloudScale Systems',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      comment: 'The Academy challenges with automated test cases gave our junior engineers the best hands-on indexing and window function training we have ever seen.',
      rating: 5,
    },
    {
      name: 'Dr. Priya Nair',
      role: 'Professor of Database Systems',
      company: 'Tech University',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
      comment: 'Our computer science students loved the instant feedback loop. Zero setup friction, instant sandbox execution, and beautiful mobile design.',
      rating: 5,
    },
  ];

  return (
    <div className="space-y-16 pb-16 font-sans text-[#FFFFFF]">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-6 sm:pt-12 pb-8 sm:pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Background glow accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#62DF7D]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative text-center max-w-3xl mx-auto space-y-6">
          {/* Release & Open Source Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B1B1E] border border-[#2D2D31] text-xs font-mono text-[#C8C8CC] shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#62DF7D] animate-pulse" />
            <span className="text-[#62DF7D] font-bold">MobileSQL v1.0.0 Live</span>
            <span className="text-[#8A8A90]">•</span>
            <span>Mobile-First SQL IDE & AI Academy</span>
          </div>

          {/* Display Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#FFFFFF] leading-[1.15]">
            Master SQL Anywhere. <br />
            <span className="text-[#62DF7D]">Desktop Power</span> in Your Pocket.
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-lg text-[#8A8A90] leading-relaxed max-w-2xl mx-auto">
            The next-generation mobile-first SQL execution environment with real-time sandbox engines, visual EXPLAIN plan cost profilers, and an AI-powered curriculum.
          </p>

          {/* Primary Call-to-Action Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('playground')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#62DF7D] text-[#131315] font-extrabold text-sm hover:bg-[#52ce6d] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#62DF7D]/20 cursor-pointer"
            >
              <Terminal className="w-4 h-4" />
              <span>Launch SQL Playground</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                loadDemoPersona();
                setActiveTab('dashboard');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1B1B1E] border border-[#2D2D31] hover:border-[#62DF7D]/60 text-[#FFFFFF] font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-[#F59E0B]" />
              <span>Explore as Demo Pro Architect</span>
            </button>

            <button
              onClick={() => setActiveTab('academy')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#1B1B1E] border border-[#2D2D31] hover:border-[#3B82F6]/60 text-[#C8C8CC] hover:text-[#FFFFFF] font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#3B82F6]" />
              <span>Explore Academy</span>
            </button>
          </div>

          {/* Quick Metrics Strip */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[#2D2D31]/80 max-w-2xl mx-auto font-mono text-center">
            <div>
              <div className="text-xl font-bold text-[#FFFFFF]">100%</div>
              <div className="text-[11px] text-[#8A8A90] uppercase tracking-wider">Open Source</div>
            </div>
            <div>
              <div className="text-xl font-bold text-[#62DF7D]">&lt; 12ms</div>
              <div className="text-[11px] text-[#8A8A90] uppercase tracking-wider">Execution Latency</div>
            </div>
            <div>
              <div className="text-xl font-bold text-[#FFFFFF]">12 Modules</div>
              <div className="text-[11px] text-[#8A8A90] uppercase tracking-wider">Zero to Pro</div>
            </div>
            <div>
              <div className="text-xl font-bold text-[#3B82F6]">3 Dialects</div>
              <div className="text-[11px] text-[#8A8A90] uppercase tracking-wider">Postgres / SQLite / MySQL</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE PRODUCT PREVIEW CANVAS */}
      <section className="px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl overflow-hidden shadow-2xl">
          {/* Top Mock Window Bar */}
          <div className="bg-[#131315] px-4 py-3 border-b border-[#2D2D31] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#EF4444]/80" />
              <div className="w-3 h-3 rounded-full bg-[#F59E0B]/80" />
              <div className="w-3 h-3 rounded-full bg-[#22C55E]/80" />
              <span className="text-xs font-mono text-[#8A8A90] pl-2 hidden sm:inline">
                mobilesql.io/sandbox/postgres-16
              </span>
            </div>

            {/* Preview switcher tabs */}
            <div className="flex items-center gap-1 bg-[#1B1B1E] p-1 rounded-xl border border-[#2D2D31]">
              <button
                onClick={() => setActivePreviewTab('playground')}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-mono transition-all',
                  activePreviewTab === 'playground'
                    ? 'bg-[#232326] text-[#62DF7D] font-bold'
                    : 'text-[#8A8A90] hover:text-[#FFFFFF]'
                )}
              >
                SQL Playground
              </button>
              <button
                onClick={() => setActivePreviewTab('explain')}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-mono transition-all',
                  activePreviewTab === 'explain'
                    ? 'bg-[#232326] text-[#3B82F6] font-bold'
                    : 'text-[#8A8A90] hover:text-[#FFFFFF]'
                )}
              >
                EXPLAIN Cost Tree
              </button>
              <button
                onClick={() => setActivePreviewTab('academy')}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-mono transition-all',
                  activePreviewTab === 'academy'
                    ? 'bg-[#232326] text-[#A855F7] font-bold'
                    : 'text-[#8A8A90] hover:text-[#FFFFFF]'
                )}
              >
                Curriculum
              </button>
              <button
                onClick={() => setActivePreviewTab('analytics')}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-mono transition-all',
                  activePreviewTab === 'analytics'
                    ? 'bg-[#232326] text-[#F59E0B] font-bold'
                    : 'text-[#8A8A90] hover:text-[#FFFFFF]'
                )}
              >
                Analytics Studio
              </button>
            </div>
          </div>

          {/* Interactive Screen Preview Content */}
          <div className="p-4 sm:p-6 bg-[#0E0E10] font-mono text-xs">
            {activePreviewTab === 'playground' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-2">
                  <div className="flex items-center justify-between text-[#8A8A90] border-b border-[#232326] pb-2">
                    <span className="text-[#62DF7D] font-bold">query_analytics_cohort.sql</span>
                    <span>Dialect: PostgreSQL 16 • Execution: 9.4ms</span>
                  </div>
                  <pre className="text-[#C8C8CC] leading-relaxed overflow-x-auto">
{`-- Calculate 30-Day Customer LTV and Window Ranking
WITH user_spend AS (
  SELECT 
    u.id, 
    u.name, 
    u.tier,
    COUNT(o.id) AS total_orders,
    SUM(o.total_amount) AS total_spent
  FROM users u
  LEFT JOIN orders o ON u.id = o.user_id
  GROUP BY u.id, u.name, u.tier
)
SELECT 
  name,
  tier,
  total_spent,
  DENSE_RANK() OVER (ORDER BY total_spent DESC) AS revenue_rank,
  ROUND(AVG(total_spent) OVER (PARTITION BY tier), 2) AS tier_avg_spend
FROM user_spend
ORDER BY total_spent DESC
LIMIT 5;`}
                  </pre>
                </div>

                {/* Simulated Result Grid */}
                <div className="rounded-xl border border-[#2D2D31] bg-[#131315] overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-[#1B1B1E] text-[#8A8A90] border-b border-[#2D2D31]">
                      <tr>
                        <th className="p-2.5">name</th>
                        <th className="p-2.5">tier</th>
                        <th className="p-2.5">total_spent ($)</th>
                        <th className="p-2.5">revenue_rank</th>
                        <th className="p-2.5">tier_avg_spend ($)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#232326] text-[#FFFFFF]">
                      <tr>
                        <td className="p-2.5 font-bold text-[#62DF7D]">Apex Enterprise Ltd</td>
                        <td className="p-2.5">Enterprise</td>
                        <td className="p-2.5 font-mono text-[#F59E0B]">42,850.00</td>
                        <td className="p-2.5">1</td>
                        <td className="p-2.5">38,120.00</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#62DF7D]">Quantum Dynamics</td>
                        <td className="p-2.5">Enterprise</td>
                        <td className="p-2.5 font-mono text-[#F59E0B]">39,200.00</td>
                        <td className="p-2.5">2</td>
                        <td className="p-2.5">38,120.00</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#62DF7D]">Starlight SaaS</td>
                        <td className="p-2.5">Growth</td>
                        <td className="p-2.5 font-mono text-[#F59E0B]">18,450.00</td>
                        <td className="p-2.5">3</td>
                        <td className="p-2.5">14,200.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activePreviewTab === 'explain' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-3">
                  <div className="flex items-center justify-between text-[#8A8A90]">
                    <span className="text-[#3B82F6] font-bold">EXPLAIN (ANALYZE, BUFFERS, VERBOSE) Plan</span>
                    <span className="text-[#22C55E]">Optimal Index Path Used</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-[#1B1B1E] border border-[#2D2D31]">
                      <div className="text-[10px] text-[#8A8A90]">TOTAL ESTIMATED COST</div>
                      <div className="text-base font-bold text-[#62DF7D]">14.28 units</div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#1B1B1E] border border-[#2D2D31]">
                      <div className="text-[10px] text-[#8A8A90]">ACTUAL RUNTIME</div>
                      <div className="text-base font-bold text-[#3B82F6]">1.84 ms</div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#1B1B1E] border border-[#2D2D31]">
                      <div className="text-[10px] text-[#8A8A90]">SCAN STRATEGY</div>
                      <div className="text-base font-bold text-[#A855F7]">Index Only Scan (idx_orders_user)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'academy' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-2">
                  <Badge variant="emerald">Module 01 • Mastered</Badge>
                  <div className="font-bold text-sm text-[#FFFFFF]">SQL Fundamentals & Relational Algebra</div>
                  <div className="text-[11px] text-[#8A8A90]">SELECT, WHERE filters, NULL semantics, and boolean logic.</div>
                </div>
                <div className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-2">
                  <Badge variant="info">Module 05 • Mastered</Badge>
                  <div className="font-bold text-sm text-[#FFFFFF]">Advanced Window Functions</div>
                  <div className="text-[11px] text-[#8A8A90]">ROW_NUMBER, DENSE_RANK, LEAD/LAG, and framing.</div>
                </div>
                <div className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-2">
                  <Badge variant="glow">Module 10 • In Progress</Badge>
                  <div className="font-bold text-sm text-[#FFFFFF]">Query Optimization & Indexing</div>
                  <div className="text-[11px] text-[#8A8A90]">B-Tree, GIN, BRIN indexes, partitioning and execution plans.</div>
                </div>
              </div>
            )}

            {activePreviewTab === 'analytics' && (
              <div className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-3">
                <div className="flex items-center justify-between text-[#8A8A90]">
                  <span className="text-[#F59E0B] font-bold">SQL Analytics Studio • Live Telemetry</span>
                  <span>Auto-Refresh 5s</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-[#1B1B1E] rounded-lg border border-[#2D2D31]">
                    <span className="text-[10px] text-[#8A8A90]">QUERIES RUN TODAY</span>
                    <div className="text-lg font-bold text-[#62DF7D]">14,280</div>
                  </div>
                  <div className="p-3 bg-[#1B1B1E] rounded-lg border border-[#2D2D31]">
                    <span className="text-[10px] text-[#8A8A90]">AVG LATENCY</span>
                    <div className="text-lg font-bold text-[#3B82F6]">11.4 ms</div>
                  </div>
                  <div className="p-3 bg-[#1B1B1E] rounded-lg border border-[#2D2D31]">
                    <span className="text-[10px] text-[#8A8A90]">INDEX HIT RATIO</span>
                    <div className="text-lg font-bold text-[#22C55E]">99.4%</div>
                  </div>
                  <div className="p-3 bg-[#1B1B1E] rounded-lg border border-[#2D2D31]">
                    <span className="text-[10px] text-[#8A8A90]">ACTIVE THREADS</span>
                    <div className="text-lg font-bold text-[#F59E0B]">42</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. CORE VALUE PROPOSITION & FEATURE SHOWCASE */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FFFFFF]">
            Engineered for Mobile Precision & Speed
          </h2>
          <p className="text-xs sm:text-sm text-[#8A8A90]">
            Every interaction is built around ergonomic touch feedback, rapid keyboard inputs, and instant sandbox responses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 hover:border-[#62DF7D]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#62DF7D]/10 border border-[#62DF7D]/30 flex items-center justify-center text-[#62DF7D]">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#FFFFFF]">Mobile-First Keyboard & Dock</h3>
            <p className="text-xs text-[#8A8A90] leading-relaxed">
              Tactile SQL keyboard accessory bar featuring instant SELECT, FROM, JOIN, WHERE, and bracket shortcuts tailored for phone screens.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 hover:border-[#3B82F6]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#FFFFFF]">Gemini AI Copilot & Fixer</h3>
            <p className="text-xs text-[#8A8A90] leading-relaxed">
              Transform natural language into production SQL, analyze performance bottlenecks, and get instant explanations for syntax errors.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 hover:border-[#A855F7]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/30 flex items-center justify-center text-[#A855F7]">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#FFFFFF]">Real Sandbox & WASM Offline</h3>
            <p className="text-xs text-[#8A8A90] leading-relaxed">
              Practice offline with zero network latency using client-side SQLite WASM or switch to live PostgreSQL 16 server sandboxes seamlessly.
            </p>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE PRODUCT TOUR */}
      <section className="px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2D2D31] pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#FFFFFF] flex items-center gap-2">
                <Play className="w-5 h-5 text-[#62DF7D]" /> Interactive Product Tour
              </h2>
              <p className="text-xs text-[#8A8A90] mt-1">
                Explore the core workflows powering MobileSQL in 4 interactive steps.
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-[#8A8A90]">Step {activeTourStep + 1} of {tourSteps.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tourSteps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeTourStep === idx;
              return (
                <button
                  key={step.title}
                  onClick={() => setActiveTourStep(idx)}
                  className={cn(
                    'p-4 rounded-xl text-left border transition-all flex items-start gap-3.5',
                    isSelected
                      ? 'bg-[#232326] border-[#62DF7D] text-[#FFFFFF]'
                      : 'bg-[#131315] border-[#2D2D31] text-[#8A8A90] hover:border-[#3F3F46]'
                  )}
                >
                  <div
                    className={cn(
                      'p-2.5 rounded-lg shrink-0',
                      isSelected ? 'bg-[#62DF7D]/20 text-[#62DF7D]' : 'bg-[#1B1B1E] text-[#8A8A90]'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className={cn('text-xs font-bold font-mono', isSelected ? 'text-[#62DF7D]' : 'text-[#FFFFFF]')}>
                      {step.title}
                    </div>
                    <p className="text-[11px] leading-relaxed text-[#8A8A90]">{step.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setActiveTab(tourSteps[activeTourStep].tab)}
              className="px-4 py-2 rounded-xl bg-[#62DF7D] text-[#131315] font-bold text-xs flex items-center gap-2 hover:bg-[#52ce6d] transition-all cursor-pointer font-mono"
            >
              <span>Launch Step Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-[#FFFFFF]">Trusted by Data Engineers Worldwide</h2>
          <p className="text-xs text-[#8A8A90]">Hear from practicing data professionals, students, and curriculum architects.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-lg flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#F59E0B]">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-[#C8C8CC] leading-relaxed italic">"{t.comment}"</p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#2D2D31]/80">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-9 h-9 rounded-full border border-[#2D2D31] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-xs font-bold text-[#FFFFFF]">{t.name}</div>
                  <div className="text-[10px] text-[#8A8A90]">{t.role} • {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TRANSPARENT PRICING CARDS */}
      <section className="px-4 sm:px-6 max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FFFFFF]">Simple, Transparent Pricing</h2>
          <p className="text-xs text-[#8A8A90]">Everything you need to master SQL from anywhere. No surprises.</p>

          <div className="inline-flex items-center gap-2 p-1 rounded-xl bg-[#1B1B1E] border border-[#2D2D31]">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-mono transition-all',
                billingCycle === 'monthly' ? 'bg-[#232326] text-[#62DF7D] font-bold' : 'text-[#8A8A90]'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1',
                billingCycle === 'yearly' ? 'bg-[#232326] text-[#62DF7D] font-bold' : 'text-[#8A8A90]'
              )}
            >
              Yearly <span className="text-[10px] text-[#62DF7D] font-bold">(Save 20%)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Tier */}
          <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#FFFFFF]">Community Free</h3>
                <p className="text-xs text-[#8A8A90]">Ideal for students and open-source SQL learners.</p>
              </div>
              <div className="text-3xl font-extrabold text-[#FFFFFF] font-mono">
                $0 <span className="text-xs text-[#8A8A90] font-normal">forever</span>
              </div>
              <ul className="space-y-2.5 text-xs text-[#C8C8CC]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#62DF7D]" /> Unlimited SQLite WASM Queries
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#62DF7D]" /> Academy Modules 1 to 4
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#62DF7D]" /> Daily SQL Coding Challenges
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#62DF7D]" /> Local Sandbox Persistence
                </li>
              </ul>
            </div>

            <button
              onClick={() => setActiveTab('playground')}
              className="w-full py-2.5 rounded-xl bg-[#232326] border border-[#2D2D31] hover:border-[#62DF7D] text-[#FFFFFF] font-bold text-xs transition-all cursor-pointer font-mono"
            >
              Start Free Learning
            </button>
          </div>

          {/* Pro Developer */}
          <div className="bg-[#1B1B1E] border-2 border-[#62DF7D] rounded-2xl p-6 space-y-6 flex flex-col justify-between relative shadow-xl shadow-[#62DF7D]/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#62DF7D] text-[#131315] text-[10px] font-mono font-extrabold uppercase">
              Most Popular
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#FFFFFF]">Pro Developer</h3>
                <p className="text-xs text-[#8A8A90]">For engineers aiming for principal data roles.</p>
              </div>
              <div className="text-3xl font-extrabold text-[#62DF7D] font-mono">
                {billingCycle === 'monthly' ? '$12' : '$9'} <span className="text-xs text-[#8A8A90] font-normal">/ month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-[#C8C8CC]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#62DF7D]" /> All 12 Academy Modules
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#62DF7D]" /> Visual EXPLAIN Plan Analyzer
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#62DF7D]" /> Unlimited Gemini AI Copilot Fixes
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#62DF7D]" /> Verifiable Employer Certificates
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#62DF7D]" /> Custom External Database Connectors
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                loadDemoPersona();
                setActiveTab('dashboard');
              }}
              className="w-full py-2.5 rounded-xl bg-[#62DF7D] text-[#131315] font-extrabold text-xs hover:bg-[#52ce6d] transition-all cursor-pointer font-mono"
            >
              Unlock Pro Full Access
            </button>
          </div>

          {/* Enterprise */}
          <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#FFFFFF]">Enterprise Team</h3>
                <p className="text-xs text-[#8A8A90]">For engineering teams, universities & cohorts.</p>
              </div>
              <div className="text-3xl font-extrabold text-[#FFFFFF] font-mono">
                {billingCycle === 'monthly' ? '$49' : '$39'} <span className="text-xs text-[#8A8A90] font-normal">/ seat</span>
              </div>
              <ul className="space-y-2.5 text-xs text-[#C8C8CC]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#62DF7D]" /> Dedicated VPC & Database Proxies
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#62DF7D]" /> Organization Cohort Analytics
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#62DF7D]" /> SAML SSO / Okta Integration
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#62DF7D]" /> Custom Curriculum & Rubric Creator
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#62DF7D]" /> 99.9% Uptime SLA & Priority Support
                </li>
              </ul>
            </div>

            <button
              onClick={() => setActiveTab('docs')}
              className="w-full py-2.5 rounded-xl bg-[#232326] border border-[#2D2D31] hover:border-[#3B82F6] text-[#FFFFFF] font-bold text-xs transition-all cursor-pointer font-mono"
            >
              Contact Enterprise Sales
            </button>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="px-4 sm:px-6 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-[#FFFFFF]">Frequently Asked Questions</h2>
          <p className="text-xs text-[#8A8A90]">Common inquiries about MobileSQL architecture, security, and learning paths.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={faq.q}
                className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#FFFFFF] hover:text-[#62DF7D] transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#62DF7D] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8A8A90] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-[#8A8A90] leading-relaxed border-t border-[#232326] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. BOTTOM CTA BANNER */}
      <section className="px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-[#1B1B1E] via-[#232326] to-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-8 text-center space-y-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#62DF7D]/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FFFFFF] tracking-tight">
            Ready to Accelerate Your SQL Engineering Skills?
          </h2>
          <p className="text-xs sm:text-sm text-[#8A8A90] max-w-xl mx-auto">
            Zero installation required. Launch the sandbox directly in your browser or explore with the preloaded Pro Architect demo profile.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('playground')}
              className="px-6 py-3 rounded-xl bg-[#62DF7D] text-[#131315] font-extrabold text-xs sm:text-sm hover:bg-[#52ce6d] transition-all flex items-center gap-2 shadow-lg shadow-[#62DF7D]/20 cursor-pointer font-mono"
            >
              <Terminal className="w-4 h-4" />
              <span>Launch Sandbox Now</span>
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className="px-5 py-3 rounded-xl bg-[#131315] border border-[#2D2D31] hover:border-[#62DF7D] text-[#FFFFFF] font-bold text-xs sm:text-sm transition-all cursor-pointer font-mono"
            >
              Read Documentation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
