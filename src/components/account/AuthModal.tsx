import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Mail,
  Lock,
  User,
  Shield,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Github,
  Globe,
  AlertCircle,
} from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { useAuthStore } from '../../stores/useAuthStore';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, addToast } = useUIStore();
  const { loginWithBackend, registerWithBackend, loginWithOAuth, loginWithGuest, isLoading } = useAuthStore();

  const [mode, setMode] = useState<'login' | 'signup' | 'guest'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      if (mode === 'guest') {
        await loginWithGuest('Guest Architect');
        setAuthModalOpen(false);
      } else if (mode === 'signup') {
        const username = (name || email.split('@')[0]).toLowerCase().replace(/[^a-z0-9_]/g, '');
        await registerWithBackend({
          name: name || 'Enterprise Engineer',
          username,
          email,
          password,
          role: 'engineer',
          rememberMe: true,
        });
        setAuthModalOpen(false);
      } else {
        await loginWithBackend({
          email,
          password,
          rememberMe: true,
        });
        setAuthModalOpen(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed.');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'microsoft') => {
    setErrorMsg(null);
    try {
      await loginWithOAuth(provider);
      setAuthModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || `Failed to authenticate with ${provider}.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={() => setAuthModalOpen(false)}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-md rounded-2xl bg-[#131315] border border-[#2D2D31] shadow-2xl overflow-hidden z-10 flex flex-col font-sans"
      >
        {/* Modal Header */}
        <div className="p-5 bg-[#1B1B1E] border-b border-[#2D2D31] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#62DF7D]/15 border border-[#62DF7D]/40 text-[#62DF7D] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#FFFFFF]">MobileSQL Enterprise Auth</h3>
              <p className="text-[11px] font-mono text-[#8A8A90]">Multi-Provider Single Sign-On (SSO)</p>
            </div>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 rounded-lg text-[#8A8A90] hover:text-[#FFFFFF] hover:bg-[#232326] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switch Tabs */}
        <div className="grid grid-cols-3 bg-[#131315] border-b border-[#2D2D31] p-1.5 gap-1 text-xs font-mono">
          <button
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-[#62DF7D] text-[#131315]'
                : 'text-[#8A8A90] hover:text-[#FFFFFF]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
            }}
            className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-[#62DF7D] text-[#131315]'
                : 'text-[#8A8A90] hover:text-[#FFFFFF]'
            }`}
          >
            Create Account
          </button>
          <button
            onClick={() => {
              setMode('guest');
              setErrorMsg(null);
            }}
            className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              mode === 'guest'
                ? 'bg-[#62DF7D] text-[#131315]'
                : 'text-[#8A8A90] hover:text-[#FFFFFF]'
            }`}
          >
            Guest Mode
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs font-mono">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/40 flex items-start gap-2.5 text-xs text-[#EF4444]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="leading-snug">{errorMsg}</p>
            </div>
          )}

          {mode === 'guest' ? (
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-xl bg-[#1B1B1E] border border-[#2D2D31] space-y-2">
                <div className="flex items-center gap-2 text-[#62DF7D] font-bold">
                  <Sparkles className="w-4 h-4" /> Anonymous WASM Session
                </div>
                <p className="text-[11px] text-[#8A8A90] leading-relaxed">
                  Execute queries, build schemas, and solve SQL challenges directly in browser memory without storing credentials.
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-[#62DF7D] hover:bg-[#52cc6c] text-[#131315] font-bold text-xs cursor-pointer flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {isLoading ? 'Establishing Session...' : 'Continue as Guest Architect'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* OAuth Providers Grid */}
              <div className="space-y-2">
                <span className="text-[#8A8A90] text-[10px] uppercase font-bold tracking-wider">
                  Enterprise Single Sign-On (SSO)
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    disabled={isLoading}
                    className="p-2.5 rounded-xl bg-[#1B1B1E] border border-[#2D2D31] hover:border-[#62DF7D] text-[#FFFFFF] flex items-center justify-center gap-1.5 transition-all cursor-pointer text-[11px] font-sans"
                  >
                    <Globe className="w-3.5 h-3.5 text-[#4285F4]" /> Google
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('github')}
                    disabled={isLoading}
                    className="p-2.5 rounded-xl bg-[#1B1B1E] border border-[#2D2D31] hover:border-[#62DF7D] text-[#FFFFFF] flex items-center justify-center gap-1.5 transition-all cursor-pointer text-[11px] font-sans"
                  >
                    <Github className="w-3.5 h-3.5 text-[#A855F7]" /> GitHub
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('microsoft')}
                    disabled={isLoading}
                    className="p-2.5 rounded-xl bg-[#1B1B1E] border border-[#2D2D31] hover:border-[#62DF7D] text-[#FFFFFF] flex items-center justify-center gap-1.5 transition-all cursor-pointer text-[11px] font-sans"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#00A4EF]" /> Microsoft
                  </button>
                </div>
              </div>

              <div className="relative my-3 flex items-center justify-center">
                <div className="absolute inset-0 border-t border-[#2D2D31]" />
                <span className="relative bg-[#131315] px-3 text-[10px] text-[#8A8A90] uppercase font-bold">
                  or email authentication
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {mode === 'signup' && (
                  <div>
                    <label className="text-[#8A8A90] text-[10px] uppercase block mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#8A8A90] absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        placeholder="Alex Mercer"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#1B1B1E] border border-[#2D2D31] rounded-xl pl-9 pr-3 py-2 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#62DF7D]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[#8A8A90] text-[10px] uppercase block mb-1">Work Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8A8A90] absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="architect@enterprise.io"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#1B1B1E] border border-[#2D2D31] rounded-xl pl-9 pr-3 py-2 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#62DF7D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#8A8A90] text-[10px] uppercase block mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8A8A90] absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#1B1B1E] border border-[#2D2D31] rounded-xl pl-9 pr-3 py-2 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#62DF7D]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl bg-[#62DF7D] hover:bg-[#52cc6c] text-[#131315] font-bold text-xs cursor-pointer flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 pt-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    'Authenticating...'
                  ) : mode === 'signup' ? (
                    'Provision Enterprise Account'
                  ) : (
                    'Sign In to Workspace'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
