'use client';

import React, { useState } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { UserRole } from '@/types/officeos';
import { 
  ShieldCheck, 
  Briefcase, 
  User as UserIcon, 
  Users, 
  Building2, 
  ArrowRight, 
  Lock, 
  Mail, 
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const LoginView: React.FC = () => {
  const { login } = useOfficeOS();
  const [email, setEmail] = useState('admin@apextech.io');
  const [password, setPassword] = useState('••••••••••••');

  const demoRoles: { 
    role: UserRole; 
    name: string; 
    title: string; 
    email: string; 
    icon: React.ReactNode; 
    badgeColor: string; 
    desc: string; 
  }[] = [
    {
      role: 'SUPER_ADMIN',
      name: 'Vikramaditya Singhania',
      title: 'Chief Executive Officer & Founder',
      email: 'v.singhania@apextech.io',
      icon: <ShieldCheck className="w-5 h-5 text-indigo-600" />,
      badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
      desc: 'Master executive access across all 12 modules, finances, staff, and permission matrices.',
    },
    {
      role: 'MANAGER',
      name: 'Sarah Montgomery',
      title: 'Senior Engineering & Delivery Manager',
      email: 's.montgomery@apextech.io',
      icon: <Briefcase className="w-5 h-5 text-emerald-600" />,
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      desc: 'Project oversight, sprint tracking, code reviews, meeting hosting, and milestone delivery.',
    },
    {
      role: 'EMPLOYEE',
      name: 'Arjun Nambiar',
      title: 'Lead Full-Stack Systems Engineer',
      email: 'a.nambiar@apextech.io',
      icon: <UserIcon className="w-5 h-5 text-blue-600" />,
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
      desc: 'Personal developer workbench, assigned tasks, code repositories, and attendance punch-in.',
    },
    {
      role: 'HR',
      name: 'Kavita Rao',
      title: 'Head of People Operations & HR',
      email: 'k.rao@apextech.io',
      icon: <Users className="w-5 h-5 text-purple-600" />,
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
      desc: 'Employee directory, live attendance check-ins, leave approvals, and holiday calendar.',
    },
    {
      role: 'CLIENT',
      name: 'Marcus Sterling',
      title: 'VP of Digital Strategy, Nova Capital Partners',
      email: 'm.sterling@novacapital.com',
      icon: <Building2 className="w-5 h-5 text-amber-600" />,
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      desc: 'Dedicated client portal: track deliverable milestones, sign off requirements, view invoices.',
    },
  ];

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login('SUPER_ADMIN');
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* Brand Header */}
      <div className="text-center max-w-lg mb-8 space-y-2">
        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-2xs mb-2">
          <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>OfficeOS Enterprise Platform</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Sign In to Your Workspace
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Select your dedicated role portal below for 1-click instant login or sign in with your enterprise credentials.
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: 1-Click Role Logins (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              1-Click Role Portals (Instant Demo Access)
            </span>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
              Live Role Access
            </span>
          </div>

          <div className="space-y-2.5">
            {demoRoles.map((dr) => (
              <button
                key={dr.role}
                onClick={() => login(dr.role)}
                className="w-full text-left p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all flex items-start gap-4 group"
              >
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/60 transition shrink-0 mt-0.5">
                  {dr.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                      {dr.name}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase shrink-0 ${dr.badgeColor}`}>
                      {dr.role.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 truncate mb-1">
                    {dr.title}
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-1 leading-relaxed">
                    {dr.desc}
                  </p>
                </div>

                <div className="self-center p-1 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Col: Standard Credential Form (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Enterprise Single Sign-On
            </h2>
            <p className="text-xs text-slate-500">
              Sign in with your organization email
            </p>
          </div>

          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[11px] text-indigo-600 hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <span>Remember this workstation</span>
              </label>
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full font-bold shadow-md shadow-indigo-600/30">
              Authenticate & Sign In
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">
              Protected by Enterprise Multi-Factor & SOC2 Type II Security
            </span>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-slate-400">
        OfficeOS &bull; Single Source of Truth IT Platform &bull; Phase 1 Frontend UI/UX
      </footer>

    </div>
  );
};
