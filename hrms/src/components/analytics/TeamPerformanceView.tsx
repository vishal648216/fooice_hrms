'use client';

import React, { useState } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { TEAM_PERFORMANCES, DEPARTMENT_METRICS } from '@/lib/analytics-data';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Users, 
  Trophy, 
  GitPullRequest, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Flame, 
  Sparkles, 
  Search,
  Filter,
  ArrowUpRight
} from 'lucide-react';

export const TeamPerformanceView: React.FC = () => {
  const { addToast } = useOfficeOS();
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = TEAM_PERFORMANCES.filter(member => {
    const matchesDept = departmentFilter === 'ALL' || member.department === departmentFilter;
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          member.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleKudos = (name: string) => {
    addToast({
      title: '🌟 Executive Kudos Sent',
      description: `Sent recognition badge to ${name} for high sprint velocity!`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Performance Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card className="p-4 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900 border-indigo-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300">Engineering Velocity</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">
            96.4 pts
          </div>
          <div className="mt-1 text-[11px] text-emerald-400 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Top 5% Industry Benchmark
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Avg PR Review Turnaround</span>
            <GitPullRequest className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            3.8 Hours
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            -45m vs last sprint
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Task Completion Rate</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            98.2%
          </div>
          <div className="mt-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
            204 tasks shipped this month
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Burnout Risk Index</span>
            <Flame className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            Low (4.2%)
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Balanced sprint workload
          </div>
        </Card>

      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search team member by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-400 shrink-0">Dept:</span>
          {['ALL', 'Product Engineering', 'UI/UX & Product Design', 'QA & Test Automation', 'DevOps & Cloud Infra'].map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-3 py-1 text-xs font-bold rounded-lg shrink-0 transition ${
                departmentFilter === dept
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {dept === 'ALL' ? 'All Departments' : dept.split('&')[0]}
            </button>
          ))}
        </div>

      </div>

      {/* Team Performance Leaderboard Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Team Productivity & Performance Leaderboard
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live efficiency rating calculated from velocity, code reviews, PR turnaround and attendance
            </p>
          </div>
          <Badge variant="primary" size="sm">{filteredMembers.length} Members</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Rank & Member</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-center">Tasks Shipped</th>
                <th className="py-3 px-4 text-center">PR Reviews</th>
                <th className="py-3 px-4 text-center">Avg Resolution</th>
                <th className="py-3 px-4 text-center">Efficiency Score</th>
                <th className="py-3 px-4 text-center">Burnout Risk</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredMembers.map((member, index) => (
                <tr
                  key={member.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition group"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        index === 0 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 ring-2 ring-amber-400' :
                        index === 1 ? 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200' :
                        index === 2 ? 'bg-amber-700/20 text-amber-700' : 'text-slate-400'
                      }`}>
                        {index + 1}
                      </div>

                      <div className="relative shrink-0">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                      </div>

                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{member.name}</span>
                          {index === 0 && <Sparkles className="w-3 h-3 text-amber-400" />}
                        </div>
                        <div className="text-[10px] text-slate-400">{member.role}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {member.department}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900 dark:text-white">
                    {member.tasksCompleted}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {member.codeReviewsDone}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono text-slate-600 dark:text-slate-300">
                    {member.avgResolutionHours}h
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold text-[11px]">
                      {member.efficiencyScore}%
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      member.burnoutRisk === 'LOW' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                      member.burnoutRisk === 'MEDIUM' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {member.burnoutRisk}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleKudos(member.name)}
                      className="text-[11px] h-7 px-2.5"
                    >
                      🌟 Kudos
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
};
