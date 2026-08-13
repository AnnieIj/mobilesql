import React, { useState } from 'react';
import {
  Briefcase,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Code,
  Target,
  FileText,
  Zap,
} from 'lucide-react';
import { useDatasetStore } from '../../stores/useDatasetStore';
import { useSqlLabStore } from '../../stores/useSqlLabStore';
import { useUIStore } from '../../stores/useUIStore';

export const AiScenarioBuilderTab: React.FC = () => {
  const { addToast } = useUIStore();
  const { setActiveSubTab } = useDatasetStore();
  const { createNewTab } = useSqlLabStore();

  const SCENARIOS = [
    {
      id: 'scen_retail_churn',
      title: 'Retail Company Losing High-Value Customers',
      category: 'Retail & E-Commerce',
      difficulty: 'Advanced',
      context: 'Global Retailer Inc. observed an 18% decline in quarterly active buyers. Executive leadership needs an RFM (Recency, Frequency, Monetary) segmentation model in SQL to identify churn risks before black friday.',
      objectives: [
        'Calculate Recency (days since last purchase) per customer.',
        'Group customers into Platinum, Gold, Silver RFM tiers.',
        'Extract churned accounts with lifetime spend > $1,000.',
      ],
      initialQuery: `WITH customer_rfm AS (
  SELECT 
    customer_id,
    MAX(order_date) AS last_order,
    COUNT(order_id) AS frequency,
    SUM(total_amount) AS monetary
  FROM orders
  GROUP BY customer_id
)
SELECT * FROM customer_rfm ORDER BY monetary DESC;`,
    },
    {
      id: 'scen_bank_fraud',
      title: 'Banking Wire Transfer Fraud & Anomaly Investigation',
      category: 'Banking & Fintech',
      difficulty: 'Architect',
      context: 'Fintech Bank compliance department flagged 45 rapid wire transfers originating from international IPs within 5 minutes of password reset. You must query transaction velocity logs to uncover the syndicate.',
      objectives: [
        'Filter transactions exceeding $5,000 made within 10 minutes of account changes.',
        'Calculate rolling 1-hour withdrawal totals per user.',
        'Export flagged account numbers to Compliance Queue.',
      ],
      initialQuery: `SELECT 
  account_number, 
  COUNT(tx_id) AS rapid_tx_count, 
  SUM(amount) AS total_flagged_volume
FROM transactions
WHERE is_flagged_fraud = TRUE
GROUP BY account_number
HAVING COUNT(tx_id) >= 2;`,
    },
    {
      id: 'scen_hospital_wait',
      title: 'Hospital Emergency Room Waiting-Time Optimization',
      category: 'Healthcare',
      difficulty: 'Intermediate',
      context: 'Metro Hospital ER patient intake times surged to 95 minutes during shift changes. Analytics team needs window functions to calculate door-to-doctor triage latency per department.',
      objectives: [
        'Compute average waiting time per doctor specialization.',
        'Identify shift bottleneck hours with > 20 unassigned patients.',
      ],
      initialQuery: `SELECT 
  specialty, 
  AVG(wait_time_minutes) AS avg_intake_delay 
FROM er_intake_logs 
GROUP BY specialty;`,
    },
  ];

  const [activeScenario, setActiveScenario] = useState(SCENARIOS[0]);

  const handleLaunchInSqlLab = (scen: typeof SCENARIOS[0]) => {
    createNewTab(scen.title, scen.initialQuery);
    addToast({
      title: 'Scenario Loaded into SQL Lab',
      message: `Created new query tab with "${scen.title}".`,
      type: 'success',
    });
    setActiveSubTab('sqllab');
  };

  return (
    <div className="space-y-6 font-sans text-[#FFFFFF]">
      {/* Header */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 shadow-xl space-y-2 font-mono">
        <h2 className="text-base sm:text-lg font-bold text-[#FFFFFF] flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-[#62DF7D]" /> AI Business Scenario & Case Study Builder
        </h2>
        <p className="text-xs text-[#8A8A90]">
          Real-world executive business problems translated into SQL dataset queries, business objectives, and targeted analytics challenges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        {/* Scenarios List (1 Col) */}
        <div className="space-y-3">
          {SCENARIOS.map((scen) => {
            const isSelected = activeScenario.id === scen.id;
            return (
              <div
                key={scen.id}
                onClick={() => setActiveScenario(scen)}
                className={`p-4 rounded-2xl bg-[#1B1B1E] border transition-all cursor-pointer space-y-2 ${
                  isSelected ? 'border-[#62DF7D] ring-2 ring-[#62DF7D]/20 shadow-xl' : 'border-[#2D2D31] hover:border-[#8A8A90]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-[#62DF7D]/15 text-[#62DF7D] text-[10px] font-bold border border-[#62DF7D]/30">
                    {scen.category}
                  </span>
                  <span className="text-[10px] text-[#F59E0B] font-bold">{scen.difficulty}</span>
                </div>
                <h3 className="font-bold text-[#FFFFFF] text-xs">{scen.title}</h3>
              </div>
            );
          })}
        </div>

        {/* Selected Scenario Details (2 Cols) */}
        <div className="lg:col-span-2 bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-[#2D2D31] pb-3">
              <span className="text-[10px] text-[#62DF7D] font-bold uppercase">{activeScenario.category}</span>
              <h3 className="text-base font-bold text-[#FFFFFF] mt-0.5">{activeScenario.title}</h3>
            </div>

            <div>
              <p className="text-[10px] text-[#8A8A90] uppercase font-bold mb-1">Business Context & Background:</p>
              <p className="text-xs text-[#C8C8CC] bg-[#131315] p-3.5 rounded-xl border border-[#2D2D31] leading-relaxed">
                {activeScenario.context}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-[#8A8A90] uppercase font-bold mb-1">Key SQL Objectives:</p>
              <ul className="space-y-1.5">
                {activeScenario.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[#FFFFFF]">
                    <CheckCircle2 className="w-4 h-4 text-[#62DF7D] shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-[#2D2D31] flex justify-end">
            <button
              onClick={() => handleLaunchInSqlLab(activeScenario)}
              className="px-6 py-3 rounded-xl bg-[#62DF7D] hover:bg-[#52cc6c] text-[#131315] font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Zap className="w-4 h-4" /> Launch Case Study in SQL Lab
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
