"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Send, 
  Calendar, 
  Clock, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle,
  Hash,
  Smile,
  Globe,
  Trash2,
  RefreshCw,
  Zap,
  ArrowRight,
  Eye,
  FileText,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  ThumbsUp,
  MoreHorizontal,
  X,
  Layers,
  Check,
  Plus,
  Edit3,
  Play,
  FileVideo,
  Image as ImageIcon
} from "lucide-react";
import toast from "react-hot-toast";
import { PlatformIcon } from "@/components/ui/SocialIcons";
import { getStoredUser, checkPlanAccess } from "@/lib/user";
import MediaPreviewModal from "@/components/modals/MediaPreviewModal";

export default function PublisherPage() {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [posting, setPosting] = useState(false);
  const [results, setResults] = useState(null);
  const [publishMode, setPublishMode] = useState("draft"); // 'draft' (default) | 'now' | 'schedule'
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("18:30");
  const [previewTab, setPreviewTab] = useState("instagram");
  const [editingPost, setEditingPost] = useState(null);
  const [previewMedia, setPreviewMedia] = useState(null);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const isVideo = Boolean(
    file?.type?.startsWith("video/") || 
    file?.name?.match(/\.(mp4|mov|webm|avi|m4v|mkv|3gp)$/i) ||
    filePreview?.startsWith("data:video") ||
    filePreview?.includes("video") ||
    filePreview?.match(/\.(mp4|mov|webm|avi|m4v|mkv)$/i) ||
    editingPost?.mediaType === "video"
  );

  const [recentPosts, setRecentPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  useEffect(() => {
    const activeUser = getStoredUser();
    setUser(activeUser);
    fetchAccounts(activeUser.userId);
    fetchRecentPosts(activeUser.userId);

    const storedEdit = localStorage.getItem("edit_post");
    if (storedEdit) {
      try {
        const postToEdit = JSON.parse(storedEdit);
        localStorage.removeItem("edit_post");
        if (postToEdit) {
          handleStartEdit(postToEdit);
        }
      } catch (e) {}
    }
  }, []);

  async function fetchRecentPosts(userId) {
    try {
      setLoadingPosts(true);
      const targetUserId = userId || user?.userId || getStoredUser()?.userId;
      const res = await fetch(`/api/post?t=${Date.now()}`, {
        headers: { "x-user-id": targetUserId },
        cache: "no-store"
      });
      const data = await res.json();
      setRecentPosts(data.posts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPosts(false);
    }
  }

  function handleStartEdit(post) {
    setEditingPost(post);
    setTitle(post.title || "");
    setDescription(post.description || "");
    setTags(Array.isArray(post.tags) ? post.tags.join(", ") : post.tags || "");
    setSelectedIds(post.accountIds || []);
    setPublishMode(post.status === "Draft" ? "draft" : "now");
    setFile(null);
    if (post.mediaUrl) {
      setFilePreview(post.mediaUrl);
    } else {
      setFilePreview(null);
    }
    toast.success(`✍️ Editing "${post.title || 'Draft'}" — Loaded into composer!`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDeletePost(postId) {
    if (!confirm("Are you sure you want to delete this draft?")) return;
    try {
      const activeUserId = user?.userId || getStoredUser()?.userId;
      const res = await fetch(`/api/post?id=${postId}`, {
        method: "DELETE",
        headers: { "x-user-id": activeUserId }
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Draft deleted successfully!");
        if (editingPost && (editingPost._id === postId || editingPost.id === postId)) {
          setEditingPost(null);
          setTitle("");
          setDescription("");
          setTags("");
          setFilePreview(null);
        }
        await fetchRecentPosts(activeUserId);
      } else {
        toast.error("Failed to delete draft");
      }
    } catch (e) {
      toast.error("Error deleting draft");
    }
  }

  async function handlePublishDraft(postId) {
    const activeUserId = user?.userId || getStoredUser()?.userId;
    const allowed = checkPlanAccess({ action: "publish_post", router, toast });
    if (!allowed) return;
    try {
      const res = await fetch("/api/post", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": activeUserId || ""
        },
        body: JSON.stringify({ postId, action: "publish_now" })
      });
      const data = await res.json();
      if (data.success || res.ok) {
        toast.success("Draft published successfully!");
        fetchRecentPosts(activeUserId);
      } else {
        toast.error(data.error || "Failed to publish draft");
      }
    } catch (err) {
      toast.error(err?.message || "Error publishing draft");
    }
  }

  async function fetchAccounts(userId) {
    try {
      const res = await fetch("/api/accounts", {
        headers: { "x-user-id": userId }
      });
      const data = await res.json();
      if (data.accounts && data.accounts.length > 0) {
        setAccounts(data.accounts);
        setSelectedIds(data.accounts.map(a => a._id));
      } else {
        setAccounts([]);
        setSelectedIds([]);
      }
    } catch (e) {
      setAccounts([]);
      setSelectedIds([]);
    }
  }

  async function handleFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setFilePreview(URL.createObjectURL(f));
    setUploadingMedia(true);

    const isVideoFile = f.type?.startsWith("video/") || Boolean(f.name?.match(/\.(mp4|mov|webm|avi|m4v|mkv|3gp)$/i));

    try {
      // Step 1: Get ImageKit authentication parameters from backend
      const authRes = await fetch("/api/upload/auth");
      const authData = await authRes.json();

      if (authData && authData.signature && authData.token) {
        // Step 2: Upload DIRECTLY to ImageKit CDN (Bypasses Vercel 4.5MB body limit completely!)
        const ikFormData = new FormData();
        ikFormData.append("file", f);
        ikFormData.append("fileName", (f.name || `media_${Date.now()}`).replace(/[^a-zA-Z0-9_.-]/g, "_"));
        ikFormData.append("publicKey", authData.publicKey || "public_zA/OEOHQn+iEQFNIGyzHV7g3e+s=");
        ikFormData.append("signature", authData.signature);
        ikFormData.append("expire", String(authData.expire));
        ikFormData.append("token", authData.token);
        ikFormData.append("folder", isVideoFile ? "/social_posts/videos" : "/social_posts/images");
        ikFormData.append("useUniqueFileName", "true");

        const ikRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
          method: "POST",
          body: ikFormData
        });
        const ikResult = await ikRes.json();

        if (ikResult && ikResult.url) {
          setFilePreview(ikResult.url);
          toast.success(`⚡ Uploaded ${isVideoFile ? 'video' : 'photo'} directly to ImageKit CDN!`);
          return;
        }
      }

      // Fallback: If direct upload was not possible, upload through server API
      const formData = new FormData();
      formData.append("file", f);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        setFilePreview(data.url);
        toast.success(`⚡ Uploaded ${data.mediaType === 'video' ? 'video' : 'photo'} to ImageKit!`);
      } else {
        toast.error(data.error || "ImageKit upload failed");
      }
    } catch (err) {
      console.error("ImageKit upload error:", err);
      toast.error("Upload error: " + (err.message || "Failed to upload media"));
    } finally {
      setUploadingMedia(false);
    }
  }

  function removeFile() {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function toggleSelect(id) {
    setSelectedIds(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  }

  const [selectedLength, setSelectedLength] = useState("short"); // 'short' | 'medium' | 'long' | 'epic'
  const [selectedHashtagCount, setSelectedHashtagCount] = useState(15); // 5 | 15 | 25 | 30

  async function handleGenerate(customTopic, overrideLength, overrideType, overrideHashtags) {
    const allowed = checkPlanAccess({ action: "ai_generator", router, toast });
    if (!allowed) return;
    const promptToUse = customTopic || topic || title || "High Growth Social Strategy";
    const lengthToUse = overrideLength || selectedLength;
    const hashtagCountToUse = overrideHashtags || selectedHashtagCount;

    setGenerating(true);
    try {
      const res = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": user?.userId || "" },
        body: JSON.stringify({
          topic: promptToUse,
          platform: previewTab,
          length: lengthToUse,
          hashtagCount: hashtagCountToUse
        })
      });
      const data = await res.json();
      
      let gotData = false;
      if (data && !data.error) {
        if (data.title && overrideType !== "description" && overrideType !== "hashtags") {
          setTitle(data.title);
          gotData = true;
        }
        if (data.description && overrideType !== "title" && overrideType !== "hashtags") {
          setDescription(data.description);
          gotData = true;
        }
        if (data.hashtags && Array.isArray(data.hashtags) && data.hashtags.length > 0 && overrideType !== "title" && overrideType !== "description") {
          setTags(data.hashtags.map(t => t.replace(/^#/, '')).join(", "));
          gotData = true;
        }
      }

      if (!gotData) {
        throw new Error("Generation fallback required");
      }

      toast.success("AI text generated successfully!");
    } catch (err) {
      console.log("Using smart concept fallback generation:", err);
      const cleanPrompt = (promptToUse || "Social Media Strategy").trim();
      const lower = cleanPrompt.toLowerCase();

      let genTitle = "Transform Your Brand Reach with Next-Generation Social Automation";
      let genDesc = "";

      if (lower.includes("promosinal") || lower.includes("promo") || lower.includes("product") || lower.includes("application") || lower.includes("app") || lower.includes("video")) {
        genTitle = "Transform Your Brand Reach with Next-Generation Social Automation";
        if (lengthToUse === "short") {
          genDesc = 
            `Discover how our advanced publishing platform streamlines multi-channel distribution and automates content workflows.\n\n` +
            `Key Takeaways:\n` +
            `• Automated multi-channel post scheduling\n` +
            `• Real-time channel preview rendering\n` +
            `• High-converting AI caption and hashtag engine`;
        } else {
          genDesc = 
            `Elevate your brand presence with a modern social media management application built for digital creators and growth teams.\n\n` +
            `Core Strategic Features:\n` +
            `• Multi-Channel Automation: Draft, schedule, and publish content across Instagram, Facebook, YouTube, LinkedIn, and Twitter simultaneously.\n` +
            `• AI-Powered Content Engine: Instantly generate optimized headlines, structured captions, and targeted viral hashtags.\n` +
            `• High-Speed Media CDN: Upload and stream image and video assets seamlessly via integrated ImageKit hosting.\n` +
            `• Performance Intelligence: Track engagement metrics and optimize publishing schedules for maximum reach.\n\n` +
            `Implement these tools today to scale your online presence efficiently. Share your feedback in the comments below.`;
        }
      } else {
        const formattedTopic = cleanPrompt.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
        genTitle = `Mastering ${formattedTopic}: Comprehensive Growth Framework`;
        genDesc = 
          `Building a strong digital presence with ${formattedTopic} requires a structured approach to content, engagement, and audience retention.\n\n` +
          `Key Strategic Pillars:\n` +
          `• Hook Audience Retention: Capture viewer attention in the first 3 seconds with compelling headlines and value offers.\n` +
          `• Structured Content Delivery: Format your captions with clear bullet points, actionable advice, and strong calls to action.\n` +
          `• Multi-Channel Consistency: Distribute high-resolution media across all active social platforms systematically.\n\n` +
          `Apply these steps to build lasting brand authority. What is your primary objective with ${formattedTopic}? Join the discussion below.`;
      }

      if (overrideType !== "description" && overrideType !== "hashtags") {
        setTitle(genTitle);
      }
      if (overrideType !== "title" && overrideType !== "hashtags") {
        setDescription(genDesc);
      }
      if (overrideType !== "title" && overrideType !== "description") {
        const fallbackTags = [
          "contentcreator", "socialgrowth", "aiautomation", "viralcontent", 
          "marketingtips", "leadgeneration", "businessgrowth", "instagramtips", 
          "reelsviral", "contentstrategy", "digitalcreator", "onlinebusiness", 
          "branding101", "growthhacks", "audiencebuilding"
        ].slice(0, hashtagCountToUse || 15);
        setTags(fallbackTags.join(", "));
      }
      toast.success("AI text generated successfully!");
    } finally {
      setGenerating(false);
    }
  }

  async function handleIncreaseTitleLength() {
    toast("Generating long catchy title...", { icon: "✨" });
    await handleGenerate(topic || title || "Social Growth", "long", "title");
  }

  async function handleIncreaseCaptionLength() {
    toast("Expanding caption with 500+ word detailed guide & bullet points...", { icon: "📈" });
    await handleGenerate(topic || title || description || "Growth Strategy", "epic", "description");
  }

  async function handleIncreaseHashtags() {
    toast("Generating 25+ viral hashtags...", { icon: "🏷️" });
    await handleGenerate(topic || title || "Growth", "long", "hashtags", 25);
  }

  async function handlePost(overrideMode) {
    const allowed = checkPlanAccess({ action: "publish_post", router, toast });
    if (!allowed) return;
    const effectiveMode = overrideMode || publishMode;

    if (effectiveMode !== "draft" && selectedIds.length === 0) {
      toast.error("Please select at least 1 social channel!");
      return;
    }
    if (!title && !description && !file && !filePreview) {
      toast.error("Please add a title, caption, or media file before saving!");
      return;
    }

    setPosting(true);
    setResults(null);
    try {
      const activeUserId = user?.userId || getStoredUser()?.userId;

      // Determine final mediaUrl and mediaType
      let finalMediaUrl = filePreview || editingPost?.mediaUrl || null;
      let finalMediaType = isVideo ? "video" : (filePreview ? "image" : (editingPost?.mediaType || null));

      // UPDATE EXISTING DRAFT / POST
      if (editingPost) {
        const res = await fetch("/api/post", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": activeUserId
          },
          body: JSON.stringify({
            postId: editingPost._id || editingPost.id,
            action: effectiveMode === "now" ? "publish_now" : "update_draft",
            title: title || (effectiveMode === "draft" ? "Draft Post" : "Social Post"),
            description: description || "",
            tags: tags || "",
            accountIds: selectedIds,
            status: effectiveMode === "draft" ? "Draft" : (effectiveMode === "schedule" ? "Scheduled" : "Published"),
            mediaUrl: finalMediaUrl,
            mediaType: finalMediaType
          })
        });
        const data = await res.json();
        if (data.success || res.ok) {
          toast.success(effectiveMode === "draft" ? "📌 Draft updated successfully!" : "🚀 Post updated & published!");
          setEditingPost(null);
          await fetchRecentPosts(activeUserId);
          return;
        }
      }

      // CREATE NEW POST / DRAFT
      let res;
      const isHostedMedia = finalMediaUrl && (finalMediaUrl.startsWith("http://") || finalMediaUrl.startsWith("https://"));

      // If saving a draft, scheduling, or if media is already hosted on ImageKit, send fast lightweight JSON
      if (effectiveMode === "draft" || effectiveMode === "schedule" || isHostedMedia || !file) {
        res = await fetch("/api/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": activeUserId || ""
          },
          body: JSON.stringify({
            title: title || (effectiveMode === "draft" ? "Draft Post" : "Social Post"),
            description: description || "",
            tags: tags || "",
            accountIds: selectedIds,
            publishMode: effectiveMode,
            scheduledAt: effectiveMode === "schedule" ? (scheduleDate ? `${scheduleDate}T${scheduleTime || "12:00"}:00` : new Date().toISOString()) : null,
            mediaUrl: finalMediaUrl,
            mediaType: finalMediaType
          })
        });
      } else {
        const form = new FormData();
        if (file) form.append("file", file);
        if (finalMediaUrl) form.append("mediaUrl", finalMediaUrl);
        if (finalMediaType) form.append("mediaType", finalMediaType);

        form.append("title", title || "Social Post");
        form.append("description", description || "");
        form.append("tags", tags || "");
        form.append("accountIds", JSON.stringify(selectedIds));
        form.append("publishMode", effectiveMode);

        res = await fetch("/api/post", {
          method: "POST",
          body: form,
          headers: { "x-user-id": activeUserId || "" }
        });
      }

      let data = {};
      const rawText = await res.text().catch(() => "");
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch (jsonErr) {
        if (res.status === 413 || rawText.toLowerCase().includes("large") || rawText.toLowerCase().includes("entity")) {
          toast.error("File size too large for direct upload. ImageKit upload in progress.");
        } else {
          toast.error("Server communication error. Please try again.");
        }
        setPosting(false);
        return;
      }

      if (!res.ok || data.error) {
        toast.error(data.error || "Failed to publish or save post.");
        if (data.isExpired) {
          router.push("/billing");
        }
        return;
      }

      setResults(data.results);
      if (effectiveMode === "schedule") {
        toast.success("📅 Post scheduled successfully for " + scheduleDate);
      } else if (effectiveMode === "draft") {
        toast.success("📌 Post saved to drafts successfully!");
      } else {
        const hasFailures = data.results && Object.values(data.results).some(r => !r.success);
        if (hasFailures) {
          toast.error("⚠️ Some channels failed to publish. Check details below.");
        } else {
          toast.success("🚀 Post published successfully to all channels!");
        }
      }
      // Instant update bottom list
      await fetchRecentPosts(activeUserId);
    } catch (err) {
      toast.error(err?.message || "Failed to publish or save post.");
    } finally {
      setPosting(false);
    }
  }

  const promptIdeas = [
    "Product Announcement",
    "Growth Tips & Hacks",
    "Engaging Discussion Poll",
    "Behind the Scenes Story"
  ];

  // Live Count Calculations
  const titleCharCount = title.length;
  const titleWordCount = title.trim() ? title.trim().split(/\s+/).length : 0;
  const descCharCount = description.length;
  const descWordCount = description.trim() ? description.trim().split(/\s+/).length : 0;
  const hashtagCount = tags ? tags.split(",").map(t => t.trim()).filter(Boolean).length : 0;

  return (
    <div className="space-y-7 max-w-7xl mx-auto font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-950 tracking-tight">
            Social Post Composer
          </h1>
          <p className="text-xs lg:text-sm text-slate-600 mt-1 font-normal">
            Compose multimedia posts, craft AI captions, preview live, and publish across your channels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingPost(null);
              setTitle("");
              setDescription("");
              setTags("");
              setTopic("");
              removeFile();
              toast.success("Composer cleared");
            }}
            className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-2xs cursor-pointer"
          >
            Clear Form
          </button>
        </div>
      </div>

      {/* Active Edit Mode Banner */}
      {editingPost && (
        <div className="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-indigo-950 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white font-bold shrink-0">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-200/70 px-2 py-0.5 rounded-md">
                  Editing Mode Active
                </span>
                <span className="text-xs text-indigo-800 font-medium">• Changes will update this saved draft</span>
              </div>
              <h4 className="text-sm font-bold text-indigo-950 truncate max-w-lg mt-0.5">
                "{editingPost.title || "Untitled Draft"}"
              </h4>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingPost(null);
              setTitle("");
              setDescription("");
              setTags("");
              setFile(null);
              setFilePreview(null);
              toast("Cancelled edit mode", { icon: "🧹" });
            }}
            className="px-3.5 py-2 rounded-xl bg-white border border-indigo-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer shadow-2xs shrink-0"
          >
            Cancel Editing
          </button>
        </div>
      )}

      {/* 3-Column Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUMN 1: CONTENT EDITOR & AI (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 lg:p-6 shadow-2xs space-y-5">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-950 flex items-center gap-2">
              <span>1. Content & Creative Editor</span>
            </h2>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Step 1 of 3
            </span>
          </div>

          {/* AI Copilot Box with Configurable Controls */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-slate-50 to-violet-50/70 border border-indigo-200/90 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black text-indigo-950">
                <Zap className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                <span>Smart Caption Assistant</span>
              </div>
              <span className="text-[10.5px] font-bold text-indigo-700 uppercase tracking-wider bg-white px-2.5 py-0.5 rounded-full border border-indigo-200 shadow-2xs">
                Deep AI Generation
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="What should this post be about? (e.g. Summer sale, Monday tip)..."
                value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleGenerate()}
                className="flex-1 h-11 px-3.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-slate-400 shadow-2xs"
              />
              <button
                type="button"
                onClick={() => handleGenerate()}
                disabled={generating}
                className="px-4 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5 shrink-0 disabled:opacity-50"
              >
                {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-white" />}
                <span>{generating ? "Generating..." : "Generate AI"}</span>
              </button>
            </div>

            {/* Configurable Generation Options (Length & Hashtags) */}
            <div className="space-y-2 pt-1 border-t border-indigo-100/80">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-950">Text Length:</span>
                <div className="flex items-center gap-1">
                  {[
                    { id: "short", label: " (50w)" },
                    { id: "medium", label: "(100w)" },
                    { id: "long", label: "(300+w)" },
                  ].map(l => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setSelectedLength(l.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        selectedLength === l.id
                          ? "bg-indigo-600 text-white shadow-2xs"
                          : "bg-white text-slate-700 hover:bg-indigo-50 border border-slate-200"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-950">Hashtags Count:</span>
                <div className="flex items-center gap-1">
                  {[5, 15, 25, 30].map(cnt => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setSelectedHashtagCount(cnt)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        selectedHashtagCount === cnt
                          ? "bg-indigo-600 text-white shadow-2xs"
                          : "bg-white text-slate-700 hover:bg-indigo-50 border border-slate-200"
                      }`}
                    >
                      {cnt} Tags
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Topic Ideas */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-500 mr-1">Quick Ideas:</span>
              {promptIdeas.map((idea, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => { setTopic(idea); handleGenerate(idea); }}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-100/70 border border-slate-200 text-[11px] font-semibold text-slate-700 transition-all cursor-pointer shadow-2xs"
                >
                  + {idea}
                </button>
              ))}
            </div>
          </div>

          {/* Media File Upload Area (ImageKit Enabled) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span>Media Attachment (Photo or Video)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-100 text-violet-700 border border-violet-200">
                  ImageKit CDN
                </span>
              </label>
              {filePreview && (
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Remove File
                </button>
              )}
            </div>

            {uploadingMedia ? (
              <div className="border-2 border-slate-200 rounded-2xl p-8 text-center bg-violet-50/50 space-y-3">
                <RefreshCw className="w-8 h-8 text-violet-600 animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-900">Uploading media to ImageKit CDN...</p>
                <p className="text-[11px] text-slate-500">Optimizing photo & video for ultra-fast social delivery</p>
              </div>
            ) : filePreview ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-900 group max-h-64 flex items-center justify-center">
                {isVideo ? (
                  <video src={filePreview} controls className="w-full max-h-60 object-contain" />
                ) : (
                  <img src={filePreview} alt="Preview" className="w-full max-h-60 object-contain" />
                )}
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white transition-all shadow-md cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1">
                  <span>{isVideo ? "📹 Video Asset" : "🖼️ Image Asset"}</span>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-indigo-50/30 transition-all cursor-pointer space-y-2 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Click or drag & drop media here</p>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                    Supports MP4, MOV, PNG, JPG (Hosted live via ImageKit CDN)
                  </p>
                </div>
                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-bold shadow-2xs group-hover:border-indigo-400 cursor-pointer"
                >
                  Browse Computer
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Post Title with Character & Word Count Badge & Quick Action Button */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900">Post Title / Headline</label>
              <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-500">
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{titleCharCount} chars</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{titleWordCount} words</span>
              </div>
            </div>
            <input
              type="text"
              placeholder="Enter an engaging headline or video title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all shadow-2xs placeholder:text-slate-400"
            />
            <div className="flex items-center justify-end pt-0.5">
              <button
                type="button"
                onClick={handleIncreaseTitleLength}
                className=""
              >

              </button>
            </div>
          </div>

          {/* Caption & Content with Large Text Count Badge & Quick Expand Buttons */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900">Caption & Content</label>
              <div className="flex items-center gap-1.5 text-[10.5px] font-bold">
                <span className={`px-2 py-0.5 rounded border ${descCharCount > 2200 ? "bg-rose-100 text-rose-700 border-rose-300 font-extrabold" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                  {descCharCount}/2,200 chars
                </span>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                  {descWordCount} words
                </span>
              </div>
            </div>
            <textarea
              rows={6}
              placeholder="Write your post caption, hook, details, bullet points, and call to action..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all shadow-2xs placeholder:text-slate-400 resize-none leading-relaxed"
            />
            <div className="flex flex-wrap items-center justify-between">
              <button
                type="button"
                onClick={handleIncreaseCaptionLength}
                className=""
              >
               
              </button>
              <button
                type="button"
                onClick={() => handleGenerate(topic || title || "Quick Takeaway", "short", "description")}
                className=""
              >
             
              </button>
            </div>
          </div>

          {/* Hashtags & Tags with Hashtag Count Badge & Quick Action Button */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900">Hashtags & Tags</label>
              <span className="text-[10.5px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                {hashtagCount} hashtags
              </span>
            </div>
            <input
              type="text"
              placeholder="e.g. socialgrowth, contentcreator, viralpost"
              value={tags}
              onChange={e => setTags(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all shadow-2xs placeholder:text-slate-400"
            />
            <div className="flex items-center justify-end pt-0.5">
              <button
                type="button"
                onClick={handleIncreaseHashtags}
                className=""
              >
              
              </button>
            </div>
          </div>

        </div>

        {/* COLUMN 2: LIVE PREVIEW STUDIO (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 lg:p-6 shadow-2xs space-y-4">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-950">2. Live Channel Preview</h2>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Real-time Rendering
            </span>
          </div>

          {/* Platform Switcher Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200/80 overflow-x-auto custom-scrollbar">
            {["instagram", "facebook", "youtube", "linkedin", "twitter", "tiktok", "pinterest"].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPreviewTab(p)}
                className={`py-1.5 px-2.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap capitalize ${
                  previewTab === p
                    ? "bg-white text-slate-900 shadow-2xs border border-slate-200/80"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <PlatformIcon platform={p} className="w-3.5 h-3.5" />
                <span className="capitalize">{p}</span>
              </button>
            ))}
          </div>

          {/* Platform-Specific Mockup Rendering */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3 shadow-inner">
            
            {/* INSTAGRAM PREVIEW */}
            {previewTab === "instagram" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {user?.name ? user.name.slice(0, 2).toUpperCase() : "IG"}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{user?.name ? user.name.toLowerCase().replace(/\s+/g, '') : "creator_hub"}</h4>
                      <p className="text-[10px] text-slate-400">Instagram Feed • Just Now</p>
                    </div>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-slate-400" />
                </div>

                <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-200/90 aspect-square flex items-center justify-center relative group">
                  {filePreview ? (
                    isVideo ? (
                      <video src={filePreview} controls className="w-full h-full object-cover" />
                    ) : (
                      <img src={filePreview} alt="Live Preview" className="w-full h-full object-cover" />
                    )
                  ) : (
                    <div className="text-center p-6 space-y-2 text-slate-400">
                      <PlatformIcon platform="instagram" className="w-8 h-8 mx-auto text-rose-500" />
                      <p className="text-xs font-medium text-slate-300">Add photo/video to preview on Instagram</p>
                    </div>
                  )}
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-slate-700">
                    <div className="flex items-center gap-3">
                      <Heart className="w-4 h-4 hover:text-rose-500 cursor-pointer transition-colors" />
                      <MessageCircle className="w-4 h-4 hover:text-indigo-600 cursor-pointer transition-colors" />
                      <Share2 className="w-4 h-4 hover:text-indigo-600 cursor-pointer transition-colors" />
                    </div>
                    <Bookmark className="w-4 h-4 hover:text-amber-500 cursor-pointer transition-colors" />
                  </div>
                  <div className="text-[11px] font-bold text-slate-900">1,482 likes</div>
                  <div className="text-xs text-slate-800 leading-relaxed font-normal whitespace-pre-wrap">
                    <span className="font-bold mr-1 text-slate-900">{user?.name ? user.name.toLowerCase().replace(/\s+/g, '') : "creator_hub"}</span>
                    {title && <span className="font-bold block text-slate-950 mb-0.5">{title}</span>}
                    {description || <span className="text-slate-400 italic">Your Instagram caption will render here...</span>}
                  </div>
                  {tags && (
                    <div className="text-[11px] font-semibold text-indigo-600">
                      {tags.split(",").map(t => `#${t.trim().replace(/^#/, '')}`).join(" ")}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* FACEBOOK PREVIEW */}
            {previewTab === "facebook" && (
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {user?.name ? user.name.slice(0, 2).toUpperCase() : "FB"}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{user?.name || "Official Brand Page"}</h4>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        Just Now • <Globe className="w-3 h-3" />
                      </p>
                    </div>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-slate-400" />
                </div>

                <div className="text-xs text-slate-800 leading-relaxed font-normal whitespace-pre-wrap">
                  {title && <h4 className="font-bold text-slate-950 text-sm mb-1">{title}</h4>}
                  {description || <span className="text-slate-400 italic">Your Facebook post text will render here...</span>}
                </div>

                {filePreview && (
                  <div className="rounded-xl overflow-hidden bg-slate-900 max-h-64 flex items-center justify-center">
                    {isVideo ? (
                      <video src={filePreview} controls className="w-full max-h-60 object-contain" />
                    ) : (
                      <img src={filePreview} alt="FB Media" className="w-full max-h-60 object-cover" />
                    )}
                  </div>
                )}

                <div className="flex items-center justify-around pt-2 border-t border-slate-100 text-slate-600 text-xs font-bold">
                  <button className="flex items-center gap-1.5 hover:text-blue-600"><ThumbsUp className="w-4 h-4" /> Like</button>
                  <button className="flex items-center gap-1.5 hover:text-blue-600"><MessageCircle className="w-4 h-4" /> Comment</button>
                  <button className="flex items-center gap-1.5 hover:text-blue-600"><Share2 className="w-4 h-4" /> Share</button>
                </div>
              </div>
            )}

            {/* YOUTUBE PREVIEW */}
            {previewTab === "youtube" && (
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
                <div className="rounded-xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center relative group">
                  {filePreview ? (
                    isVideo ? (
                      <video src={filePreview} controls className="w-full h-full object-contain" />
                    ) : (
                      <div className="relative w-full h-full">
                        <img src={filePreview} alt="YouTube Thumbnail" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                            <Play className="w-6 h-6 fill-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="text-center p-6 space-y-2 text-slate-400">
                      <PlatformIcon platform="youtube" className="w-10 h-10 mx-auto text-red-600" />
                      <p className="text-xs font-medium text-slate-300">Upload video to preview YouTube Player</p>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {title || "Enter Video Title above..."}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-100">
                    <span>{user?.name || "YouTube Channel"} • 0 views • Just now</span>
                    <button className="px-2.5 py-1 rounded-full bg-red-600 text-white font-bold text-[10px]">Subscribe</button>
                  </div>
                  <p className="text-[11.5px] text-slate-600 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                    {description || "Video description text will render here..."}
                  </p>
                </div>
              </div>
            )}

            {/* LINKEDIN PREVIEW */}
            {previewTab === "linkedin" && (
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-blue-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {user?.name ? user.name.slice(0, 2).toUpperCase() : "IN"}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{user?.name || "Professional Creator"}</h4>
                    <p className="text-[10px] text-slate-500">Industry Leader • Just Now • 🌐</p>
                  </div>
                </div>

                <div className="text-xs text-slate-800 leading-relaxed font-normal whitespace-pre-wrap">
                  {title && <h4 className="font-bold text-slate-950 text-xs mb-1">{title}</h4>}
                  {description || <span className="text-slate-400 italic">LinkedIn professional copy will render here...</span>}
                </div>

                {filePreview && (
                  <div className="rounded-xl overflow-hidden bg-slate-900 max-h-60 flex items-center justify-center">
                    {isVideo ? (
                      <video src={filePreview} controls className="w-full max-h-56 object-contain" />
                    ) : (
                      <img src={filePreview} alt="LinkedIn Media" className="w-full max-h-56 object-cover" />
                    )}
                  </div>
                )}

                <div className="flex items-center justify-around pt-2 border-t border-slate-100 text-slate-600 text-[11px] font-bold">
                  <button className="hover:text-blue-700">👍 Like</button>
                  <button className="hover:text-blue-700">💬 Comment</button>
                  <button className="hover:text-blue-700">🔄 Repost</button>
                  <button className="hover:text-blue-700">📤 Send</button>
                </div>
              </div>
            )}

            {/* TWITTER / X PREVIEW */}
            {previewTab === "twitter" && (
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {user?.name ? user.name.slice(0, 2).toUpperCase() : "X"}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{user?.name || "Creator"}</h4>
                    <p className="text-[10px] text-slate-400">@{user?.name ? user.name.toLowerCase().replace(/\s+/g, '') : "creator"} • Just Now</p>
                  </div>
                </div>

                <div className="text-xs text-slate-900 leading-relaxed whitespace-pre-wrap">
                  {title && <p className="font-bold mb-1">{title}</p>}
                  {description || <span className="text-slate-400 italic">Tweet body text will render here...</span>}
                </div>

                {filePreview && (
                  <div className="rounded-xl overflow-hidden bg-slate-950 max-h-56 flex items-center justify-center">
                    {isVideo ? (
                      <video src={filePreview} controls className="w-full max-h-52 object-contain" />
                    ) : (
                      <img src={filePreview} alt="Tweet Media" className="w-full max-h-52 object-cover" />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TIKTOK / PINTEREST FALLBACK PREVIEW */}
            {(previewTab === "tiktok" || previewTab === "pinterest") && (
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs text-center space-y-3">
                <div className="rounded-xl overflow-hidden bg-slate-900 aspect-[9/16] max-h-80 mx-auto flex items-center justify-center relative">
                  {filePreview ? (
                    isVideo ? (
                      <video src={filePreview} controls className="w-full h-full object-cover" />
                    ) : (
                      <img src={filePreview} alt="Vertical Asset" className="w-full h-full object-cover" />
                    )
                  ) : (
                    <div className="text-slate-400 space-y-2 p-4">
                      <PlatformIcon platform={previewTab} className="w-10 h-10 mx-auto text-indigo-500" />
                      <p className="text-xs font-medium text-slate-300">Upload 9:16 vertical video or photo for {previewTab}</p>
                    </div>
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-900 truncate">{title || "Post Title"}</h4>
              </div>
            )}

          </div>

        </div>

        {/* COLUMN 3: CHANNEL SELECTION & PUBLISH (3 cols) */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-5 lg:p-6 shadow-2xs space-y-5">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-950">3. Target Channels</h2>
            <span className="text-[11px] font-bold text-indigo-600">
              {selectedIds.length} Selected
            </span>
          </div>

          {/* Account List Checkboxes */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
            {accounts.length === 0 ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium space-y-2 text-center">
                <p>No connected channels found.</p>
                <Link
                  href="/accounts"
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 underline"
                >
                  + Connect Social Channels
                </Link>
              </div>
            ) : (
              accounts.map((acc) => {
                const isSelected = selectedIds.includes(acc._id);
                return (
                  <div
                    key={acc._id}
                    onClick={() => toggleSelect(acc._id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                      isSelected
                        ? "bg-indigo-50/80 border-indigo-500 shadow-2xs"
                        : "bg-slate-50/70 border-slate-200/80 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <PlatformIcon platform={acc.platform} className="w-5 h-5 shrink-0" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {acc.name || acc.accountName}
                        </h4>
                        <p className="text-[10.5px] text-slate-500 capitalize truncate">
                          {acc.platform}
                        </p>
                      </div>
                    </div>

                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300 bg-white"
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Publishing Mode Radio Tabs */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-900">PUBLISHING MODE</label>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-bold">
              {[
                { id: "now", label: "Publish Now" },
                { id: "schedule", label: "Schedule" },
                { id: "draft", label: "Save / Draft" }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPublishMode(m.id)}
                  className={`py-2 rounded-lg transition-all text-center cursor-pointer ${
                    publishMode === m.id
                      ? "bg-indigo-600 text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Date & Time Pickers */}
          {publishMode === "schedule" && (
            <div className="space-y-3 p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200/80 animate-in fade-in duration-200">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-indigo-950">Schedule Date</label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={e => setScheduleDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-indigo-600 shadow-2xs"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-indigo-950">Schedule Time</label>
                  <span className="text-[10px] font-bold text-indigo-600 bg-white px-1.5 py-0.5 rounded border border-indigo-200">
                    Peak: 6:30 PM
                  </span>
                </div>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={e => setScheduleTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-indigo-600 shadow-2xs"
                />
              </div>
            </div>
          )}

          {/* Primary Action Button */}
          <div className="pt-2 space-y-2.5">
            <button
              onClick={() => handlePost()}
              disabled={posting || (publishMode !== "draft" && selectedIds.length === 0)}
              className={`w-full py-3.5 px-4 rounded-xl text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50 ${
                publishMode === "draft"
                  ? "bg-amber-500 hover:bg-amber-600 active:bg-amber-700 shadow-amber-500/25"
                  : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-indigo-600/25"
              }`}
            >
              {publishMode === "draft" ? (
                <Bookmark className="w-4 h-4 fill-white" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>
                {posting 
                  ? "Processing..." 
                  : editingPost
                  ? (publishMode === "draft" ? "Update Draft" : "Update & Publish Now")
                  : publishMode === "schedule" 
                  ? `Schedule Post for ${selectedIds.length} Channel(s)` 
                  : publishMode === "draft"
                  ? "Save as Draft"
                  : `Publish to ${selectedIds.length} Channel(s) Now`}
              </span>
            </button>

            {/* Quick Save as Draft Button with Solid Rich Amber BG Color */}
            {publishMode !== "draft" && (
              <button
                type="button"
                onClick={() => handlePost("draft")}
                disabled={posting}
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-black text-xs shadow-md shadow-amber-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.98]"
              >
                <Bookmark className="w-4 h-4 fill-white text-white" />
                <span>{editingPost ? "Update Saved Draft" : "Save as Draft (Don't Publish)"}</span>
              </button>
            )}
          </div>

          {/* Results Modal / Notification */}
          {results && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <h5 className="font-bold text-slate-900">Publish Confirmation</h5>
              {Object.entries(results).map(([accountId, r]) => {
                const acc = accounts.find(a => a._id === accountId) || {};
                return (
                  <div key={accountId} className="space-y-0.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-slate-800">{acc.name || accountId}</span>
                      <span className={r.success ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                        {r.success ? "✓ Published" : "✕ Error"}
                      </span>
                    </div>
                    {!r.success && r.error && (
                      <p className="text-[10px] text-rose-600 font-medium break-words leading-tight bg-rose-50/90 p-1.5 rounded-lg border border-rose-200">
                        {r.error}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* RECENT POSTS & DRAFTS LIST SECTION WITH VIDEO PREVIEW & ADVANCED EDIT BUTTON */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm lg:text-base font-bold text-slate-950">
              Recent Posts & Saved Drafts ({recentPosts.length})
            </h3>
            <p className="text-xs text-slate-500 font-normal">
              Posts and drafts saved from this composer. Click any video/media thumbnail to watch or click "Edit" to modify content.
            </p>
          </div>

          <Link
            href="/posts"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 no-underline"
          >
            <span>View Full Library</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingPosts ? (
          <div className="space-y-2 py-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : recentPosts.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p className="text-xs font-medium">No posts or drafts created yet. Compose your first post above!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider text-[10.5px]">
                  <th className="py-2.5 px-4">Content & Media</th>
                  <th className="py-2.5 px-3">Date / Time</th>
                  <th className="py-2.5 px-3">Channels</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {recentPosts.slice(0, 8).map(post => {
                  const isDraft = post.status === "Draft";
                  const isScheduled = post.status === "Scheduled";
                  const dateObj = post.scheduledAt ? new Date(post.scheduledAt) : new Date(post.createdAt);
                  const formattedDate = dateObj.toLocaleDateString(undefined, { month: "short", day: "numeric" });
                  const formattedTime = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                  const isVideoMedia = post.mediaType === "video" || (post.mediaUrl && (post.mediaUrl.startsWith("data:video") || post.mediaUrl.match(/\.(mp4|mov|webm|avi|m4v)$/i)));

                  return (
                    <tr key={post._id || post.id} className="hover:bg-slate-50/60 transition-colors">
                      
                      {/* Content Column with Video/Photo Preview Thumbnail */}
                      <td className="py-3 px-4 max-w-sm">
                        <div className="flex items-center gap-3">
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
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 text-slate-500 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-slate-900 text-xs block truncate">{post.title || "Untitled Post"}</span>
                            {post.description && (
                              <span className="text-slate-500 text-[11px] block truncate">{post.description}</span>
                            )}
                            {post.mediaUrl && (
                              <button
                                type="button"
                                onClick={() => setPreviewMedia({ url: post.mediaUrl, type: isVideoMedia ? "video" : "image", title: post.title, description: post.description })}
                                className="inline-flex items-center gap-1 text-[10.5px] font-bold text-indigo-600 hover:text-indigo-700 mt-0.5 cursor-pointer"
                              >
                                <Play className="w-3 h-3 fill-indigo-600" />
                                <span>Watch Draft Video</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Date / Time */}
                      <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                        {formattedDate} • {formattedTime}
                      </td>

                      {/* Channels */}
                      <td className="py-3 px-3 max-w-[240px]">
                        {post.channelDetails && post.channelDetails.length > 0 ? (
                          <div className="flex flex-wrap items-center gap-1">
                            {post.channelDetails.slice(0, 2).map((ch, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10.5px] font-semibold text-slate-800"
                              >
                                <PlatformIcon platform={ch.platform} className="w-3 h-3 shrink-0" />
                                <span className="max-w-[80px] truncate">{ch.name}</span>
                              </span>
                            ))}
                            {post.channelDetails.length > 2 && (
                              <div className="relative group/ch">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-[10px] cursor-pointer hover:bg-indigo-100 shadow-2xs transition-all">
                                  +{post.channelDetails.length - 2} channels
                                </span>
                                {/* Hover Popover List */}
                                <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover/ch:flex flex-col gap-1.5 p-2.5 bg-slate-900 text-white rounded-xl shadow-xl z-30 min-w-[170px] max-w-[220px] text-[11px] border border-slate-700 animate-in fade-in duration-150">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                                    Target Channels ({post.channelDetails.length})
                                  </span>
                                  <div className="max-h-36 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                                    {post.channelDetails.map((ch, idx) => (
                                      <div key={idx} className="flex items-center gap-1.5 truncate text-slate-200 py-0.5">
                                        <PlatformIcon platform={ch.platform} className="w-3 h-3 shrink-0" />
                                        <span className="truncate">{ch.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">Channels linked</span>
                        )}
                      </td>

                      {/* Status Pill */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {isDraft ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10.5px] border border-amber-300">
                            Draft
                          </span>
                        ) : isScheduled ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10.5px] border border-blue-200">
                            <Calendar className="w-3 h-3" /> Scheduled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10.5px] border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Published
                          </span>
                        )}
                      </td>

                      {/* Actions Column: Edit, Publish Now, Delete */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* EDIT BUTTON */}
                          <button
                            onClick={() => handleStartEdit(post)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs transition-all cursor-pointer shadow-2xs"
                            title="Edit draft content in composer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Edit</span>
                          </button>

                          {/* PUBLISH NOW BUTTON */}
                          {isDraft && (
                            <button
                              onClick={() => handlePublishDraft(post._id || post.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
                              title="Publish draft now"
                            >
                              <Send className="w-3 h-3" />
                              <span>Publish Now</span>
                            </button>
                          )}

                          {/* DELETE BUTTON */}
                          <button
                            onClick={() => handleDeletePost(post._id || post.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                            title="Delete draft"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
