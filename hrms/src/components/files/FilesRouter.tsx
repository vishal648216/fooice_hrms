'use client';

import React from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { FilesDriveView } from './FilesDriveView';
import { DocumentsManagerView } from './DocumentsManagerView';
import { KnowledgeBaseView } from './KnowledgeBaseView';
import { 
  HardDrive, 
  FileText, 
  BookOpen 
} from 'lucide-react';

export const FilesRouter: React.FC = () => {
  const { activePath, setActivePath } = useOfficeOS();

  // Navigation tabs for files and knowledge module
  const tabs = [
    { id: '/files', label: 'Cloud Files Drive', icon: <HardDrive className="w-3.5 h-3.5" /> },
    { id: '/documents', label: 'Official Documents & RFCs', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: '/knowledge-base', label: 'Knowledge Base & Wiki', icon: <BookOpen className="w-3.5 h-3.5" /> },
  ];

  // Helper for Breadcrumbs
  const pathParts = activePath.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, i) => ({
    label: part.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    href: '/' + pathParts.slice(0, i + 1).join('/')
  }));

  // Determine current active view
  let currentView = <FilesDriveView />;
  let title = 'Cloud Storage & Digital Asset Vault';
  let subtitle = 'Encrypted enterprise file storage, project build artifacts, and client deliverables';

  if (activePath.includes('document')) {
    currentView = <DocumentsManagerView />;
    title = 'Corporate Document Registry & Architecture RFCs';
    subtitle = 'Official Master Services Agreements, SOC2 compliance policies, and technical specifications';
  } else if (activePath.includes('knowledge') || activePath.includes('wiki')) {
    currentView = <KnowledgeBaseView />;
    title = 'Engineering Knowledge Base & Playbooks';
    subtitle = 'Best practices, architectural guidelines, incident response runbooks, and developer onboarding';
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <PageHeader
        title={title}
        subtitle={subtitle}
        breadcrumbs={breadcrumbs}
      />

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl overflow-x-auto select-none border border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => {
          const isActive = activePath === tab.id || 
            (tab.id === '/knowledge-base' && activePath === '/wiki');

          return (
            <button
              key={tab.id}
              onClick={() => setActivePath(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active View */}
      {currentView}
    </div>
  );
};
