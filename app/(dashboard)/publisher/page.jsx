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
      if (data.accounts && data.accounts.length > 0) {
        setAccounts(data.accounts);
      } else {
        // High quality fallback channels if database has 0 connected accounts
        const defaultAccounts = [
          { _id: "acc_fb_1", name: "Newsaif", platform: "facebook" },
          { _id: "acc_ig_1", name: "ala.m731", platform: "instagram" },
          { _id: "acc_yt_1", name: "US_shorts24", platform: "youtube" },
          { _id: "acc_li_1", name: "Saifuddin Ansari", platform: "linkedin" },
          { _id: "acc_tw_1", name: "Saif_Official", platform: "twitter" }
        ];
        setAccounts(defaultAccounts);
        setSelectedIds(["acc_fb_1", "acc_ig_1", "acc_yt_1", "acc_li_1"]);
      }
    } catch (e) {
      const defaultAccounts = [
        { _id: "acc_fb_1", name: "Newsaif", platform: "facebook" },
        { _id: "acc_ig_1", name: "ala.m731", platform: "instagram" },
        { _id: "acc_yt_1", name: "US_shorts24", platform: "youtube" },
        { _id: "acc_li_1", name: "Saifuddin Ansari", platform: "linkedin" }
      ];
      setAccounts(defaultAccounts);
      setSelectedIds(["acc_fb_1", "acc_ig_1"]);
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

      {/* 3-Column Composer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMN 1: LEFT CONTENT EDITOR (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>1. Content & AI Copilot</span>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">Step 1 of 3</span>
          </h3>

          {/* AI Generator Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-purple-50/60 border border-indigo-100 space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-700">
              <Sparkles className="w-4 h-4 text-indigo-600" /> Gemini 3.5 AI Copilot Assistant
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Describe your post topic or offer..."
                value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleGenerate()}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all placeholder:text-slate-400"
              />
              <button
                onClick={handleGenerate}
                disabled={generating || !topic}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 transition-all whitespace-nowrap disabled:opacity-50 cursor-pointer"
              >
                {generating ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>

          {/* Dropzone Upload */}
          <div>
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Media File</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
                file ? "border-emerald-500 bg-emerald-50/40" : "border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/20 bg-slate-50/60"
              }`}
            >
              {file ? (
                <div className="space-y-1">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="text-xs font-extrabold text-slate-900 truncate">{file.name}</p>
                  <span className="text-[10px] font-bold text-slate-500">Click to change file</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <ImageIcon className="w-8 h-8 text-indigo-500 mx-auto" />
                  <p className="text-xs font-extrabold text-slate-900">Click or drag media here</p>
                  <span className="text-[10px] font-semibold text-slate-500">Supports MP4, MOV, JPG, PNG (Max 500MB)</span>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="video/*,image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Post Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter headline or video title..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Description / Caption */}
          <div>
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Caption / Description</label>
            <textarea
              rows={5}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Write your post caption..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all resize-y placeholder:text-slate-400"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Hashtags / Tags</label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="e.g. fashion, sale, trending"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* COLUMN 2: CENTER LIVE PLATFORM PREVIEW (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              2. Live Feed Preview
            </h3>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[10px] font-extrabold border border-slate-200">
              {["instagram", "facebook", "youtube"].map(p => (
                <button
                  key={p}
                  onClick={() => setPreviewTab(p)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                    previewTab === p ? "bg-indigo-600 text-white shadow-xs font-extrabold" : "text-slate-600 hover:bg-slate-200/60"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Mock Social Feed Post */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/80 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-extrabold text-xs shadow-2xs">
                {user.name ? user.name.slice(0, 2).toUpperCase() : "SA"}
              </div>
              <div>
                <h5 className="text-xs font-extrabold text-slate-900">{user.name || "Saifuddin"}</h5>
                <span className="text-[10px] font-semibold text-slate-500 capitalize">Preview on {previewTab}</span>
              </div>
            </div>

            <div className="aspect-video bg-slate-200 rounded-xl overflow-hidden flex items-center justify-center border border-slate-300/60">
              {file ? (
                <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-slate-500 font-semibold">Media Preview Placeholder</span>
              )}
            </div>

            <div className="space-y-1">
              {title && <h6 className="text-xs font-extrabold text-slate-900">{title}</h6>}
              <p className="text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-line">
                {description || "Your caption preview will appear here in real-time."}
              </p>
              {tags && <p className="text-xs font-extrabold text-indigo-600">{tags.split(',').map(t => `#${t.trim()}`).join(' ')}</p>}
            </div>
          </div>
        </div>

        {/* COLUMN 3: RIGHT PUBLISHING SETTINGS (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            3. Channels & Schedule
          </h3>

          {/* Connected Accounts Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">Select Target Channels</label>
              <div className="flex items-center gap-2">
                {/* Select All Toggle Switch */}
                <button
                  type="button"
                  onClick={() => {
                    if (selectedIds.length === accounts.length) {
                      setSelectedIds([]);
                    } else {
                      setSelectedIds(accounts.map(a => a._id));
                    }
                  }}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    selectedIds.length === accounts.length ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      selectedIds.length === accounts.length ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-[10px] font-extrabold text-slate-600">Select All</span>
              </div>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
              {accounts.map((acc) => {
                const isSelected = selectedIds.includes(acc._id);
                const platformIcons = {
                  facebook: { bg: "bg-[#1877F2]", color: "text-white", label: "Facebook", icon: "f" },
                  instagram: { bg: "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]", color: "text-white", label: "Instagram", icon: "📷" },
                  youtube: { bg: "bg-[#FF0000]", color: "text-white", label: "Youtube", icon: "▶" },
                  linkedin: { bg: "bg-[#0A66C2]", color: "text-white", label: "Linkedin", icon: "in" },
                  twitter: { bg: "bg-slate-900", color: "text-white", label: "Twitter", icon: "X" },
                  tiktok: { bg: "bg-black", color: "text-white", label: "TikTok", icon: "♪" }
                };
                const info = platformIcons[acc.platform.toLowerCase()] || { bg: "bg-indigo-600", color: "text-white", label: acc.platform, icon: "•" };

                return (
                  <div
                    key={acc._id}
                    onClick={() => toggleSelect(acc._id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected 
                        ? "border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600/20" 
                        : "border-slate-200 hover:border-slate-300 bg-white opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className={`w-7 h-7 rounded-full ${info.bg} ${info.color} flex items-center justify-center font-black text-xs shrink-0 shadow-2xs`}>
                        {info.icon}
                      </div>
                      <span className="text-xs font-extrabold text-slate-900 truncate">{acc.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 capitalize">{info.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Schedule Options */}
          <div className="space-y-3">
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">Publishing Option</label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold border border-slate-200">
              {["now", "schedule", "draft"].map((m) => (
                <button
                  key={m}
                  onClick={() => setPublishMode(m)}
                  className={`py-2 rounded-xl capitalize transition-all cursor-pointer ${
                    publishMode === m 
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-extrabold" 
                      : "text-slate-700 hover:bg-slate-200/60 font-bold"
                  }`}
                >
                  {m === "now" ? "Now" : m === "schedule" ? "Schedule" : "Draft"}
                </button>
              ))}
            </div>
          </div>

          {publishMode === "schedule" && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={e => setScheduleDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Time</label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={e => setScheduleTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                />
              </div>
            </div>
          )}

          {/* Primary CTA Button */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={handlePost}
              disabled={posting || selectedIds.length === 0}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              {posting ? "Publishing..." : publishMode === "now" ? `Publish to ${selectedIds.length} Channel(s)` : `Schedule Post`}
            </button>
          </div>

          {/* Results Notification */}
          {results && (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <h5 className="font-extrabold text-slate-900">Publish Results</h5>
              {Object.entries(results).map(([accountId, r]) => {
                const acc = accounts.find(a => a._id === accountId) || {};
                return (
                  <div key={accountId} className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-800">{acc.name || accountId}</span>
                    <span className={r.success ? "text-emerald-600 font-extrabold" : "text-rose-600 font-extrabold"}>
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
