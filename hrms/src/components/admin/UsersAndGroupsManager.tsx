'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Users, 
  Search, 
  ShieldAlert, 
  CheckCircle, 
  Trash2, 
  Lock, 
  Unlock, 
  Shield, 
  Briefcase, 
  User as UserIcon,
  HardDrive,
  Database
} from 'lucide-react';

export default function UsersAndGroupsManager() {
  const { currentRole, users, groups, toggleUserBlock, deleteUser, toggleGroupPermission } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState('ALL');

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroupFilter === 'ALL' || u.groupId === selectedGroupFilter;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <span>Remote Users & Group Permissions</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            Excalidraw Module 3 & 4
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage remote members, block/unblock accounts, and configure group chat broadcast permissions.
        </p>
      </div>

      {/* Group Permissions Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Group Access Rules & Chat Controls
            </h2>
            <p className="text-xs text-slate-500">
              Set which groups allow all members to chat vs restricting to "Only Admin Can Send Messages".
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-full">
            {groups.length} Active Groups
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {groups.map((group) => (
            <div
              key={group.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {group.name}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {group.memberCount} members
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {group.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  {group.onlyAdminCanSend ? (
                    <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Only Admin Can Send
                    </span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <Unlock className="w-3 h-3" /> Everyone Can Send
                    </span>
                  )}
                </span>

                {currentRole === 'ADMIN' && (
                  <button
                    onClick={() => toggleGroupPermission(group.id)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 transition shadow-sm"
                  >
                    Toggle Rule
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Remote Users Management Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search remote user by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filter Group:</span>
            <select
              value={selectedGroupFilter}
              onChange={(e) => setSelectedGroupFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Groups</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                <th className="pb-3 px-3">User</th>
                <th className="pb-3 px-3">Role</th>
                <th className="pb-3 px-3">Assigned Group</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[10px] ${
                      user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' :
                      user.role === 'MANAGER' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    }`}>
                      {user.role === 'ADMIN' && <Shield className="w-3 h-3" />}
                      {user.role === 'MANAGER' && <Briefcase className="w-3 h-3" />}
                      {user.role === 'USER' && <UserIcon className="w-3 h-3" />}
                      <span>{user.role}</span>
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-medium">
                    {user.groupName || 'Unassigned'}
                  </td>

                  <td className="py-3 px-3">
                    {user.status === 'ACTIVE' ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Blocked</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-right">
                    {currentRole === 'ADMIN' && user.role !== 'ADMIN' && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleUserBlock(user.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                            user.status === 'ACTIVE'
                              ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300'
                              : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {user.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                        </button>

                        <button
                          onClick={() => deleteUser(user.id)}
                          title="Remove user"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Storage & Logs Summary Card (Excalidraw Module 1 & 4) */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-indigo-400">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold">Cloud Media & Data Storage</div>
            <div className="text-xs text-slate-400 mt-0.5">
              128 MB used of 10 GB &bull; Encrypted team artifacts and shared chat documents
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-emerald-400">Status: Healthy</div>
            <div className="text-[10px] text-slate-400">Automatic nightly backups enabled</div>
          </div>
          <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 transition">
            View Storage Logs
          </button>
        </div>
      </div>

    </div>
  );
}
