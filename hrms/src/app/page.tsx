'use client';

import React from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { Sidebar } from '@/components/shell/Sidebar';
import { TopBar } from '@/components/shell/TopBar';
import { CommandPalette } from '@/components/shell/CommandPalette';
import { QuickCreateModal } from '@/components/shell/QuickCreateModal';
import { NotificationsDrawer } from '@/components/shell/NotificationsDrawer';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { MasterDashboardView } from '@/components/views/MasterDashboardView';
import { DynamicViewShell } from '@/components/views/DynamicViewShell';
import { LoginView } from '@/components/auth/LoginView';

export default function OfficeOSApp() {
  const { activePath, isLoggedIn } = useOfficeOS();

  if (!isLoggedIn) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Sticky Top Navigation Bar */}
        <TopBar />

        {/* Dynamic Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activePath === '/dashboard' || activePath === '/' ? (
            <MasterDashboardView />
          ) : (
            <DynamicViewShell />
          )}
        </main>

        {/* Global Overlays & Modals */}
        <CommandPalette />
        <QuickCreateModal />
        <NotificationsDrawer />
        <ToastContainer />

      </div>

    </div>
  );
}
