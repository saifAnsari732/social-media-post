"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  Trash2, 
  Copy, 
  Send, 
  Calendar,
  Clock,
  Layers,
  FileText,
  RefreshCw,
  ExternalLink,
  ArrowRight
} from "lucide-react";
import toast from "react-hot-toast";
import { TableSkeleton } from "@/components/ui/Skeletons";
import { EmptyState } from "@/components/ui/EmptyState";
import { PlatformIcon } from "@/components/ui/SocialIcons";
import { useRouter } from "next/navigation";
import { getStoredUser, checkPlanAccess } from "@/lib/user";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      setIsRefreshing(true);
      const user = getStoredUser();

      const res = await fetch("/api/post", {
        headers: { "x-user-id": user.userId }
      });
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }

  async function handlePublishDraft(postId) {
    try {
      const user = getStoredUser();
      const res = await fetch("/api/post", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "x-user-id": user.userId 
        },
        body: JSON.stringify({ postId, action: "publish_now" })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Draft published successfully!");
        fetchPosts();
      } else {
        toast.error("Failed to publish draft.");
      }
    } catch (err) {
      toast.error("Error publishing draft");
    }
  }

  async function handleDeletePost(postId) {
    if (!confirm("Are you sure you want to remove this post?")) return;
    try {
      const user = getStoredUser();
      const res = await fetch(`/api/post?id=${postId}`, {
        method: "DELETE",
        headers: { "x-user-id": user.userId }
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Post removed");
        fetchPosts();
      }
    } catch (err) {
      toast.error("Failed to delete post");
    }
  }

  const publishedCount = posts.filter(p => !p.status || p.status === "Published").length;
  const scheduledCount = posts.filter(p => p.status === "Scheduled").length;
  const draftCount = posts.filter(p => p.status === "Draft").length;

  const filteredPosts = posts.filter(post => {
    const matchesSearch = (post.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (post.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeTab === "All") return true;
    const postStatus = post.status || "Published";
    return postStatus.toLowerCase() === activeTab.toLowerCase();
  });

  const getTabCount = (tabName) => {
    if (tabName === "All") return posts.length;
    if (tabName === "Published") return publishedCount;
    if (tabName === "Scheduled") return scheduledCount;
    if (tabName === "Draft") return draftCount;
    return 0;
  };

  return (
    <div className="space-y-7 max-w-7xl mx-auto font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-950 tracking-tight">Content Library</h1>
          <p className="text-xs lg:text-sm text-slate-600 mt-1 font-normal">
            Manage your multi-channel posts, scheduled releases, and drafted content.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchPosts}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
            title="Refresh post list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-indigo-600" : "text-slate-500"}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link 
            href="/publisher"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-xs shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all no-underline cursor-pointer active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Post</span>
          </Link>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Total Content</span>
              <span className="text-lg font-bold text-slate-950">{posts.length} Posts</span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold">
            All Time
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Published</span>
              <span className="text-lg font-bold text-slate-950">{publishedCount} Live</span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
            Live
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Scheduled</span>
              <span className="text-lg font-bold text-slate-950">{scheduledCount} Queued</span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
            Upcoming
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Drafts</span>
              <span className="text-lg font-bold text-slate-950">{draftCount} Drafts</span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold">
            Saved
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Status Tab Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-medium">
          {["All", "Published", "Scheduled", "Draft"].map((tab) => {
            const count = getTabCount(tab);
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                  isActive 
                    ? "bg-white text-slate-950 font-bold shadow-2xs border border-slate-200/80" 
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/50 font-semibold"
                }`}
              >
                <span>{tab}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : "bg-slate-200/80 text-slate-600"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 bg-white border border-slate-300 px-3.5 py-2 rounded-xl text-xs max-w-xs w-full shadow-2xs focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search posts title or caption..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full border-none bg-transparent outline-none text-slate-900 placeholder:text-slate-400 font-medium"
          />
        </div>
      </div>

      {/* Posts Table Card */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : filteredPosts.length === 0 ? (
        <EmptyState
          title="No posts found"
          description="You haven't created any posts matching this filter yet."
          actionText="Create Post Now"
          onAction={() => window.location.href = "/publisher"}
        />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200/80">
                  <th className="py-3.5 px-6">Post Content</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Target Channels</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredPosts.map((post) => {
                  const postDate = post.createdAt ? new Date(post.createdAt) : new Date();
                  const formattedDate = postDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                  const formattedTime = postDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

                  return (
                    <tr key={post._id || post.id} className="hover:bg-slate-50/70 transition-colors group">
                      
                      {/* Post Content */}
                      <td className="py-4 px-6 max-w-md">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-slate-950 text-sm truncate" title={post.title || "Untitled Post"}>
                              {post.title || "Untitled Post"}
                            </h4>
                            {post.description && (
                              <p className="text-slate-500 text-xs font-normal line-clamp-1 mt-0.5">
                                {post.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formattedDate}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500">{formattedTime}</span>
                        </div>
                      </td>

                      {/* Channels Badges */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {post.channelDetails && post.channelDetails.length > 0 ? (
                            post.channelDetails.map((channel, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 font-semibold text-[11px] text-slate-800 shadow-2xs"
                              >
                                <PlatformIcon platform={channel.platform} className="w-3.5 h-3.5" />
                                <span className="max-w-[110px] truncate">{channel.name}</span>
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-xs italic">All Connected Channels</span>
                          )}
                        </div>
                      </td>

                      {/* Status Pill */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {post.status === "Scheduled" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-[11px] border border-blue-200">
                            <Calendar className="w-3 h-3" /> Scheduled
                          </span>
                        ) : post.status === "Draft" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-semibold text-[11px] border border-amber-200">
                            <Clock className="w-3 h-3" /> Draft
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Published
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {post.status === "Draft" && (
                            <button
                              onClick={() => handlePublishDraft(post._id || post.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-2xs transition-all cursor-pointer"
                              title="Publish draft now"
                            >
                              <Send className="w-3 h-3" />
                              <span>Publish</span>
                            </button>
                          )}
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(`${post.title}\n\n${post.description || ""}`);
                              toast.success("Post title & caption copied!");
                            }} 
                            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
                            title="Copy content"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeletePost(post._id || post.id)} 
                            className="p-2 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                            title="Delete post"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
