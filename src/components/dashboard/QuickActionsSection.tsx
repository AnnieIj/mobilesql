import React from 'react';
import {
  Terminal,
  Sparkles,
  Bot,
  Zap,
  FolderGit2,
  Award,
  FileText,
  Briefcase,
  Grid,
} from 'lucide-react';
import { SectionTitle } from '../layout/Headers';
import { useUIStore } from '../../stores/useUIStore';

export const QuickActionsSection: React.FC = () => {
  const { setActiveTab, setCopilotOpen, setSqlGeneratorOpen, addToast } = useUIStore();

  const ACTIONS = [
    {
      id: 'action_playground',
      label: 'SQL Playground',
      description: 'Execute queries in WASM SQLite',
      icon: <Terminal className="w-5 h-5 text-[#62DF7D]" />,
      onClick: () => {
        setActiveTab('playground');
        addToast({ title: 'SQL Playground', message: 'WASM database engine active.', type: 'info' });
      },
    },
    {
      id: 'action_generator',
      label: 'AI Query Generator',
      description: 'Convert natural language to SQL',
      icon: <Sparkles className="w-5 h-5 text-[#3B82F6]" />,
      onClick: () => {
        setSqlGeneratorOpen(true);
      },
    },
    {
      id: 'action_mentor',
      label: 'AI Copilot Mentor',
      description: 'Ask database architecture questions',
      icon: <Bot className="w-5 h-5 text-[#62DF7D]" />,
      onClick: () => {
        setCopilotOpen(true);
      },
    },
    {
      id: 'action_challenge',
      label: 'Daily Challenge',
      description: 'Solve query optimization puzzle',
      icon: <Zap className="w-5 h-5 text-[#F59E0B]" />,
      onClick: () => {
        setActiveTab('challenges');
        addToast({ title: 'Daily Challenge', message: 'Loading performance optimization puzzle.', type: 'info' });
      },
    },
    {
      id: 'action_projects',
      label: 'Portfolio Projects',
      description: 'Build enterprise SQL architecture',
      icon: <FolderGit2 className="w-5 h-5 text-[#3B82F6]" />,
      onClick: () => {
        setActiveTab('projects');
      },
    },
    {
      id: 'action_certificates',
      label: 'Certifications',
      description: 'View verified credentials & share',
      icon: <Award className="w-5 h-5 text-[#22C55E]" />,
      onClick: () => {
        setActiveTab('certificates');
      },
    },
    {
      id: 'action_resume',
      label: 'SQL Resume Builder',
      description: 'Generate database portfolio PDF',
      icon: <FileText className="w-5 h-5 text-[#A855F7]" />,
      onClick: () => {
        setActiveTab('career');
        addToast({ title: 'Career Preparation', message: 'Opening SQL Portfolio & Resume Builder.', type: 'info' });
      },
    },
    {
      id: 'action_interview',
      label: 'Interview Prep',
      description: 'Practice FAANG database questions',
      icon: <Briefcase className="w-5 h-5 text-[#EC4899]" />,
      onClick: () => {
        setActiveTab('career');
      },
    },
  ];

  return (
    <div className="space-y-4 font-sans">
      <SectionTitle
        title="Quick Launch Controls"
        subtitle="One-tap access to primary tools, AI query generators, and career modules"
        icon={<Grid className="w-5 h-5 text-[#62DF7D]" />}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className="p-4 rounded-2xl bg-[#1B1B1E] border border-[#2D2D31] hover:border-[#62DF7D] hover:bg-[#232326] transition-all duration-200 text-left space-y-2 group cursor-pointer"
          >
            <div className="p-2 rounded-xl bg-[#131315] border border-[#2D2D31] w-fit group-hover:scale-110 transition-transform">
              {action.icon}
            </div>

            <div className="space-y-0.5">
              <p className="text-xs font-bold text-[#FFFFFF] group-hover:text-[#62DF7D] transition-colors">
                {action.label}
              </p>
              <p className="text-[10px] text-[#8A8A90] line-clamp-1 font-mono">
                {action.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
