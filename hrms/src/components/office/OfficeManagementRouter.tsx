'use client';

import React from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

import { EmployeesView } from './EmployeesView';
import { EmployeeProfileView } from './EmployeeProfileView';
import { AttendanceView } from './AttendanceView';
import { AttendanceCorrectionsView } from './AttendanceCorrectionsView';
import { LeaveManagementView } from './LeaveManagementView';
import { TeamsView } from './TeamsView';
import { DepartmentsView } from './DepartmentsView';
import { HolidaysView } from './HolidaysView';
import { ShiftsView } from './ShiftsView';

export const OfficeManagementRouter: React.FC = () => {
  const { 
    activePath, 
    setActivePath, 
    currentRole, 
    addToast 
  } = useOfficeOS();

  // Role Permission Check: CLIENT role has no access to internal office management
  if (currentRole === 'CLIENT') {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Access Restricted</h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Office Management, payroll rosters, shift policies, and internal attendance records are restricted to TechNova internal staff. Client accounts cannot view this workspace.
        </p>
        <button
          onClick={() => setActivePath('/dashboard')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
        >
          Return to Client Portal
        </button>
      </div>
    );
  }

  const showToastHelper = (title: string, desc?: string) => {
    addToast({
      title,
      description: desc,
      type: 'info'
    });
  };

  // Route: /office/employees/:id
  const employeeMatch = activePath.match(/^\/office\/employees\/([^/]+)$/);
  if (employeeMatch && employeeMatch[1] && employeeMatch[1] !== 'employees') {
    return (
      <EmployeeProfileView
        employeeId={employeeMatch[1]}
        onBack={() => setActivePath('/office/employees')}
        onNavigateToAttendance={(empId) => setActivePath(`/office/attendance/${empId}`)}
        showToast={showToastHelper}
      />
    );
  }

  // Route: /office/employees
  if (activePath === '/office/employees') {
    return (
      <EmployeesView
        onSelectEmployee={(id) => setActivePath(`/office/employees/${id}`)}
        onNavigateToAttendance={(empId) => setActivePath(empId ? `/office/attendance/${empId}` : '/office/attendance')}
        showToast={showToastHelper}
      />
    );
  }

  // Route: /office/attendance/corrections
  if (activePath === '/office/attendance/corrections') {
    return (
      <AttendanceCorrectionsView
        onBackToAttendance={() => setActivePath('/office/attendance')}
        showToast={showToastHelper}
      />
    );
  }

  // Route: /office/attendance/:employeeId
  const attendanceEmpMatch = activePath.match(/^\/office\/attendance\/([^/]+)$/);
  if (attendanceEmpMatch && attendanceEmpMatch[1] && attendanceEmpMatch[1] !== 'corrections') {
    return (
      <AttendanceView
        initialEmployeeId={attendanceEmpMatch[1]}
        onNavigateToCorrections={() => setActivePath('/office/attendance/corrections')}
        onNavigateToSettings={() => setActivePath('/office/shifts')}
        showToast={showToastHelper}
      />
    );
  }

  // Route: /office/attendance
  if (activePath === '/office/attendance') {
    return (
      <AttendanceView
        onNavigateToCorrections={() => setActivePath('/office/attendance/corrections')}
        onNavigateToSettings={() => setActivePath('/office/shifts')}
        showToast={showToastHelper}
      />
    );
  }

  // Route: /office/leave/requests
  if (activePath === '/office/leave/requests') {
    return (
      <LeaveManagementView
        initialViewMode="requests"
        onNavigateToSettings={() => setActivePath('/office/shifts')}
        showToast={showToastHelper}
      />
    );
  }

  // Route: /office/leave
  if (activePath.startsWith('/office/leave')) {
    return (
      <LeaveManagementView
        initialViewMode="all"
        onNavigateToSettings={() => setActivePath('/office/shifts')}
        showToast={showToastHelper}
      />
    );
  }

  // Route: /office/teams/:id
  const teamMatch = activePath.match(/^\/office\/teams\/([^/]+)$/);
  if (teamMatch && teamMatch[1] && teamMatch[1] !== 'teams') {
    return (
      <TeamsView
        initialTeamId={teamMatch[1]}
        onSelectEmployee={(empId) => setActivePath(`/office/employees/${empId}`)}
        showToast={showToastHelper}
      />
    );
  }

  // Route: /office/teams
  if (activePath.startsWith('/office/teams')) {
    return (
      <TeamsView
        onSelectEmployee={(empId) => setActivePath(`/office/employees/${empId}`)}
        showToast={showToastHelper}
      />
    );
  }

  // Route: /office/departments/:id
  const deptMatch = activePath.match(/^\/office\/departments\/([^/]+)$/);
  if (deptMatch && deptMatch[1] && deptMatch[1] !== 'departments') {
    return (
      <DepartmentsView
        initialDepartmentId={deptMatch[1]}
        onSelectEmployee={(empId) => setActivePath(`/office/employees/${empId}`)}
        showToast={showToastHelper}
      />
    );
  }

  // Route: /office/departments
  if (activePath.startsWith('/office/departments')) {
    return (
      <DepartmentsView
        onSelectEmployee={(empId) => setActivePath(`/office/employees/${empId}`)}
        showToast={showToastHelper}
      />
    );
  }

  // Route: /office/holidays
  if (activePath.startsWith('/office/holidays')) {
    return (
      <HolidaysView
        showToast={showToastHelper}
      />
    );
  }

  // Route: /office/shifts
  if (activePath.startsWith('/office/shifts')) {
    return (
      <ShiftsView
        showToast={showToastHelper}
      />
    );
  }

  // Default fallback for any other /office path
  return (
    <EmployeesView
      onSelectEmployee={(id) => setActivePath(`/office/employees/${id}`)}
      onNavigateToAttendance={(empId) => setActivePath(empId ? `/office/attendance/${empId}` : '/office/attendance')}
      showToast={showToastHelper}
    />
  );
};
