"use client";

import React from "react";
import { X, Play, FileVideo, Image as ImageIcon, Download, ExternalLink } from "lucide-react";
import { formatImageKitUrl } from "@/lib/imagekit";

export default function MediaPreviewModal({ isOpen, onClose, mediaUrl, mediaType, title, description }) {
  if (!isOpen || !mediaUrl) return null;

  const isVideo = 
    mediaType === "video" || 
    mediaUrl.startsWith("data:video") || 
    mediaUrl.match(/\.(mp4|mov|webm|avi|m4v|mkv)$/i);

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-white space-y-0"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
              {isVideo ? <FileVideo className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 block">
                {isVideo ? "🎬 Draft Video Preview" : "🖼️ Draft Photo Preview"}
              </span>
              <h3 className="text-sm font-bold text-white truncate" title={title || "Draft Media Preview"}>
                {title || "Draft Media Preview"}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Video / Image Player */}
        <div className="p-4 sm:p-6 bg-slate-950 flex items-center justify-center min-h-[300px] max-h-[70vh] overflow-hidden">
          {isVideo ? (
            <video 
              key={mediaUrl}
              src={formatImageKitUrl(mediaUrl, true)} 
              controls 
              playsInline
              preload="auto"
              crossOrigin="anonymous"
              className="w-full max-h-[65vh] object-contain rounded-2xl shadow-2xl bg-black border border-slate-800"
            />
          ) : (
            <img 
              src={mediaUrl} 
              alt={title || "Draft Preview"} 
              className="w-full max-h-[65vh] object-contain rounded-2xl shadow-2xl bg-black/90 border border-slate-800"
            />
          )}
        </div>

        {/* Modal Footer */}
        {description && (
          <div className="px-6 py-3.5 bg-slate-900 border-t border-slate-800/80 text-xs text-slate-300 font-normal leading-relaxed line-clamp-2">
            <span className="font-semibold text-white mr-1.5">Caption:</span>
            {description}
          </div>
        )}

        <div className="px-6 py-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-3">
          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={isVideo ? "draft-video.mp4" : "draft-photo.jpg"}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 no-underline"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Media</span>
          </a>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
