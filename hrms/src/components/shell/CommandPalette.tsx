'use client';

import React, { useState, useEffect } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { GLOBAL_SEARCH_INDEX } from '@/lib/officeos-data';
import { 
  Search, 
  X, 
  FolderGit2, 
  CheckSquare, 
  Users, 
  Video, 
  Building2, 
  Receipt, 
  HardDrive, 
  ArrowRight,
  Command
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setCommandPaletteOpen, setActivePath, addToast } = useOfficeOS();
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const filteredResults = GLOBAL_SEARCH_INDEX.filter((item) => {
    const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase()) || 
                         item.subtitle.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchesQuery && matchesCategory;
  });

  const handleSelect = (url: string, title: string) => {
    setActivePath(url);
    setCommandPaletteOpen(false);
    addToast({
      title: `Navigated to ${title}`,
      description: `Opened view from global command palette search.`,
      type: 'info',
    });
  };

  const categoryIcons = {
    PROJECTS: <FolderGit2 className="w-3.5 h-3.5 text-indigo-500" />,
    TASKS: <CheckSquare className="w-3.5 h-3.5 text-blue-500" />,
    PEOPLE: <Users className="w-3.5 h-3.5 text-emerald-500" />,
    MEETINGS: <Video className="w-3.5 h-3.5 text-rose-500" />,
    CLIENTS: <Building2 className="w-3.5 h-3.5 text-amber-500" />,
    INVOICES: <Receipt className="w-3.5 h-3.5 text-purple-500" />,
    FILES: <HardDrive className="w-3.5 h-3.5 text-slate-500" />,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search people, projects, meetings, tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 overflow-x-auto">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'PROJECTS', label: 'Projects' },
            { id: 'TASKS', label: 'Tasks' },
            { id: 'PEOPLE', label: 'People' },
            { id: 'MEETINGS', label: 'Meetings' },
            { id: 'CLIENTS', label: 'Clients' },
            { id: 'INVOICES', label: 'Invoices' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap ${
                categoryFilter === cat.id
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1 max-h-96">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No matching records found for "{query}". Try another query.
            </div>
          ) : (
            filteredResults.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item.actionUrl, item.title)}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between group gap-3"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    {categoryIcons[item.category] || <Command className="w-3.5 h-3.5" />}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">
                      {item.badge}
                    </span>
                  )}
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded font-mono text-[10px]">↑↓</kbd> to navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded font-mono text-[10px]">↵</kbd> to select</span>
            <span><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded font-mono text-[10px]">esc</kbd> to dismiss</span>
          </div>
          <span className="font-semibold text-slate-500">OfficeOS Universal Index</span>
        </div>

      </div>
    </div>
  );
};
