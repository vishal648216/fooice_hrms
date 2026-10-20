'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Role } from '@/types';
import { 
  ShieldCheck, 
  Briefcase, 
  User as UserIcon, 
  Database, 
  RefreshCw, 
  Bell, 
  Sparkles,
  Layers
} from 'lucide-react';

export default function Navbar() {
  const { currentRole, setCurrentRole, currentUser, dbStatus, retryDbConnection, announcements } = useApp();

  const roles: { role: Role; label: string; icon: React.ReactNode; color: string }[] = [
    { role: 'ADMIN', label: 'Admin', icon: <ShieldCheck className="w-4 h-4" />, color: 'bg-indigo-600 text-white' },
    { role: 'MANAGER', label: 'Manager', icon: <Briefcase className="w-4 h-4" />, color: 'bg-emerald-600 text-white' },
    { role: 'USER', label: 'User / Member', icon: <UserIcon className="w-4 h-4" />, color: 'bg-blue-600 text-white' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white tracking-tight">
              <span>WorkSync</span>
              <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Multi-Role Task & Team Collaboration
            </p>
          </div>
        </div>

        {/* Database Connection & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* DB Connection Indicator (Excalidraw Module 2) */}
          <button 
            onClick={retryDbConnection}
            title="Click to verify / retry database connection"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 transition"
          >
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${dbStatus === 'CONNECTED' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-spin'}`} />
              <span className="text-slate-700 dark:text-slate-300">
                {dbStatus === 'CONNECTED' ? 'DB Connected' : 'Reconnecting...'}
              </span>
            </span>
            <RefreshCw className={`w-3 h-3 text-slate-400 ${dbStatus === 'RETRYING' ? 'animate-spin' : ''}`} />
          </button>

          {/* Quick Interactive Role Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="hidden lg:flex items-center px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Role:
            </div>
            {roles.map((r) => {
              const active = currentRole === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => setCurrentRole(r.role)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    active 
                      ? `${r.color} shadow-sm font-semibold scale-[1.02]` 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700'
                  }`}
                >
                  {r.icon}
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20"
            />
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-500 capitalize">
                {currentUser.role.toLowerCase()}
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
