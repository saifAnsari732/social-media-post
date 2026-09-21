"use client";

import { FolderOpen, Plus } from "lucide-react";

export function EmptyState({ title, description, actionText, onAction, icon: Icon = FolderOpen }) {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center shadow-sm flex flex-col items-center justify-center max-w-xl mx-auto my-8">
      <div className="w-14 h-14 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-center mb-4 shadow-sm text-slate-400">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-md leading-relaxed mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs shadow-sm hover:bg-slate-800 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" /> {actionText}
        </button>
      )}
    </div>
  );
}
