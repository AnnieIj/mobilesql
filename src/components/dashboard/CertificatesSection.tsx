import React from 'react';
import { Award, ArrowRight, Share2, ShieldCheck } from 'lucide-react';
import { CertificateCard } from '../shared/DomainCards';
import { SectionTitle } from '../layout/Headers';
import { Button } from '../ui/Button';
import { useUIStore } from '../../stores/useUIStore';

export const CertificatesSection: React.FC = () => {
  const { setActiveTab, addToast } = useUIStore();

  return (
    <div className="space-y-4 font-sans">
      <SectionTitle
        title="Verified Professional Certification"
        subtitle="Cryptographically verified SQL Master Architect credential"
        icon={<Award className="w-5 h-5 text-[#22C55E]" />}
        action={
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />} onClick={() => setActiveTab('certificates')}>
            View Credentials
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-2">
          <CertificateCard
            title="SQL MASTER ARCHITECT"
            recipientName="Alex Quan"
            issueDate="August 2026"
            certificateId="MSQL-CERT-9942A"
            onShare={() =>
              addToast({
                title: 'Certificate Link Copied',
                message: 'Sharable verification link copied to clipboard.',
                type: 'success',
              })
            }
          />
        </div>

        <div className="p-6 rounded-2xl bg-[#1B1B1E] border border-[#2D2D31] space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#62DF7D]" />
            <h3 className="text-sm font-bold text-[#FFFFFF]">Credential Verification</h3>
          </div>

          <p className="text-xs text-[#8A8A90] leading-relaxed">
            Issued upon mastering PostgreSQL execution plans, window functions, and B-Tree index optimization benchmarks. Verified on-chain.
          </p>

          <div className="space-y-2 text-xs font-mono text-[#C8C8CC] pt-2 border-t border-[#2D2D31]">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-[#62DF7D] font-bold">Active & Verified</span>
            </div>
            <div className="flex justify-between">
              <span>Issuer:</span>
              <span>MobileSQL Institute</span>
            </div>
            <div className="flex justify-between">
              <span>Score:</span>
              <span className="text-[#62DF7D]">99.4% Performance</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full text-xs"
            leftIcon={<Share2 className="w-3.5 h-3.5" />}
            onClick={() =>
              addToast({
                title: 'LinkedIn Badge Exported',
                message: 'Added certificate to LinkedIn profile credentials.',
                type: 'info',
              })
            }
          >
            Export to LinkedIn
          </Button>
        </div>
      </div>
    </div>
  );
};
