import React, { useState } from 'react';
import { Award, CheckCircle2, Download, Share2, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';

export interface CertificateItem {
  id: string;
  title: string;
  category: string;
  issueDate: string;
  verificationHash: string;
  issuedTo: string;
  skillsVerified: string[];
  isUnlocked: boolean;
}

const CERTIFICATES: CertificateItem[] = [
  {
    id: 'cert_01',
    title: 'SQL Master Architect (PostgreSQL v16)',
    category: 'Pro Architecture',
    issueDate: 'August 12, 2026',
    verificationHash: '0x8f9a...32e1',
    issuedTo: 'SQL Query Architect',
    skillsVerified: ['Window Functions', 'Recursive CTEs', 'Index Tuning', 'EXPLAIN ANALYZE', 'JSONB Querying'],
    isUnlocked: true,
  },
  {
    id: 'cert_02',
    title: 'Database Administrator (DBA Professional)',
    category: 'Database Administration',
    issueDate: 'August 10, 2026',
    verificationHash: '0x4c2b...91f0',
    issuedTo: 'SQL Query Architect',
    skillsVerified: ['Buffer Cache Tuning', 'Vacuum & Autovacuum', 'WAL Replication', 'Partitioning'],
    isUnlocked: true,
  },
  {
    id: 'cert_03',
    title: 'FAANG Interview Certified Candidate',
    category: 'Career Placement',
    issueDate: 'August 08, 2026',
    verificationHash: '0x1e8d...77a3',
    issuedTo: 'SQL Query Architect',
    skillsVerified: ['Live Technical Mocking', 'Query Optimization', 'Complex Aggregations', 'DAU/MAU Metrics'],
    isUnlocked: true,
  },
  {
    id: 'cert_04',
    title: 'Data Engineer & ETL Pipeline Specialist',
    category: 'Analytics Engineering',
    issueDate: 'Pending Completion',
    verificationHash: 'Locked',
    issuedTo: 'SQL Query Architect',
    skillsVerified: ['dbt Models', 'Incremental Materializations', 'Star Schema', 'Data Lineage'],
    isUnlocked: false,
  },
];

export const CertificatesView: React.FC = () => {
  const { addToast } = useUIStore();
  const [selectedCert, setSelectedCert] = useState<CertificateItem>(CERTIFICATES[0]);

  const handleCopyLink = (cert: CertificateItem) => {
    navigator.clipboard.writeText(`https://mobilesql.app/verify/${cert.verificationHash}`);
    addToast({
      title: 'Verification Link Copied',
      message: `Shareable credential link for ${cert.title} copied to clipboard!`,
      type: 'success',
    });
  };

  return (
    <main className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans text-[#FFFFFF] select-none">
      {/* Header */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-2 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#62DF7D]/15 border border-[#62DF7D]/40 text-[#62DF7D] flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#FFFFFF]">Cryptographic Verified Certificates</h1>
            <p className="text-xs text-[#8A8A90] font-mono">
              Shareable, signed database engineering certifications backed by MobileSQL verification hashes.
            </p>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Certificate List */}
        <div className="lg:col-span-5 space-y-3 font-mono text-xs">
          {CERTIFICATES.map((cert) => (
            <div
              key={cert.id}
              onClick={() => setSelectedCert(cert)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                selectedCert.id === cert.id
                  ? 'bg-[#1B1B1E] border-[#62DF7D] shadow-lg'
                  : 'bg-[#131315] border-[#2D2D31] hover:border-[#3F3F46]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    cert.isUnlocked
                      ? 'bg-[#62DF7D]/20 text-[#62DF7D]'
                      : 'bg-[#232326] text-[#8A8A90]'
                  }`}
                >
                  {cert.category}
                </span>
                <span className="text-[10px] text-[#8A8A90]">
                  {cert.isUnlocked ? 'Verified' : 'Locked'}
                </span>
              </div>
              <h3 className="font-bold text-[#FFFFFF] text-sm font-sans">{cert.title}</h3>
              <p className="text-[11px] text-[#8A8A90]">Issued: {cert.issueDate}</p>
            </div>
          ))}
        </div>

        {/* Certificate Preview Card */}
        <div className="lg:col-span-7 bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-6 flex flex-col justify-between shadow-2xl relative">
          <div className="space-y-6">
            {/* Badge Banner */}
            <div className="flex items-center justify-between border-b border-[#2D2D31] pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#62DF7D]" />
                <span className="text-xs font-mono text-[#62DF7D] font-bold">Official MobileSQL Credential</span>
              </div>
              <span className="text-xs font-mono text-[#8A8A90]">ID: {selectedCert.verificationHash}</span>
            </div>

            {/* Main Credential Body */}
            <div className="text-center space-y-4 py-4 bg-[#131315] border border-[#2D2D31] rounded-2xl p-6">
              <Sparkles className="w-8 h-8 text-[#62DF7D] mx-auto" />
              <h2 className="text-xl font-extrabold text-[#FFFFFF] font-sans">{selectedCert.title}</h2>
              <p className="text-xs text-[#8A8A90] font-mono">This certifies that</p>
              <p className="text-lg font-bold text-[#62DF7D] font-mono underline decoration-[#62DF7D]/40">
                {selectedCert.issuedTo}
              </p>
              <p className="text-xs text-[#8A8A90] max-w-md mx-auto leading-relaxed">
                has successfully passed all hands-on PostgreSQL & SQLite query optimization benchmarks and earned a verified rating.
              </p>
            </div>

            {/* Verified Skills */}
            <div className="space-y-2 font-mono text-xs">
              <span className="text-[#8A8A90] text-[10px] uppercase">Verified Competencies:</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedCert.skillsVerified.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-lg bg-[#131315] border border-[#2D2D31] text-[#62DF7D] text-[11px] flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#2D2D31] flex items-center justify-between font-mono text-xs">
            <button
              onClick={() => handleCopyLink(selectedCert)}
              className="px-4 py-2 rounded-xl bg-[#131315] border border-[#2D2D31] hover:border-[#62DF7D] text-[#FFFFFF] cursor-pointer flex items-center gap-2 transition-all"
            >
              <Share2 className="w-4 h-4 text-[#62DF7D]" /> Copy Link
            </button>

            <button
              onClick={() =>
                addToast({
                  title: 'Downloading Certificate PDF',
                  message: 'Generated high-resolution vector PDF.',
                  type: 'success',
                })
              }
              className="px-4 py-2 rounded-xl bg-[#62DF7D] hover:bg-[#52cc6c] text-[#131315] font-bold cursor-pointer flex items-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
