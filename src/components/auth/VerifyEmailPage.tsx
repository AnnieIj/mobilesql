import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { apiClient } from '../../services/apiClient';
import { useUIStore } from '../../stores/useUIStore';
import { useAuthStore } from '../../stores/useAuthStore';

export const VerifyEmailPage: React.FC = () => {
  const { setActiveTab, addToast } = useUIStore();
  const { addXp, user } = useAuthStore();

  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Auto-extract token from URL if available
    const searchParams = new URLSearchParams(window.location.search);
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
      handleAutoVerify(urlToken);
    }
  }, []);

  const handleAutoVerify = async (tokenToVerify: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await apiClient.auth.verifyEmail(tokenToVerify);
      setIsVerified(true);
      setIsLoading(false);
      addXp(100);
      addToast({
        title: 'Email Verified',
        message: 'Your account email has been verified. +100 XP awarded!',
        type: 'xp',
      });
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Email verification failed. The token may be expired or already used.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setErrorMsg('Please enter your verification token.');
      return;
    }
    await handleAutoVerify(token.trim());
  };

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="Confirm your identity to unlock all MobileSQL features."
      badgeText="Identity Verification"
    >
      <div className="space-y-4">
        {/* Error Alert Box */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/40 flex items-start gap-2.5 text-xs text-[#EF4444] animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-snug">{errorMsg}</p>
          </div>
        )}

        {isVerified ? (
          <div className="space-y-4 text-center py-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-[#62DF7D]/15 border border-[#62DF7D]/40 text-[#62DF7D] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(98,223,125,0.2)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#FFFFFF]">Email Verified Successfully!</h3>
              <p className="text-xs text-[#8A8A90] mt-1">
                Your account is now fully activated with complete access to certificates, leaderboard submissions, and cloud sync.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#62DF7D]/10 border border-[#62DF7D]/30 flex items-center justify-center gap-2 text-xs font-mono text-[#62DF7D] font-bold">
              <Sparkles className="w-4 h-4" />
              <span>+100 XP Verified Engineer Bonus Earned</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveTab(user ? 'dashboard' : 'login');
                window.history.pushState(null, '', user ? '/dashboard' : '/login');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#62DF7D] text-[#003914] font-bold text-sm hover:bg-[#79F292] active:scale-[0.99] transition-all shadow-[0_0_15px_rgba(98,223,125,0.25)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{user ? 'Go to Workspace Dashboard' : 'Proceed to Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="verify_token" className="block text-xs font-semibold text-[#C8C8CC]">
                Email Verification Token
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A90]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="verify_token"
                  type="text"
                  required
                  value={token}
                  onChange={(e) => {
                    setToken(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Paste verification token"
                  className="w-full bg-[#1B1B1E] text-[#FFFFFF] placeholder-[#8A8A90] font-mono text-xs rounded-xl border border-[#2D2D31] pl-10 pr-3.5 py-2.5 transition-all focus:outline-none focus:border-[#62DF7D] focus:ring-1 focus:ring-[#62DF7D]"
                />
              </div>
              <p className="text-[11px] text-[#8A8A90]">
                Check your inbox for the token generated during registration.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#62DF7D] text-[#003914] font-bold text-sm hover:bg-[#79F292] active:scale-[0.99] transition-all shadow-[0_0_15px_rgba(98,223,125,0.25)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-[#003914] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Verify Email Address</span>
                  <ShieldCheck className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Back to Login */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              window.history.pushState(null, '', '/login');
            }}
            className="inline-flex items-center gap-1.5 text-xs text-[#8A8A90] hover:text-[#FFFFFF] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};
