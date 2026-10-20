'use client';

import React, { useState } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { NAVIGATION_CATEGORIES } from '@/lib/officeos-data';
import { 
  LayoutDashboard, 
  CheckSquare, 
  ListTodo, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Users, 
  Video, 
  PenTool, 
  Fingerprint, 
  CalendarOff, 
  UserCheck, 
  Network, 
  Palmtree, 
  FolderGit2, 
  Kanban, 
  GitCommit, 
  Flag, 
  FileCheck, 
  GitPullRequest, 
  Building2, 
  ExternalLink, 
  FileBadge, 
  LifeBuoy, 
  CreditCard, 
  Receipt, 
  Wallet, 
  PieChart, 
  HardDrive, 
  FileText, 
  BookOpen, 
  BarChart3, 
  LineChart, 
  Activity, 
  DollarSign, 
  TrendingUp, 
  Sparkles, 
  BrainCircuit, 
  GitBranch, 
  GitFork, 
  Plug, 
  ShieldAlert, 
  Key, 
  Building, 
  Laptop, 
  AlertTriangle, 
  ScrollText, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  X, 
  LogOut, 
  ShieldCheck, 
  Briefcase, 
  User as UserIcon, 
  Layers,
  Search,
  Crown
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Crown: <Crown className="w-4 h-4 text-amber-500" />,
  LayoutDashboard: <LayoutDashboard className="w-4 h-4" />,
  CheckSquare: <CheckSquare className="w-4 h-4" />,
  ListTodo: <ListTodo className="w-4 h-4" />,
  Calendar: <Calendar className="w-4 h-4" />,
  Clock: <Clock className="w-4 h-4" />,
  MessageSquare: <MessageSquare className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  Video: <Video className="w-4 h-4" />,
  PenTool: <PenTool className="w-4 h-4" />,
  Fingerprint: <Fingerprint className="w-4 h-4" />,
  CalendarOff: <CalendarOff className="w-4 h-4" />,
  UserCheck: <UserCheck className="w-4 h-4" />,
  Network: <Network className="w-4 h-4" />,
  Palmtree: <Palmtree className="w-4 h-4" />,
  FolderGit2: <FolderGit2 className="w-4 h-4" />,
  Kanban: <Kanban className="w-4 h-4" />,
  GitCommit: <GitCommit className="w-4 h-4" />,
  Flag: <Flag className="w-4 h-4" />,
  FileCheck: <FileCheck className="w-4 h-4" />,
  GitPullRequest: <GitPullRequest className="w-4 h-4" />,
  Building2: <Building2 className="w-4 h-4" />,
  ExternalLink: <ExternalLink className="w-4 h-4" />,
  FileBadge: <FileBadge className="w-4 h-4" />,
  LifeBuoy: <LifeBuoy className="w-4 h-4" />,
  CreditCard: <CreditCard className="w-4 h-4" />,
  Receipt: <Receipt className="w-4 h-4" />,
  Wallet: <Wallet className="w-4 h-4" />,
  PieChart: <PieChart className="w-4 h-4" />,
  HardDrive: <HardDrive className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
  BarChart3: <BarChart3 className="w-4 h-4" />,
  LineChart: <LineChart className="w-4 h-4" />,
  Activity: <Activity className="w-4 h-4" />,
  DollarSign: <DollarSign className="w-4 h-4" />,
  TrendingUp: <TrendingUp className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  BrainCircuit: <BrainCircuit className="w-4 h-4" />,
  GitBranch: <GitBranch className="w-4 h-4" />,
  GitFork: <GitFork className="w-4 h-4" />,
  Plug: <Plug className="w-4 h-4" />,
  ShieldAlert: <ShieldAlert className="w-4 h-4" />,
  Key: <Key className="w-4 h-4" />,
  Building: <Building className="w-4 h-4" />,
  Laptop: <Laptop className="w-4 h-4" />,
  AlertTriangle: <AlertTriangle className="w-4 h-4" />,
  ScrollText: <ScrollText className="w-4 h-4" />,
  Settings: <Settings className="w-4 h-4" />,
};

export const Sidebar: React.FC = () => {
  const { 
    currentRole, 
    currentUser, 
    currentWorkspace, 
    activePath, 
    setActivePath, 
    isMobileSidebarOpen, 
    setMobileSidebarOpen,
    hasPermission,
    isModuleEnabled,
    impersonatedRole,
    isImpersonatingTenant,
    currentTenant,
    logout
  } = useOfficeOS();

  // Search inside sidebar to find menus instantly
  const [menuSearch, setMenuSearch] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (catId: string) => {
    setCollapsedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const badgeStyles = {
    primary: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    danger: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    neutral: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  };

  const rolePillStyles = {
    SUPER_ADMIN: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
    MANAGER: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    EMPLOYEE: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    HR: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
    CLIENT: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 select-none transition-colors">
      
      {/* Workspace Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3 truncate">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-slate-900 text-white font-extrabold flex items-center justify-center shadow-md shadow-indigo-600/20 text-sm shrink-0">
            {currentWorkspace.logo}
          </div>
          <div className="truncate text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight truncate">
                OfficeOS
              </span>
              <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {currentWorkspace.plan}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {currentWorkspace.name}
            </div>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Menu Filter (Helpful when Super Admin has many menus) */}
      <div className="px-3 pt-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter menu..."
            value={menuSearch}
            onChange={(e) => setMenuSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Main Navigation Scroll Area with RBAC Dynamic Filtering */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {NAVIGATION_CATEGORIES.map((cat) => {
          // Dynamic RBAC Permission Check + Tenant Module Subscription Check
          const effectiveRole = impersonatedRole || currentRole;
          const visibleItems = cat.items.filter((item) => {
            const matchesSearch = !menuSearch || item.label.toLowerCase().includes(menuSearch.toLowerCase());
            const hasAccess = hasPermission(item.permissionKey);
            const matchesRole = !item.allowedRoles || item.allowedRoles.includes(effectiveRole);
            const isSubscribed = isModuleEnabled(item.moduleKey || cat.moduleKey);
            return matchesSearch && hasAccess && matchesRole && isSubscribed;
          });

          if (visibleItems.length === 0) return null;

          const isCollapsed = collapsedCategories[cat.id];

          return (
            <div key={cat.id} className="space-y-1">
              {/* Category Header with Toggle */}
              {cat.id !== 'overview' && (
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center justify-between px-2.5 py-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hover:text-slate-800 dark:hover:text-slate-200 transition"
                >
                  <span>{cat.title}</span>
                  {isCollapsed ? (
                    <ChevronRight className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>
              )}

              {/* Category Items */}
              {!isCollapsed && (
                <div className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const isActive = activePath === item.path;
                    const icon = iconMap[item.iconName] || <Layers className="w-4 h-4" />;
                    const badgeClass = item.badgeVariant ? badgeStyles[item.badgeVariant] : badgeStyles.primary;

                    return (
                      <button
                        key={item.id}
                        onClick={() => setActivePath(item.path)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                          isActive
                            ? 'bg-indigo-600 text-white font-semibold shadow-xs shadow-indigo-600/30'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'} shrink-0 transition-colors`}>
                            {icon}
                          </span>
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.badge && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ml-1.5 ${
                            isActive ? 'bg-white/20 text-white' : badgeClass
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Profile Bar */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70">
        <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-800/80 transition">
          
          <div className="flex items-center gap-2.5 truncate">
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>

            <div className="truncate text-left">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {currentUser.name}
              </div>
              <div className="text-[10px] truncate mt-0.5">
                <span className={`font-extrabold uppercase px-1.5 py-0.2 rounded ${rolePillStyles[currentRole]}`}>
                  {currentRole.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {currentRole === 'SUPER_ADMIN' && (
              <button
                onClick={() => setActivePath('/admin/roles')}
                title="Manage RBAC Permissions"
                className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950 transition"
              >
                <Key className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={logout}
              title="Sign Out / Switch Role Portal"
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/60 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
