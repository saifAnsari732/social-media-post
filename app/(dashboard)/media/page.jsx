"use client";

import { useState } from "react";
import { Folder, Upload, Image as ImageIcon, Video, FileText, Trash2, Download, Eye, Plus, LayoutGrid, List } from "lucide-react";
import toast from "react-hot-toast";

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [viewMode, setViewMode] = useState("Grid");

  const mediaItems = [
    {
      id: 1,
      name: "Q3_Brand_Launch_Banner.png",
      type: "Image",
      size: "2.4 MB",
      date: "Sep 20, 2026",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      name: "Product_Promo_Teaser.mp4",
      type: "Video",
      size: "18.5 MB",
      date: "Sep 19, 2026",
      url: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: 3,
      name: "Social_Campaign_Brief.pdf",
      type: "Document",
      size: "850 KB",
      date: "Sep 15, 2026",
      url: null
    }
  ];

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
            Manage your marketing images, video teasers, and content assets.
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

          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-xs shadow-md shadow-violet-600/20 hover:bg-violet-700 transition-all cursor-pointer">
            <Upload className="w-4 h-4" /> Upload Media
            <input type="file" className="hidden" onChange={() => toast.success("File uploaded to library!")} />
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
        {["All", "Image", "Video", "Document"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab
                ? "bg-violet-50 text-violet-700 border border-violet-100 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {tab}s
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {viewMode === "Grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all group">
              <div className="h-40 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                {item.url ? (
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <FileText className="w-12 h-12 text-slate-400" />
                )}
                <span className="absolute top-2 right-2 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-950/70 text-white backdrop-blur-xs">
                  {item.type}
                </span>
              </div>

              <div className="p-4">
                <h4 className="text-xs font-bold text-slate-900 truncate mb-1">{item.name}</h4>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{item.size}</span>
                  <span>{item.date}</span>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs font-bold">
                  <button 
                    onClick={() => window.location.href = "/publisher"}
                    className="text-violet-600 hover:text-violet-700"
                  >
                    Use in Post
                  </button>
                  <button 
                    onClick={() => toast.success("Deleted from Media Library")}
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
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                  {item.type === "Image" ? <ImageIcon className="w-5 h-5 text-violet-600" /> : <Video className="w-5 h-5 text-pink-600" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                  <span className="text-[11px] text-slate-400">{item.type} • {item.size} • Uploaded {item.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold">
                <button onClick={() => window.location.href = "/publisher"} className="text-violet-600 hover:underline">Use in Post</button>
                <button onClick={() => toast.success("Deleted")} className="text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
