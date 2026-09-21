"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Filter, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState("Month");
  const [statusFilter, setStatusFilter] = useState("All");

  const sampleEvents = [
    {
      id: 1,
      title: "Q3 Product Launch Reel",
      platform: "Instagram",
      platformColor: "bg-pink-500",
      time: "10:30 AM",
      day: 15,
      status: "Published"
    },
    {
      id: 2,
      title: "Meta OAuth Integration Guide",
      platform: "Facebook",
      platformColor: "bg-blue-600",
      time: "02:00 PM",
      day: 18,
      status: "Scheduled"
    },
    {
      id: 3,
      title: "SaaS AI Copilot Showcase Video",
      platform: "YouTube",
      platformColor: "bg-red-600",
      time: "05:00 PM",
      day: 22,
      status: "Scheduled"
    },
    {
      id: 4,
      title: "Weekly Growth Hacking Tips Thread",
      platform: "X / Twitter",
      platformColor: "bg-slate-900",
      time: "11:00 AM",
      day: 25,
      status: "Draft"
    }
  ];

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Content Calendar</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Schedule, manage, and visualize your upcoming multi-platform posts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-white border border-slate-200/80 p-1 rounded-xl shadow-xs text-xs font-bold text-slate-600">
            {["Month", "Week", "List"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === mode ? "bg-slate-900 text-white shadow-xs" : "hover:bg-slate-50"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <Link
            href="/publisher"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-xs shadow-md shadow-violet-600/20 hover:bg-violet-700 transition-all no-underline"
          >
            <Plus className="w-4 h-4" /> Schedule Post
          </Link>
        </div>
      </div>

      {/* Month Calendar Grid View */}
      {viewMode === "Month" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Calendar Month Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-violet-600" /> September 2026
            </h3>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider py-2.5">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 text-xs">
            {daysInMonth.map((day) => {
              const dayEvents = sampleEvents.filter(e => e.day === day);
              return (
                <div key={day} className="min-h-[110px] p-2 bg-white hover:bg-slate-50/50 transition-colors flex flex-col justify-between">
                  <span className={`text-xs font-bold ${day === 20 ? 'w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center' : 'text-slate-500'}`}>
                    {day}
                  </span>
                  <div className="space-y-1 mt-1">
                    {dayEvents.map(evt => (
                      <div key={evt.id} className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-800 truncate flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${evt.platformColor}`}></span>
                        <span className="truncate">{evt.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === "List" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Upcoming Scheduled Posts</h3>
          {sampleEvents.map(evt => (
            <div key={evt.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition-all">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${evt.platformColor}`}></div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{evt.title}</h4>
                  <span className="text-xs text-slate-400 font-medium">{evt.platform} • Scheduled for Sep {evt.day}, {evt.time}</span>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                evt.status === "Published" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                evt.status === "Scheduled" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                "bg-slate-100 text-slate-600 border border-slate-200"
              }`}>
                {evt.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
