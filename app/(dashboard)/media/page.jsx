"use client";

import { useEffect, useState } from "react";
import { Folder, Upload, Image as ImageIcon, Video, FileText, Trash2, Download, Eye, Plus, LayoutGrid, List, Play, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { getStoredUser } from "@/lib/user";
import MediaPreviewModal from "@/components/modals/MediaPreviewModal";

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [viewMode, setViewMode] = useState("Grid");
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  async function fetchMedia() {
    try {
      setLoading(true);
      const user = getStoredUser();
      const res = await fetch(`/api/post?t=${Date.now()}`, {
        headers: { "x-user-id": user?.userId || "" }
      });
      const data = await res.json();
      const posts = data.posts || [];

      // Extract unique media assets from posts
      const itemsMap = new Map();
      posts.forEach(post => {
        if (post.mediaUrl) {
          const isVid = post.mediaType === "video" || post.mediaUrl.startsWith("data:video") || post.mediaUrl.match(/\.(mp4|mov|webm|avi|m4v)$/i);
          const itemKey = post.mediaUrl;
          if (!itemsMap.has(itemKey)) {
            itemsMap.set(itemKey, {
              id: post._id || post.id || Math.random().toString(),
              name: post.title || (isVid ? "Video Asset" : "Image Asset"),
              type: isVid ? "Video" : "Image",
              date: new Date(post.createdAt || Date.now()).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
              url: post.mediaUrl,
              postTitle: post.title,
              postDescription: post.description
            });
          }
        }
      });

      // Sample fallback items if no posts exist
      if (itemsMap.size === 0) {
        itemsMap.set("sample_1", {
          id: "s1",
          name: "Brand_Banner_Asset.png",
          type: "Image",
          date: "Sep 24, 2026",
          url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80"
        });
        itemsMap.set("sample_2", {
          id: "s2",
          name: "Promo_Teaser_Short.mp4",
          type: "Video",
          date: "Sep 22, 2026",
          url: "https://ik.imagekit.io/saifdeveloper/sample.mp4"
        });
      }

      setMediaItems(Array.from(itemsMap.values()));
    } catch (e) {
      console.error("Failed to load media items:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleUploadMedia(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        toast.success(`⚡ Uploaded ${data.mediaType === 'video' ? 'video' : 'photo'} to ImageKit CDN!`);
        const newItem = {
          id: Date.now().toString(),
          name: data.name || file.name,
          type: data.mediaType === "video" ? "Video" : "Image",
          date: "Just Now",
          url: data.url
        };
        setMediaItems(prev => [newItem, ...prev]);
      } else {
        toast.error(data.error || "Failed to upload file to ImageKit");
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload error");
    } finally {
      setUploading(false);
    }
  }

  function handleUseInPost(item) {
    localStorage.setItem("edit_post", JSON.stringify({
      title: item.postTitle || item.name || "Media Post",
      description: item.postDescription || "",
      mediaUrl: item.url,
      mediaType: item.type === "Video" ? "video" : "image"
    }));
    toast.success("Loaded media into Publisher!");
    window.location.href = "/publisher";
  }

  const filteredItems = mediaItems.filter(item => {
    if (activeTab === "All") return true;
    return item.type === activeTab;
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Media Library</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage your high-resolution images, video teasers, and ImageKit CDN assets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white border border-slate-200/80 p-1 rounded-xl shadow-xs text-xs font-bold text-slate-600">
            <button
              onClick={() => setViewMode("Grid")}
              className={`p-1.5 rounded-lg transition-all ${viewMode === "Grid" ? "bg-slate-900 text-white" : "hover:bg-slate-50"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("List")}
              className={`p-1.5 rounded-lg transition-all ${viewMode === "List" ? "bg-slate-900 text-white" : "hover:bg-slate-50"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-xs shadow-md shadow-violet-600/20 hover:bg-violet-700 transition-all cursor-pointer disabled:opacity-50">
            {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>{uploading ? "Uploading to ImageKit..." : "Upload Media to ImageKit"}</span>
            <input type="file" accept="image/*,video/*" className="hidden" onChange={handleUploadMedia} disabled={uploading} />
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
        {["All", "Image", "Video"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab
                ? "bg-violet-50 text-violet-700 border border-violet-100 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {tab === "All" ? "All Media" : `${tab}s`}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-500 space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-violet-600" />
          <p className="text-xs font-semibold">Loading ImageKit CDN media library...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-12 text-center text-slate-400 space-y-2 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
          <p className="text-xs font-semibold">No media found for this category.</p>
        </div>
      ) : viewMode === "Grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
              <div 
                onClick={() => setPreviewMedia({ url: item.url, type: item.type.toLowerCase(), title: item.name })}
                className="h-44 bg-slate-900 relative overflow-hidden flex items-center justify-center cursor-pointer"
              >
                {item.type === "Video" ? (
                  <>
                    <video src={item.url} className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-md">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                  </>
                ) : (
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                )}
                <span className="absolute top-2 right-2 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-950/80 text-white backdrop-blur-xs">
                  {item.type}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 truncate mb-1" title={item.name}>{item.name}</h4>
                  <div className="text-[11px] text-slate-400 font-medium">Uploaded {item.date}</div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold">
                  <button 
                    onClick={() => handleUseInPost(item)}
                    className="text-violet-600 hover:text-violet-700 font-bold hover:underline"
                  >
                    Use in Post
                  </button>
                  <button 
                    onClick={() => {
                      setMediaItems(prev => prev.filter(i => i.id !== item.id));
                      toast.success("Removed from view");
                    }}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm divide-y divide-slate-100">
          {filteredItems.map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600 shrink-0">
                  {item.type === "Image" ? <ImageIcon className="w-5 h-5 text-violet-600" /> : <Video className="w-5 h-5 text-pink-600" />}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                  <span className="text-[11px] text-slate-400">{item.type} • Uploaded {item.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold shrink-0">
                <button onClick={() => handleUseInPost(item)} className="text-violet-600 hover:underline">Use in Post</button>
                <button 
                  onClick={() => {
                    setMediaItems(prev => prev.filter(i => i.id !== item.id));
                    toast.success("Removed");
                  }} 
                  className="text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Media Preview Modal */}
      <MediaPreviewModal
        isOpen={Boolean(previewMedia)}
        onClose={() => setPreviewMedia(null)}
        mediaUrl={previewMedia?.url}
        mediaType={previewMedia?.type}
        title={previewMedia?.title}
      />
    </div>
  );
}
