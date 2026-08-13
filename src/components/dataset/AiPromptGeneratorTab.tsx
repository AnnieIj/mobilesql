import React, { useState } from 'react';
import {
  Sparkles,
  Database,
  Sliders,
  Layers,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Zap,
  Bot,
  Terminal,
} from 'lucide-react';
import { useDatasetStore } from '../../stores/useDatasetStore';
import { useUIStore } from '../../stores/useUIStore';
import { generateDatasetFromPrompt } from '../../services/aiDatasetService';
import { DatasetCategory } from '../../types/dataset';

export const AiPromptGeneratorTab: React.FC = () => {
  const { addToast } = useUIStore();
  const {
    currentDataset,
    setCurrentDataset,
    isAiGenerating,
    setIsAiGenerating,
    setActiveSubTab,
    addDataset,
  } = useDatasetStore();

  const [promptInput, setPromptInput] = useState(
    'Create a hospital management database with doctors, patients, appointments, billing, pharmacy, and laboratory records.'
  );

  const [selectedCategory, setSelectedCategory] = useState<DatasetCategory>('Healthcare');
  const [targetRowCount, setTargetRowCount] = useState<number>(10000);
  const [noiseLevel, setNoiseLevel] = useState<'clean' | 'realistic-nulls' | 'dirty-anomalies'>('realistic-nulls');

  const SAMPLE_PROMPTS = [
    {
      title: 'E-Commerce Platform',
      prompt: 'Create an e-commerce database with 100,000 customers and 3 years of sales.',
      cat: 'E-Commerce' as DatasetCategory,
    },
    {
      title: 'Hospital Management',
      prompt: 'Build a hospital management database with doctors, patients, appointments, billing, pharmacy, and laboratory records.',
      cat: 'Healthcare' as DatasetCategory,
    },
    {
      title: 'Banking & Fraud Detection',
      prompt: 'Design a core banking database with checking accounts, wire transfers, credit lines, and suspicious AML fraud flags.',
      cat: 'Banking' as DatasetCategory,
    },
    {
      title: 'SaaS Product Telemetry',
      prompt: 'Generate a B2B SaaS analytics schema tracking workspaces, seats, feature usage events, MRR expansion, and churn.',
      cat: 'SaaS Analytics' as DatasetCategory,
    },
  ];

  const handleGenerate = async () => {
    if (!promptInput.trim()) return;

    setIsAiGenerating(true);
    addToast({
      title: 'AI Dataset Architect Thinking...',
      message: 'Generating relational tables, foreign key constraints, indexes, and sample rows.',
      type: 'info',
    });

    try {
      const generated = await generateDatasetFromPrompt(promptInput, selectedCategory);
      addDataset(generated);
      setCurrentDataset(generated);
      setIsAiGenerating(false);

      addToast({
        title: 'Dataset Generated Successfully!',
        message: `Created "${generated.name}" with ${generated.tables.length} tables and ER relationships.`,
        type: 'success',
      });

      setActiveSubTab('designer');
    } catch (err) {
      setIsAiGenerating(false);
      addToast({
        title: 'Generation Failed',
        message: 'Unable to build schema. Loading baseline template.',
        type: 'error',
      });
    }
  };

  return (
    <div className="space-y-6 font-sans text-[#FFFFFF]">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#1B1B1E] via-[#232326] to-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#62DF7D]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#62DF7D]/15 text-[#62DF7D] border border-[#62DF7D]/30 font-mono text-[10px] font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI DATASET ARCHITECT
              </span>
              <span className="text-xs text-[#8A8A90] font-mono">• Gemini 2.5 Engine Active</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#FFFFFF]">
              Prompt-Driven Relational Database Synthesis
            </h2>
            <p className="text-xs text-[#C8C8CC] leading-relaxed font-mono">
              Describe your business scenario in plain English. MobileSQL will construct relational schemas, tables, primary/foreign keys, B-Tree indexes, and realistic mock records automatically.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
            <div className="p-3 rounded-xl bg-[#131315] border border-[#2D2D31] text-center min-w-[100px]">
              <p className="text-xs font-bold text-[#62DF7D]">{currentDataset.tables.length}</p>
              <p className="text-[10px] text-[#8A8A90]">Active Tables</p>
            </div>
            <div className="p-3 rounded-xl bg-[#131315] border border-[#2D2D31] text-center min-w-[100px]">
              <p className="text-xs font-bold text-[#3B82F6]">{currentDataset.relationships.length}</p>
              <p className="text-[10px] text-[#8A8A90]">FK Links</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Prompt Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Input Section (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-xl">
            <label className="text-xs font-bold text-[#FFFFFF] flex items-center justify-between font-mono">
              <span className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#62DF7D]" /> Describe Database Requirements:
              </span>
              <span className="text-[10px] text-[#8A8A90]">Multi-table Relational Schema</span>
            </label>

            <div className="relative">
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                rows={4}
                placeholder="e.g. Create a banking database with checking accounts, wire transfers, loan applications, credit lines, and suspicious AML fraud flags."
                className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl p-4 text-xs font-mono text-[#FFFFFF] placeholder-[#8A8A90] focus:outline-none focus:border-[#62DF7D] leading-relaxed resize-none"
              />
            </div>

            {/* Parameter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs pt-2">
              <div>
                <label className="text-[#8A8A90] text-[10px] block mb-1">Domain Industry:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as DatasetCategory)}
                  className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl p-2.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#62DF7D]"
                >
                  {[
                    'E-Commerce',
                    'Banking',
                    'Healthcare',
                    'Education',
                    'HR',
                    'CRM',
                    'ERP',
                    'Retail',
                    'Logistics',
                    'Airlines',
                    'Hotels',
                    'Social Media',
                    'Movie Streaming',
                    'Food Delivery',
                    'Insurance',
                    'Government',
                    'Telecommunications',
                    'Manufacturing',
                    'Real Estate',
                    'SaaS Analytics',
                  ].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#8A8A90] text-[10px] block mb-1">Target Row Scale:</label>
                <select
                  value={targetRowCount}
                  onChange={(e) => setTargetRowCount(Number(e.target.value))}
                  className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl p-2.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#62DF7D]"
                >
                  <option value={1000}>1,000 Records (Small)</option>
                  <option value={10000}>10,000 Records (Standard)</option>
                  <option value={100000}>100,000 Records (Large)</option>
                  <option value={1000000}>1,000,000 Records (Stress Test)</option>
                </select>
              </div>

              <div>
                <label className="text-[#8A8A90] text-[10px] block mb-1">Data Realism Profile:</label>
                <select
                  value={noiseLevel}
                  onChange={(e) => setNoiseLevel(e.target.value as any)}
                  className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl p-2.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#62DF7D]"
                >
                  <option value="clean">Pristine 3NF Normalization</option>
                  <option value="realistic-nulls">Realistic (Nulls & Foreign Keys)</option>
                  <option value="dirty-anomalies">Anomalies & Duplicate Email Tests</option>
                </select>
              </div>
            </div>

            {/* Action Trigger */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={isAiGenerating}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#62DF7D] hover:bg-[#52cc6c] text-[#131315] font-mono text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isAiGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Synthesizing Database Schema...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Generate Relational Schema & Data
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sample Prompts Palette */}
          <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold text-[#FFFFFF] flex items-center gap-2 font-mono">
              <Zap className="w-4 h-4 text-[#F59E0B]" /> Pre-Configured Architectural Prompts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              {SAMPLE_PROMPTS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPromptInput(sample.prompt);
                    setSelectedCategory(sample.cat);
                  }}
                  className="p-3.5 rounded-xl bg-[#131315] border border-[#2D2D31] hover:border-[#62DF7D] text-left transition-all cursor-pointer group space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#FFFFFF] group-hover:text-[#62DF7D]">{sample.title}</span>
                    <span className="text-[10px] text-[#8A8A90] px-2 py-0.5 rounded bg-[#1B1B1E] border border-[#2D2D31]">
                      {sample.cat}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8A8A90] line-clamp-2 leading-relaxed">{sample.prompt}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Active Schema Quick Preview (1 Col) */}
        <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#2D2D31] pb-3 mb-3">
              <h3 className="text-xs font-bold text-[#FFFFFF] flex items-center gap-2 font-mono">
                <Database className="w-4 h-4 text-[#3B82F6]" /> Active Dataset Schema
              </h3>
              <span className="px-2 py-0.5 rounded bg-[#3B82F6]/20 text-[#3B82F6] font-mono text-[10px] font-bold border border-[#3B82F6]/40">
                {currentDataset.category}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs max-h-[380px] overflow-y-auto pr-1">
              <div>
                <h4 className="font-bold text-[#FFFFFF]">{currentDataset.name}</h4>
                <p className="text-[10px] text-[#8A8A90] mt-0.5">{currentDataset.description}</p>
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-[10px] text-[#8A8A90] uppercase tracking-wider font-bold">
                  Generated Tables ({currentDataset.tables.length})
                </p>

                {currentDataset.tables.map((table) => (
                  <div key={table.id} className="p-3 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#62DF7D] text-[11px]">{table.name}</span>
                      <span className="text-[10px] text-[#8A8A90]">{table.columns.length} Cols</span>
                    </div>
                    <p className="text-[10px] text-[#8A8A90]">{table.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#2D2D31]">
            <button
              onClick={() => setActiveSubTab('designer')}
              className="w-full py-2.5 rounded-xl bg-[#131315] border border-[#2D2D31] hover:border-[#62DF7D] text-[#FFFFFF] hover:text-[#62DF7D] font-mono text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              Open in ER Diagram Editor <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
