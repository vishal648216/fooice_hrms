'use client';

import React, { useState } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { EXTENDED_CLIENTS, ExtendedClientItem } from '@/lib/clients-data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Building2, 
  Plus, 
  Search, 
  ExternalLink, 
  DollarSign, 
  FolderGit2, 
  ShieldCheck, 
  Clock, 
  Phone, 
  Mail, 
  UserCheck, 
  TrendingUp, 
  FileText, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const ClientsListView: React.FC = () => {
  const { setActivePath, addToast } = useOfficeOS();
  const [clients, setClients] = useState<ExtendedClientItem[]>(EXTENDED_CLIENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('ALL');
  const [showOnboardModal, setShowOnboardModal] = useState(false);

  // New Client Form State
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newContactPerson, setNewContactPerson] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newIndustry, setNewIndustry] = useState('Fintech & Banking');
  const [newContractValue, setNewContractValue] = useState(250000);
  const [newSlaTier, setNewSlaTier] = useState<'ENTERPRISE_24_7' | 'PREMIUM_SLA' | 'STANDARD'>('ENTERPRISE_24_7');

  const filteredClients = clients.filter(c => {
    const matchesIndustry = selectedIndustry === 'ALL' || c.industry.toLowerCase().includes(selectedIndustry.toLowerCase());
    const matchesQuery = c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIndustry && matchesQuery;
  });

  // Summary KPIs
  const totalContractValue = clients.reduce((acc, c) => acc + c.contractValue, 0);
  const totalReceived = clients.reduce((acc, c) => acc + c.totalSpent, 0);
  const totalPendingInvoices = clients.reduce((acc, c) => acc + c.pendingInvoices, 0);
  const activeProjectsCount = clients.reduce((acc, c) => acc + c.activeProjects, 0);

  const handleOnboardClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim() || !newEmail.trim() || !newContactPerson.trim()) return;

    const newCli: ExtendedClientItem = {
      id: `cli-${Date.now()}`,
      companyName: newCompanyName,
      contactPerson: newContactPerson,
      email: newEmail,
      phone: newPhone || '+1 (555) 019-2834',
      industry: newIndustry,
      activeProjects: 1,
      activeProjectNames: [`${newCompanyName} Digital Transformation Phase 1`],
      totalSpent: 0,
      contractValue: Number(newContractValue),
      pendingInvoices: 0,
      status: 'ACTIVE',
      slaTier: newSlaTier,
      msaStatus: 'ACTIVE_SIGNED',
      ndaStatus: 'SIGNED',
      contractStartDate: new Date().toISOString().split('T')[0],
      contractRenewalDate: new Date(Date.now() + 86400000 * 365).toISOString().split('T')[0],
      healthScore: 'EXCELLENT',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      assignedAccountManager: {
        name: 'Alexander Vance',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        email: 'alexander@apextech.com',
        role: 'Chief Executive Officer',
      },
      keyStakeholders: [
        { name: newContactPerson, role: 'Executive Sponsor', email: newEmail, phone: newPhone, isPrimary: true }
      ]
    };

    setClients(prev => [newCli, ...prev]);
    setShowOnboardModal(false);
    setNewCompanyName('');
    setNewContactPerson('');
    setNewEmail('');
    addToast({
      title: 'Client Onboarded',
      description: `Created enterprise client account for ${newCli.companyName}`,
      type: 'success'
    });
  };

  const slaBadges = {
    ENTERPRISE_24_7: { bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-800', label: 'Enterprise 24/7 SLA' },
    PREMIUM_SLA: { bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-800', label: 'Premium 4h SLA' },
    STANDARD: { bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-800', label: 'Standard Business SLA' }
  };

  const healthColors = {
    EXCELLENT: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
    GOOD: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
    AT_RISK: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
  };

  return (
    <div className="space-y-6">
      {/* Executive Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-slate-900 border-indigo-100 dark:border-indigo-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Contract Portfolio</span>
            <div className="p-2 rounded-xl bg-indigo-600/10 text-indigo-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white">
            ${totalContractValue.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Across {clients.length} active enterprise client accounts
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-900 border-emerald-100 dark:border-emerald-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Revenue Recognized</span>
            <div className="p-2 rounded-xl bg-emerald-600/10 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            ${totalReceived.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-emerald-600 font-medium">
            {Math.round((totalReceived / totalContractValue) * 100)}% lifetime contract billing fulfilled
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-50/50 to-white dark:from-amber-950/20 dark:to-slate-900 border-amber-100 dark:border-amber-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Invoices</span>
            <div className="p-2 rounded-xl bg-amber-600/10 text-amber-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
            ${totalPendingInvoices.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Net 30 wire transfer cycles
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50/50 to-white dark:from-purple-950/20 dark:to-slate-900 border-purple-100 dark:border-purple-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Delivery SOWs</span>
            <div className="p-2 rounded-xl bg-purple-600/10 text-purple-600">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {activeProjectsCount} Live Projects
          </div>
          <div className="mt-1 text-xs text-purple-600 font-medium">
            100% active signed MSAs & NDAs
          </div>
        </Card>
      </div>

      {/* Control Bar: Filters & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search clients, sponsors, industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Industries</option>
            <option value="Fintech">Fintech & Banking</option>
            <option value="Healthcare">Healthcare & Clinical</option>
            <option value="Supply Chain">Supply Chain & Logistics</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActivePath('/client-portal')}
            leftIcon={<ExternalLink className="w-4 h-4" />}
          >
            Preview Client Portal
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowOnboardModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Onboard Enterprise Client
          </Button>
        </div>
      </div>

      {/* Client Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredClients.map((client) => {
          const slaConfig = slaBadges[client.slaTier] || slaBadges.ENTERPRISE_24_7;
          const healthStyle = healthColors[client.healthScore] || healthColors.EXCELLENT;

          return (
            <Card
              key={client.id}
              hoverable
              className="p-5 flex flex-col justify-between space-y-4 border border-slate-200 dark:border-slate-800"
            >
              {/* Header Info */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={client.avatar}
                      alt={client.companyName}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-sm"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {client.companyName}
                      </h3>
                      <div className="text-xs text-slate-400 font-medium">
                        {client.industry}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${healthStyle}`}>
                    ● {client.healthScore} HEALTH
                  </span>
                </div>

                {/* Primary Contact & SLA */}
                <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="space-y-0.5">
                    <span className="text-slate-400 text-[11px]">Primary Sponsor:</span>
                    <div className="font-bold text-slate-900 dark:text-white truncate">
                      {client.contactPerson}
                    </div>
                    <div className="text-[11px] text-indigo-600 dark:text-indigo-400 truncate flex items-center gap-1">
                      <Mail className="w-3 h-3 shrink-0" /> {client.email}
                    </div>
                  </div>

                  <div className="space-y-0.5 text-right">
                    <span className="text-slate-400 text-[11px]">SLA Agreement:</span>
                    <div className="pt-0.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${slaConfig.bg}`}>
                        {slaConfig.label}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 pt-0.5 font-mono">
                      MSA: {client.msaStatus}
                    </div>
                  </div>
                </div>

                {/* Financial Ledger & Projects */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Contract Lifetime Value:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      ${client.contractValue.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Total Billed & Paid:</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ${client.totalSpent.toLocaleString()}
                    </span>
                  </div>

                  {client.pendingInvoices > 0 ? (
                    <div className="flex items-center justify-between text-amber-600 font-semibold">
                      <span>Outstanding Invoices:</span>
                      <span className="font-mono font-bold">${client.pendingInvoices.toLocaleString()}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-emerald-600 text-[11px]">
                      <span>Invoicing Status:</span>
                      <span className="font-medium">All Invoices Cleared ✓</span>
                    </div>
                  )}

                  {/* Active Projects List */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Active Engagements ({client.activeProjects})
                    </span>
                    <div className="mt-1 space-y-1">
                      {client.activeProjectNames.map((pName, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                          <FolderGit2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span className="font-medium truncate">{pName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Lead: <strong className="text-slate-700 dark:text-slate-300">{client.assignedAccountManager.name}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setActivePath('/client-portal');
                      addToast({ title: 'Client Workspace', description: `Opened ${client.companyName} portal.`, type: 'info' });
                    }}
                  >
                    Open Portal View
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Onboard Enterprise Client Modal */}
      {showOnboardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-600 text-white">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Onboard Enterprise Client Account</h3>
              </div>
              <button
                onClick={() => setShowOnboardModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleOnboardClient} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Company Legal Entity *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Global Logistics Corp"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Primary Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marcus Sterling"
                    value={newContactPerson}
                    onChange={(e) => setNewContactPerson(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Industry Domain</label>
                  <select
                    value={newIndustry}
                    onChange={(e) => setNewIndustry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option>Fintech & Banking</option>
                    <option>Healthcare & Telemedicine</option>
                    <option>Supply Chain & Logistics</option>
                    <option>E-Commerce & Retail</option>
                    <option>Cybersecurity & IAM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="marcus@client.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 019-2834"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Contract Value ($ USD)</label>
                  <input
                    type="number"
                    min="10000"
                    step="5000"
                    value={newContractValue}
                    onChange={(e) => setNewContractValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">SLA Agreement Tier</label>
                  <select
                    value={newSlaTier}
                    onChange={(e) => setNewSlaTier(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="ENTERPRISE_24_7">Enterprise 24/7 SLA</option>
                    <option value="PREMIUM_SLA">Premium 4h SLA</option>
                    <option value="STANDARD">Standard Business SLA</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowOnboardModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Onboard Client & Generate Portal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
