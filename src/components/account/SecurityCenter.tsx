import React, { useState } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Mail,
  Smartphone,
  Laptop,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Trash2,
  RefreshCw,
  QrCode,
  ShieldAlert,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useAccountStore } from '../../stores/useAccountStore';
import { useUIStore } from '../../stores/useUIStore';

export const SecurityCenter: React.FC = () => {
  const { addToast } = useUIStore();
  const {
    isTwoFactorEnabled,
    twoFactorSecret,
    toggleTwoFactor,
    sessions,
    revokeSession,
    revokeAllOtherSessions,
    toggleTrustedDevice,
    securityAlerts,
    resolveAlert,
  } = useAccountStore();

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const [newEmail, setNewEmail] = useState('');
  const [emailPass, setEmailPass] = useState('');

  const [show2FAQR, setShow2FAQR] = useState(false);
  const [totpCode, setTotpCode] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      addToast({ title: 'Password Mismatch', message: 'New password fields do not match.', type: 'error' });
      return;
    }
    addToast({ title: 'Password Updated', message: 'Account password changed successfully.', type: 'success' });
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  const handleEmailChange = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({ title: 'Verification Email Sent', message: `Confirmation link sent to ${newEmail}.`, type: 'info' });
    setNewEmail('');
    setEmailPass('');
  };

  const handleVerify2FA = () => {
    if (totpCode.length < 6) {
      addToast({ title: 'Invalid Code', message: 'Enter a 6-digit TOTP code.', type: 'error' });
      return;
    }
    toggleTwoFactor(true);
    setShow2FAQR(false);
    addToast({ title: '2FA Enabled', message: 'Two-Factor Authentication active on account.', type: 'success' });
  };

  return (
    <div className="space-y-6 font-sans text-[#FFFFFF]">
      {/* 2FA Banner */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#62DF7D]/15 border border-[#62DF7D]/40 text-[#62DF7D] flex items-center justify-center shrink-0 mt-1">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#FFFFFF]">Two-Factor Authentication (2FA)</h3>
              <span
                className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                  isTwoFactorEnabled
                    ? 'bg-[#62DF7D]/20 text-[#62DF7D] border border-[#62DF7D]/40'
                    : 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40'
                }`}
              >
                {isTwoFactorEnabled ? 'PROTECTED' : 'ARCHITECTURE READY'}
              </span>
            </div>
            <p className="text-xs text-[#8A8A90] font-mono mt-1">
              Enforce TOTP authenticator app tokens (Google Authenticator, 1Password) for every admin session.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isTwoFactorEnabled ? (
            <button
              onClick={() => {
                toggleTwoFactor(false);
                addToast({ title: '2FA Disabled', message: 'Two-factor protection removed.', type: 'info' });
              }}
              className="px-4 py-2 rounded-xl bg-[#131315] border border-[#2D2D31] hover:border-[#EF4444] text-[#EF4444] font-mono text-xs font-bold cursor-pointer transition-all"
            >
              Disable 2FA
            </button>
          ) : (
            <button
              onClick={() => setShow2FAQR(!show2FAQR)}
              className="px-4 py-2 rounded-xl bg-[#62DF7D] hover:bg-[#52cc6c] text-[#131315] font-mono text-xs font-bold cursor-pointer transition-all shadow-md"
            >
              Configure 2FA
            </button>
          )}
        </div>
      </div>

      {/* 2FA Setup Drawer / Modal card */}
      {show2FAQR && (
        <div className="bg-[#1B1B1E] border border-[#62DF7D]/40 rounded-2xl p-6 space-y-4 shadow-2xl animate-fade-in">
          <h4 className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[#62DF7D]" /> Scan Authenticator QR Code
          </h4>
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-[#131315] p-4 rounded-xl border border-[#2D2D31]">
            <div className="w-32 h-32 bg-white p-2 rounded-xl flex items-center justify-center shrink-0">
              {/* Clean SVG Mock QR code */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path fill="#000" d="M0,0h40v40h-40z M10,10h20v20h-20z M60,0h40v40h-40z M70,10h20v20h-20z M0,60h40v40h-40z M10,70h20v20h-20z M50,50h10v10h-10z M70,70h30v30h-30z M80,80h10v10h-10z" />
              </svg>
            </div>
            <div className="space-y-2 text-xs font-mono text-[#C8C8CC] flex-1">
              <p>1. Open your authenticator app (Google Authenticator, Authy, 1Password).</p>
              <p>2. Scan the QR code or enter secret key:</p>
              <div className="p-2 bg-[#1B1B1E] rounded-lg border border-[#2D2D31] text-[#62DF7D] font-bold tracking-widest select-all">
                {twoFactorSecret}
              </div>
              <div className="pt-2 flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  className="bg-[#1B1B1E] border border-[#2D2D31] rounded-lg px-3 py-1.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#62DF7D] w-36"
                />
                <button
                  onClick={handleVerify2FA}
                  className="px-3 py-1.5 rounded-lg bg-[#62DF7D] text-[#131315] font-bold hover:bg-[#52cc6c] cursor-pointer"
                >
                  Verify & Enable
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password & Email Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Change Password */}
        <form onSubmit={handlePasswordChange} className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2 border-b border-[#2D2D31] pb-3">
            <KeyRound className="w-4 h-4 text-[#62DF7D]" /> Change Account Password
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-[#8A8A90] block mb-1">Current Password</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl p-2.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#62DF7D]"
              />
            </div>
            <div>
              <label className="text-[#8A8A90] block mb-1">New Secure Password</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl p-2.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#62DF7D]"
              />
            </div>
            <div>
              <label className="text-[#8A8A90] block mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl p-2.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#62DF7D]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#131315] border border-[#2D2D31] hover:border-[#62DF7D] text-[#62DF7D] font-bold cursor-pointer transition-all"
            >
              Update Password
            </button>
          </div>
        </form>

        {/* Change Email */}
        <form onSubmit={handleEmailChange} className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2 border-b border-[#2D2D31] pb-3">
            <Mail className="w-4 h-4 text-[#3B82F6]" /> Change Primary Email
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-[#8A8A90] block mb-1">New Primary Email Address</label>
              <input
                type="email"
                required
                placeholder="new.architect@mobilesql.io"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl p-2.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
            <div>
              <label className="text-[#8A8A90] block mb-1">Confirm Password</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={emailPass}
                onChange={(e) => setEmailPass(e.target.value)}
                className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl p-2.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div className="p-3 bg-[#131315] rounded-xl border border-[#2D2D31] text-[11px] text-[#8A8A90] leading-relaxed">
              A verification link will be dispatched to your new email before switching session tokens.
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#131315] border border-[#2D2D31] hover:border-[#3B82F6] text-[#3B82F6] font-bold cursor-pointer transition-all"
            >
              Send Verification Email
            </button>
          </div>
        </form>
      </div>

      {/* Device Management & Active Sessions */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2D2D31] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2">
              <Laptop className="w-4 h-4 text-[#62DF7D]" /> Device Management & Active Sessions
            </h3>
            <p className="text-xs text-[#8A8A90] font-mono mt-0.5">
              Inspect active hardware sessions, revoke untrusted devices, and verify login locations.
            </p>
          </div>

          <button
            onClick={() => {
              revokeAllOtherSessions();
              addToast({ title: 'Sessions Revoked', message: 'All other active sessions signed out.', type: 'info' });
            }}
            className="px-3 py-1.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 hover:bg-[#EF4444]/20 text-[#EF4444] font-mono text-xs font-bold cursor-pointer transition-all self-start sm:self-auto"
          >
            Revoke All Other Sessions
          </button>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#62DF7D]/30 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1B1B1E] border border-[#2D2D31] flex items-center justify-center text-[#62DF7D] shrink-0 mt-0.5">
                  {session.deviceName.toLowerCase().includes('iphone') ? (
                    <Smartphone className="w-4 h-4" />
                  ) : (
                    <Laptop className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#FFFFFF]">{session.deviceName}</span>
                    {session.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-[#62DF7D]/20 text-[#62DF7D] text-[10px] font-bold border border-[#62DF7D]/40">
                        Current Session
                      </span>
                    )}
                    {session.isTrusted && (
                      <span className="px-2 py-0.5 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] text-[10px] font-bold border border-[#3B82F6]/40">
                        Trusted Device
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#8A8A90] mt-0.5">
                    {session.browser} • IP: {session.ipAddress} • {session.location}
                  </p>
                  <p className="text-[10px] text-[#8A8A90] mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#62DF7D]" /> Last active: {session.lastActive}
                  </p>
                </div>
              </div>

              {!session.isCurrent && (
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => toggleTrustedDevice(session.id)}
                    className="px-2.5 py-1 rounded-lg bg-[#1B1B1E] border border-[#2D2D31] hover:border-[#3B82F6] text-[#C8C8CC] hover:text-[#FFFFFF] cursor-pointer"
                  >
                    {session.isTrusted ? 'Untrust Device' : 'Trust Device'}
                  </button>
                  <button
                    onClick={() => {
                      revokeSession(session.id);
                      addToast({ title: 'Session Revoked', message: `Revoked session ${session.deviceName}`, type: 'info' });
                    }}
                    className="p-1.5 rounded-lg bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#EF4444]/20 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Security Alerts & Login History */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2 border-b border-[#2D2D31] pb-3">
          <ShieldAlert className="w-4 h-4 text-[#F59E0B]" /> Security Alerts & Failed Login Detection
        </h3>

        <div className="space-y-3 font-mono text-xs">
          {securityAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                alert.resolved
                  ? 'bg-[#131315] border-[#2D2D31] opacity-75'
                  : 'bg-[#F59E0B]/10 border-[#F59E0B]/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${alert.resolved ? 'text-[#8A8A90]' : 'text-[#F59E0B]'}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#FFFFFF]">{alert.title}</span>
                    <span className="text-[10px] text-[#8A8A90]">{alert.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-[#C8C8CC] mt-0.5">{alert.message}</p>
                </div>
              </div>

              {!alert.resolved && (
                <button
                  onClick={() => {
                    resolveAlert(alert.id);
                    addToast({ title: 'Alert Resolved', message: 'Marked security alert as resolved.', type: 'success' });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40 hover:bg-[#F59E0B]/30 font-bold cursor-pointer transition-all self-end sm:self-center"
                >
                  Mark Resolved
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
