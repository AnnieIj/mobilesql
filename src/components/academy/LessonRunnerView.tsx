import React, { useState } from 'react';
import {
  ArrowLeft,
  Award,
  BookMarked,
  CheckCircle2,
  Play,
  Bot,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  Send,
  X,
} from 'lucide-react';
import Markdown from 'react-markdown';
import type { AcademyLesson } from '../../data/academyCurriculumData';
import { useAcademyStore } from '../../stores/useAcademyStore';
import { InteractiveJoinDiagram } from './InteractiveJoinDiagram';
import { SqlDragBlockExercise } from './SqlDragBlockExercise';
import { QuizCard } from './QuizCard';
import { MonacoSQLEditor } from '../playground/MonacoSQLEditor';
import type { SQLExecutionResult } from '../../types';
import { executePlaygroundQuery } from '../../services/sqlExecutionEngine';

interface LessonRunnerProps {
  lesson: AcademyLesson;
  onClose: () => void;
}

export const LessonRunnerView: React.FC<LessonRunnerProps> = ({ lesson, onClose }) => {
  const {
    activeLessonCode,
    updateLessonCode,
    markLessonComplete,
    completedLessonIds,
    bookmarkedLessonIds,
    toggleBookmarkLesson,
    aiChatMessages,
    isAiThinking,
    sendAiChatMessage,
  } = useAcademyStore();

  const [aiPromptInput, setAiPromptInput] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'ai'>('content');
  const [isExecuting, setIsExecuting] = useState(false);
  const [queryResult, setQueryResult] = useState<SQLExecutionResult | null>(null);

  const isCompleted = completedLessonIds.includes(lesson.id);
  const isBookmarked = bookmarkedLessonIds.includes(lesson.id);

  const handleRunCode = async () => {
    setIsExecuting(true);
    const { result } = await executePlaygroundQuery(
      activeLessonCode || lesson.initialSql,
      lesson.databaseId,
      'PostgreSQL'
    );
    setQueryResult(result);
    setIsExecuting(false);

    // Verify if query matches expected outcome or returns non-empty result
    if (!result.error && result.rowCount > 0) {
      markLessonComplete(lesson.id, lesson.xpReward);
    }
  };

  const handleSendAi = async (text: string) => {
    if (!text.trim()) return;
    setAiPromptInput('');
    await sendAiChatMessage(text);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#131315] flex flex-col font-sans select-none overflow-hidden">
      {/* Lesson Header Navigation */}
      <div className="bg-[#1B1B1E] border-b border-[#2D2D31] p-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="p-1.5 text-[#8A8A90] hover:text-[#FFFFFF] hover:bg-[#232326] rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#62DF7D]/15 text-[#62DF7D] font-mono text-[10px] font-bold">
                {lesson.difficulty}
              </span>
              <h2 className="text-sm font-bold text-[#FFFFFF] truncate">{lesson.title}</h2>
            </div>
            <p className="text-xs text-[#8A8A90] truncate">{lesson.summary}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => toggleBookmarkLesson(lesson.id)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isBookmarked
                ? 'bg-[#62DF7D]/15 text-[#62DF7D] border-[#62DF7D]'
                : 'bg-[#131315] text-[#8A8A90] border-[#2D2D31]'
            }`}
            title="Bookmark Lesson"
          >
            <BookMarked className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#62DF7D]/15 text-[#62DF7D] border border-[#62DF7D]/30 font-mono text-xs font-bold">
            <Award className="w-4 h-4" />
            <span>+{lesson.xpReward} XP</span>
          </div>

          <button
            onClick={() => setActiveTab(activeTab === 'content' ? 'ai' : 'content')}
            className={`p-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'ai'
                ? 'bg-[#62DF7D] text-[#131315] border-[#62DF7D]'
                : 'bg-[#131315] text-[#8A8A90] border-[#2D2D31]'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">AI Mentor</span>
          </button>
        </div>
      </div>

      {/* Main Split-Screen Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* LEFT PANE: LESSON EXPLANATION / AI MENTOR */}
        <div className="w-full md:w-1/2 h-full border-r border-[#2D2D31] flex flex-col bg-[#131315] overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {activeTab === 'content' ? (
            <>
              {/* Reading Markdown */}
              <div className="prose prose-invert prose-xs max-w-none space-y-3 text-[#FFFFFF]">
                <Markdown>{lesson.readingMarkdown}</Markdown>
              </div>

              {/* Interactive Visual Diagrams */}
              {lesson.visualType === 'join_diagram' && <InteractiveJoinDiagram />}

              {/* Drag Block Puzzle Exercise */}
              {lesson.dragExercise && (
                <SqlDragBlockExercise
                  exercise={lesson.dragExercise}
                  onComplete={(xp) => markLessonComplete(lesson.id, xp)}
                />
              )}

              {/* Multiple Choice Quiz */}
              {lesson.quiz && <QuizCard quiz={lesson.quiz} />}

              {/* Best Practices & Common Mistakes */}
              {lesson.bestPractices && (
                <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-4 space-y-2">
                  <h4 className="text-xs font-bold text-[#62DF7D] flex items-center gap-1.5 font-mono">
                    <Lightbulb className="w-4 h-4" /> Best Practices
                  </h4>
                  <ul className="list-disc list-inside text-xs text-[#8A8A90] space-y-1">
                    {lesson.bestPractices.map((bp, i) => (
                      <li key={i}>{bp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Interview Tip */}
              {lesson.interviewTip && (
                <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-2xl p-4 space-y-1">
                  <h4 className="text-xs font-bold text-[#F59E0B] flex items-center gap-1.5 font-mono">
                    <Award className="w-4 h-4" /> FAANG Interview Tip
                  </h4>
                  <p className="text-xs text-[#FFFFFF] leading-relaxed">{lesson.interviewTip}</p>
                </div>
              )}
            </>
          ) : (
            /* AI MENTOR CHAT SIDE PANEL */
            <div className="flex-1 flex flex-col h-full space-y-3">
              <div className="flex items-center justify-between border-b border-[#2D2D31] pb-2">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-[#62DF7D]" />
                  <span className="text-xs font-bold text-[#FFFFFF]">AI Lesson Assistant</span>
                </div>
              </div>

              {/* Quick Prompts */}
              <div className="flex flex-wrap gap-1.5">
                {['Explain this concept simpler', 'Give another real-world example', 'Explain common bugs'].map(
                  (qp, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendAi(qp)}
                      className="px-2.5 py-1 rounded-lg bg-[#1B1B1E] hover:bg-[#232326] border border-[#2D2D31] text-[11px] text-[#8A8A90] hover:text-[#FFFFFF] transition-colors cursor-pointer"
                    >
                      {qp}
                    </button>
                  )
                )}
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-[#1B1B1E] rounded-xl border border-[#2D2D31] custom-scrollbar">
                {aiChatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-xl text-xs font-sans space-y-1 ${
                      msg.sender === 'user'
                        ? 'bg-[#62DF7D]/15 border border-[#62DF7D]/30 ml-6 text-[#FFFFFF]'
                        : 'bg-[#131315] border border-[#2D2D31] mr-6 text-[#8A8A90]'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] font-mono text-[#8A8A90]">
                      <span className="font-bold text-[#62DF7D]">
                        {msg.sender === 'user' ? 'You' : 'AI Mentor'}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-[#FFFFFF]">{msg.text}</p>
                  </div>
                ))}
                {isAiThinking && (
                  <p className="text-xs font-mono text-[#62DF7D] animate-pulse p-2">
                    AI Mentor is thinking...
                  </p>
                )}
              </div>

              {/* Input Bar */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask a question about this lesson..."
                  value={aiPromptInput}
                  onChange={(e) => setAiPromptInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAi(aiPromptInput)}
                  className="flex-1 bg-[#1B1B1E] border border-[#2D2D31] rounded-xl px-3 py-2 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#62DF7D]"
                />
                <button
                  onClick={() => handleSendAi(aiPromptInput)}
                  className="p-2 bg-[#62DF7D] text-[#131315] font-bold rounded-xl cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANE: MONACO PRACTICE EDITOR & EXECUTION OUTPUT */}
        <div className="w-full md:w-1/2 h-full flex flex-col bg-[#131315]">
          {/* Editor Header Toolbar */}
          <div className="p-3 bg-[#1B1B1E] border-b border-[#2D2D31] flex items-center justify-between text-xs font-mono">
            <span className="text-[#8A8A90] font-bold flex items-center gap-1.5">
              <Play className="w-4 h-4 text-[#62DF7D]" /> SQL Practice Workspace
            </span>

            <button
              onClick={handleRunCode}
              disabled={isExecuting}
              className="px-4 py-1.5 rounded-xl bg-[#62DF7D] hover:bg-[#52cc6c] text-[#131315] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-[#131315]" /> Run SQL (Ctrl+Enter)
            </button>
          </div>

          {/* Monaco Editor */}
          <div className="h-[50%] border-b border-[#2D2D31]">
            <MonacoSQLEditor
              value={activeLessonCode || lesson.initialSql}
              onChange={(val) => updateLessonCode(val)}
              onRunQuery={handleRunCode}
            />
          </div>

          {/* Execution Output Panel */}
          <div className="h-[50%] p-4 bg-[#131315] overflow-y-auto custom-scrollbar flex flex-col space-y-3">
            <div className="flex justify-between items-center text-xs font-mono text-[#8A8A90]">
              <span>Query Result Output</span>
              {queryResult && (
                <span className="text-[#62DF7D]">
                  {queryResult.rowCount} rows • {queryResult.executionTimeMs.toFixed(1)}ms
                </span>
              )}
            </div>

            {queryResult && !queryResult.error ? (
              <div className="overflow-x-auto rounded-xl border border-[#2D2D31] bg-[#1B1B1E]">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="bg-[#131315] border-b border-[#2D2D31] text-[#8A8A90]">
                      {queryResult.columns.map((col: string) => (
                        <th key={col} className="p-2.5">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResult.rows.map((row: Record<string, any>, rIdx: number) => (
                      <tr key={rIdx} className="border-b border-[#2D2D31]/40 hover:bg-[#232326]">
                        {queryResult.columns.map((col: string) => (
                          <td key={col} className="p-2.5 text-[#FFFFFF]">
                            {String(row[col] ?? 'NULL')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : queryResult?.error ? (
              <div className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] text-xs font-mono">
                {queryResult.error}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs font-mono text-[#8A8A90]">
                Click "Run SQL" to execute your query against the database...
              </div>
            )}

            {isCompleted && (
              <div className="p-3 rounded-xl bg-[#62DF7D]/15 border border-[#62DF7D]/40 text-[#62DF7D] text-xs font-mono font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Lesson Passed! +{lesson.xpReward} XP awarded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
