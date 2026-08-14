import React from 'react';
import { motion } from 'motion/react';
import { Terminal, Shield, Database, Sparkles, CheckCircle2, Lock, Zap } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  badgeText?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  badgeText = 'Enterprise v2.4 Security',
}) => {
  const { setActiveTab } = useUIStore();

  return (
    <div className="min-h-screen w-full bg-[#0D0D10] text-[#FFFFFF] font-sans selection:bg-[#62DF7D]/30 selection:text-[#62DF7D] flex flex-col justify-between relative overflow-hidden">
      {/* Background Decorative Grid & Gradients */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      
      {/* Subtle Glow Spheres */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#62DF7D]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Simple Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        <button
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2.5 group focus:outline-none cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#1B1B1E] border border-[#2D2D31] flex items-center justify-center text-[#62DF7D] group-hover:border-[#62DF7D]/60 group-hover:scale-105 transition-all shadow-md">
            <Terminal className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#FFFFFF] group-hover:text-[#62DF7D] transition-colors">
              Mobile<span className="text-[#62DF7D]">SQL</span>
            </span>
            <span className="block text-[10px] font-mono text-[#8A8A90] -mt-1 tracking-wider uppercase">
              Cloud & WASM Studio
            </span>
          </div>
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B1B1E] border border-[#2D2D31] text-[11px] font-mono text-[#8A8A90]">
            <Shield className="w-3.5 h-3.5 text-[#62DF7D]" />
            <span>{badgeText}</span>
          </div>
        </div>
      </header>

      {/* Center Auth Card Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Perks (Visible on Large Screens) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col space-y-6 pr-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#62DF7D]/10 border border-[#62DF7D]/25 text-xs font-mono text-[#62DF7D] w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack SQL Engine</span>
            </div>

            <div>
              <h2 className="text-2xl xl:text-3xl font-extrabold text-[#FFFFFF] tracking-tight leading-snug">
                Architect, Optimize & Master Production Databases
              </h2>
              <p className="text-sm text-[#8A8A90] mt-2 leading-relaxed">
                Join thousands of software engineers and data architects executing sub-millisecond queries with zero latency.
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#131315]/80 border border-[#2D2D31]/80">
                <div className="w-7 h-7 rounded-lg bg-[#62DF7D]/15 text-[#62DF7D] flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#FFFFFF]">Sub-10ms WASM Sandbox</p>
                  <p className="text-[11px] text-[#8A8A90]">Instant in-browser SQLite with zero cloud dependencies.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#131315]/80 border border-[#2D2D31]/80">
                <div className="w-7 h-7 rounded-lg bg-[#3B82F6]/15 text-[#3B82F6] flex items-center justify-center shrink-0 mt-0.5">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#FFFFFF]">Multi-Dialect Compatibility</p>
                  <p className="text-[11px] text-[#8A8A90]">Native support for PostgreSQL 16, MySQL 8, and SQLite.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#131315]/80 border border-[#2D2D31]/80">
                <div className="w-7 h-7 rounded-lg bg-[#A855F7]/15 text-[#A855F7] flex items-center justify-center shrink-0 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#FFFFFF]">Enterprise Grade Security</p>
                  <p className="text-[11px] text-[#8A8A90]">JWT token rotation, rate limiting, and encrypted storage.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Auth Card Form */}
          <div className="lg:col-span-7 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md bg-[#131315]/95 backdrop-blur-2xl border border-[#2D2D31] rounded-3xl p-6 sm:p-8 shadow-2xl relative"
            >
              {/* Card Title & Subtitle */}
              <div className="mb-6 space-y-1 text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-[#FFFFFF] tracking-tight">{title}</h1>
                <p className="text-xs sm:text-sm text-[#8A8A90]">{subtitle}</p>
              </div>

              {children}
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 py-4 text-center text-[11px] font-mono text-[#8A8A90] flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-[#2D2D31]/40">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#62DF7D]" />
          <span>MobileSQL Enterprise Platform v2.4</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <button onClick={() => setActiveTab('docs')} className="hover:text-[#FFFFFF] transition-colors cursor-pointer">
            Documentation
          </button>
          <button onClick={() => setActiveTab('help')} className="hover:text-[#FFFFFF] transition-colors cursor-pointer">
            Support
          </button>
        </div>
      </footer>
    </div>
  );
};
