import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Check,
  FileSpreadsheet,
  FileCode,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useAnalyticsStore } from '../../stores/useAnalyticsStore';
import { generatePrintableReportHtml } from '../../services/analyticsEngine';

export const ReportBuilderView: React.FC = () => {
  const { dashboards, activeDashboardId } = useAnalyticsStore();
  const activeDashboard = dashboards.find((d) => d.id === activeDashboardId);

  const [reportTitle, setReportTitle] = useState(
    activeDashboard ? `${activeDashboard.title} - Executive Report` : 'Executive BI Report'
  );
  const [includeAiSummary, setIncludeAiSummary] = useState(true);
  const [includeRawTables, setIncludeRawTables] = useState(true);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [scheduledAutoExport, setScheduledAutoExport] = useState(false);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  if (!activeDashboard) {
    return (
      <div className="p-8 text-center text-[#8A8A90] font-mono text-xs">
        No active dashboard selected for report generation.
      </div>
    );
  }

  const handlePrintPdf = () => {
    const htmlContent = generatePrintableReportHtml(activeDashboard, 'pdf');
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 300);
    }
  };

  const handleDownloadCsv = () => {
    const csvContent = generatePrintableReportHtml(activeDashboard, 'csv');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeDashboard.title.replace(/\s+/g, '_')}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccessMessage('Excel / CSV Export downloaded successfully!');
    setTimeout(() => setDownloadSuccessMessage(null), 4000);
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(activeDashboard, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeDashboard.title.replace(/\s+/g, '_')}_Backup.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccessMessage('JSON Dashboard State exported!');
    setTimeout(() => setDownloadSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6 font-mono text-xs text-[#FFFFFF]">
      {/* Header Banner */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-2">
        <div className="flex items-center gap-2 text-[#3B82F6] font-bold text-sm">
          <FileText className="w-5 h-5" />
          <span>Executive Report Generator & Export Engine</span>
        </div>
        <p className="text-xs text-[#8A8A90]">
          Format, customize, schedule, and print high-resolution C-Suite executive PDF reports or raw Excel/CSV data dumps.
        </p>
      </div>

      {downloadSuccessMessage && (
        <div className="p-4 rounded-xl bg-[#62DF7D]/20 border border-[#62DF7D] text-[#62DF7D] font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{downloadSuccessMessage}</span>
        </div>
      )}

      {/* Main Grid Options & Live Page Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Config Panel */}
        <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-5 space-y-5">
          <h3 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider pb-2 border-b border-[#2D2D31]">
            Report Layout Configuration
          </h3>

          <div className="space-y-1">
            <label className="text-[10px] text-[#8A8A90]">Document Title Header</label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#131315] border border-[#2D2D31] text-[#FFFFFF] focus:outline-none focus:border-[#3B82F6]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-[#8A8A90]">Page Orientation</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setOrientation('portrait')}
                className={`py-2 rounded-xl border text-center font-bold cursor-pointer ${
                  orientation === 'portrait'
                    ? 'bg-[#3B82F6] text-[#FFFFFF] border-[#3B82F6]'
                    : 'bg-[#131315] border-[#2D2D31] text-[#8A8A90]'
                }`}
              >
                Portrait (A4)
              </button>
              <button
                onClick={() => setOrientation('landscape')}
                className={`py-2 rounded-xl border text-center font-bold cursor-pointer ${
                  orientation === 'landscape'
                    ? 'bg-[#3B82F6] text-[#FFFFFF] border-[#3B82F6]'
                    : 'bg-[#131315] border-[#2D2D31] text-[#8A8A90]'
                }`}
              >
                Landscape
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#2D2D31]">
            <span className="text-[10px] text-[#8A8A90] font-bold uppercase">Include Report Modules</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeAiSummary}
                onChange={(e) => setIncludeAiSummary(e.target.checked)}
                className="rounded text-[#3B82F6]"
              />
              <span>AI Anomaly & Executive Summary</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeRawTables}
                onChange={(e) => setIncludeRawTables(e.target.checked)}
                className="rounded text-[#3B82F6]"
              />
              <span>SQL Query Data Matrices</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={scheduledAutoExport}
                onChange={(e) => setScheduledAutoExport(e.target.checked)}
                className="rounded text-[#3B82F6]"
              />
              <span>Schedule Auto-Email Export (Weekly)</span>
            </label>
          </div>

          {/* Export Buttons */}
          <div className="space-y-2 pt-4 border-t border-[#2D2D31]">
            <button
              onClick={handlePrintPdf}
              className="w-full py-2.5 rounded-xl bg-[#3B82F6] text-[#FFFFFF] font-bold flex items-center justify-center gap-2 hover:bg-[#2563eb] transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF Report</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="w-full py-2.5 rounded-xl bg-[#10B981] text-[#FFFFFF] font-bold flex items-center justify-center gap-2 hover:bg-[#059669] transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Excel / CSV Workbook</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="w-full py-2.5 rounded-xl bg-[#131315] border border-[#2D2D31] text-[#FFFFFF] font-bold flex items-center justify-center gap-2 hover:border-[#62DF7D] transition-all cursor-pointer"
            >
              <FileCode className="w-4 h-4 text-[#8B5CF6]" />
              <span>Export Raw JSON Schema</span>
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Document Live Page Simulation */}
        <div className="lg:col-span-2 bg-[#FFFFFF] text-[#111827] rounded-2xl p-8 space-y-6 shadow-2xl font-sans min-h-[500px]">
          <div className="border-b border-gray-200 pb-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-[#059669]">{reportTitle}</h1>
              <p className="text-xs text-gray-500">
                Dashboard: {activeDashboard.title} • Generated: {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="text-right text-xs text-gray-400">
              Page 1 of 1 • MobileSQL BI
            </div>
          </div>

          {/* Simulated Executive Overview section */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Executive KPI Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {activeDashboard.widgets
                .filter((w) => w.type === 'kpi' && w.kpiConfig)
                .map((w) => (
                  <div key={w.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-gray-500">{w.title}</span>
                    <div className="text-lg font-bold text-gray-900 font-mono">
                      {w.kpiConfig?.unit}
                      {w.kpiConfig?.value.toLocaleString()}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Simulated AI Summary */}
          {includeAiSummary && (
            <div className="p-4 border border-emerald-200 bg-emerald-50 rounded-xl space-y-2 text-xs">
              <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> AI Anomaly & Insight Briefing
              </span>
              <p className="text-emerald-900 leading-relaxed text-[11px]">
                Active dataset scanned. Overall revenue growth is steady (+18.4%), while mobile cart conversion shows a minor 2.1% throughput bottleneck during peak hours.
              </p>
            </div>
          )}

          {/* Active Visualizers List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Report Visual Inventory</h3>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="p-2 font-bold text-gray-700">Widget Title</th>
                  <th className="p-2 font-bold text-gray-700">Type</th>
                  <th className="p-2 font-bold text-gray-700">SQL Connection</th>
                </tr>
              </thead>
              <tbody>
                {activeDashboard.widgets.map((w) => (
                  <tr key={w.id} className="border-b border-gray-100">
                    <td className="p-2 font-bold text-gray-800">{w.title}</td>
                    <td className="p-2 text-gray-600">{w.type.toUpperCase()}</td>
                    <td className="p-2 text-gray-600 font-mono text-[11px]">{w.dataSourceType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
