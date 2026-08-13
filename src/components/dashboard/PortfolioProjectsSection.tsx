import React from 'react';
import { FolderGit2, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/Feedback';
import { Button } from '../ui/Button';
import { SectionTitle } from '../layout/Headers';
import { MOCK_PORTFOLIO_PROJECTS } from '../../data/dashboardData';
import { useUIStore } from '../../stores/useUIStore';

export const PortfolioProjectsSection: React.FC = () => {
  const { setActiveTab, addToast } = useUIStore();

  return (
    <div className="space-y-4 font-sans">
      <SectionTitle
        title="Production Portfolio Projects"
        subtitle="End-to-end relational schema architecture and analytics pipeline projects"
        icon={<FolderGit2 className="w-5 h-5 text-[#3B82F6]" />}
        action={
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />} onClick={() => setActiveTab('projects')}>
            All Projects
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MOCK_PORTFOLIO_PROJECTS.map((proj) => (
          <Card
            key={proj.id}
            className="group bg-[#1B1B1E] border border-[#2D2D31] hover:border-[#3B82F6]/60 p-5 rounded-2xl flex flex-col justify-between space-y-4 transition-all duration-200"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30">
                  {proj.difficulty}
                </span>
                <span className="text-xs font-mono font-bold text-[#62DF7D]">
                  {proj.completionPercent}% Done
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#FFFFFF] group-hover:text-[#3B82F6] transition-colors leading-snug">
                {proj.name}
              </h3>

              <p className="text-xs text-[#8A8A90] leading-relaxed line-clamp-2">
                {proj.description}
              </p>
            </div>

            <div className="space-y-3 pt-2 border-t border-[#2D2D31]">
              {/* Tech Pills */}
              <div className="flex flex-wrap gap-1">
                {proj.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#232326] text-[#C8C8CC] border border-[#2D2D31]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <ProgressBar value={proj.completionPercent} height="sm" color="blue" showValue={false} />

              <Button
                variant="secondary"
                size="sm"
                className="w-full group-hover:border-[#3B82F6] transition-all"
                leftIcon={<Play className="w-3.5 h-3.5 text-[#3B82F6]" />}
                onClick={() => {
                  setActiveTab('projects');
                  addToast({
                    title: proj.name,
                    message: `Loading project workspace (${proj.completionPercent}% complete)...`,
                    type: 'info',
                  });
                }}
              >
                {proj.completionPercent === 100 ? 'Review Architecture' : 'Continue Project'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
