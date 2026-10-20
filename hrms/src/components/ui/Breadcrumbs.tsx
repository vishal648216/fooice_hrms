import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const Breadcrumbs: React.FC<{ items: BreadcrumbItem[]; className?: string }> = ({
  items,
  className = '',
}) => {
  return (
    <nav className={`flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 ${className}`}>
      <span className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition cursor-pointer">
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">OfficeOS</span>
      </span>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            <span
              className={`${
                isLast
                  ? 'font-semibold text-slate-900 dark:text-white'
                  : 'hover:text-slate-900 dark:hover:text-white transition cursor-pointer'
              }`}
            >
              {item.label}
            </span>
          </React.Fragment>
        );
      })}
    </nav>
  );
};
