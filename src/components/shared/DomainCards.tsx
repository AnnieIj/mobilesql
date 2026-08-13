import React from 'react';
import { Award, Lock, Sparkles, CheckCircle2, QrCode } from 'lucide-react';
import { Card, GlassCard } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/Feedback';
import { Button } from '../ui/Button';
import type { AchievementBadge } from '../../types';

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  action,
  children,
}) => {
  return (
    <Card className="space-y-4 bg-[#1B1B1E] border border-[#2D2D31]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#FFFFFF]">{title}</h3>
          {subtitle && <p className="text-xs text-[#8A8A90]">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="w-full h-48 sm:h-64 flex items-center justify-center">
        {children}
      </div>
    </Card>
  );
};

export interface AchievementCardProps {
  badge: AchievementBadge;
  onClaim?: () => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  badge,
  onClaim,
}) => {
  return (
    <GlassCard className="flex items-center gap-4 p-4 bg-[#1B1B1E] border border-[#2D2D31]">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
          badge.unlocked
            ? 'bg-[#62DF7D]/15 border-[#62DF7D] text-[#62DF7D] shadow-[0_0_15px_rgba(98,223,125,0.25)]'
            : 'bg-[#232326] border-[#2D2D31] text-[#8A8A90]'
        }`}
      >
        {badge.unlocked ? <Award className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#FFFFFF]">{badge.title}</h4>
          {badge.unlocked ? (
            <Badge variant="emerald" icon={<CheckCircle2 className="w-3 h-3 text-[#62DF7D]" />}>
              Unlocked
            </Badge>
          ) : (
            <Badge variant="neutral">Locked</Badge>
          )}
        </div>
        <p className="text-xs text-[#8A8A90]">{badge.description}</p>
        <ProgressBar value={badge.progress} max={badge.maxProgress} height="sm" />
      </div>

      {!badge.unlocked && badge.progress >= badge.maxProgress && onClaim && (
        <Button size="sm" variant="glow" leftIcon={<Sparkles className="w-3.5 h-3.5" />} onClick={onClaim}>
          Claim
        </Button>
      )}
    </GlassCard>
  );
};

export interface CertificateCardProps {
  title?: string;
  recipientName?: string;
  issueDate?: string;
  certificateId?: string;
  onShare?: () => void;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  title = 'SQL MASTER ARCHITECT',
  recipientName = 'Alex Mercer',
  issueDate = 'August 2026',
  certificateId = 'MSQL-CERT-9942A',
  onShare,
}) => {
  return (
    <div className="relative rounded-2xl p-6 bg-gradient-to-br from-[#1B1B1E] via-[#131315] to-[#09090B] border-2 border-[#62DF7D]/50 shadow-[0_0_35px_rgba(98,223,125,0.15)] text-[#FFFFFF] space-y-6 overflow-hidden">
      {/* Background Matrix Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#62DF7D]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Certificate Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <Award className="w-8 h-8 text-[#62DF7D]" />
          <span className="font-bold text-lg tracking-tight">MobileSQL Certified</span>
        </div>
        <QrCode className="w-10 h-10 text-[#8A8A90]/50" />
      </div>

      {/* Title & Name */}
      <div className="space-y-2 text-center py-4">
        <p className="text-xs uppercase tracking-widest text-[#8A8A90] font-semibold">Certificate of Achievement</p>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#62DF7D] uppercase">{title}</h2>
        <p className="text-sm text-[#C8C8CC]">Awarded to</p>
        <p className="text-xl font-bold text-[#FFFFFF]">{recipientName}</p>
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center text-xs text-[#8A8A90] pt-4 border-t border-[#2D2D31]">
        <div>
          <p>Issued: <span className="text-[#FFFFFF] font-mono">{issueDate}</span></p>
          <p>ID: <span className="text-[#62DF7D] font-mono">{certificateId}</span></p>
        </div>
        {onShare && (
          <Button size="sm" variant="outline" onClick={onShare}>
            Share Badge
          </Button>
        )}
      </div>
    </div>
  );
};
