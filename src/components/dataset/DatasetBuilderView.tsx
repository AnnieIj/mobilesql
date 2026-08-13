import React from 'react';
import {
  Sparkles,
  BookOpen,
  Layers,
  Sliders,
  Briefcase,
  Terminal,
  Activity,
  Globe,
  FileUp,
} from 'lucide-react';
import { useDatasetStore, DatasetBuilderSubTab } from '../../stores/useDatasetStore';
import { AiPromptGeneratorTab } from './AiPromptGeneratorTab';
import { DatasetTemplatesTab } from './DatasetTemplatesTab';
import { VisualDatabaseDesignerTab } from './VisualDatabaseDesignerTab';
import { DataGeneratorTab } from './DataGeneratorTab';
import { AiScenarioBuilderTab } from './AiScenarioBuilderTab';
import { SqlLabSandboxTab } from './SqlLabSandboxTab';
import { PerformanceSimulatorTab } from './PerformanceSimulatorTab';
import { DatasetMarketplaceTab } from './DatasetMarketplaceTab';
import { ImportExportTab } from './ImportExportTab';
import { AiDatasetAssistantPanel } from './AiDatasetAssistantPanel';

export const DatasetBuilderView: React.FC = () => {
  const { activeSubTab, setActiveSubTab } = useDatasetStore();

  const NAV_TABS: Array<{ id: DatasetBuilderSubTab; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'prompt', label: 'AI Dataset Generator', icon: Sparkles },
    { id: 'templates', label: 'Dataset Templates (20)', icon: BookOpen },
    { id: 'designer', label: 'Visual ER Designer', icon: Layers },
    { id: 'datagen', label: 'Data Generator', icon: Sliders },
    { id: 'scenarios', label: 'AI Scenarios', icon: Briefcase },
    { id: 'sqllab', label: 'SQL Laboratory', icon: Terminal },
    { id: 'performance', label: 'Performance Simulator', icon: Activity },
    { id: 'marketplace', label: 'Marketplace', icon: Globe },
    { id: 'importexport', label: 'Import / Export', icon: FileUp },
  ];

  return (
    <div className="space-y-6 font-sans text-[#FFFFFF] relative pb-16">
      {/* Sub-Tab Navigation Header Bar */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shadow-xl font-mono text-xs">
        {NAV_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3.5 py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap text-[11px] ${
                isActive
                  ? 'bg-[#62DF7D] text-[#131315] shadow-lg'
                  : 'text-[#8A8A90] hover:text-[#FFFFFF] hover:bg-[#131315]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Sub-Tab Content View */}
      {activeSubTab === 'prompt' && <AiPromptGeneratorTab />}
      {activeSubTab === 'templates' && <DatasetTemplatesTab />}
      {activeSubTab === 'designer' && <VisualDatabaseDesignerTab />}
      {activeSubTab === 'datagen' && <DataGeneratorTab />}
      {activeSubTab === 'scenarios' && <AiScenarioBuilderTab />}
      {activeSubTab === 'sqllab' && <SqlLabSandboxTab />}
      {activeSubTab === 'performance' && <PerformanceSimulatorTab />}
      {activeSubTab === 'marketplace' && <DatasetMarketplaceTab />}
      {activeSubTab === 'importexport' && <ImportExportTab />}

      {/* Floating Assistant Drawer */}
      <AiDatasetAssistantPanel />
    </div>
  );
};
