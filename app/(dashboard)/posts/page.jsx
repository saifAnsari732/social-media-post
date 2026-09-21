"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, CheckCircle2, XCircle, Search, Filter, Trash2, Copy, Send, Calendar } from "lucide-react";
import toast from 'react-hot-toast';
import { TableSkeleton } from "@/components/ui/Skeletons";
import { EmptyState } from "@/components/ui/EmptyState";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const userStr = localStorage.getItem("yt_user");
      if (!userStr) return;
      const { userId } = JSON.parse(userStr);

      const res = await fetch("/api/post", {
        headers: { "x-user-id": userId }
      });
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = (post.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (post.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "All") return matchesSearch;
    if (activeTab === "Published") return matchesSearch; // All saved in DB are published currently
    return matchesSearch;
  });

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Post Management</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage your published content, scheduled posts, and drafts.
          </p>
        </div>

        <Link 
          href="/publisher"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-xs shadow-md shadow-violet-600/20 hover:bg-violet-700 transition-all no-underline shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Post
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-white border border-slate-200/80 p-1 rounded-xl shadow-xs text-xs font-bold text-slate-600">
          {["All", "Published", "Scheduled", "Draft", "Failed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === tab ? "bg-slate-900 text-white shadow-xs" : "hover:bg-slate-50 text-slate-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-slate-200/80 px-3 py-2 rounded-xl text-xs max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full border-none bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium"
          />
        </div>
      </div>

      {/* Posts Table */}
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
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="py-3.5 px-6">Post Content</th>
                <th className="py-3.5 px-4">Published Date</th>
                <th className="py-3.5 px-4">Channels</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredPosts.map((post) => (
                <tr key={post._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6 max-w-md">
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{post.title || "Untitled Post"}</h4>
                    {post.description && (
                      <p className="text-slate-500 text-xs line-clamp-1">{post.description}</p>
                    )}
                  </td>
                  <td className="py-4 px-4 text-slate-500">
                    {new Date(post.createdAt).toLocaleDateString()} {new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {Object.keys(post.results || {}).map((accId, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-100 font-bold text-[10px] text-slate-700">
                          Acc #{accId.slice(-4)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Published
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => toast.success("Copied post content")} 
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
