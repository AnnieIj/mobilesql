import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Globe,
  Code,
  FileCode,
  CheckCircle,
} from 'lucide-react';
import { useAnalyticsStore } from '../../stores/useAnalyticsStore';

export const DashboardShareModal: React.FC = () => {
  const {
    isShareModalOpen,
    setIsShareModalOpen,
    dashboards,
    activeDashboardId,
    updateDashboard,
    publishDashboardToMarketplace,
  } = useAnalyticsStore();

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  const activeDashboard = dashboards.find((d) => d.id === activeDashboardId);

  if (!isShareModalOpen || !activeDashboard) return null;

  const publicUrl = `https://mobilesql.app/share/dashboard/${activeDashboard.publicShareToken || activeDashboard.id}`;
  const embedCode = `<iframe src="${publicUrl}" width="100%" height="600" frameborder="0"></iframe>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 3000);
  };

  const handlePublish = () => {
    publishDashboardToMarketplace(activeDashboard.id);
    setPublishedSuccess(true);
    setTimeout(() => setPublishedSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#131315]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl font-mono text-xs text-[#FFFFFF]">
        <div className="flex items-center justify-between pb-3 border-b border-[#2D2D31]">
          <div className="flex items-center gap-2 text-[#8B5CF6] font-bold text-sm">
            <Share2 className="w-5 h-5" />
            <span>Share & Publish BI Dashboard</span>
          </div>
          <button
            onClick={() => setIsShareModalOpen(false)}
            className="p-1 text-[#8A8A90] hover:text-[#FFFFFF] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {publishedSuccess && (
          <div className="p-3 rounded-xl bg-[#62DF7D]/20 border border-[#62DF7D] text-[#62DF7D] font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Successfully published to Community Marketplace!</span>
          </div>
        )}

        {/* Public Access Toggle */}
        <div className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] flex items-center justify-between">
          <div className="space-y-1">
            <div className="font-bold text-[#FFFFFF] flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#62DF7D]" />
              <span>Public Share Link Access</span>
            </div>
            <p className="text-[10px] text-[#8A8A90]">Anyone with the link can view live dashboard read-only</p>
          </div>
          <input
            type="checkbox"
            checked={activeDashboard.isPublished}
            onChange={(e) => updateDashboard(activeDashboard.id, { isPublished: e.target.checked })}
            className="w-5 h-5 accent-[#62DF7D] cursor-pointer"
          />
        </div>

        {/* Direct Public URL */}
        <div className="space-y-1">
          <label className="text-[10px] text-[#8A8A90] uppercase tracking-wider font-bold">Public Web URL</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={publicUrl}
              className="flex-1 px-3 py-2 rounded-xl bg-[#131315] border border-[#2D2D31] text-[#62DF7D] font-mono text-[11px]"
            />
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-[#62DF7D] text-[#131315] font-bold flex items-center gap-1 cursor-pointer hover:bg-[#52ce6d]"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* iFrame Embed Code */}
        <div className="space-y-1">
          <label className="text-[10px] text-[#8A8A90] uppercase tracking-wider font-bold">HTML iFrame Embed</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={embedCode}
              className="flex-1 px-3 py-2 rounded-xl bg-[#131315] border border-[#2D2D31] text-[#3B82F6] font-mono text-[11px]"
            />
            <button
              onClick={handleCopyEmbed}
              className="px-3.5 py-2 rounded-xl bg-[#3B82F6] text-[#FFFFFF] font-bold flex items-center gap-1 cursor-pointer hover:bg-[#2563eb]"
            >
              {copiedEmbed ? <Check className="w-4 h-4" /> : <Code className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Publish to Marketplace Button */}
        <div className="pt-3 border-t border-[#2D2D31] flex items-center justify-between">
          <button
            onClick={handlePublish}
            className="w-full py-2.5 rounded-xl bg-[#8B5CF6] text-[#FFFFFF] font-bold flex items-center justify-center gap-2 hover:bg-[#7c4dff] transition-all cursor-pointer"
          >
            <Globe className="w-4 h-4" />
            <span>Publish Template to Marketplace</span>
          </button>
        </div>
      </div>
    </div>
  );
};
