'use client';

import React from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { 
  Bot, 
  Sparkles, 
  FileText, 
  MessageSquare, 
  RefreshCw 
} from 'lucide-react';
import { AICompanyAssistantView } from './AICompanyAssistantView';
import { MeetingIntelligenceView } from './MeetingIntelligenceView';

export const AIRouter: React.FC = () => {
  const { activePath, setActivePath, addToast } = useOfficeOS();

  const tabs = [
    {
      id: 'assistant',
      label: 'AI Company Assistant',
      path: '/ai/assistant',
      icon: <Bot className="w-4 h-4" />,
    },
    {
      id: 'meeting-intelligence',
      label: 'Meeting Intelligence & Diarization',
      path: '/ai/meeting-intelligence',
      icon: <Sparkles className="w-4 h-4" />,
    },
  ];

  const pathParts = activePath.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, i) => ({
    label: part.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    href: '/' + pathParts.slice(0, i + 1).join('/')
  }));

  const isMeetingInt = activePath.includes('meeting');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Page Header */}
      <PageHeader
        title="OfficeOS Autonomous AI & Meeting Intelligence"
        subtitle="Conversational organization queries, automated speech-to-text diarization, sentiment tracking, and task extraction"
        breadcrumbs={breadcrumbs}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => addToast({ title: 'AI Embeddings Synced', description: 'Semantic vector store updated with latest organization events.', type: 'success' })}
          >
            <RefreshCw className="w-3.5 h-3.5" /> Sync AI Vectors
          </Button>
        }
      />

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {tabs.map((tab) => {
          const isActive = activePath === tab.path || (!isMeetingInt && tab.id === 'assistant');
          return (
            <button
              key={tab.id}
              onClick={() => setActivePath(tab.path)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Sub View */}
      {isMeetingInt ? <MeetingIntelligenceView /> : <AICompanyAssistantView />}

    </div>
  );
};
