import React from 'react';

export default function SkeletonLoader({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col animate-pulse"
        >
          {/* Image skeleton */}
          <div className="aspect-4/3 bg-slate-200" />

          {/* Body skeleton */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="h-5 bg-slate-200 rounded-md w-3/4" />
              <div className="h-3.5 bg-slate-100 rounded-md w-1/3" />
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="h-8 bg-slate-100 rounded-xl w-full" />
              <div className="flex justify-between items-center pt-1">
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-3 bg-slate-100 rounded w-4" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
