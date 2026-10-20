'use client';

import React from 'react';
import { OfficeOSProvider } from '@/context/OfficeOSContext';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return <OfficeOSProvider>{children}</OfficeOSProvider>;
}
