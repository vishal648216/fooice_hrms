'use client';

import React, { useState } from 'react';
import { 
  IndianRupee, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  Download, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { FINANCIAL_OVERVIEW_DATA } from '@/lib/boss-dashboard-data';

interface FinancialSectionProps {
  onNewInvoice?: () => void;
  onExportReport?: () => void;
}

export const FinancialSection: React.FC<FinancialSectionProps> = ({
  onNewInvoice,
  onExportReport,
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '3m' | '6m' | '1y'>('3m');

  const maxVal = Math.max(
    ...FINANCIAL_OVERVIEW_DATA.monthlyRevenue.map((d) => Math.max(d.received, d.target))
  );

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">Financial Overview &amp; Cash Flow</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                INR (₹) Corporate Books
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live collection rate, milestone invoicing, and overdue accounts receivable
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range switcher */}
          <div className="flex items-center bg-slate-800/90 rounded-lg p-1 border border-slate-700/80 text-xs">
            {(['7d', '30d', '3m', '6m', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={onNewInvoice}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Project Value */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800/90 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Project Value</span>
            <span className="p-1 rounded bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold text-white tracking-tight">
              {FINANCIAL_OVERVIEW_DATA.totalProjectValue}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <span className="text-indigo-400 font-semibold">12 active client contracts</span>
          </div>
        </div>

        {/* Received */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800/90 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Collected Revenue</span>
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold text-emerald-400 tracking-tight">
              {FINANCIAL_OVERVIEW_DATA.received}
            </span>
          </div>
          <div className="text-[11px] text-emerald-400/90 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>66% collected to date</span>
          </div>
        </div>

        {/* Pending */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800/90 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pending Receivables</span>
            <span className="p-1 rounded bg-amber-500/10 text-amber-400">
              <Clock className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold text-amber-400 tracking-tight">
              {FINANCIAL_OVERVIEW_DATA.pending}
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Awaiting upcoming milestone approvals
          </div>
        </div>

        {/* Overdue */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800/90 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Overdue Amount</span>
            <span className="p-1 rounded bg-rose-500/10 text-rose-400">
              <AlertCircle className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold text-rose-400 tracking-tight">
              {FINANCIAL_OVERVIEW_DATA.overdue}
            </span>
          </div>
          <div className="text-[11px] text-rose-400 flex items-center gap-1">
            <span>1 invoice past 15 days</span>
          </div>
        </div>
      </div>

      {/* Monthly Inward Cashflow Trend Chart */}
      <div className="p-5 rounded-xl bg-slate-800/30 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-white">Monthly Cashflow Collection vs Target</h4>
            <p className="text-xs text-slate-400 mt-0.5">Month-by-month inward client payments (in ₹ Lakhs)</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-3 rounded bg-emerald-500"></span>
              <span>Received</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-3 rounded bg-indigo-500/50"></span>
              <span>Target</span>
            </div>
          </div>
        </div>

        {/* Custom Bar Visualization */}
        <div className="h-48 flex items-end justify-between gap-4 pt-4 pb-2 border-b border-slate-800">
          {FINANCIAL_OVERVIEW_DATA.monthlyRevenue.map((item) => {
            const receivedPct = Math.round((item.received / maxVal) * 100);
            const targetPct = Math.round((item.target / maxVal) * 100);

            return (
              <div key={item.month} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1.5 h-full max-w-[48px]">
                  {/* Received Bar */}
                  <div
                    className="w-1/2 bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t transition-all group-hover:brightness-110 relative"
                    style={{ height: `${receivedPct}%` }}
                    title={`Received: ₹${(item.received / 100000).toFixed(2)} Lakhs`}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-950 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap transition-opacity border border-emerald-500/30 z-10">
                      ₹{(item.received / 100000).toFixed(1)}L
                    </div>
                  </div>

                  {/* Target Bar */}
                  <div
                    className="w-1/2 bg-indigo-500/40 rounded-t transition-all group-hover:bg-indigo-500/60 relative"
                    style={{ height: `${targetPct}%` }}
                    title={`Target: ₹${(item.target / 100000).toFixed(2)} Lakhs`}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-950 text-indigo-300 text-[10px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap transition-opacity border border-indigo-500/30 z-10">
                      ₹{(item.target / 100000).toFixed(1)}L
                    </div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-400 mt-2">{item.month}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-3 text-xs text-slate-400">
          <span>Q2-Q3 Inward Velocity: +18.4% YoY</span>
          <button 
            onClick={onExportReport}
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Financial Statement (PDF/Excel)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
