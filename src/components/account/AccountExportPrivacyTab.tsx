import React, { useState } from 'react';
import {
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  Trash2,
  ShieldAlert,
  Globe,
  Github,
  Lock,
  UserCheck,
  Check,
  AlertTriangle,
  Printer,
  Shield,
  Eye,
  LogOut,
} from 'lucide-react';
import { useAccountStore } from '../../stores/useAccountStore';
import { useUIStore } from '../../stores/useUIStore';
import { useAuthStore } from '../../stores/useAuthStore';

export const AccountExportPrivacyTab: React.FC = () => {
  const { addToast } = useUIStore();
  const { user } = useAuthStore();
  const {
    providers,
    disconnectProvider,
    privacy,
    updatePrivacy,
    resetAccountData,
  } = useAccountStore();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  const handleExportJSON = () => {
    const exportData = {
      user: user || {},
      preferences: useAccountStore.getState().preferences,
      exportTimestamp: new Date().toISOString(),
      sqlPlaygroundQueries: [
        { title: 'Monthly Revenue Window Function', query: 'SELECT date_trunc(\'month\', created_at), SUM(amount) OVER() FROM orders;' },
        { title: 'Customer Churn CTE', query: 'WITH inactive_users AS (SELECT id FROM users WHERE last_login < NOW() - INTERVAL \'90 days\') SELECT * FROM inactive_users;' },
      ],
      academyProgress: { completedModules: 12, xp: user?.xp || 100, streakDays: user?.streakDays || 1 },
      certificates: [{ id: 'MSQL-9942A', title: 'SQL Master Architect', issueDate: '2026-02-10' }],
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = (user?.name || 'developer').toLowerCase().replace(/\s+/g, '_');
    a.download = `mobilesql_account_export_${safeName}.json`;
    a.click();
    addToast({ title: 'JSON Export Complete', message: 'Full account backup downloaded.', type: 'success' });
  };

  const handleExportCSV = () => {
    const safeName = user?.name || 'Developer';
    const safeLevel = user?.level || 1;
    const safeXp = user?.xp || 100;
    const safeQueries = user?.queriesRun || 14;

    const csvContent = [
      'Category,Item Title,Metrics,Date',
      `User Profile,${safeName},Level ${safeLevel} (${safeXp} XP),${new Date().toISOString().split('T')[0]}`,
      `Statistics,Queries Executed,${safeQueries} queries,2026-08-13`,
      `Certificate,SQL Master Architect,Verification ID MSQL-9942A,2026-02-10`,
      `Portfolio,Realtime E-Commerce Analytics,Star-Schema Postgres,2026-02-12`,
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mobilesql_data_${safeName.toLowerCase().replace(/\s+/g, '_')}.csv`;
    a.click();
    addToast({ title: 'CSV Downloaded', message: 'Account metrics CSV exported successfully.', type: 'success' });
  };

  const handlePrintPDFReport = () => {
    window.print();
    addToast({ title: 'PDF Generator Triggered', message: 'Print dialog opened for formatted PDF output.', type: 'info' });
  };

  return (
    <div className="space-y-6 font-sans text-[#FFFFFF]">
      {/* Account Export Options */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2 border-b border-[#2D2D31] pb-3">
          <Download className="w-4 h-4 text-[#62DF7D]" /> Account Data Export (JSON, CSV, Printable PDF)
        </h3>
        <p className="text-xs text-[#8A8A90] font-mono">
          Export your complete learning history, certificates, achievements, portfolio items, statistics, and saved SQL queries.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <button
            onClick={handleExportJSON}
            className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] hover:border-[#62DF7D] text-[#FFFFFF] flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group"
          >
            <FileJson className="w-6 h-6 text-[#62DF7D] group-hover:scale-110 transition-transform" />
            <span className="font-bold">Export Complete JSON</span>
            <span className="text-[10px] text-[#8A8A90]">Full DB Schema & Backups</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] hover:border-[#3B82F6] text-[#FFFFFF] flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group"
          >
            <FileSpreadsheet className="w-6 h-6 text-[#3B82F6] group-hover:scale-110 transition-transform" />
            <span className="font-bold">Export Summary CSV</span>
            <span className="text-[10px] text-[#8A8A90]">Spreadsheet Report</span>
          </button>

          <button
            onClick={handlePrintPDFReport}
            className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] hover:border-[#A855F7] text-[#FFFFFF] flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group"
          >
            <Printer className="w-6 h-6 text-[#A855F7] group-hover:scale-110 transition-transform" />
            <span className="font-bold">Generate PDF Summary</span>
            <span className="text-[10px] text-[#8A8A90]">Printable Record</span>
          </button>
        </div>
      </div>

      {/* Disconnect OAuth Providers */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2 border-b border-[#2D2D31] pb-3">
          <Lock className="w-4 h-4 text-[#3B82F6]" /> Connected Providers & Revocation
        </h3>

        <div className="space-y-3 font-mono text-xs">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="p-3.5 rounded-xl bg-[#131315] border border-[#2D2D31] flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1B1B1E] border border-[#2D2D31] flex items-center justify-center text-[#FFFFFF]">
                  {provider.id === 'github' ? <Github className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#FFFFFF]">{provider.name}</span>
                    {provider.connected ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#62DF7D]/20 text-[#62DF7D] text-[10px] font-bold border border-[#62DF7D]/40">
                        CONNECTED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-[#8A8A90]/20 text-[#8A8A90] text-[10px] font-bold border border-[#8A8A90]/40">
                        NOT CONNECTED
                      </span>
                    )}
                  </div>
                  {provider.email && <p className="text-[10px] text-[#8A8A90] mt-0.5">{provider.email}</p>}
                </div>
              </div>

              {provider.connected && (
                <button
                  onClick={() => {
                    disconnectProvider(provider.id);
                    addToast({ title: 'Provider Disconnected', message: `Revoked SSO session with ${provider.name}.`, type: 'info' });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#EF4444]/20 font-bold cursor-pointer transition-all"
                >
                  Disconnect
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Privacy & Visibility Settings */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2 border-b border-[#2D2D31] pb-3">
          <Eye className="w-4 h-4 text-[#F59E0B]" /> Privacy Controls & Telemetry
        </h3>

        <div className="space-y-3 font-mono text-xs">
          {[
            {
              key: 'publicProfile',
              label: 'Public Portfolio & Profile',
              desc: 'Allow employers to view your verified SQL certificates and projects',
            },
            {
              key: 'shareLeaderboardStats',
              label: 'Leaderboard Participation',
              desc: 'Display XP ranking on global Pro Architect leaderboards',
            },
            {
              key: 'anonymousTelemetry',
              label: 'Anonymous Engine Crash Reporting',
              desc: 'Send anonymized WASM performance metrics to improve latency',
            },
            {
              key: 'allowAiTrainingOnQueries',
              label: 'Opt-in AI Query Learning',
              desc: 'Improve MobileSQL Copilot suggestions with query patterns',
            },
          ].map((item) => (
            <label
              key={item.key}
              className="p-3 rounded-xl bg-[#131315] border border-[#2D2D31] flex items-center justify-between cursor-pointer hover:border-[#F59E0B]/40 transition-all"
            >
              <div>
                <p className="font-bold text-[#FFFFFF]">{item.label}</p>
                <p className="text-[10px] text-[#8A8A90]">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={(privacy as any)[item.key]}
                onChange={(e) => updatePrivacy({ [item.key]: e.target.checked })}
                className="w-4 h-4 accent-[#F59E0B]"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="bg-[#EF4444]/5 border border-[#EF4444]/30 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-3 text-[#EF4444]">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="text-sm font-bold">Danger Zone: Account Deletion & Local Purge</h3>
        </div>

        <p className="text-xs text-[#C8C8CC] font-mono leading-relaxed">
          Permanently delete your MobileSQL account, clear encrypted local browser storage, and revoke all active JWT tokens.
        </p>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#EF4444] hover:bg-[#dc2626] text-[#FFFFFF] font-mono text-xs font-bold cursor-pointer transition-all flex items-center gap-2 shadow-lg"
        >
          <Trash2 className="w-4 h-4" /> Delete Account & Wipe Local Cache
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowDeleteModal(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md" />

          <div className="relative w-full max-w-md rounded-2xl bg-[#131315] border border-[#EF4444]/40 p-6 space-y-4 z-10 font-sans shadow-2xl">
            <div className="flex items-center gap-3 text-[#EF4444]">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-extrabold">Confirm Irreversible Account Deletion</h3>
            </div>

            <p className="text-xs text-[#C8C8CC] font-mono leading-relaxed">
              To proceed, type <span className="text-[#EF4444] font-bold">DELETE MY ACCOUNT</span> below:
            </p>

            <input
              type="text"
              placeholder="DELETE MY ACCOUNT"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              className="w-full bg-[#1B1B1E] border border-[#2D2D31] rounded-xl p-2.5 text-xs font-mono text-[#FFFFFF] focus:outline-none focus:border-[#EF4444]"
            />

            <div className="flex items-center gap-3 pt-2 font-mono text-xs">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#1B1B1E] border border-[#2D2D31] text-[#FFFFFF] font-bold cursor-pointer hover:bg-[#232326]"
              >
                Cancel
              </button>
              <button
                disabled={deleteConfirmationText !== 'DELETE MY ACCOUNT'}
                onClick={() => {
                  addToast({ title: 'Account Wiped', message: 'Local storage cache cleared.', type: 'info' });
                  resetAccountData();
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#EF4444] text-[#FFFFFF] font-bold cursor-pointer hover:bg-[#dc2626] disabled:opacity-40"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
