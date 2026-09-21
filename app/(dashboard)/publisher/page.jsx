"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Send, 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  Link as LinkIcon, 
  Smile, 
  Hash, 
  Calendar, 
  Clock, 
  Globe, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Trash2,
  Eye,
  FileText
} from "lucide-react";
import toast from "react-hot-toast";

const PLATFORMS = [
  { id: "youtube", label: "YouTube", color: "bg-red-600 text-white" },
  { id: "facebook", label: "Facebook", color: "bg-blue-600 text-white" },
  { id: "instagram", label: "Instagram", color: "bg-pink-600 text-white" },
  { id: "twitter", label: "X / Twitter", color: "bg-slate-900 text-white" },
  { id: "linkedin", label: "LinkedIn", color: "bg-blue-700 text-white" },
  { id: "tiktok", label: "TikTok", color: "bg-[#000000] text-white" },
];

export default function PublisherPage() {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [posting, setPosting] = useState(false);
  const [results, setResults] = useState(null);
  const [publishMode, setPublishMode] = useState("now"); // 'now' | 'schedule' | 'draft'
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [previewTab, setPreviewTab] = useState("instagram");
  const fileInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("yt_user");
    if (!stored) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(stored);
    setUser(parsed);
    fetchAccounts(parsed.userId);
  }, []);

  async function fetchAccounts(userId) {
    try {
      const res = await fetch("/api/accounts", {
        headers: { "x-user-id": userId }
      });
      const data = await res.json();
      setAccounts(data.accounts || []);
    } catch (e) {
      toast.error("Failed to load connected accounts");
    }
  }

  function toggleSelect(id) {
    setSelectedIds(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  }

  async function handleGenerate() {
    if (!topic) { toast.error("Please enter a topic first!"); return; }
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": user.userId },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      
      if (!res.ok) {
        toast.error(data.error || "Failed to generate content.");
        return;
      }
      
      if (data.title) setTitle(data.title);
      if (data.description) setDescription(data.description);
      if (data.hashtags) setTags(data.hashtags.map(t => t.replace(/^#/, '')).join(", "));
      toast.success("AI Caption & Title generated!");
    } catch (err) {
      toast.error("Network error: Failed to generate content.");
    } finally {
      setGenerating(false);
    }
  }

  async function handlePost() {
    if (!file || selectedIds.length === 0 || !user) {
      toast.error("Please select media and at least 1 social channel!");
      return;
    }
    setPosting(true);
    setResults(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("title", title);
      form.append("description", description);
      form.append("tags", tags);
      form.append("accountIds", JSON.stringify(selectedIds));
      const res = await fetch("/api/post", {
        method: "POST",
        body: form,
        headers: { "x-user-id": user.userId }
      });
      const data = await res.json();
      setResults(data.results);
      toast.success("Post published successfully!");
    } catch (err) {
      toast.error("Failed to publish post.");
    } finally {
      setPosting(false);
    }
  }

  if (!user) return null;

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Social Post Composer</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Compose, generate with Gemini AI, preview live, and publish across multiple channels.
          </p>
        </div>
      </div>

      {/* 3-Column Composer Layout (Matches Section 9 of Prompt) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMN 1: LEFT CONTENT EDITOR (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            1. Content & AI Copilot
          </h3>

          {/* AI Generator Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50/60 border border-violet-100 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-violet-700">
              <Sparkles className="w-4 h-4 text-violet-600" /> Gemini 3.5 AI Copilot Assistant
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Describe your post topic or offer..."
                value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleGenerate()}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:border-violet-600"
              />
              <button
                onClick={handleGenerate}
                disabled={generating || !topic}
                className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-sm transition-all whitespace-nowrap"
              >
                {generating ? "..." : "Generate"}
              </button>
            </div>
          </div>

          {/* Dropzone Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Media File</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
                file ? "border-emerald-500 bg-emerald-50/30" : "border-slate-200 hover:border-violet-500 bg-slate-50/50"
              }`}
            >
              {file ? (
                <div className="space-y-1">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="text-xs font-bold text-slate-900 truncate">{file.name}</p>
                  <span className="text-[10px] text-slate-400">Click to change file</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-800">Click or drag media here</p>
                  <span className="text-[10px] text-slate-400">Supports MP4, MOV, JPG, PNG (Max 500MB)</span>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="video/*,image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Post Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter headline or video title..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-violet-600"
            />
          </div>

          {/* Description / Caption */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Caption / Description</label>
            <textarea
              rows={5}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Write your post caption..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-violet-600 resize-y"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Hashtags / Tags</label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="e.g. fashion, sale, trending"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-violet-600"
            />
          </div>
        </div>

        {/* COLUMN 2: CENTER LIVE PLATFORM PREVIEW (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. Live Preview
            </h3>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-[10px] font-bold">
              {["instagram", "facebook", "youtube"].map(p => (
                <button
                  key={p}
                  onClick={() => setPreviewTab(p)}
                  className={`px-2 py-1 rounded-md capitalize transition-all ${
                    previewTab === p ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Mock Social Feed Post */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-xs">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900">{user.name}</h5>
                <span className="text-[10px] text-slate-400 capitalize">Preview on {previewTab}</span>
              </div>
            </div>

            <div className="aspect-video bg-slate-200 rounded-xl overflow-hidden flex items-center justify-center">
              {file ? (
                <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-slate-400 font-medium">Media Preview Placeholder</span>
              )}
            </div>

            <div className="space-y-1">
              {title && <h6 className="text-xs font-bold text-slate-900">{title}</h6>}
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {description || "Your caption preview will appear here in real-time."}
              </p>
              {tags && <p className="text-xs font-bold text-violet-600">{tags.split(',').map(t => `#${t.trim()}`).join(' ')}</p>}
            </div>
          </div>
        </div>

        {/* COLUMN 3: RIGHT PUBLISHING SETTINGS (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            3. Channels & Schedule
          </h3>

          {/* Connected Accounts Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase">Select Target Channels</label>
            {accounts.length === 0 ? (
              <p className="text-xs text-slate-400">No accounts connected yet. Go to Social Channels to connect.</p>
            ) : (
              <div className="space-y-2">
                {accounts.map((acc) => {
                  const isSelected = selectedIds.includes(acc._id);
                  return (
                    <div
                      key={acc._id}
                      onClick={() => toggleSelect(acc._id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected ? "border-violet-600 bg-violet-50/50 shadow-xs" : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-violet-600' : 'bg-slate-300'}`}></span>
                        <span className="text-xs font-bold text-slate-900 truncate">{acc.name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 capitalize">{acc.platform}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Schedule Options */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase">Publishing Option</label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {["now", "schedule", "draft"].map((m) => (
                <button
                  key={m}
                  onClick={() => setPublishMode(m)}
                  className={`py-1.5 rounded-lg capitalize transition-all ${
                    publishMode === m ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {publishMode === "schedule" && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Date</label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={e => setScheduleDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Time</label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={e => setScheduleTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>
            </div>
          )}

          {/* Primary CTA */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={handlePost}
              disabled={posting || !file || selectedIds.length === 0}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-violet-600/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {posting ? "Publishing..." : publishMode === "now" ? `Publish to ${selectedIds.length} Channel(s)` : `Schedule Post`}
            </button>
          </div>

          {/* Results Notification */}
          {results && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <h5 className="font-bold text-slate-900">Publish Results</h5>
              {Object.entries(results).map(([accountId, r]) => {
                const acc = accounts.find(a => a._id === accountId) || {};
                return (
                  <div key={accountId} className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-700">{acc.name || accountId}</span>
                    <span className={r.success ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                      {r.success ? "✓ Success" : "✕ Failed"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
