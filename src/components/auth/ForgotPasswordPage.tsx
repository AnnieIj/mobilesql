import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, KeyRound, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { apiClient } from '../../services/apiClient';
import { useUIStore } from '../../stores/useUIStore';

export const ForgotPasswordPage: React.FC = () => {
  const { setActiveTab, addToast } = useUIStore();

  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your account email.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    try {
      const res = await apiClient.auth.forgotPassword(email);
      setIsLoading(false);
      if (res?.resetToken && res.resetToken !== 'if_email_exists_token_sent') {
        setResetToken(res.resetToken);
      }
      setStep('reset');
      addToast({
        title: 'Recovery Dispatched',
        message: 'A security reset token has been generated for your account.',
        type: 'info',
      });
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Failed to dispatch reset token.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetToken || !newPassword) {
      setErrorMsg('Please provide the reset token and your new password.');
      return;
    }

    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setErrorMsg('Password must be 8+ characters with at least 1 uppercase letter and 1 number.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    try {
      await apiClient.auth.resetPassword({ token: resetToken.trim(), newPassword });
      setIsLoading(false);
      setSuccessMsg('Your password has been successfully reset! You may now sign in.');
      addToast({
        title: 'Password Updated',
        message: 'Account secured. Please log in with your new password.',
        type: 'success',
      });
      setTimeout(() => {
        setActiveTab('login');
        window.history.pushState(null, '', '/login');
      }, 2000);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Failed to reset password. Token may be invalid or expired.');
    }
  };

  const copyToken = () => {
    if (resetToken) {
      navigator.clipboard.writeText(resetToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AuthLayout
      title="Reset Account Password"
      subtitle="Recover your MobileSQL database credentials securely."
      badgeText="Automated Security Recovery"
    >
      <div className="space-y-4">
        {/* Error Alert Box */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/40 flex items-start gap-2.5 text-xs text-[#EF4444] animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-snug">{errorMsg}</p>
          </div>
        )}

        {/* Success Alert Box */}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-[#62DF7D]/15 border border-[#62DF7D]/40 flex items-start gap-2.5 text-xs text-[#62DF7D] animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-snug">{successMsg}</p>
          </div>
        )}

        {step === 'request' ? (
          <form onSubmit={handleRequestToken} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="forgot_email" className="block text-xs font-semibold text-[#C8C8CC]">
                Registered Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A90]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="forgot_email"
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
              <p className="text-[11px] text-[#8A8A90]">
                We will generate an account recovery token valid for 60 minutes.
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
                  <span>Send Reset Token</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep('reset');
                }}
                className="text-xs text-[#8A8A90] hover:text-[#62DF7D] font-mono transition-colors cursor-pointer"
              >
                Already have a reset token? Enter it here →
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-3.5">
            {/* Generated Token Helper in Dev Mode */}
            {resetToken && (
              <div className="p-3 rounded-xl bg-[#1B1B1E] border border-[#62DF7D]/30 space-y-1 text-xs">
                <div className="flex items-center justify-between text-[#62DF7D] font-mono font-bold">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5" /> Recovery Token Dispatched
                  </span>
                  <button
                    type="button"
                    onClick={copyToken}
                    className="flex items-center gap-1 text-[10px] text-[#8A8A90] hover:text-[#FFFFFF] cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-[#62DF7D]" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="font-mono text-[11px] text-[#C8C8CC] truncate">{resetToken}</p>
              </div>
            )}

            {/* Token Input */}
            <div className="space-y-1">
              <label htmlFor="reset_token" className="block text-xs font-semibold text-[#C8C8CC]">
                Security Reset Token
              </label>
              <input
                id="reset_token"
                type="text"
                required
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="Paste 64-character token"
                className="w-full bg-[#1B1B1E] text-[#FFFFFF] placeholder-[#8A8A90] font-mono text-xs rounded-xl border border-[#2D2D31] px-3.5 py-2.5 transition-all focus:outline-none focus:border-[#62DF7D] focus:ring-1 focus:ring-[#62DF7D]"
              />
            </div>

            {/* New Password */}
            <div className="space-y-1">
              <label htmlFor="reset_new_password" className="block text-xs font-semibold text-[#C8C8CC]">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A90]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="reset_new_password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="8+ chars, 1 uppercase, 1 number"
                  className="w-full bg-[#1B1B1E] text-[#FFFFFF] placeholder-[#8A8A90] text-xs rounded-xl border border-[#2D2D31] pl-10 pr-10 py-2.5 transition-all focus:outline-none focus:border-[#62DF7D] focus:ring-1 focus:ring-[#62DF7D]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8A8A90] hover:text-[#FFFFFF] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label htmlFor="reset_confirm_password" className="block text-xs font-semibold text-[#C8C8CC]">
                Confirm New Password
              </label>
              <input
                id="reset_confirm_password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full bg-[#1B1B1E] text-[#FFFFFF] placeholder-[#8A8A90] text-xs rounded-xl border border-[#2D2D31] px-3.5 py-2.5 transition-all focus:outline-none focus:border-[#62DF7D] focus:ring-1 focus:ring-[#62DF7D]"
              />
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
                  <span>Save New Password</span>
                  <CheckCircle2 className="w-4 h-4" />
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
