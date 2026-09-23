"use client";

import { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  CalendarCheck2,
  CalendarDays,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { PlatformIcon } from "@/components/ui/SocialIcons";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("Month");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      setLoading(true);
      const userStr = localStorage.getItem("socialflow_user") || localStorage.getItem("yt_user");
      let userId = "eb994f0c8e6f7fb4c2629561";
      if (userStr) {
        try {
          const parsed = JSON.parse(userStr);
          if (parsed?.userId) userId = parsed.userId;
        } catch (e) {}
      }

      const res = await fetch("/api/post", {
        headers: { "x-user-id": userId }
      });
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load posts for calendar");
    } finally {
      setLoading(false);
    }
  }

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  // Days array with padding from previous month and next month
  const calendarCells = [];

  // Prev month padding
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarCells.push({
      day: prevMonthTotalDays - i,
      month: month - 1,
      year: month === 0 ? year - 1 : year,
      isCurrentMonth: false
    });
  }

  // Current month days
  for (let i = 1; i <= totalDays; i++) {
    calendarCells.push({
      day: i,
      month: month,
      year: year,
      isCurrentMonth: true
    });
  }

  // Next month padding to fill out a 35 or 42 grid
  const remainingCells = 42 - calendarCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push({
      day: i,
      month: month + 1,
      year: month === 11 ? year + 1 : year,
      isCurrentMonth: false
    });
  }

  const today = new Date();
  const isToday = (cell) => {
    return (
      cell.day === today.getDate() &&
      cell.month === today.getMonth() &&
      cell.year === today.getFullYear()
    );
  };

  // Associate posts with calendar dates
  const getPostsForCell = (cell) => {
    return posts.filter(post => {
      const dateToMatch = post.scheduledAt ? new Date(post.scheduledAt) : new Date(post.createdAt);
      return (
        dateToMatch.getDate() === cell.day &&
        dateToMatch.getMonth() === cell.month &&
        dateToMatch.getFullYear() === cell.year
      );
    });
  };

  return (
    <div className="space-y-7 max-w-7xl mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-950 tracking-tight flex items-center gap-2.5">
            <CalendarDays className="w-7 h-7 text-indigo-600" />
            <span>Content Calendar</span>
          </h1>
          <p className="text-xs lg:text-sm text-slate-600 mt-1 font-normal">
            Visualize your live publishing schedule, preview scheduled broadcasts, and drag-and-drop release dates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100/90 border border-slate-200/90 p-1 rounded-xl text-xs font-bold text-slate-700 shadow-2xs">
            {["Month", "List"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === mode 
                    ? "bg-white text-indigo-600 shadow-2xs font-extrabold" 
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <Link
            href="/publisher"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all no-underline cursor-pointer active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" /> Schedule Post
          </Link>
        </div>
      </div>

      {/* Month Calendar Grid View */}
      {viewMode === "Month" && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          
          {/* Calendar Toolbar Header */}
          <div className="p-3 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-sm lg:text-base font-bold text-slate-800 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-indigo-500" />
                <span>{monthName} {year}</span>
              </h2>
              <button
                onClick={goToToday}
                className="px-2.5 py-0.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-semibold text-slate-600 transition-all shadow-2xs cursor-pointer"
              >
                Today
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button 
                onClick={prevMonth}
                className="p-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-2xs cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={nextMonth}
                className="p-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-2xs cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Weekday Labels Header */}
          <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/40 text-center text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider py-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100/70 text-xs">
            {calendarCells.map((cell, idx) => {
              const cellPosts = getPostsForCell(cell);
              const isCellToday = isToday(cell);

              return (
                <div 
                  key={idx} 
                  className={`min-h-[82px] p-1.5 transition-all flex flex-col justify-between ${
                    cell.isCurrentMonth ? "bg-white hover:bg-slate-50/50" : "bg-slate-50/20 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-semibold ${
                      isCellToday
                        ? "w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shadow-2xs" 
                        : cell.isCurrentMonth 
                        ? "text-slate-600" 
                        : "text-slate-300"
                    }`}>
                      {cell.day}
                    </span>

                    {cellPosts.length > 0 && (
                      <span className="text-[9.5px] font-semibold text-indigo-600 bg-indigo-50/60 px-1 py-0.2 rounded-md border border-indigo-100/60">
                        {cellPosts.length}
                      </span>
                    )}
                  </div>

                  {/* Post Badges within this Day */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {cellPosts.slice(0, 2).map((post, pIdx) => {
                      const firstChannel = post.channelDetails?.[0];
                      const isScheduled = post.status === "Scheduled";
                      return (
                        <div
                          key={pIdx}
                          onClick={() => setSelectedPost(post)}
                          className={`p-1 rounded-md border text-[9.5px] font-medium truncate flex items-center gap-1 cursor-pointer transition-all shadow-2xs hover:scale-[1.01] ${
                            isScheduled 
                              ? "bg-blue-50/60 border-blue-100/70 text-blue-700 hover:bg-blue-50" 
                              : post.status === "Draft"
                              ? "bg-rose-50/60 border-rose-100/70 text-rose-700 hover:bg-rose-50"
                              : "bg-emerald-50/60 border-emerald-100/70 text-emerald-700 hover:bg-emerald-50"
                          }`}
                          title={post.title || "Post"}
                        >
                          {firstChannel && (
                            <PlatformIcon platform={firstChannel.platform} className="w-3 h-3 shrink-0" />
                          )}
                          <span className="truncate">{post.title || "Untitled Post"}</span>
                        </div>
                      );
                    })}

                    {cellPosts.length > 2 && (
                      <span className="text-[9px] text-slate-400 font-semibold block pl-0.5">
                        +{cellPosts.length - 2} more
                      </span>
                    )}
                  </div>

                  <div className="h-0.5"></div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === "List" && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-950">Scheduled & Published Posts Queue</h3>
            <span className="text-xs font-semibold text-slate-500">{posts.length} Total Events</span>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold text-slate-600">No scheduled posts found.</p>
              <Link
                href="/publisher"
                className="mt-3 inline-block px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold no-underline"
              >
                Schedule Your First Post
              </Link>
            </div>
          ) : (
            posts.map(post => {
              const dateToFormat = post.scheduledAt ? new Date(post.scheduledAt) : new Date(post.createdAt);
              const formattedDate = dateToFormat.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric"
              });
              const formattedTime = dateToFormat.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              });

              return (
                <div 
                  key={post._id || post.id} 
                  onClick={() => setSelectedPost(post)}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-200/80 hover:border-indigo-300 bg-white hover:bg-slate-50/70 transition-all cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <div className="flex -space-x-1.5 shrink-0">
                      {post.channelDetails && post.channelDetails.length > 0 ? (
                        post.channelDetails.slice(0, 3).map((ch, i) => (
                          <div key={i} className="w-7 h-7 rounded-lg overflow-hidden border-2 border-white shadow-2xs">
                            <PlatformIcon platform={ch.platform} className="w-full h-full" />
                          </div>
                        ))
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                          <PlatformIcon platform="instagram" className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs lg:text-sm font-bold text-slate-950 truncate">
                        {post.title || "Untitled Post"}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                        {post.description || "No caption added"}
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                        {formattedDate} at {formattedTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      post.status === "Scheduled"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : post.status === "Draft"
                        ? "bg-slate-100 text-slate-700 border-slate-300"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}>
                      {post.status || "Published"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Post Details Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-lg w-full space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-950">Post Schedule Details</h3>
              <button 
                onClick={() => setSelectedPost(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">Title</label>
                <p className="text-xs font-bold text-slate-900 mt-0.5">{selectedPost.title || "Untitled Post"}</p>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">Caption</label>
                <p className="text-xs text-slate-700 font-normal leading-relaxed mt-0.5 whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedPost.description || "No caption provided"}
                </p>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">Target Channels</label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedPost.channelDetails && selectedPost.channelDetails.length > 0 ? (
                    selectedPost.channelDetails.map((ch, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
                        <PlatformIcon platform={ch.platform} className="w-3.5 h-3.5" />
                        <span>{ch.name}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">All connected channels</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-medium">
                  Status: <strong className="text-slate-900">{selectedPost.status || "Published"}</strong>
                </span>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
