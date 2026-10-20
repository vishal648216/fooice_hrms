import React, { useState } from 'react';
import {
  ShieldCheck, Building2, Users, ToggleLeft, ToggleRight, CreditCard,
  AlertCircle, CheckCircle2, XCircle, Eye, Edit3, Trash2, Plus,
  Search, Filter, Globe, TrendingUp, Server, Zap, Clock, Lock, Unlock,
  BarChart3, DollarSign, UserCheck, Settings, ChevronDown, ChevronRight,
  Crown, Ban, RefreshCw, Download, Send, Bell, Activity, Database,
  Wifi, Shield, Package, Star, Calendar, ArrowUpRight, X, Check,
  Building, Briefcase, UserX, Mail, Phone, HardDrive, Cpu, LogIn
} from 'lucide-react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { Tenant, TenantPlan, TenantStatus } from '@/types/officeos';

// ── Types ──────────────────────────────────────────────────────────────────────

interface TenantModule {
  key: string;
  label: string;
  icon: React.ReactNode;
  enabled: boolean;
  category: string;
}

// ── Mock Tenant Data ────────────────────────────────────────────────────────────

const ALL_MODULES: Omit<TenantModule, 'enabled'>[] = [
  { key: 'dashboard',    label: 'Dashboard & Analytics', icon: <BarChart3 className="w-3.5 h-3.5" />, category: 'Core' },
  { key: 'employees',   label: 'Employee Management',   icon: <Users className="w-3.5 h-3.5" />,     category: 'HR' },
  { key: 'attendance',  label: 'Attendance & Shifts',   icon: <Clock className="w-3.5 h-3.5" />,     category: 'HR' },
  { key: 'leave',       label: 'Leave Management',      icon: <Calendar className="w-3.5 h-3.5" />,  category: 'HR' },
  { key: 'payroll',     label: 'Payroll & Salary',      icon: <DollarSign className="w-3.5 h-3.5" />, category: 'HR' },
  { key: 'projects',    label: 'Projects & Kanban',     icon: <Package className="w-3.5 h-3.5" />,   category: 'Work' },
  { key: 'tasks',       label: 'Task Manager',          icon: <CheckCircle2 className="w-3.5 h-3.5" />, category: 'Work' },
  { key: 'chat',        label: 'Team Chat',             icon: <Bell className="w-3.5 h-3.5" />,      category: 'Communication' },
  { key: 'meetings',    label: 'Video Meetings',        icon: <Wifi className="w-3.5 h-3.5" />,      category: 'Communication' },
  { key: 'whiteboard',  label: 'Whiteboards',           icon: <Edit3 className="w-3.5 h-3.5" />,     category: 'Communication' },
  { key: 'clients',     label: 'Client Portal',         icon: <Building2 className="w-3.5 h-3.5" />, category: 'Business' },
  { key: 'finance',     label: 'Finance & Invoices',    icon: <CreditCard className="w-3.5 h-3.5" />, category: 'Business' },
  { key: 'files',       label: 'Files & Documents',     icon: <HardDrive className="w-3.5 h-3.5" />, category: 'Tools' },
  { key: 'ai',          label: 'AI Assistant',          icon: <Zap className="w-3.5 h-3.5" />,       category: 'Tools' },
  { key: 'analytics',   label: 'Advanced Analytics',    icon: <TrendingUp className="w-3.5 h-3.5" />, category: 'Tools' },
];

const INITIAL_TENANTS: Tenant[] = [
  {
    id: 't-001',
    companyName: 'NovaPay Technologies',
    ownerName: 'Rahul Sharma',
    ownerEmail: 'rahul@novapay.in',
    ownerPhone: '+91 98765 43210',
    plan: 'ENTERPRISE',
    status: 'ACTIVE',
    employeeCount: 120,
    joinedDate: '2024-01-15',
    nextBillingDate: '2025-11-01',
    monthlyRevenue: 24000,
    storageUsedGB: 42,
    storageCapGB: 500,
    lastLoginAt: '2 hours ago',
    location: 'Mumbai, India',
    industry: 'Fintech',
    modules: {
      dashboard: true, employees: true, attendance: true, leave: true, payroll: true,
      projects: true, tasks: true, chat: true, meetings: true, whiteboard: true,
      clients: true, finance: true, files: true, ai: true, analytics: true,
    },
  },
  {
    id: 't-002',
    companyName: 'BlueWave Designs',
    ownerName: 'Priya Mehta',
    ownerEmail: 'priya@bluewave.co',
    ownerPhone: '+91 87654 32109',
    plan: 'PRO',
    status: 'ACTIVE',
    employeeCount: 35,
    joinedDate: '2024-03-20',
    nextBillingDate: '2025-11-01',
    monthlyRevenue: 8500,
    storageUsedGB: 12,
    storageCapGB: 100,
    lastLoginAt: '5 hours ago',
    location: 'Bangalore, India',
    industry: 'Design Agency',
    modules: {
      dashboard: true, employees: true, attendance: true, leave: true, payroll: false,
      projects: true, tasks: true, chat: true, meetings: true, whiteboard: true,
      clients: true, finance: true, files: true, ai: true, analytics: false,
    },
  },
  {
    id: 't-003',
    companyName: 'GreenLeaf HR Solutions',
    ownerName: 'Amit Patel',
    ownerEmail: 'amit@greenleafhr.com',
    ownerPhone: '+91 76543 21098',
    plan: 'STARTER',
    status: 'TRIAL',
    employeeCount: 12,
    joinedDate: '2025-09-28',
    trialEndsAt: '2025-11-12',
    monthlyRevenue: 0,
    storageUsedGB: 2,
    storageCapGB: 20,
    lastLoginAt: 'Yesterday',
    location: 'Pune, India',
    industry: 'HR Consulting',
    modules: {
      dashboard: true, employees: true, attendance: true, leave: true, payroll: false,
      projects: false, tasks: true, chat: true, meetings: false, whiteboard: false,
      clients: false, finance: false, files: true, ai: false, analytics: false,
    },
  },
  {
    id: 't-004',
    companyName: 'Skyline Constructions',
    ownerName: 'Vikram Singh',
    ownerEmail: 'vikram@skyline.build',
    ownerPhone: '+91 65432 10987',
    plan: 'PRO',
    status: 'SUSPENDED',
    employeeCount: 78,
    joinedDate: '2023-08-05',
    nextBillingDate: 'Overdue',
    monthlyRevenue: 0,
    storageUsedGB: 31,
    storageCapGB: 100,
    lastLoginAt: '3 days ago',
    location: 'Delhi, India',
    industry: 'Construction',
    modules: {
      dashboard: true, employees: true, attendance: true, leave: true, payroll: true,
      projects: true, tasks: true, chat: false, meetings: false, whiteboard: false,
      clients: true, finance: true, files: true, ai: false, analytics: true,
    },
  },
  {
    id: 't-005',
    companyName: 'TechSprout Academy',
    ownerName: 'Neha Joshi',
    ownerEmail: 'neha@techsprout.edu',
    ownerPhone: '+91 54321 09876',
    plan: 'FREE',
    status: 'ACTIVE',
    employeeCount: 8,
    joinedDate: '2025-08-01',
    monthlyRevenue: 0,
    storageUsedGB: 0.8,
    storageCapGB: 5,
    lastLoginAt: '1 hour ago',
    location: 'Hyderabad, India',
    industry: 'EdTech',
    modules: {
      dashboard: true, employees: true, attendance: true, leave: false, payroll: false,
      projects: false, tasks: true, chat: false, meetings: false, whiteboard: false,
      clients: false, finance: false, files: false, ai: false, analytics: false,
    },
  },
];

// ── Helper Components ───────────────────────────────────────────────────────────

const PlanBadge = ({ plan }: { plan: TenantPlan }) => {
  const styles: Record<TenantPlan, string> = {
    FREE:       'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    STARTER:    'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    PRO:        'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
    ENTERPRISE: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  };
  const icons: Record<TenantPlan, React.ReactNode> = {
    FREE:       null,
    STARTER:    <Star className="w-2.5 h-2.5" />,
    PRO:        <Zap className="w-2.5 h-2.5" />,
    ENTERPRISE: <Crown className="w-2.5 h-2.5" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${styles[plan]}`}>
      {icons[plan]}
      {plan}
    </span>
  );
};

const StatusBadge = ({ status }: { status: TenantStatus }) => {
  const config: Record<TenantStatus, { cls: string; icon: React.ReactNode; label: string }> = {
    ACTIVE:    { cls: 'text-emerald-600 dark:text-emerald-400', icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: 'Active' },
    SUSPENDED: { cls: 'text-rose-600 dark:text-rose-400',     icon: <Ban className="w-3.5 h-3.5" />,          label: 'Suspended' },
    TRIAL:     { cls: 'text-violet-600 dark:text-violet-400', icon: <Clock className="w-3.5 h-3.5" />,        label: 'Trial' },
    EXPIRED:   { cls: 'text-orange-600 dark:text-orange-400', icon: <AlertCircle className="w-3.5 h-3.5" />,  label: 'Expired' },
    CANCELLED: { cls: 'text-slate-500 dark:text-slate-400',   icon: <XCircle className="w-3.5 h-3.5" />,      label: 'Cancelled' },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1 font-bold text-xs ${c.cls}`}>
      {c.icon}
      {c.label}
    </span>
  );
};

// ── Stat Card ──────────────────────────────────────────────────────────────────

const StatCard = ({
  icon, label, value, sub, color, trend
}: {
  icon: React.ReactNode; label: string; value: string; sub?: string; color: string; trend?: string;
}) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-start justify-between gap-3 shadow-sm hover:shadow-md transition-shadow">
    <div>
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{value}</p>
      {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
      {trend && (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
          <ArrowUpRight className="w-3 h-3" /> {trend}
        </span>
      )}
    </div>
    <div className={`p-3 rounded-xl ${color} shrink-0`}>
      {icon}
    </div>
  </div>
);

// ── Module Toggle Row ──────────────────────────────────────────────────────────

const ModuleToggleRow = ({
  module, enabled, onToggle, disabled
}: {
  module: Omit<TenantModule, 'enabled'>; enabled: boolean; onToggle: () => void; disabled?: boolean;
}) => (
  <div className={`flex items-center justify-between p-3 rounded-xl border transition ${
    enabled
      ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/60'
      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
  }`}>
    <div className="flex items-center gap-2.5">
      <span className={enabled ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}>
        {module.icon}
      </span>
      <div>
        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{module.label}</p>
        <p className="text-[10px] text-slate-400">{module.category}</p>
      </div>
    </div>
    <button
      onClick={onToggle}
      disabled={disabled}
      title={enabled ? 'Disable module' : 'Enable module'}
      className={`transition ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105'}`}
    >
      {enabled
        ? <ToggleRight className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
        : <ToggleLeft className="w-7 h-7 text-slate-300 dark:text-slate-600" />}
    </button>
  </div>
);

// ── Module Management Modal ────────────────────────────────────────────────────

const ModuleModal = ({
  tenant, onClose, onSave
}: {
  tenant: Tenant; onClose: () => void; onSave: (modules: Record<string, boolean>) => void;
}) => {
  const [modules, setModules] = useState<Record<string, boolean>>({ ...tenant.modules });
  const [filter, setFilter] = useState('ALL');
  const categories = ['ALL', ...Array.from(new Set(ALL_MODULES.map(m => m.category)))];

  const filteredModules = ALL_MODULES.filter(m =>
    filter === 'ALL' || m.category === filter
  );

  const enabledCount = Object.values(modules).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-600" />
              Module Access Control
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              <strong className="text-slate-700 dark:text-slate-300">{tenant.companyName}</strong> — Toggle which features this tenant can access
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-6 pt-4 flex items-center gap-2 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                filter === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-xs font-bold text-slate-400 whitespace-nowrap">
            {enabledCount}/{ALL_MODULES.length} enabled
          </span>
        </div>

        {/* Module List */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredModules.map(mod => (
            <ModuleToggleRow
              key={mod.key}
              module={mod}
              enabled={!!modules[mod.key]}
              onToggle={() => setModules(prev => ({ ...prev, [mod.key]: !prev[mod.key] }))}
            />
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              const allEnabled: Record<string, boolean> = {};
              ALL_MODULES.forEach(m => { allEnabled[m.key] = true; });
              setModules(allEnabled);
            }}
            className="text-xs font-semibold text-indigo-600 hover:underline"
          >
            Enable All
          </button>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              Cancel
            </button>
            <button
              onClick={() => { onSave(modules); onClose(); }}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Add Tenant Modal ──────────────────────────────────────────────────────────

const AddTenantModal = ({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (tenant: Tenant) => void;
}) => {
  const [companyName, setCompanyName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('Technology');
  const [plan, setPlan] = useState<TenantPlan>('PRO');
  const [monthlyRevenue, setMonthlyRevenue] = useState(15000);
  const [employeeCount, setEmployeeCount] = useState(25);

  const [modules, setModules] = useState<Record<string, boolean>>(() => {
    const m: Record<string, boolean> = {};
    ALL_MODULES.forEach(mod => {
      m[mod.key] = true;
    });
    return m;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !ownerEmail.trim()) return;

    const newTenant: Tenant = {
      id: `t-${Date.now()}`,
      companyName,
      ownerName: ownerName || 'Business Owner',
      ownerEmail,
      ownerPhone: ownerPhone || '+91 99999 99999',
      location: location || 'Mumbai, India',
      industry: industry || 'Technology',
      plan,
      status: 'ACTIVE',
      monthlyRevenue: plan === 'FREE' ? 0 : Number(monthlyRevenue) || 0,
      employeeCount: Number(employeeCount) || 10,
      storageUsedGB: 1,
      storageCapGB: plan === 'ENTERPRISE' ? 500 : plan === 'PRO' ? 100 : plan === 'STARTER' ? 20 : 5,
      joinedDate: new Date().toISOString().split('T')[0],
      nextBillingDate: '2026-11-01',
      lastLoginAt: 'Just now',
      modules,
    };

    onAdd(newTenant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Register New Business Tenant
              </h3>
              <p className="text-xs text-slate-500">
                Setup workspace, pricing plan & configure enabled module permissions
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Company / Organization Name *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="e.g. Nexus Software Solutions"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Industry</label>
              <input
                type="text"
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                placeholder="e.g. Fintech, Healthcare, Agency"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Owner Name *</label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={e => setOwnerName(e.target.value)}
                placeholder="e.g. Rohan Varma"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Owner Email *</label>
              <input
                type="email"
                required
                value={ownerEmail}
                onChange={e => setOwnerEmail(e.target.value)}
                placeholder="e.g. rohan@nexus.in"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={ownerPhone}
                onChange={e => setOwnerPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subscription Plan</label>
              <select
                value={plan}
                onChange={e => setPlan(e.target.value as TenantPlan)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="FREE">FREE Tier</option>
                <option value="STARTER">STARTER Tier (₹4,999/mo)</option>
                <option value="PRO">PRO Tier (₹12,999/mo)</option>
                <option value="ENTERPRISE">ENTERPRISE Tier (₹29,999/mo)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Bangalore, India"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">User Limit</label>
              <input
                type="number"
                value={employeeCount}
                onChange={e => setEmployeeCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Module Selector */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Configure Enabled Modules for this Business
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const all: Record<string, boolean> = {};
                    ALL_MODULES.forEach(m => { all[m.key] = true; });
                    setModules(all);
                  }}
                  className="text-[11px] font-bold text-indigo-600 hover:underline"
                >
                  Enable All
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => setModules({ dashboard: true, tasks: true })}
                  className="text-[11px] font-bold text-slate-500 hover:underline"
                >
                  Minimal
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/50">
              {ALL_MODULES.map(m => (
                <label
                  key={m.key}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs font-semibold border transition ${
                    modules[m.key]
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!modules[m.key]}
                    onChange={() => setModules(prev => ({ ...prev, [m.key]: !prev[m.key] }))}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="truncate">{m.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center gap-2 shadow-sm shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" />
              Create Business Tenant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Tenant Detail Panel ────────────────────────────────────────────────────────

const TenantDetailPanel = ({
  tenant, onClose, onModuleChange, onStatusChange, onPlanChange, onImpersonate, onDelete, addToast
}: {
  tenant: Tenant;
  onClose: () => void;
  onModuleChange: (id: string, modules: Record<string, boolean>) => void;
  onStatusChange: (id: string, status: TenantStatus) => void;
  onPlanChange: (id: string, plan: TenantPlan) => void;
  onImpersonate: (id: string) => void;
  onDelete: (id: string) => void;
  addToast: (toast: any) => void;
}) => {
  const [showModuleModal, setShowModuleModal] = useState(false);
  const enabledModules = ALL_MODULES.filter(m => tenant.modules[m.key]);
  const storagePercent = Math.round((tenant.storageUsedGB / tenant.storageCapGB) * 100);

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-sm" onClick={onClose}>
        <div
          className="h-full w-full max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-250"
          onClick={e => e.stopPropagation()}
        >
          {/* Panel Header */}
          <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-5 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-extrabold flex items-center justify-center text-lg shadow-md shadow-indigo-500/20">
                {tenant.companyName.charAt(0)}
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">{tenant.companyName}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <PlanBadge plan={tenant.plan} />
                  <StatusBadge status={tenant.status} />
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-5">

            {/* Owner Info */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Owner Details</h4>
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-sm font-bold text-slate-800 dark:text-white">{tenant.ownerName}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-xs text-slate-600 dark:text-slate-300">{tenant.ownerEmail}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-xs text-slate-600 dark:text-slate-300">{tenant.ownerPhone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-xs text-slate-600 dark:text-slate-300">{tenant.location} · {tenant.industry}</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Employees', value: tenant.employeeCount, icon: <Users className="w-4 h-4" />, color: 'text-blue-600' },
                { label: 'Monthly Revenue', value: tenant.monthlyRevenue > 0 ? `₹${(tenant.monthlyRevenue / 1000).toFixed(0)}K` : '—', icon: <DollarSign className="w-4 h-4" />, color: 'text-emerald-600' },
                { label: 'Storage Used', value: `${tenant.storageUsedGB}/${tenant.storageCapGB} GB`, icon: <HardDrive className="w-4 h-4" />, color: 'text-violet-600' },
                { label: 'Last Login', value: tenant.lastLoginAt, icon: <Activity className="w-4 h-4" />, color: 'text-orange-600' },
              ].map(s => (
                <div key={s.label} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
                  <div className={`${s.color} mb-1`}>{s.icon}</div>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">{s.value}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Storage Bar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-600 dark:text-slate-400">Storage Usage</span>
                <span className={`font-extrabold ${storagePercent > 80 ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'}`}>{storagePercent}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${storagePercent > 80 ? 'bg-rose-500' : storagePercent > 60 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                  style={{ width: `${storagePercent}%` }}
                />
              </div>
            </div>

            {/* Plan Control */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Change Subscription Plan</h4>
              <div className="grid grid-cols-2 gap-2">
                {(['FREE', 'STARTER', 'PRO', 'ENTERPRISE'] as TenantPlan[]).map(plan => (
                  <button
                    key={plan}
                    onClick={() => onPlanChange(tenant.id, plan)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition border ${
                      tenant.plan === plan
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
                    }`}
                  >
                    {plan}
                    {tenant.plan === plan && <Check className="w-3 h-3 inline ml-1" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Account Status Control */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Account Status Control</h4>
              <div className="flex flex-wrap gap-2">
                {(['ACTIVE', 'SUSPENDED', 'TRIAL', 'EXPIRED', 'CANCELLED'] as TenantStatus[]).map(status => (
                  <button
                    key={status}
                    onClick={() => onStatusChange(tenant.id, status)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
                      tenant.status === status
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {status}
                    {tenant.status === status && <Check className="w-2.5 h-2.5 inline ml-1" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Module Access Summary */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Module Access</h4>
                <button
                  onClick={() => setShowModuleModal(true)}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  Manage
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {enabledModules.map(m => (
                  <span key={m.key} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800/60">
                    {m.icon}
                    {m.label}
                  </span>
                ))}
                {ALL_MODULES.filter(m => !tenant.modules[m.key]).map(m => (
                  <span key={m.key} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-semibold line-through">
                    {m.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  addToast({
                    title: 'Welcome Email Sent',
                    description: `Credentials and setup instructions sent to ${tenant.ownerEmail}.`,
                    type: 'success',
                  });
                }}
                className="flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition hover:opacity-80 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
              >
                <Mail className="w-4 h-4" />
                Send Email
              </button>
              <button
                onClick={() => {
                  onImpersonate(tenant.id);
                  onClose();
                }}
                className="flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition hover:opacity-80 bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800"
              >
                <Eye className="w-4 h-4" />
                Impersonate
              </button>
              <button
                onClick={() => {
                  addToast({
                    title: 'Security Link Sent',
                    description: `Password reset token dispatched to ${tenant.ownerEmail}.`,
                    type: 'warning',
                  });
                }}
                className="flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition hover:opacity-80 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
              >
                <Lock className="w-4 h-4" />
                Reset Password
              </button>
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete ${tenant.companyName}? All workspace data will be removed.`)) {
                    onDelete(tenant.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition hover:opacity-80 bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
              >
                <Trash2 className="w-4 h-4" />
                Delete Tenant
              </button>
            </div>

            {/* Billing Info */}
            {(tenant.nextBillingDate || tenant.trialEndsAt) && (
              <div className={`rounded-xl p-3 flex items-center gap-3 text-xs font-semibold ${
                tenant.status === 'TRIAL'
                  ? 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800'
                  : tenant.status === 'SUSPENDED'
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}>
                <CreditCard className="w-4 h-4 shrink-0" />
                {tenant.status === 'TRIAL'
                  ? `Trial ends: ${tenant.trialEndsAt}`
                  : `Next billing: ${tenant.nextBillingDate}`}
              </div>
            )}
          </div>
        </div>
      </div>

      {showModuleModal && (
        <ModuleModal
          tenant={tenant}
          onClose={() => setShowModuleModal(false)}
          onSave={(modules) => onModuleChange(tenant.id, modules)}
        />
      )}
    </>
  );
};

// ── Main Panel ─────────────────────────────────────────────────────────────────

export const PlatformSuperAdminPanel: React.FC = () => {
  const {
    tenants,
    updateTenantModules,
    updateTenantStatus,
    updateTenantPlan,
    addTenant,
    deleteTenant,
    impersonateTenant,
    addToast
  } = useOfficeOS();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TenantStatus | 'ALL'>('ALL');
  const [planFilter, setPlanFilter] = useState<TenantPlan | 'ALL'>('ALL');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'tenants' | 'overview' | 'system'>('tenants');

  // Computed Stats
  const activeCount    = tenants.filter(t => t.status === 'ACTIVE').length;
  const trialCount     = tenants.filter(t => t.status === 'TRIAL').length;
  const suspendedCount = tenants.filter(t => t.status === 'SUSPENDED').length;
  const totalRevenue   = tenants.reduce((s, t) => s + t.monthlyRevenue, 0);
  const totalEmployees = tenants.reduce((s, t) => s + t.employeeCount, 0);

  const filteredTenants = tenants.filter(t => {
    const matchSearch = !search ||
      t.companyName.toLowerCase().includes(search.toLowerCase()) ||
      t.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      t.ownerEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchPlan   = planFilter   === 'ALL' || t.plan   === planFilter;
    return matchSearch && matchStatus && matchPlan;
  });

  const handleModuleChange = (id: string, modules: Record<string, boolean>) => {
    updateTenantModules(id, modules);
    if (selectedTenant?.id === id) {
      setSelectedTenant(prev => prev ? { ...prev, modules } : prev);
    }
  };

  const handleStatusChange = (id: string, status: TenantStatus) => {
    updateTenantStatus(id, status);
    if (selectedTenant?.id === id) {
      setSelectedTenant(prev => prev ? { ...prev, status } : prev);
    }
  };

  const handlePlanChange = (id: string, plan: TenantPlan) => {
    updateTenantPlan(id, plan);
    if (selectedTenant?.id === id) {
      setSelectedTenant(prev => prev ? { ...prev, plan } : prev);
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tenants, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `saas-tenants-export-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast({
      title: 'Tenants Exported',
      description: 'Downloaded saas-tenants-export.json successfully.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Platform Super Admin
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage all business tenants, subscriptions, module access & system health
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Export Data
          </button>
          <button
            onClick={() => setShowAddTenantModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            Add Tenant
          </button>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'tenants',  label: 'Tenants',         icon: <Building2 className="w-3.5 h-3.5" /> },
          { id: 'overview', label: 'Platform Stats',   icon: <BarChart3 className="w-3.5 h-3.5" /> },
          { id: 'system',   label: 'System Health',    icon: <Server className="w-3.5 h-3.5" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition -mb-px ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: TENANTS ── */}
      {activeTab === 'tenants' && (
        <div className="space-y-5">

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <StatCard icon={<Building2 className="w-5 h-5 text-indigo-600" />}   label="Total Tenants"    value={String(tenants.length)}   color="bg-indigo-50 dark:bg-indigo-950" />
            <StatCard icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />} label="Active"          value={String(activeCount)}      color="bg-emerald-50 dark:bg-emerald-950" trend="+2 this week" />
            <StatCard icon={<Clock className="w-5 h-5 text-violet-600" />}        label="On Trial"         value={String(trialCount)}       color="bg-violet-50 dark:bg-violet-950" />
            <StatCard icon={<Ban className="w-5 h-5 text-rose-600" />}            label="Suspended"        value={String(suspendedCount)}   color="bg-rose-50 dark:bg-rose-950" />
            <StatCard icon={<DollarSign className="w-5 h-5 text-amber-600" />}    label="Monthly Revenue"  value={`₹${(totalRevenue/1000).toFixed(0)}K`} sub={`${totalEmployees} total users`} color="bg-amber-50 dark:bg-amber-950" />
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search company, owner, email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as TenantStatus | 'ALL')}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="TRIAL">Trial</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="EXPIRED">Expired</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <select
                value={planFilter}
                onChange={e => setPlanFilter(e.target.value as TenantPlan | 'ALL')}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Plans</option>
                <option value="FREE">Free</option>
                <option value="STARTER">Starter</option>
                <option value="PRO">Pro</option>
                <option value="ENTERPRISE">Enterprise</option>
              </select>
              <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">
                {filteredTenants.length} result{filteredTenants.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Tenants Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <tr className="text-slate-400 uppercase font-bold tracking-wide">
                    <th className="py-3.5 px-4">Company</th>
                    <th className="py-3.5 px-4">Plan</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-center">Users</th>
                    <th className="py-3.5 px-4">Modules</th>
                    <th className="py-3.5 px-4">Revenue/mo</th>
                    <th className="py-3.5 px-4">Last Active</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredTenants.map(tenant => {
                    const enabledCount = Object.values(tenant.modules).filter(Boolean).length;
                    return (
                      <tr
                        key={tenant.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition cursor-pointer"
                        onClick={() => setSelectedTenant(tenant)}
                      >
                        {/* Company */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-extrabold flex items-center justify-center text-sm shrink-0">
                              {tenant.companyName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">{tenant.companyName}</div>
                              <div className="text-slate-400 text-[11px]">{tenant.ownerName} · {tenant.location}</div>
                            </div>
                          </div>
                        </td>

                        {/* Plan */}
                        <td className="py-4 px-4">
                          <PlanBadge plan={tenant.plan} />
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <StatusBadge status={tenant.status} />
                          {tenant.status === 'TRIAL' && tenant.trialEndsAt && (
                            <div className="text-[10px] text-violet-500 mt-0.5">Ends {tenant.trialEndsAt}</div>
                          )}
                        </td>

                        {/* Users */}
                        <td className="py-4 px-4 text-center">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{tenant.employeeCount}</span>
                        </td>

                        {/* Modules */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5">
                            <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden max-w-[60px]">
                              <div
                                className="h-full bg-indigo-500 rounded-full"
                                style={{ width: `${(enabledCount / ALL_MODULES.length) * 100}%` }}
                              />
                            </div>
                            <span className="text-slate-500 font-semibold">{enabledCount}/{ALL_MODULES.length}</span>
                          </div>
                        </td>

                        {/* Revenue */}
                        <td className="py-4 px-4 font-bold">
                          {tenant.monthlyRevenue > 0
                            ? <span className="text-emerald-600 dark:text-emerald-400">₹{(tenant.monthlyRevenue/1000).toFixed(0)}K</span>
                            : <span className="text-slate-400">—</span>}
                        </td>

                        {/* Last Active */}
                        <td className="py-4 px-4 text-slate-500">{tenant.lastLoginAt}</td>

                        {/* Actions */}
                        <td className="py-4 px-4" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => impersonateTenant(tenant.id)}
                              className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950 rounded-lg transition"
                              title="Impersonate Tenant (Login as Company)"
                            >
                              <LogIn className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setSelectedTenant(tenant)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-lg transition"
                              title="View Details & Modules"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(tenant.id, tenant.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')}
                              className={`p-1.5 rounded-lg transition ${
                                tenant.status === 'ACTIVE'
                                  ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950'
                                  : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950'
                              }`}
                              title={tenant.status === 'ACTIVE' ? 'Suspend Account' : 'Reactivate Account'}
                            >
                              {tenant.status === 'ACTIVE' ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredTenants.length === 0 && (
                <div className="text-center py-16 text-slate-400">
                  <Building className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm font-semibold">No tenants found</p>
                  <p className="text-xs mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: PLATFORM STATS ── */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={<DollarSign className="w-5 h-5 text-emerald-600" />} label="MRR" value={`₹${(totalRevenue/1000).toFixed(0)}K`} sub="Monthly Recurring Revenue" color="bg-emerald-50 dark:bg-emerald-950" trend="+18% this month" />
            <StatCard icon={<Building2 className="w-5 h-5 text-indigo-600" />}   label="Total Businesses" value={String(tenants.length)} sub="Across all plans" color="bg-indigo-50 dark:bg-indigo-950" />
            <StatCard icon={<Users className="w-5 h-5 text-violet-600" />}        label="Total Users" value={String(totalEmployees)} sub="Across all tenants" color="bg-violet-50 dark:bg-violet-950" />
            <StatCard icon={<Star className="w-5 h-5 text-amber-600" />}          label="Paid Tenants" value={String(tenants.filter(t => t.plan !== 'FREE' && t.monthlyRevenue > 0).length)} sub="Converted from trial" color="bg-amber-50 dark:bg-amber-950" />
          </div>

          {/* Plan Distribution */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-4">Plan Distribution</h3>
            <div className="space-y-3">
              {(['ENTERPRISE', 'PRO', 'STARTER', 'FREE'] as TenantPlan[]).map(plan => {
                const count = tenants.filter(t => t.plan === plan).length;
                const pct = Math.round((count / tenants.length) * 100);
                const colors: Record<TenantPlan, string> = {
                  ENTERPRISE: 'bg-amber-500',
                  PRO:        'bg-violet-500',
                  STARTER:    'bg-blue-500',
                  FREE:       'bg-slate-300 dark:bg-slate-600',
                };
                return (
                  <div key={plan} className="flex items-center gap-3">
                    <span className="w-20 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase text-right">{plan}</span>
                    <div className="flex-1 h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className={`h-full rounded-full ${colors[plan]} transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 w-12">{count} ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: SYSTEM HEALTH ── */}
      {activeTab === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'API Gateway', status: 'Operational', icon: <Globe className="w-5 h-5" />, latency: '42ms', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950' },
            { label: 'Database Cluster', status: 'Operational', icon: <Database className="w-5 h-5" />, latency: '8ms', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950' },
            { label: 'File Storage', status: 'Operational', icon: <HardDrive className="w-5 h-5" />, latency: '120ms', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950' },
            { label: 'Email Service', status: 'Degraded', icon: <Mail className="w-5 h-5" />, latency: '1200ms', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950' },
            { label: 'AI Module (GPT)', status: 'Operational', icon: <Zap className="w-5 h-5" />, latency: '600ms', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950' },
            { label: 'WebSocket Server', status: 'Operational', icon: <Wifi className="w-5 h-5" />, latency: '5ms', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950' },
            { label: 'Auth Service', status: 'Operational', icon: <Shield className="w-5 h-5" />, latency: '22ms', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950' },
            { label: 'CPU Usage', status: '34%', icon: <Cpu className="w-5 h-5" />, latency: '', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950' },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${s.bg} ${s.color}`}>{s.icon}</div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{s.label}</p>
                  <p className={`text-xs font-semibold ${s.color}`}>{s.status}</p>
                </div>
              </div>
              {s.latency && (
                <span className="text-xs font-extrabold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                  {s.latency}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Tenant Detail Slide-over Panel ── */}
      {selectedTenant && (
        <TenantDetailPanel
          tenant={selectedTenant}
          onClose={() => setSelectedTenant(null)}
          onModuleChange={handleModuleChange}
          onStatusChange={handleStatusChange}
          onPlanChange={handlePlanChange}
          onImpersonate={impersonateTenant}
          onDelete={deleteTenant}
          addToast={addToast}
        />
      )}

      {/* ── Add Tenant Modal ── */}
      {showAddTenantModal && (
        <AddTenantModal
          onClose={() => setShowAddTenantModal(false)}
          onAdd={addTenant}
        />
      )}
    </div>
  );
};
