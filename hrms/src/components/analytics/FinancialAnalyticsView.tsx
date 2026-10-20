'use client';

import React from 'react';
import { MONTHLY_TRENDS_2026 } from '@/lib/analytics-data';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  ShieldCheck, 
  CreditCard, 
  Wallet, 
  Receipt, 
  ArrowUpRight, 
  Building2 
} from 'lucide-react';

export const FinancialAnalyticsView: React.FC = () => {
  const clientRevenueShares = [
    { name: 'Nova Capital Partners', sharePercent: 38, revenue: '₹42.50L', color: '#6366f1' },
    { name: 'Apex BioHealth Systems', sharePercent: 26, revenue: '₹29.10L', color: '#06b6d4' },
    { name: 'LogiGlobal Supply Chain', sharePercent: 18, revenue: '₹20.15L', color: '#10b981' },
    { name: 'TechNova FinTech Labs', sharePercent: 12, revenue: '₹13.40L', color: '#f59e0b' },
    { name: 'Others & Retainers', sharePercent: 6, revenue: '₹6.70L', color: '#a855f7' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Financial Health KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card className="p-4 border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total YTD Inward Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            ₹104.70L
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +22.4% YoY Growth
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-indigo-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Net Profit Realized</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            ₹51.70L
          </div>
          <div className="mt-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
            49.4% Blended Margin
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-cyan-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Monthly Burn Rate</span>
            <Wallet className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            ₹6.80L
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Payroll + Cloud Infra + Tools
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Corporate Runway</span>
            <ShieldCheck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-purple-600 dark:text-purple-400 tracking-tight">
            32.4 Months
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            Zero Debt • Zero Risk
          </div>
        </Card>

      </div>

      {/* Revenue Distribution & Client Concentration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Client Concentration Risk Analysis */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-indigo-500" />
                Client Revenue Concentration Share
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Diversification analysis across top corporate enterprise contracts
              </p>
            </div>
            <Badge variant="success" size="sm">Healthy Spread</Badge>
          </div>

          <div className="space-y-3 pt-1">
            {clientRevenueShares.map((client) => (
              <div key={client.name} className="space-y-1.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: client.color }} />
                    <span className="font-bold text-slate-900 dark:text-slate-100">{client.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-slate-900 dark:text-white">{client.revenue}</span>
                    <span className="text-slate-400">({client.sharePercent}%)</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${client.sharePercent}%`, backgroundColor: client.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Profitability & Margin Waterfall */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-500" />
                Inward Billings vs Cost Centers Breakdown
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Where organizational budget is allocated vs net return
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { label: 'Total Inward Retainer & Milestone Collections', amount: '₹104.70L', type: 'INCOME', percent: 100, color: '#10b981' },
              { label: 'Engineering & Staff Salaries (Direct Labor)', amount: '₹34.80L', type: 'EXPENSE', percent: 33.2, color: '#f43f5e' },
              { label: 'Cloud Infrastructure, AWS & SaaS Tools', amount: '₹8.40L', type: 'EXPENSE', percent: 8.0, color: '#f59e0b' },
              { label: 'Office Lease, Facilities & Administrative', amount: '₹5.60L', type: 'EXPENSE', percent: 5.3, color: '#06b6d4' },
              { label: 'Legal, Compliance, Audits & Taxes', amount: '₹4.20L', type: 'EXPENSE', percent: 4.0, color: '#a855f7' },
              { label: 'Net Retained Enterprise Earnings', amount: '₹51.70L', type: 'PROFIT', percent: 49.4, color: '#6366f1' },
            ].map((item) => (
              <div
                key={item.label}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  item.type === 'PROFIT'
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 font-bold'
                    : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-900 dark:text-slate-100">{item.label}</span>
                </div>
                <div className="font-mono font-bold text-right">
                  <span className={item.type === 'EXPENSE' ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}>
                    {item.type === 'EXPENSE' ? '-' : '+'}{item.amount}
                  </span>
                  <div className="text-[10px] text-slate-400 font-normal">{item.percent}% of gross</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

    </div>
  );
};
