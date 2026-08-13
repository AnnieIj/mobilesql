import React from 'react';
import { Bot, Sparkles, BookOpen, FolderGit2, Zap, HelpCircle, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { SectionTitle } from '../layout/Headers';
import { MOCK_AI_RECOMMENDATIONS } from '../../data/dashboardData';
import { useUIStore } from '../../stores/useUIStore';

export const AIRecommendationsSection: React.FC = () => {
  const { setActiveTab, setCopilotOpen, addToast } = useUIStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'Lesson':
        return <BookOpen className="w-4 h-4 text-[#62DF7D]" />;
      case 'Project':
        return <FolderGit2 className="w-4 h-4 text-[#3B82F6]" />;
      case 'Challenge':
        return <Zap className="w-4 h-4 text-[#F59E0B]" />;
      default:
        return <HelpCircle className="w-4 h-4 text-[#C8C8CC]" />;
    }
  };

  return (
    <div className="space-y-4 font-sans">
      <SectionTitle
        title="AI Mentor Personal Recommendations"
        subtitle="Tailored learning pathways based on your query performance and mistakes"
        icon={<Sparkles className="w-5 h-5 text-[#62DF7D]" />}
        action={
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />} onClick={() => setCopilotOpen(true)}>
            Chat with AI Mentor
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_AI_RECOMMENDATIONS.map((item) => (
          <Card
            key={item.id}
            className="group bg-[#1B1B1E] border border-[#2D2D31] hover:border-[#62DF7D]/60 p-5 rounded-2xl flex flex-col justify-between space-y-4 transition-all duration-200"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="emerald" icon={getIcon(item.type)}>
                  {item.type} Recommendation
                </Badge>
                <span className="text-[10px] font-mono text-[#8A8A90]">Gemini 2.5 Analysis</span>
              </div>

              <h3 className="text-sm font-bold text-[#FFFFFF] group-hover:text-[#62DF7D] transition-colors leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-[#C8C8CC] bg-[#131315] p-3 rounded-xl border border-[#2D2D31] leading-relaxed">
                "{item.reason}"
              </p>
            </div>

            <div className="pt-2">
              <Button
                variant="secondary"
                size="sm"
                className="w-full group-hover:bg-[#62DF7D] group-hover:text-[#131315] group-hover:border-[#62DF7D] transition-all"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                onClick={() => {
                  setActiveTab(item.tabTarget);
                  addToast({
                    title: item.title,
                    message: `Opening recommended ${item.type}...`,
                    type: 'info',
                  });
                }}
              >
                {item.actionLabel}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
