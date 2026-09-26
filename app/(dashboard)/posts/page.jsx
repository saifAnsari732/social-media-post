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
  ArrowRight,
  Edit3,
  Play,
  FileVideo,
  Image as ImageIcon,
  BarChart2,
  AlertTriangle,
  Minus,
  Info,
  X
} from "lucide-react";
import toast from "react-hot-toast";
import { TableSkeleton } from "@/components/ui/Skeletons";
import { EmptyState } from "@/components/ui/EmptyState";
import { PlatformIcon } from "@/components/ui/SocialIcons";
import { useRouter } from "next/navigation";
import { getStoredUser, checkPlanAccess } from "@/lib/user";
import MediaPreviewModal from "@/components/modals/MediaPreviewModal";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewMedia, setPreviewMedia] = useState(null);
  const [selectedPostForReport, setSelectedPostForReport] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeletingRemotely, setIsDeletingRemotely] = useState(false);
  const [deleteProgressMessage, setDeleteProgressMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      setIsRefreshing(true);
      const user = getStoredUser();

      const res = await fetch(`/api/post?t=${Date.now()}`, {
        headers: { "x-user-id": user.userId },
        cache: "no-store"
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

  function handleInitiateDelete(post) {
    const hasPublishedChannels = post.channelDetails && post.channelDetails.some(ch => ch.success === true);
    const isBroadcastPost = post.status === "Published" || post.status === "Partial" || hasPublishedChannels;

    if (!isBroadcastPost) {
      if (confirm(`Delete draft "${post.title || 'Untitled Post'}"?`)) {
        executeDeletePost(post._id || post.id, false);
      }
      return;
    }

    setPostToDelete(post);
  }

  async function executeDeletePost(postId, deleteFromChannels = false) {
    try {
      setIsDeletingRemotely(true);
      if (deleteFromChannels) {
        setDeleteProgressMessage("Communicating with social media APIs (Facebook, Instagram, YouTube, X)...");
      } else {
        setDeleteProgressMessage("Removing post from PostFly platform...");
      }

      const user = getStoredUser();
      const res = await fetch(`/api/post?id=${postId}&deleteFromChannels=${deleteFromChannels ? "true" : "false"}`, {
        method: "DELETE",
        headers: { "x-user-id": user.userId }
      });
      const data = await res.json();
      if (data.success) {
        if (deleteFromChannels && data.channelDeletes) {
          const results = Object.values(data.channelDeletes);
          const succeeded = results.filter(r => r.success).length;
          const failed = results.filter(r => !r.success).length;
          if (failed > 0 && succeeded > 0) {
            toast.success(`Removed from ${succeeded} social channel(s) and PostFly. (${failed} channels had API restriction)`);
          } else if (succeeded > 0) {
            toast.success(`Post successfully deleted from all ${succeeded} social media channels and platform!`);
          } else {
            toast.success("Post removed from PostFly platform.");
          }
        } else {
          toast.success("Post removed from PostFly platform.");
        }
        setPostToDelete(null);
        fetchPosts();
      } else {
        toast.error(data.error || "Failed to delete post");
      }
    } catch (err) {
      toast.error("Failed to delete post: " + (err.message || "Network error"));
    } finally {
      setIsDeletingRemotely(false);
      setDeleteProgressMessage("");
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

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200/80 overflow-x-auto">
          {["All", "Published", "Scheduled", "Draft"].map((tab) => {
            const count = getTabCount(tab);
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isActive 
                    ? "bg-white text-slate-950 shadow-2xs border border-slate-200/80" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>{tab}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  isActive ? "bg-indigo-100 text-indigo-700" : "bg-slate-200/70 text-slate-600"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Field */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-300 focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-100 transition-all shadow-2xs sm:w-72">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search posts title or caption..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full border-none bg-transparent outline-none text-slate-900 placeholder:text-slate-400 font-medium text-xs"
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
          onAction={() => router.push("/publisher")}
        />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200/80">
                  <th className="py-3.5 px-6">Post Content & Media</th>
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
                  const isVideoMedia = post.mediaType === "video" || (post.mediaUrl && (post.mediaUrl.startsWith("data:video") || post.mediaUrl.match(/\.(mp4|mov|webm|avi|m4v)$/i)));

                  return (
                    <tr key={post._id || post.id} className="hover:bg-slate-50/70 transition-colors group">
                      
                      {/* Post Content & Media Thumbnail */}
                      <td className="py-4 px-6 max-w-md">
                        <div className="flex items-start gap-3">
                          {post.mediaUrl ? (
                            <div 
                              onClick={() => setPreviewMedia({ url: post.mediaUrl, type: isVideoMedia ? "video" : "image", title: post.title, description: post.description })}
                              className="relative w-11 h-11 rounded-xl bg-slate-900 overflow-hidden shrink-0 group/media cursor-pointer border border-slate-200 shadow-2xs hover:scale-105 transition-transform"
                              title="Click to view full draft video/photo"
                            >
                              {isVideoMedia ? (
                                <>
                                  <video src={post.mediaUrl} className="w-full h-full object-cover opacity-80" />
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover/media:bg-black/20 transition-colors">
                                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                                      <Play className="w-3 h-3 fill-white ml-0.5" />
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover" />
                              )}
                            </div>
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                              <FileText className="w-4 h-4" />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-slate-950 text-sm truncate" title={post.title || "Untitled Post"}>
                              {post.title || "Untitled Post"}
                            </h4>
                            {post.description && (
                              <p className="text-slate-500 text-xs font-normal line-clamp-1 mt-0.5">
                                {post.description}
                              </p>
                            )}
                            {post.mediaUrl && (
                              <button
                                type="button"
                                onClick={() => setPreviewMedia({ url: post.mediaUrl, type: isVideoMedia ? "video" : "image", title: post.title, description: post.description })}
                                className="inline-flex items-center gap-1 text-[10.5px] font-bold text-indigo-600 hover:text-indigo-700 mt-1 cursor-pointer"
                              >
                                <Play className="w-3 h-3 fill-indigo-600" />
                                <span>Watch Media</span>
                              </button>
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
                      <td className="py-4 px-4 max-w-[260px]">
                        {post.channelDetails && post.channelDetails.length > 0 ? (
                          <div 
                            onClick={() => setSelectedPostForReport(post)}
                            className="flex flex-wrap items-center gap-1.5 cursor-pointer group/ch"
                            title="Click to view detailed per-channel delivery results"
                          >
                            {post.channelDetails.slice(0, 2).map((channel, i) => (
                              <span
                                key={i}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-semibold text-[11px] shadow-2xs transition-colors ${
                                  channel.success === false
                                    ? "bg-rose-50 border-rose-200 text-rose-800"
                                    : channel.success === true
                                    ? "bg-slate-50 border-slate-200 text-slate-800 hover:border-emerald-300"
                                    : "bg-slate-50 border-slate-200 text-slate-800"
                                }`}
                              >
                                <PlatformIcon platform={channel.platform} className="w-3.5 h-3.5 shrink-0" />
                                <span className="max-w-[90px] truncate">{channel.name}</span>
                                {channel.success === false ? (
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" title="Failed" />
                                ) : channel.success === true && post.status !== "Draft" ? (
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Published" />
                                ) : null}
                              </span>
                            ))}
                            {post.channelDetails.length > 2 && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-[10.5px] hover:bg-indigo-100 shadow-2xs transition-all">
                                +{post.channelDetails.length - 2} channels
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic">All Connected Channels</span>
                        )}
                      </td>

                      {/* Status Pill (Clickable for diagnostics) */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedPostForReport(post)}
                          className="cursor-pointer transition-transform active:scale-95 text-left inline-block"
                          title="Click to view channel-by-channel delivery results & error reasons"
                        >
                          {post.status === "Scheduled" ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-[11px] border border-blue-200 shadow-2xs hover:bg-blue-100 transition-colors">
                              <Calendar className="w-3 h-3" /> Scheduled
                            </span>
                          ) : post.status === "Draft" ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-semibold text-[11px] border border-amber-200 shadow-2xs hover:bg-amber-100 transition-colors">
                              <Clock className="w-3 h-3" /> Draft
                            </span>
                          ) : post.status === "Canceled" ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-300 shadow-2xs hover:bg-slate-200 transition-colors">
                              <Minus className="w-3 h-3" /> Canceled
                            </span>
                          ) : post.failedCount > 0 && post.successCount === 0 ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 font-bold text-[11px] border border-rose-300 shadow-2xs hover:bg-rose-100 transition-colors">
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              Failed ({post.failedCount})
                            </span>
                          ) : post.failedCount > 0 && post.successCount > 0 ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 font-bold text-[11px] border border-amber-300 shadow-2xs hover:bg-amber-100 transition-colors">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              Partial ({post.successCount}/{post.totalChannels || (post.successCount + post.failedCount)})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200 shadow-2xs hover:bg-emerald-100 transition-colors">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Published {post.successCount ? `(${post.successCount})` : ""}
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Channel Report Button */}
                          <button
                            onClick={() => setSelectedPostForReport(post)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer shadow-2xs"
                            title="View channel delivery report & error details"
                          >
                            <BarChart2 className="w-3.5 h-3.5 text-slate-600" />
                            <span>Report</span>
                          </button>

                          <button
                            onClick={() => {
                              localStorage.setItem("edit_post", JSON.stringify(post));
                              router.push("/publisher");
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs transition-all cursor-pointer shadow-2xs"
                            title="Edit post in composer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Edit</span>
                          </button>

                          {post.status === "Draft" && (
                            <button
                              onClick={() => handlePublishDraft(post._id || post.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
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
                            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
                            title="Copy content"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleInitiateDelete(post)} 
                            className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
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

      {/* CHANNEL DELIVERY REPORT & DIAGNOSTICS MODAL */}
      {selectedPostForReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold shadow-2xs">
                  <BarChart2 className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950 tracking-tight flex items-center gap-2">
                    <span>Channel Delivery Report</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      selectedPostForReport.failedCount > 0 && selectedPostForReport.successCount === 0
                        ? "bg-rose-100 text-rose-800 border border-rose-200"
                        : selectedPostForReport.failedCount > 0
                        ? "bg-amber-100 text-amber-900 border border-amber-200"
                        : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    }`}>
                      {selectedPostForReport.status}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium truncate max-w-sm mt-0.5">
                    {selectedPostForReport.title || "Untitled Post"} • {selectedPostForReport.createdAt ? new Date(selectedPostForReport.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "Recent"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPostForReport(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* KPI Summary Cards */}
            <div className="p-4 sm:p-6 grid grid-cols-3 gap-3 border-b border-slate-100 bg-slate-50/30">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Channels</span>
                <span className="text-xl font-black text-slate-900 mt-0.5 block">{selectedPostForReport.totalChannels || selectedPostForReport.channelDetails?.length || 0}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/90 shadow-2xs text-center">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Published</span>
                <span className="text-xl font-black text-emerald-700 mt-0.5 block">{selectedPostForReport.successCount || 0}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200/90 shadow-2xs text-center">
                <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">Failed</span>
                <span className="text-xl font-black text-rose-700 mt-0.5 block">{selectedPostForReport.failedCount || 0}</span>
              </div>
            </div>

            {/* Channel List Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 custom-scrollbar">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Individual Channel Results ({selectedPostForReport.channelDetails?.length || 0})
              </h4>

              {selectedPostForReport.channelDetails?.map((ch, idx) => {
                const isFail = ch.success === false || (selectedPostForReport.results && selectedPostForReport.results[ch.id]?.success === false);
                const errorMsg = ch.error || (selectedPostForReport.results && selectedPostForReport.results[ch.id]?.error);
                const postId = ch.postId || (selectedPostForReport.results && selectedPostForReport.results[ch.id]?.id);

                // Friendly Diagnosis Parser
                let friendlyReason = null;
                let resolutionTip = null;

                if (errorMsg) {
                  const lowerErr = String(errorMsg).toLowerCase();
                  if (lowerErr.includes("aspect ratio") || lowerErr.includes("36003")) {
                    friendlyReason = "Aspect Ratio Not Supported by Meta";
                    resolutionTip = "Instagram requires images with aspect ratios between 4:5 (vertical) and 1.91:1 (horizontal). Square (1:1) is optimal. Please crop or resize your image.";
                  } else if (lowerErr.includes("requires a video") || lowerErr.includes("video file")) {
                    friendlyReason = "YouTube Requires Video File";
                    resolutionTip = "YouTube API does not support static image/photo uploads. To publish on YouTube, please attach an MP4/MOV video file.";
                  } else if (lowerErr.includes("unauthorized") || lowerErr.includes("token") || lowerErr.includes("401") || lowerErr.includes("190")) {
                    friendlyReason = "OAuth Access Token Expired or Revoked";
                    resolutionTip = "The channel's authentication expired on the platform side. Please go to Social Channels (/accounts) and reconnect this account.";
                  } else if (lowerErr.includes("credits depleted") || lowerErr.includes("402") || lowerErr.includes("payment required")) {
                    friendlyReason = "Twitter / X Monthly API Quota Depleted";
                    resolutionTip = "Your X Developer Portal credits are exhausted. Please top-up on developer.x.com.";
                  } else if (lowerErr.includes("transient") || lowerErr.includes("code 2")) {
                    friendlyReason = "Platform Temporary Glitch";
                    resolutionTip = "Meta Graph API experienced a temporary processing delay. You can retry publishing this draft.";
                  }
                }

                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isFail
                        ? "bg-rose-50/40 border-rose-200"
                        : "bg-white border-slate-200/90 shadow-2xs hover:shadow-xs"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                          <PlatformIcon platform={ch.platform} className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-bold text-slate-900 text-xs truncate">{ch.name}</h5>
                          <span className="text-[10px] text-slate-400 capitalize block">{ch.platform}</span>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {isFail ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-wider border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-600" /> Failed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Published
                          </span>
                        )}
                        {postId && (
                          <span className="text-[10px] font-mono text-slate-400 block mt-1">
                            ID: {postId}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Error Diagnostic Box */}
                    {isFail && (
                      <div className="mt-2.5 pt-2.5 border-t border-rose-200/80 space-y-1.5 text-left">
                        {friendlyReason && (
                          <div className="flex items-center gap-1.5 text-xs font-black text-rose-900">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>{friendlyReason}</span>
                          </div>
                        )}
                        {resolutionTip && (
                          <p className="text-[11px] text-rose-800 font-medium leading-relaxed bg-white/70 p-2 rounded-xl border border-rose-200">
                            💡 <strong>How to Fix:</strong> {resolutionTip}
                          </p>
                        )}
                        {errorMsg && (
                          <div className="bg-slate-900 text-slate-200 p-2 rounded-xl text-[10px] font-mono overflow-x-auto">
                            <code>{errorMsg}</code>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem("edit_post", JSON.stringify(selectedPostForReport));
                  setSelectedPostForReport(null);
                  router.push("/publisher");
                }}
                className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Open in Post Composer</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPostForReport(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Close Report
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DELETE PUBLISHED POST MODAL (REMOTE PLATFORMS + LOCAL) */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-start gap-4 bg-rose-50/50">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0 shadow-inner">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Delete Published Post
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5 line-clamp-1">
                  &ldquo;{postToDelete.title || "Social Post"}&rdquo;
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-rose-700">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Choose how you want to delete this content:</span>
                </div>
              </div>
              <button
                type="button"
                disabled={isDeletingRemotely}
                onClick={() => setPostToDelete(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Channels Summary */}
            <div className="p-6 space-y-4">
              {postToDelete.channelDetails && postToDelete.channelDetails.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Published Channels Detected:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {postToDelete.channelDetails.map((ch, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs"
                      >
                        <PlatformIcon platform={ch.platform} className="w-3.5 h-3.5" />
                        <span>{ch.name}</span>
                        {ch.success && <span className="text-[10px] text-emerald-600 font-bold">✓ Live</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress feedback when deleting */}
              {isDeletingRemotely && (
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center gap-3 animate-pulse">
                  <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin shrink-0" />
                  <span className="text-xs font-bold text-indigo-900">{deleteProgressMessage}</span>
                </div>
              )}

              {/* 2 Options */}
              {!isDeletingRemotely && (
                <div className="space-y-3">
                  {/* Option 1: Remote Delete from Social Channels + Platform */}
                  <div className="p-4 rounded-2xl border-2 border-rose-200 bg-rose-50/30 hover:bg-rose-50/60 transition-all space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 font-black text-xs shadow-xs">
                        1
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-extrabold text-rose-950">
                          🌐 Delete Everywhere (Channels & PostFly)
                        </h4>
                        <p className="text-[11.5px] text-rose-800 leading-relaxed">
                          Calls Facebook, Instagram, YouTube, X APIs to <strong>permanently delete</strong> the published post/video directly from your live accounts, and removes it from PostFly.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => executeDeletePost(postToDelete._id || postToDelete.id, true)}
                      className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete from Channels & Platform</span>
                    </button>
                  </div>

                  {/* Option 2: Delete from PostFly Only */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-xl bg-slate-300 text-slate-800 flex items-center justify-center shrink-0 font-black text-xs shadow-xs">
                        2
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-extrabold text-slate-900">
                          📱 Delete from PostFly Platform Only
                        </h4>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed">
                          Keeps the post live and published on your social media channels, but removes it from your PostFly dashboard & content history.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => executeDeletePost(postToDelete._id || postToDelete.id, false)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                      <span>Remove from PostFly Only</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                disabled={isDeletingRemotely}
                onClick={() => setPostToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MEDIA PREVIEW MODAL */}
      <MediaPreviewModal
        isOpen={Boolean(previewMedia)}
        onClose={() => setPreviewMedia(null)}
        mediaUrl={previewMedia?.url}
        mediaType={previewMedia?.type}
        title={previewMedia?.title}
        description={previewMedia?.description}
      />

    </div>
  );
}
