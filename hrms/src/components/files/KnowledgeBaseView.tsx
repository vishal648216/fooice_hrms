'use client';

import React, { useState } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { MOCK_WIKI_ARTICLES, WikiArticleItem } from '@/lib/files-data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Clock, 
  Eye, 
  Sparkles, 
  Tag, 
  ChevronRight, 
  CheckCircle2, 
  Code, 
  LifeBuoy, 
  UserCheck, 
  ShieldCheck,
  X
} from 'lucide-react';

export const KnowledgeBaseView: React.FC = () => {
  const { addToast } = useOfficeOS();
  const [articles, setArticles] = useState<WikiArticleItem[]>(MOCK_WIKI_ARTICLES);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticleDetail, setSelectedArticleDetail] = useState<WikiArticleItem | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // New Article Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<WikiArticleItem['category']>('ENGINEERING_PRACTICES');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newBody, setNewBody] = useState('');

  const filteredArticles = articles.filter(art => {
    const matchesCat = selectedCategory === 'ALL' || art.category === selectedCategory;
    const matchesQuery = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const handlePublishArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newArt: WikiArticleItem = {
      id: `wiki-${Date.now()}`,
      slug: newTitle.toLowerCase().replace(/\s+/g, '-'),
      title: newTitle,
      category: newCategory,
      excerpt: newExcerpt || 'Engineering guidelines and standards.',
      body: newBody || `### Overview\n${newTitle}\n\n### Best Practices\nFollow core monorepo architecture.`,
      readTimeMinutes: 5,
      viewCount: 1,
      lastUpdated: new Date().toISOString().split('T')[0],
      author: {
        name: 'Sarah Montgomery',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      },
      tags: ['Engineering', 'Playbook']
    };

    setArticles(prev => [newArt, ...prev]);
    setShowPublishModal(false);
    setNewTitle('');
    setNewExcerpt('');
    setNewBody('');
    addToast({
      title: 'Article Published',
      description: `${newArt.title} published to team wiki.`,
      type: 'success'
    });
  };

  const categoryConfigs = {
    ENGINEERING_PRACTICES: { bg: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400', label: 'Engineering Standards' },
    DEVOPS_RUNBOOKS: { bg: 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400', label: 'Incident Runbooks' },
    ONBOARDING: { bg: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400', label: 'Onboarding & Playbooks' },
    ARCHITECTURE: { bg: 'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400', label: 'Architecture' },
    SECURITY_IAM: { bg: 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400', label: 'Security & IAM' }
  };

  return (
    <div className="space-y-6">
      {/* Search & Hero Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white space-y-4 border border-indigo-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold tracking-tight">Apex Engineering Knowledge Hub & Playbooks</h2>
            <p className="text-xs text-indigo-200">
              Centralized engineering standards, incident response runbooks, architecture blueprints, and onboarding protocols.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowPublishModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Publish Playbook
          </Button>
        </div>

        {/* Global Wiki Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400" />
          <input
            type="text"
            placeholder="Search knowledge base across 50+ engineering runbooks & playbooks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs text-white placeholder:text-indigo-300/70 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs select-none">
        {[
          { id: 'ALL', label: 'All Knowledge Articles' },
          { id: 'ENGINEERING_PRACTICES', label: 'Engineering Standards' },
          { id: 'DEVOPS_RUNBOOKS', label: 'Incident Runbooks' },
          { id: 'ONBOARDING', label: 'Developer Onboarding' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap border ${
              selectedCategory === tab.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filteredArticles.map((art) => {
          const catConfig = categoryConfigs[art.category] || categoryConfigs.ENGINEERING_PRACTICES;

          return (
            <Card
              key={art.id}
              hoverable
              className="p-5 flex flex-col justify-between space-y-4 border border-slate-200 dark:border-slate-800 cursor-pointer group"
              onClick={() => setSelectedArticleDetail(art)}
            >
              <div className="space-y-2.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${catConfig.bg}`}>
                  {catConfig.label}
                </span>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {art.excerpt}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {art.tags.map((t, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <img src={art.author.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                  <span>{art.author.name.split(' ')[0]}</span>
                </div>

                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {art.readTimeMinutes}m read
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {art.viewCount}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Article Detail Reading Drawer */}
      {selectedArticleDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-600">
                  {selectedArticleDetail.category.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-400">• {selectedArticleDetail.readTimeMinutes} min read</span>
              </div>
              <button
                onClick={() => setSelectedArticleDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {selectedArticleDetail.title}
              </h1>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
                {selectedArticleDetail.body}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Author: <strong>{selectedArticleDetail.author.name}</strong></span>
              <span>Last Updated: {selectedArticleDetail.lastUpdated}</span>
            </div>
          </div>
        </div>
      )}

      {/* Publish Article Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-600 text-white">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Publish Knowledge Base Playbook</h3>
              </div>
              <button
                onClick={() => setShowPublishModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePublishArticle} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Article Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Multi-AZ Aurora Database Failover Runbook"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Category Tag</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="ENGINEERING_PRACTICES">Engineering Standards</option>
                  <option value="DEVOPS_RUNBOOKS">Incident Runbooks</option>
                  <option value="ONBOARDING">Developer Onboarding</option>
                  <option value="ARCHITECTURE">System Architecture</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Short Excerpt</label>
                <textarea
                  rows={2}
                  placeholder="Brief synopsis for card preview..."
                  value={newExcerpt}
                  onChange={(e) => setNewExcerpt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Markdown Content Body</label>
                <textarea
                  rows={4}
                  placeholder="Full technical guide in Markdown..."
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowPublishModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Publish to Wiki
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
