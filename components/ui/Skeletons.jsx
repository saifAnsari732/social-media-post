"use client";

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-slate-100 rounded-md w-1/3"></div>
        <div className="h-8 w-8 bg-slate-100 rounded-xl"></div>
      </div>
      <div className="h-8 bg-slate-100 rounded-lg w-1/2"></div>
      <div className="h-3 bg-slate-100 rounded-md w-2/3"></div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-8 bg-slate-200 rounded-lg w-32"></div>
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between animate-pulse">
            <div className="flex items-center space-x-3 w-1/3">
              <div className="h-9 w-9 bg-slate-100 rounded-xl"></div>
              <div className="space-y-1.5 flex-1">
                <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                <div className="h-2.5 bg-slate-100 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-3 bg-slate-100 rounded w-16"></div>
            <div className="h-3 bg-slate-100 rounded w-16"></div>
            <div className="h-6 bg-slate-100 rounded-full w-20"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SocialCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-6 shadow-sm animate-pulse space-y-4 text-center flex flex-col items-center">
      <div className="h-12 w-12 bg-slate-100 rounded-2xl"></div>
      <div className="h-4 bg-slate-100 rounded w-1/2"></div>
      <div className="h-3 bg-slate-100 rounded w-3/4"></div>
      <div className="h-9 bg-slate-100 rounded-xl w-full mt-2"></div>
    </div>
  );
}
