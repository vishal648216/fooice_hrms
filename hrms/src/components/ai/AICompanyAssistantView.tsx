'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { 
  SUGGESTED_AI_PROMPTS, 
  INITIAL_AI_CHAT_MESSAGES, 
  AIAssistantMessage 
} from '@/lib/ai-data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Bot, 
  Sparkles, 
  Send, 
  User, 
  ArrowRight, 
  Copy, 
  Check, 
  RefreshCw, 
  DollarSign, 
  FolderGit2, 
  Clock, 
  Building2, 
  FileText 
} from 'lucide-react';

export const AICompanyAssistantView: React.FC = () => {
  const { setActivePath, addToast } = useOfficeOS();
  const [messages, setMessages] = useState<AIAssistantMessage[]>(INITIAL_AI_CHAT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: AIAssistantMessage = {
      id: `msg-${Date.now()}`,
      sender: 'USER',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: promptText,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Contextual AI Intelligence Response Generator
    setTimeout(() => {
      let aiReply = '';
      let suggestedActions: any[] = [];

      const query = promptText.toLowerCase();

      if (query.includes('financial') || query.includes('revenue') || query.includes('profit') || query.includes('margin')) {
        aiReply = `### 📊 Q3 2026 Financial Executive Summary:\n\n- **Gross Inward Collections:** **₹38.20L** *(+14.8% vs Q2 2026)*\n- **Operating Cost Centers:** **₹19.20L** (Payroll ₹14.2L, Cloud Infra ₹3.2L, Tools ₹1.8L)\n- **Net Operating Margin:** **49.7%** (₹19.00L Retained Profit)\n- **Corporate Runway:** **32.4 Months** with zero debt liabilities.\n\n*All client milestone payouts from Nova Capital and Apex BioHealth are fully cleared.*`;
        suggestedActions = [
          { label: '💰 Open Financial Ledger', path: '/finance/invoices', actionType: 'NAVIGATE' },
          { label: '📈 View Revenue BI Charts', path: '/analytics/financial-analytics', actionType: 'NAVIGATE' }
        ];
      } else if (query.includes('novapay') || query.includes('blocker') || query.includes('sprint')) {
        aiReply = `### 🚀 NovaPay Sprint 14 Delivery Status:\n\n- **Sprint Health:** **98% On-Track** (42 story points velocity)\n- **Completed Deliverables:** WebAuthn Biometric Protocol, Multi-currency transaction engine (sub-45ms latency)\n- **Active Blocker:** DNS & TLS staging certificate sync pending with client's DevOps team before 5 PM today.\n- **Assigned Dev:** **Arjun Nambiar** is deploying build to UAT now.`;
        suggestedActions = [
          { label: '🎯 Open Project Kanban', path: '/projects/all', actionType: 'NAVIGATE' },
          { label: '🎙️ View Meeting AI Transcript', path: '/ai/meeting-intelligence', actionType: 'NAVIGATE' }
        ];
      } else if (query.includes('attendance') || query.includes('punctuality') || query.includes('employee')) {
        aiReply = `### 👥 Today’s Live Organizational Attendance Telemetry:\n\n- **Employees Present:** **142 / 148** (96.8% reliability score)\n- **Approved Remote WFH:** **4 Employees**\n- **Unplanned Absence:** **2 Employees** (HR leave notifications acknowledged)\n- **Average Check-in Time:** **9:14 AM** (within standard 15-min company grace window).`;
        suggestedActions = [
          { label: '⏱️ View Attendance Heatmap', path: '/analytics/attendance-analytics', actionType: 'NAVIGATE' },
          { label: '📋 HR Leave Approvals', path: '/office/leave', actionType: 'NAVIGATE' }
        ];
      } else if (query.includes('email') || query.includes('marcus') || query.includes('client')) {
        aiReply = `### 📄 Draft Executive Client Email for Marcus Sterling (VP, Nova Capital):\n\n\`\`\`text\nSubject: NovaPay Sprint 14 Deliverables & Staging Deployment Confirmation\n\nDear Marcus,\n\nFollowing our review meeting earlier today, I am pleased to confirm that the WebAuthn passkey security module and multi-currency performance benchmarking have successfully passed all staging validation checks.\n\nOur DevOps team has deployed the staging build for your team's UAT testing. You can review the milestone sign-off in the dedicated Client Portal.\n\nBest regards,\nVikramaditya Singhania\nApex Global Technologies\n\`\`\``;
        suggestedActions = [
          { label: '🏢 Open Client Portal', path: '/client-portal', actionType: 'NAVIGATE' },
          { label: '✍️ Review Client Approvals', path: '/clients/approvals', actionType: 'NAVIGATE' }
        ];
      } else {
        aiReply = `### 🤖 OfficeOS Intelligence Analysis:\n\nI processed your query across all organization sub-systems. All **14 enterprise projects**, **finance ledgers**, **HR shifts**, and **client approvals** are synchronized in real-time.\n\nIs there a specific report, automated task, or executive briefing you would like me to generate?`;
        suggestedActions = [
          { label: '📊 Executive Reports', path: '/analytics/reports', actionType: 'NAVIGATE' },
          { label: '👥 Team Velocity', path: '/analytics/team-performance', actionType: 'NAVIGATE' }
        ];
      }

      const aiMsg: AIAssistantMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'AI',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: aiReply,
        suggestedActions,
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  const handleActionClick = (action: any) => {
    if (action.path) {
      setActivePath(action.path);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-5xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in duration-200">
      
      {/* Header Bar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              OfficeOS Autonomous Company Assistant
              <Badge variant="primary" size="sm">Enterprise v2.4 Active</Badge>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Indexed with real-time permissions across HR, Finance, Sprints, Client Portal, and Meeting Transcripts
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setMessages(INITIAL_AI_CHAT_MESSAGES);
            addToast({ title: 'Context Refreshed', description: 'Conversation reset to clean slate.', type: 'info' });
          }}
          className="text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Clear Chat
        </Button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 overflow-x-auto flex items-center gap-2 scrollbar-none">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
          Suggested Queries:
        </span>
        {SUGGESTED_AI_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendPrompt(prompt)}
            className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/80 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700/80 shrink-0 transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isAI = msg.sender === 'AI';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 ${isAI ? 'justify-start' : 'justify-end'}`}
            >
              {isAI && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-600/30">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-2xl space-y-3 ${isAI ? 'text-left' : 'text-right'}`}>
                <div
                  className={`p-4 rounded-3xl text-xs leading-relaxed ${
                    isAI
                      ? 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200'
                      : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 rounded-tr-xs'
                  }`}
                >
                  <div className="prose prose-xs dark:prose-invert max-w-none whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>
                </div>

                {/* Suggested Navigation & Execution Action Buttons */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {msg.suggestedActions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionClick(act)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition shadow-2xs"
                      >
                        <span>{act.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="text-[10px] text-slate-400 px-2">
                  {msg.timestamp}
                </div>
              </div>

              {!isAI && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* AI Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Message Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendPrompt(inputText);
        }}
        className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask OfficeOS AI anything about finances, active sprints, meetings, or draft client emails..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-2xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <Button
          variant="primary"
          size="md"
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="rounded-2xl px-4 shrink-0"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Ask AI</span>
        </Button>
      </form>

    </div>
  );
};
