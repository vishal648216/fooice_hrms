'use client';

import React, { useState } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { MOCK_CORPORATE_DOCS, CorporateDocumentItem } from '@/lib/files-data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  FileText, 
  Plus, 
  Search, 
  BookOpen, 
  ShieldCheck, 
  Calendar, 
  User, 
  Tag, 
  Download, 
  Printer, 
  Sparkles,
  X,
  FileBadge
} from 'lucide-react';

export const DocumentsManagerView: React.FC = () => {
  const { addToast } = useOfficeOS();
  const [docs, setDocs] = useState<CorporateDocumentItem[]>(MOCK_CORPORATE_DOCS);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocDetail, setSelectedDocDetail] = useState<CorporateDocumentItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Document Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CorporateDocumentItem['category']>('ARCHITECTURE_RFC');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');

  const filteredDocs = docs.filter(doc => {
    const matchesCat = selectedCategory === 'ALL' || doc.category === selectedCategory;
    const matchesQuery = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.docNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newDoc: CorporateDocumentItem = {
      id: `doc-${Date.now()}`,
      docNumber: `DOC-GEN-2026-${Math.floor(10 + Math.random() * 90)}`,
      title: newTitle,
      category: newCategory,
      summary: newSummary || 'Technical specification and guidelines.',
      content: newContent || `## 1. Overview\n${newTitle}\n\n## 2. Technical Scope\nCreated by engineering leadership.`,
      version: 'v1.0',
      status: 'PUBLISHED',
      author: {
        name: 'Arjun Nambiar',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'Lead Full-Stack Engineer',
      },
      lastReviewed: new Date().toISOString().split('T')[0],
      pagesCount: 5,
      tags: ['Corporate', 'Specification', 'Engineering']
    };

    setDocs(prev => [newDoc, ...prev]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewSummary('');
    setNewContent('');
    addToast({
      title: 'Document Published',
      description: `${newDoc.docNumber} recorded in corporate library.`,
      type: 'success'
    });
  };

  const categoryBadges = {
    SECURITY_SOC2: { bg: 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400', label: 'Security & SOC2' },
    LEGAL_MSA: { bg: 'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400', label: 'Legal & MSA' },
    ARCHITECTURE_RFC: { bg: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400', label: 'Architecture RFC' },
    SOW_CONTRACT: { bg: 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400', label: 'SOW Contract' },
    HR_POLICY: { bg: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400', label: 'Company Policy' }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search specifications, RFCs, policies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Document Types</option>
            <option value="SECURITY_SOC2">Security & SOC2</option>
            <option value="LEGAL_MSA">Legal & MSAs</option>
            <option value="ARCHITECTURE_RFC">Architecture RFCs</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCreateModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Document
          </Button>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map((doc) => {
          const catConfig = categoryBadges[doc.category] || categoryBadges.ARCHITECTURE_RFC;

          return (
            <Card
              key={doc.id}
              hoverable
              className="p-5 flex flex-col justify-between space-y-4 border border-slate-200 dark:border-slate-800 cursor-pointer"
              onClick={() => setSelectedDocDetail(doc)}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                    {doc.docNumber}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${catConfig.bg}`}>
                    {catConfig.label}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {doc.summary}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {doc.tags.map((t, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <img src={doc.author.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                  <span>{doc.author.name.split(' ')[0]}</span>
                </div>

                <div className="flex items-center gap-2 text-[11px]">
                  <span>{doc.version}</span>
                  <span>•</span>
                  <span>{doc.pagesCount} pages</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Document Reader Modal */}
      {selectedDocDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded">
                  {selectedDocDetail.docNumber}
                </span>
                <span className="text-xs font-mono text-slate-400">{selectedDocDetail.version}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addToast({ title: 'Exported PDF', description: `${selectedDocDetail.docNumber}.pdf downloaded.`, type: 'success' })}
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                >
                  Download PDF
                </Button>
                <button
                  onClick={() => setSelectedDocDetail(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {selectedDocDetail.title}
              </h1>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
                {selectedDocDetail.content}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Author: <strong>{selectedDocDetail.author.name}</strong> ({selectedDocDetail.author.role})</span>
              <span>Last Reviewed: {selectedDocDetail.lastReviewed}</span>
            </div>
          </div>
        </div>
      )}

      {/* Create Document Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-600 text-white">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Draft Official Document</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SOC2 Compliance & Data Retention Protocol"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Document Classification</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="ARCHITECTURE_RFC">Architecture RFC</option>
                  <option value="SECURITY_SOC2">Security & SOC2 Policy</option>
                  <option value="LEGAL_MSA">Legal Master Services Agreement</option>
                  <option value="SOW_CONTRACT">Statement of Work (SOW)</option>
                  <option value="HR_POLICY">HR Employee Policy</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Executive Summary</label>
                <textarea
                  rows={2}
                  placeholder="Brief synopsis of this specification..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Document Markdown Body</label>
                <textarea
                  rows={4}
                  placeholder="Write specifications in Markdown..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Publish Document
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
