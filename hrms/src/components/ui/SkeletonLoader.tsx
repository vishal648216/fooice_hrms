import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800 ${className}`}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
      <Skeleton className="w-3/4 h-6" />
      <Skeleton className="w-full h-12" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-16 h-4" />
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <Skeleton className="w-48 h-5" />
        <Skeleton className="w-24 h-8" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-2 gap-4">
          <Skeleton className="w-10 h-10 rounded-full shrink-0" />
          <Skeleton className="w-1/3 h-4" />
          <Skeleton className="w-1/4 h-4 hidden sm:block" />
          <Skeleton className="w-16 h-6 rounded-full" />
        </div>
      ))}
    </div>
  );
};
