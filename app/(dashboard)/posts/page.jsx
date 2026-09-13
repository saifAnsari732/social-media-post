"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, CheckCircle2, XCircle, LayoutGrid } from "lucide-react";
import toast from 'react-hot-toast';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Published Content</h1>
          <p className="text-[#64748B] text-sm mt-1">History of videos and posts published across your connected channels.</p>
        </div>
        <Link 
          href="/publisher"
          className="bg-[#7C3AED] text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-[#6D28D9] transition-colors flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-xl border border-[#E2E8F0]"></div>)}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-[#CBD5E1] p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-[#F8FAFC] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E2E8F0]">
            <LayoutGrid className="w-8 h-8 text-[#94A3B8]" />
          </div>
          <h3 className="text-lg font-bold text-[#0F172A] mb-2">No posts yet</h3>
          <p className="text-[#64748B] max-w-sm mx-auto mb-6">You haven't published any content through SocialFlow yet.</p>
          <Link href="/publisher" className="bg-[#7C3AED] text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-[#6D28D9] transition-colors inline-block text-sm">
            Publish your first post
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post._id} className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-[#0F172A] text-lg mb-1">{post.title || "Untitled Post"}</h3>
                  {post.description && (
                    <p className="text-[#64748B] text-sm line-clamp-2 mb-3">{post.description}</p>
                  )}
                  <div className="text-xs font-medium text-[#94A3B8]">
                    Published on {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 md:max-w-xs justify-end">
                  {Object.entries(post.results || {}).map(([accountId, result]) => (
                    <div key={accountId} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${
                      result.success 
                        ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#16A34A]' 
                        : 'bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]'
                    }`}>
                      {result.success ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>Account ID: {accountId.slice(-4)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
