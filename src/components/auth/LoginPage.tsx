import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, User, AlertCircle, Check } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { useAuthStore } from '../../stores/useAuthStore';
import { useUIStore } from '../../stores/useUIStore';

export const LoginPage: React.FC = () => {
  const { loginWithBackend, loginWithGuest, loginWithOAuth, loadDemoPersona, isLoading, returnTab } = useAuthStore();
  const { setActiveTab } = useUIStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    setErrorMsg(null);
    try {
      await loginWithBackend({ email, password, rememberMe });
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password. Please try again.');
    }
  };

  const handleSocial = async (provider: 'google' | 'github' | 'microsoft') => {
    setSocialLoading(provider);
    setErrorMsg(null);
    try {
      await loginWithOAuth(provider);
    } catch (err: any) {
      setErrorMsg(err.message || `Failed to sign in with ${provider}.`);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <AuthLayout
      title="Welcome to MobileSQL"
      subtitle="Sign in to access your databases, challenges, and analytics."
      badgeText="Secure SSO & WASM Engine"
    >
      <div className="space-y-5">
        {/* Return Redirect Notice if redirected */}
        {returnTab && !['login', 'register', 'forgot-password', 'verify-email'].includes(returnTab) && (
          <div className="p-3 rounded-xl bg-[#62DF7D]/10 border border-[#62DF7D]/30 flex items-start gap-2.5 text-xs text-[#62DF7D]">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              Please sign in to access <span className="font-bold font-mono">/{returnTab}</span>. You will be redirected immediately.
            </p>
          </div>
        )}

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/40 flex items-start gap-2.5 text-xs text-[#EF4444] animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-snug">{errorMsg}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label htmlFor="login_email" className="block text-xs font-semibold text-[#C8C8CC]">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A90]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="login_email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="name@company.com"
                className="w-full bg-[#1B1B1E] text-[#FFFFFF] placeholder-[#8A8A90] text-sm rounded-xl border border-[#2D2D31] pl-10 pr-3.5 py-2.5 transition-all focus:outline-none focus:border-[#62DF7D] focus:ring-1 focus:ring-[#62DF7D]"
              />
            </div>
          </div>

          {/* Password Input with Visibility Toggle */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="login_password" className="block text-xs font-semibold text-[#C8C8CC]">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('forgot-password');
                  window.history.pushState(null, '', '/forgot-password');
                }}
                className="text-xs text-[#62DF7D] hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A90]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login_password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="••••••••"
                className="w-full bg-[#1B1B1E] text-[#FFFFFF] placeholder-[#8A8A90] text-sm rounded-xl border border-[#2D2D31] pl-10 pr-10 py-2.5 transition-all focus:outline-none focus:border-[#62DF7D] focus:ring-1 focus:ring-[#62DF7D]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8A8A90] hover:text-[#FFFFFF] cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#2D2D31] bg-[#1B1B1E] text-[#62DF7D] focus:ring-[#62DF7D] accent-[#62DF7D]"
              />
              <span className="text-xs text-[#8A8A90]">Remember me for 30 days</span>
            </label>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !!socialLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-[#62DF7D] text-[#003914] font-bold text-sm hover:bg-[#79F292] active:scale-[0.99] transition-all shadow-[0_0_15px_rgba(98,223,125,0.25)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-[#003914] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to MobileSQL</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#2D2D31] w-full" />
          <span className="bg-[#131315] px-3 text-[11px] font-mono text-[#8A8A90] uppercase shrink-0">
            or continue with
          </span>
        </div>

        {/* Social SSO Logins */}
        <div className="grid grid-cols-3 gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => handleSocial('google')}
            disabled={isLoading || !!socialLoading}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#1B1B1E] border border-[#2D2D31] text-[#C8C8CC] hover:text-[#FFFFFF] hover:border-[#3F3F46] transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocial('github')}
            disabled={isLoading || !!socialLoading}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#1B1B1E] border border-[#2D2D31] text-[#C8C8CC] hover:text-[#FFFFFF] hover:border-[#3F3F46] transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocial('microsoft')}
            disabled={isLoading || !!socialLoading}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#1B1B1E] border border-[#2D2D31] text-[#C8C8CC] hover:text-[#FFFFFF] hover:border-[#3F3F46] transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <rect fill="#F25022" x="1" y="1" width="10" height="10" />
              <rect fill="#7FBA00" x="13" y="1" width="10" height="10" />
              <rect fill="#00A4EF" x="1" y="13" width="10" height="10" />
              <rect fill="#FFB900" x="13" y="13" width="10" height="10" />
            </svg>
            <span>Microsoft</span>
          </button>
        </div>

        {/* Quick Sandbox & Demo Mode Options */}
        <div className="p-3.5 rounded-2xl bg-[#1B1B1E]/60 border border-[#2D2D31] space-y-2">
          <p className="text-[11px] font-mono text-[#8A8A90] font-semibold uppercase tracking-wider">
            Explore Without Credentials
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => loginWithGuest()}
              className="py-2 px-3 rounded-xl bg-[#1B1B1E] border border-[#2D2D31] hover:border-[#62DF7D]/40 text-[#FFFFFF] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[#62DF7D]" />
              <span>Guest Sandbox</span>
            </button>

            <button
              type="button"
              onClick={() => loadDemoPersona()}
              className="py-2 px-3 rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/30 hover:bg-[#A855F7]/20 text-[#A855F7] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo Pro Mode</span>
            </button>
          </div>
        </div>

        {/* Switch to Register */}
        <div className="text-center text-xs text-[#8A8A90]">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              window.history.pushState(null, '', '/register');
            }}
            className="text-[#62DF7D] font-semibold hover:underline cursor-pointer"
          >
            Create an account
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};
