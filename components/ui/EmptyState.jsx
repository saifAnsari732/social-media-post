"use client";

import { FolderOpen, Plus } from "lucide-react";

export function EmptyState({ title, description, actionText, onAction, icon: Icon = FolderOpen }) {
  return (
    <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200/90 p-12 text-center shadow-sm flex flex-col items-center justify-center max-w-xl mx-auto my-8">
      <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm text-indigo-600">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-extrabold text-slate-900 mb-1 tracking-tight">{title}</h3>
      <p className="text-xs text-slate-600 font-medium max-w-md leading-relaxed mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> {actionText}
        </button>
      )}
    </div>
  );
}
