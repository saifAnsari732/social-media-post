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
  Image as ImageIcon
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
                          <div className="flex flex-wrap items-center gap-1.5">
                            {post.channelDetails.slice(0, 2).map((channel, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 font-semibold text-[11px] text-slate-800 shadow-2xs"
                              >
                                <PlatformIcon platform={channel.platform} className="w-3.5 h-3.5 shrink-0" />
                                <span className="max-w-[90px] truncate">{channel.name}</span>
                              </span>
                            ))}
                            {post.channelDetails.length > 2 && (
                              <div className="relative group/ch">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-[10.5px] cursor-pointer hover:bg-indigo-100 shadow-2xs transition-all">
                                  +{post.channelDetails.length - 2} channels
                                </span>
                                {/* Hover Popover List */}
                                <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover/ch:flex flex-col gap-1.5 p-2.5 bg-slate-900 text-white rounded-xl shadow-xl z-30 min-w-[180px] max-w-[230px] text-[11px] border border-slate-700 animate-in fade-in duration-150">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                                    Target Channels ({post.channelDetails.length})
                                  </span>
                                  <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                                    {post.channelDetails.map((ch, idx) => (
                                      <div key={idx} className="flex items-center gap-1.5 truncate text-slate-200 py-0.5">
                                        <PlatformIcon platform={ch.platform} className="w-3.5 h-3.5 shrink-0" />
                                        <span className="truncate">{ch.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic">All Connected Channels</span>
                        )}
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
                        <div className="flex items-center justify-end gap-1.5">
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
                            onClick={() => handleDeletePost(post._id || post.id)} 
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
