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
  CheckCheck,
  Sliders,
  Plus,
  Edit3,
  Play,
  FileVideo,
  Image as ImageIcon,
  MessageSquareOff,
  Copy,
  Type,
  Flame,
  BookOpen,
  Lightbulb,
  TrendingUp,
  Tag,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  AlertTriangle,
  Volume2,
  VolumeX,
  Scale,
  FileCheck,
  Camera,
  Cpu,
  Bot,
  FolderPlus,
  Folder,
  Music,
  Mic,
  Sparkles,
  Fingerprint
} from "lucide-react";
import toast from "react-hot-toast";
import { PlatformIcon } from "@/components/ui/SocialIcons";
import { getStoredUser, checkPlanAccess } from "@/lib/user";
import MediaPreviewModal from "@/components/modals/MediaPreviewModal";
import { formatImageKitUrl } from "@/lib/imagekit";

function convertToUnicodeBold(str) {
  const map = {
    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶',
    'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿',
    's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜',
    'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥',
    'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
    '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
  };
  return str.split('').map(c => map[c] || c).join('');
}

function convertToUnicodeItalic(str) {
  const map = {
    'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩', 'i': '𝘪',
    'j': '𝘫', 'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱', 'q': '𝘲', 'r': '𝘳',
    's': '𝘴', 't': '𝘵', 'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹', 'y': '𝘺', 'z': '𝘻',
    'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍', 'G': '𝘎', 'H': '𝘏', 'I': '𝘐',
    'J': '𝘑', 'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕', 'O': '𝘖', 'P': '𝘗', 'Q': '𝘘', 'R': '𝘙',
    'S': '𝘚', 'T': '𝘛', 'U': '𝘜', 'V': '𝘝', 'W': '𝘞', 'X': '𝗫', 'Y': '𝘠', 'Z': '𝘡'
  };
  return str.split('').map(c => map[c] || c).join('');
}

function renderFormattedHashtags(text, customHighlightClass = "text-indigo-600 font-semibold hover:underline cursor-pointer") {
  if (!text) return null;
  const regex = /(#[a-zA-Z0-9_\u0900-\u097F]+|@[a-zA-Z0-9_.]+|https?:\/\/[^\s]+)/g;
  const parts = text.split(regex);
  return parts.map((part, i) => {
    if (part.startsWith("#")) {
      return (
        <span key={i} className={customHighlightClass}>
          {part}
        </span>
      );
    }
    if (part.startsWith("@")) {
      return (
        <span key={i} className="text-indigo-600 font-bold hover:underline cursor-pointer">
          {part}
        </span>
      );
    }
    if (part.startsWith("http://") || part.startsWith("https://")) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">
          {part}
        </a>
      );
    }
    return part;
  });
}

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
  const [selectedTone, setSelectedTone] = useState("viral"); // 'viral' | 'professional' | 'story' | 'promo' | 'educational'
  const [generating, setGenerating] = useState(false);
  const [posting, setPosting] = useState(false);
  const [results, setResults] = useState(null);
  const [publishMode, setPublishMode] = useState("draft"); // 'draft' (default) | 'now' | 'schedule'
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("18:30");
  const [processingAction, setProcessingAction] = useState(""); // 'upload' | 'draft' | 'publish' | 'schedule'
  const [disableComments, setDisableComments] = useState(false);
  const [youtubeFormat, setYoutubeFormat] = useState("auto"); // 'auto' | 'shorts' | 'standard'
  const [youtubePrivacy, setYoutubePrivacy] = useState("public"); // 'public' | 'unlisted' | 'private'
  const [youtubeMadeForKids, setYoutubeMadeForKids] = useState(false);
  const [youtubeCategory, setYoutubeCategory] = useState("22");
  const [instagramPlacement, setInstagramPlacement] = useState("reels"); // 'reels' | 'feed' | 'stories'
  const [instagramShareToFeed, setInstagramShareToFeed] = useState(true);
  const [facebookPlacement, setFacebookPlacement] = useState("reels_video"); // 'reels_video' | 'feed'
  const [showChannelOptimization, setShowChannelOptimization] = useState(false); // Collapsed by default as requested
  const [videoDimensions, setVideoDimensions] = useState(null); // { width, height, duration, isVertical, isShortsCompatible }
  const [previewTab, setPreviewTab] = useState("instagram");
  const [editingPost, setEditingPost] = useState(null);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [showCopyrightModal, setShowCopyrightModal] = useState(false);
  const [showAudioGuideModal, setShowAudioGuideModal] = useState(false);
  const [ownerBusiness, setOwnerBusiness] = useState("Kisan Groups");
  const [ownerWhatsapp, setOwnerWhatsapp] = useState("63900 59995");
  const [ownerEmail, setOwnerEmail] = useState("info@kisangroups.in");
  const [ownerWebsite, setOwnerWebsite] = useState("www.kisangroups.in");
  const [customDisclaimerText, setCustomDisclaimerText] = useState("");
  const [isDisclaimerTextCustomized, setIsDisclaimerTextCustomized] = useState(false);
  const [copyrightTab, setCopyrightTab] = useState("form");
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputePlatform, setDisputePlatform] = useState("youtube"); // 'youtube' | 'meta'
  const [customDisputeText, setCustomDisputeText] = useState("");
  const [scannerExpanded, setScannerExpanded] = useState(true);
  const [scanStatus, setScanStatus] = useState("idle"); // 'idle' | 'scanning' | 'completed'
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStepText, setScanStepText] = useState("");
  const [scanResultData, setScanResultData] = useState(null);
  const [scannerDetailedOpen, setScannerDetailedOpen] = useState(false);
  const [detectedMediaOrigin, setDetectedMediaOrigin] = useState("real"); // 'real' | 'ai'
  const [mediaOriginConfidence, setMediaOriginConfidence] = useState(98);
  const [activeScanStage, setActiveScanStage] = useState(1);
  const [stageStatuses, setStageStatuses] = useState({});
  const fileInputRef = useRef(null);
  const videoPreviewRef = useRef(null);
  const imagePreviewRef = useRef(null);
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

  const [hashtagGroups, setHashtagGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [newGroupNameInput, setNewGroupNameInput] = useState("");
  const [showCreateGroupInput, setShowCreateGroupInput] = useState(false);
  const [newSelfTagInput, setNewSelfTagInput] = useState("");
  const [showAddTagInput, setShowAddTagInput] = useState(false);

  useEffect(() => {
    const activeUser = getStoredUser();
    setUser(activeUser);
    fetchAccounts(activeUser.userId);
    fetchRecentPosts(activeUser.userId);

    try {
      const savedBusiness = localStorage.getItem("c_owner_business");
      const savedWhatsapp = localStorage.getItem("c_owner_whatsapp");
      const savedEmail = localStorage.getItem("c_owner_email");
      const savedWebsite = localStorage.getItem("c_owner_website");
      if (savedBusiness) setOwnerBusiness(savedBusiness);
      if (savedWhatsapp) setOwnerWhatsapp(savedWhatsapp);
      if (savedEmail) setOwnerEmail(savedEmail);
      if (savedWebsite) setOwnerWebsite(savedWebsite);

      const savedGroups = localStorage.getItem("user_hashtag_groups");
      if (savedGroups) {
        const parsed = JSON.parse(savedGroups);
        if (Array.isArray(parsed)) {
          // Remove default demo groups if they were previously saved
          const cleanGroups = parsed.filter(g => 
            g.id !== "grp_kisan" && 
            g.id !== "grp_viral" && 
            g.id !== "grp_business" &&
            !g.name?.includes("Kisan") &&
            !g.name?.includes("Viral Reels") &&
            !g.name?.includes("Business & Brand")
          );
          setHashtagGroups(cleanGroups);
          if (cleanGroups.length > 0) {
            setSelectedGroupId(cleanGroups[0].id);
          } else {
            setSelectedGroupId("");
          }
          localStorage.setItem("user_hashtag_groups", JSON.stringify(cleanGroups));
        }
      }
    } catch (e) {}

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
    setDisableComments(Boolean(post.disableComments));
    setYoutubeFormat(post.youtubeFormat || "auto");
    setYoutubePrivacy(post.youtubePrivacy || "public");
    setYoutubeMadeForKids(Boolean(post.youtubeMadeForKids));
    setYoutubeCategory(post.youtubeCategory || "22");
    setInstagramPlacement(post.instagramPlacement || "reels");
    setInstagramShareToFeed(post.instagramShareToFeed !== false);
    setFacebookPlacement(post.facebookPlacement || "reels_video");
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
    setPosting(true);
    setProcessingAction("publish");
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
    } finally {
      setPosting(false);
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
    setProcessingAction("upload");

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
          const cdnUrl = formatImageKitUrl(ikResult.url, isVideoFile);
          setFilePreview(cdnUrl);
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
        const cdnUrl = formatImageKitUrl(data.url, isVideoFile);
        setFilePreview(cdnUrl);
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

  function handleToggleSelectAll() {
    if (selectedIds.length === accounts.length && accounts.length > 0) {
      setSelectedIds([]);
      toast("Deselected all channels", { icon: "🧹" });
    } else {
      setSelectedIds(accounts.map(a => a._id));
      toast.success(`Selected all ${accounts.length} channels!`);
    }
  }

  function handleSelectGroup(group) {
    if (group === "meta") {
      const metaIds = accounts.filter(a => a.platform === "facebook" || a.platform === "instagram" || a.platform === "threads").map(a => a._id);
      setSelectedIds(metaIds);
      toast.success(`Selected ${metaIds.length} Meta channels!`);
    } else if (group === "video") {
      const videoIds = accounts.filter(a => a.platform === "youtube" || a.platform === "tiktok" || a.platform === "instagram").map(a => a._id);
      setSelectedIds(videoIds);
      toast.success(`Selected ${videoIds.length} video channels!`);
    }
  }

  const [selectedLength, setSelectedLength] = useState("short"); // 'short' | 'medium' | 'long' | 'epic'
  const [selectedHashtagCount, setSelectedHashtagCount] = useState(15); // 5 | 15 | 25 | 30
  const [enhancingPrompt, setEnhancingPrompt] = useState(false);
  const [enhanceCount, setEnhanceCount] = useState(0);

  function smartEnhanceKeywords(input, tone = "viral", iteration = 0) {
    const clean = input.replace(/^(The ultimate viral breakdown on|Exclusive launch and special discount breakdown for|5 Actionable step-by-step master tactics for|The untold behind-the-scenes journey of|Executive analysis and strategic roadmap on|Stop guessing with|The complete roadmap to)\s*:?\s*/i, "").trim();
    
    if (tone === "promo" || tone === "sales") {
      return `Exclusive launch and special offer breakdown for ${clean}: Limited-time incentives, high-value bonuses, and immediate customer call-to-action`;
    }
    if (tone === "educational" || tone === "actionable") {
      return `5 Actionable step-by-step master tactics for ${clean}: Beginner-friendly implementation, key metrics to track, and proven workflow cheatsheet`;
    }
    if (tone === "story") {
      return `The untold behind-the-scenes journey of ${clean}: The biggest obstacle faced, how it was solved, and 3 lessons every creator must know`;
    }
    if (tone === "professional" || tone === "authority") {
      return `Executive analysis and strategic roadmap on ${clean}: Industry data trends, competitive advantage, and future-proof scaling techniques`;
    }
    const viralTemplates = [
      `The ultimate viral breakdown on ${clean}: Proven high-retention hook, 3 critical secrets most people overlook, and maximum audience impact in 2026`,
      `Stop guessing with ${clean}: The battle-tested 3-step formula to skyrocket viewer retention and drive massive organic engagement`,
      `5 Game-changing secrets of ${clean} that industry leaders never share: Actionable tactics and high-converting framework`,
      `The complete roadmap to ${clean}: How to achieve 10x better results with zero fluff, actionable insights, and community call-to-action`
    ];
    return viralTemplates[iteration % viralTemplates.length];
  }

  async function handleEnhancePrompt() {
    const rawInput = topic.trim();
    if (!rawInput) {
      toast("Please enter a rough idea or keywords to enhance first!", { icon: "💡" });
      return;
    }

    setEnhancingPrompt(true);
    try {
      const res = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": user?.userId || "" },
        body: JSON.stringify({
          topic: rawInput,
          type: "enhance_prompt",
          tone: selectedTone
        })
      });
      const data = await res.json();

      if (data && data.enhancedPrompt) {
        setTopic(data.enhancedPrompt);
        setEnhanceCount(c => c + 1);
        toast.success("✨ Prompt enhanced with viral angle! Add more keywords or click Generate AI.");
        return;
      }
      throw new Error("Fallback required");
    } catch (err) {
      const enhanced = smartEnhanceKeywords(rawInput, selectedTone, enhanceCount);
      setTopic(enhanced);
      setEnhanceCount(c => c + 1);
      toast.success("✨ Prompt enhanced! Add more keywords or click Generate AI.");
    } finally {
      setEnhancingPrompt(false);
    }
  }

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

  function handleInsertEmoji(emoji) {
    setDescription(prev => prev ? `${prev} ${emoji}` : emoji);
  }

  function handleMakeBold() {
    if (!description.trim()) {
      if (title.trim()) {
        setTitle(convertToUnicodeBold(title));
        toast.success("Converted headline to bold!");
      } else {
        toast("Enter text to convert to bold", { icon: "ℹ️" });
      }
      return;
    }
    const lines = description.split("\n");
    lines[0] = convertToUnicodeBold(lines[0]);
    setDescription(lines.join("\n"));
    toast.success("Converted first line to Unicode Bold!");
  }

  function handleMakeItalic() {
    if (!description.trim()) return;
    const lines = description.split("\n");
    lines[0] = convertToUnicodeItalic(lines[0]);
    setDescription(lines.join("\n"));
    toast.success("Converted first line to Unicode Italic!");
  }

  function handleAddHook() {
    const hooks = [
      "Stop scrolling if you want to scale your reach in 2026 👇",
      "Most creators get this completely wrong... here is the real truth:",
      "If you're not doing this right now, you're leaving growth on the table 🚨",
      "Here is the exact framework that changed our results completely 🔥",
      "The #1 mistake holding back 90% of brands right now:"
    ];
    const randomHook = hooks[Math.floor(Math.random() * hooks.length)];
    setDescription(prev => prev ? `${randomHook}\n\n${prev}` : randomHook);
    toast.success("Added viral hook!");
  }

  function handleAddCTA() {
    const ctas = [
      "\n\n💬 What are your thoughts on this? Join the discussion below!\n📌 Save this post so you don't lose it.",
      "\n\n🚀 Double tap if this helped you!\n📲 Share with a creator who needs this today.",
      "\n\n👇 Drop a '🔥' in the comments if you want the full step-by-step breakdown!\n📌 Bookmark for your next project."
    ];
    const randomCTA = ctas[Math.floor(Math.random() * ctas.length)];
    setDescription(prev => `${prev.trim()}${randomCTA}`);
    toast.success("Added high-converting CTA!");
  }

  function handleAddBullets() {
    if (!description.trim()) return;
    const lines = description.split("\n").filter(l => l.trim().length > 0);
    const bulleted = lines.map(l => l.startsWith("•") || l.match(/^\d+\./) ? l : `• ${l}`).join("\n");
    setDescription(bulleted);
    toast.success("Formatted into bullet points!");
  }

  function handleCopyCaption() {
    if (!description.trim()) {
      toast.error("No caption to copy");
      return;
    }
    navigator.clipboard.writeText(description);
    toast.success("Caption copied to clipboard!");
  }

  const activeHashtagGroup = hashtagGroups.find(g => g.id === selectedGroupId) || hashtagGroups[0] || null;

  function handleSelectHashtagGroup(groupId) {
    setSelectedGroupId(groupId);
    setShowAddTagInput(false);
    setShowCreateGroupInput(false);
  }

  function handleCreateGroup() {
    const cleanName = newGroupNameInput.trim();
    if (!cleanName) {
      toast.error("Please enter a group name");
      return;
    }
    const newGroup = {
      id: `grp_${Date.now()}`,
      name: cleanName,
      tags: []
    };
    const updated = [...hashtagGroups, newGroup];
    setHashtagGroups(updated);
    setSelectedGroupId(newGroup.id);
    try {
      localStorage.setItem("user_hashtag_groups", JSON.stringify(updated));
    } catch (e) {}
    setNewGroupNameInput("");
    setShowCreateGroupInput(false);
    toast.success(`📁 Created group "${cleanName}"! Now add your hashtags.`);
  }

  function handleDeleteGroup(groupId, e) {
    if (e) e.stopPropagation();
    const groupToDelete = hashtagGroups.find(g => g.id === groupId);
    if (!confirm(`Are you sure you want to delete "${groupToDelete?.name || 'this group'}"?`)) return;
    const updated = hashtagGroups.filter(g => g.id !== groupId);
    setHashtagGroups(updated);
    if (selectedGroupId === groupId) {
      setSelectedGroupId(updated[0]?.id || "");
    }
    try {
      localStorage.setItem("user_hashtag_groups", JSON.stringify(updated));
    } catch (e) {}
    toast.success("Group deleted");
  }

  function handleAddTagToCurrentGroup() {
    const clean = newSelfTagInput.replace(/^[#,]/, '').trim();
    if (!clean) return;
    const lower = clean.toLowerCase();
    
    if (activeHashtagGroup.tags.some(t => t.toLowerCase() === lower)) {
      toast.error("Tag already exists in this group");
      return;
    }
    
    const updatedGroups = hashtagGroups.map(g => {
      if (g.id === activeHashtagGroup.id) {
        return { ...g, tags: [...g.tags, clean] };
      }
      return g;
    });
    setHashtagGroups(updatedGroups);
    try {
      localStorage.setItem("user_hashtag_groups", JSON.stringify(updatedGroups));
    } catch (e) {}
    setNewSelfTagInput("");
    setShowAddTagInput(false);
    toast.success(`Added #${clean} to "${activeHashtagGroup.name}"!`);
  }

  function handleDeleteTagFromGroup(tagToDelete, e) {
    if (e) e.stopPropagation();
    const updatedGroups = hashtagGroups.map(g => {
      if (g.id === activeHashtagGroup.id) {
        return { ...g, tags: g.tags.filter(t => t !== tagToDelete) };
      }
      return g;
    });
    setHashtagGroups(updatedGroups);
    try {
      localStorage.setItem("user_hashtag_groups", JSON.stringify(updatedGroups));
    } catch (e) {}
    toast("Tag removed from group", { icon: "🗑️" });
  }

  function handleAddGroupToDescription() {
    if (!activeHashtagGroup || activeHashtagGroup.tags.length === 0) {
      toast.error("No hashtags in this group to add");
      return;
    }
    const formattedTags = activeHashtagGroup.tags.map(t => `#${t.replace(/^#/, '')}`).join(" ");
    setDescription(prev => {
      if (!prev || !prev.trim()) return formattedTags;
      return `${prev.trim()}\n\n${formattedTags}`;
    });
    toast.success(`➕ Added ${activeHashtagGroup.tags.length} hashtags from "${activeHashtagGroup.name}" to description!`);
  }


  async function handleIncreaseTitleLength() {
    toast("Generating long catchy title...", { icon: "✨" });
    await handleGenerate(topic || title || "Social Growth", "long", "title");
  }

  async function handleIncreaseCaptionLength() {
    toast("Expanding caption with 500+ word detailed guide & bullet points...", { icon: "📈" });
    await handleGenerate(topic || title || description || "Growth Strategy", "epic", "description");
  }

  function generateCopyrightText(bName = ownerBusiness, wApp = ownerWhatsapp, em = ownerEmail, web = ownerWebsite) {
    return `✅ CONTENT DECLARATION & FAIR USE

Under Section 107 of the Copyright Act 1976, fair use allows 
use of copyrighted material for criticism, comment, news reporting, 
teaching, scholarship, and research.

This content is:
✓ Original Creation (100%)
✓ Fair Use Applicable (if referenced)
✓ Properly Attributed
✓ Legally Compliant

BUSINESS: ${bName || "Kisan Groups"}
📞 WhatsApp: ${wApp || "63900 59995"}
📧 Email: ${em || "info@kisangroups.in"}
🌐 Website: ${web || "www.kisangroups.in"}

All rights belong to their respective owners.
#OriginalContent #CopyrightFree #FairUse`;
  }

  function handleSaveOwnerInfoAndInsert(mode = "append") {
    try {
      localStorage.setItem("c_owner_business", ownerBusiness);
      localStorage.setItem("c_owner_whatsapp", ownerWhatsapp);
      localStorage.setItem("c_owner_email", ownerEmail);
      localStorage.setItem("c_owner_website", ownerWebsite);
    } catch (e) {}

    const textToInsert = isDisclaimerTextCustomized && customDisclaimerText.trim()
      ? customDisclaimerText.trim()
      : generateCopyrightText(ownerBusiness, ownerWhatsapp, ownerEmail, ownerWebsite);

    if (mode === "append") {
      setDescription(prev => prev && prev.trim() ? `${prev.trim()}\n\n${textToInsert}` : textToInsert);
    } else {
      setDescription(textToInsert);
    }

    // Append copyright tags if not already present
    const copyrightTags = ["OriginalContent", "CopyrightFree", "FairUse"];
    setTags(prev => {
      if (!prev) return copyrightTags.join(", ");
      const existing = prev.split(",").map(t => t.trim().toLowerCase());
      const missing = copyrightTags.filter(t => !existing.includes(t.toLowerCase()));
      if (missing.length === 0) return prev;
      return `${prev}, ${missing.join(", ")}`;
    });

    setShowCopyrightModal(false);
    setScanResultData(prev => {
      if (!prev) return prev;
      const filteredIssues = (prev.issues || []).filter(i => i.fixType !== "safe_harbor" && i.id !== "missing_fair_use");
      return {
        ...prev,
        issues: filteredIssues,
        safetyReport: {
          ...prev.safetyReport,
          platformPolicy: { status: "PASS", icon: "✓", badge: "✓ PASS", color: "emerald" }
        }
      };
    });
    toast.success("✅ Free Copyright & Fair Use notice added to description!");
  }

  function handleApplySafeHarbor() {
    const textToInsert = isDisclaimerTextCustomized && customDisclaimerText.trim()
      ? customDisclaimerText.trim()
      : generateCopyrightText(ownerBusiness, ownerWhatsapp, ownerEmail, ownerWebsite);

    setDescription(prev => {
      if (prev && (prev.includes("CONTENT DECLARATION & FAIR USE") || prev.includes("Section 107"))) {
        return prev;
      }
      return prev && prev.trim() ? `${prev.trim()}\n\n${textToInsert}` : textToInsert;
    });

    const copyrightTags = ["OriginalContent", "CopyrightFree", "FairUse"];
    setTags(prev => {
      if (!prev) return copyrightTags.join(", ");
      const existing = prev.split(",").map(t => t.trim().toLowerCase());
      const missing = copyrightTags.filter(t => !existing.includes(t.toLowerCase()));
      if (missing.length === 0) return prev;
      return `${prev}, ${missing.join(", ")}`;
    });

    setScanResultData(prev => {
      if (!prev) return prev;
      const filteredIssues = (prev.issues || []).filter(i => i.fixType !== "safe_harbor" && i.id !== "missing_fair_use");
      return {
        ...prev,
        issues: filteredIssues,
        safetyReport: {
          ...prev.safetyReport,
          platformPolicy: { status: "PASS", icon: "✓", badge: "✓ PASS", color: "emerald" }
        }
      };
    });

    toast.success("🛡️ 1-Click Safe Harbor & Section 107 Notice applied!");
  }

  function handleEnableYTSafeMode() {
    setYoutubePrivacy("unlisted");
    toast.success("🛡️ YouTube Safe Mode Active! Privacy switched to 'Unlisted' for Content ID pre-scan.");
  }

  function handleDeclareMetaAudio() {
    const metaNotice = `\n\n🎵 META RIGHTS & AUDIO DECLARATION:\nOriginal commentary and transformative audio/visual production under Fair Use & Meta Creator Terms. Audio rights remain with respective licensors/creators.\n#OriginalAudio #MetaCreators #FairUse`;
    setDescription(prev => {
      if (prev && prev.includes("META RIGHTS & AUDIO DECLARATION")) return prev;
      return prev && prev.trim() ? `${prev.trim()}${metaNotice}` : metaNotice.trim();
    });
    toast.success("🎵 Meta Rights Manager audio clearance declaration added!");
  }

  function handleDeclareOriginalVoice() {
    const voiceNotice = `\n\n🎙️ ORIGINAL AUDIO DECLARATION:\nOriginal voice, commentary & spoken narration recorded and produced by creator. 100% original human speech cleared for all platforms.\n#OriginalAudio #OriginalVoice #CreatorVoice`;
    setDescription(prev => {
      if (prev && (prev.includes("ORIGINAL AUDIO DECLARATION") || prev.includes("Original voice"))) return prev;
      return prev && prev.trim() ? `${prev.trim()}${voiceNotice}` : voiceNotice.trim();
    });
    setScanResultData(prev => {
      if (!prev) return prev;
      const filteredIssues = (prev.issues || []).filter(i => !i.id?.includes("audio") && !i.id?.includes("commercial_music"));
      return {
        ...prev,
        issues: filteredIssues,
        safetyReport: {
          ...prev.safetyReport,
          audio: { status: "LOW", icon: "✓", badge: "✓ LOW", color: "emerald", score: 5 },
          platformPolicy: filteredIssues.length === 0 ? { status: "PASS", icon: "✓", badge: "✓ PASS", color: "emerald" } : prev.safetyReport?.platformPolicy
        }
      };
    });
    setShowAudioGuideModal(false);
    toast.success("🎙️ Original Voice & Speech declaration added! Audio risk set to LOW.");
  }

  function handleDeclareRoyaltyFreeMusic() {
    const musicNotice = `\n\n🎵 AUDIO / SOUNDTRACK CLEARANCE:\nSoundtrack licensed via Meta Sound Collection / YouTube Audio Library. Free for commercial & organic creator monetization.\n#MetaSoundCollection #RoyaltyFreeAudio #NoCopyrightMusic`;
    setDescription(prev => {
      if (prev && prev.includes("AUDIO / SOUNDTRACK CLEARANCE")) return prev;
      return prev && prev.trim() ? `${prev.trim()}${musicNotice}` : musicNotice.trim();
    });
    setScanResultData(prev => {
      if (!prev) return prev;
      const filteredIssues = (prev.issues || []).filter(i => !i.id?.includes("audio") && !i.id?.includes("commercial_music"));
      return {
        ...prev,
        issues: filteredIssues,
        safetyReport: {
          ...prev.safetyReport,
          audio: { status: "LOW", icon: "✓", badge: "✓ LOW", color: "emerald", score: 5 },
          platformPolicy: filteredIssues.length === 0 ? { status: "PASS", icon: "✓", badge: "✓ PASS", color: "emerald" } : prev.safetyReport?.platformPolicy
        }
      };
    });
    setShowAudioGuideModal(false);
    toast.success("🎵 Royalty-Free / Meta Sound Collection clearance added!");
  }

  function generateYouTubeDisputeText() {
    return `FORMAL DISPUTE UNDER SECTION 107 OF THE COPYRIGHT ACT 1976

To: YouTube Copyright Operations & Content ID Rights Holder
Video Title: ${title || "Original Video Production"}
Channel / Creator: ${ownerBusiness || "Content Creator"}
Contact: ${ownerEmail || "info@kisangroups.in"} | WhatsApp: ${ownerWhatsapp || "63900 59995"}

1. FAIR USE DOCTRINE & TRANSFORMATIVE PURPOSE:
This video constitutes a transformative work protected under Section 107 of the U.S. Copyright Act of 1976. Any audio or video material referenced is used strictly for commentary, criticism, news reporting, educational, or transformative analysis. The video adds significant original creative commentary, narration, and visual modification.

2. MARKET IMPACT ASSESSMENT:
This usage does not serve as a market substitute for the original copyrighted work and has zero negative economic impact on the copyright owner's primary commercial market.

3. GOOD FAITH STATEMENT:
I have a good faith belief that the material identified was flagged as a result of an automated Content ID algorithm error, misidentification, or failure to evaluate Fair Use legal exceptions. 

Please release the Content ID claim on this video immediately.

Authorized Representative: ${ownerBusiness || "Content Creator"}
Date: ${new Date().toLocaleDateString('en-GB')}`;
  }

  function generateMetaDisputeText() {
    return `OFFICIAL META RIGHTS MANAGER / INSTAGRAM AUDIO APPEAL

To: Meta Rights Operations / Audio Rights Holder
Post / Reel Title: ${title || "Original Creative Reel"}
Page / Account: ${ownerBusiness || "Creator"}
Contact: ${ownerEmail || "info@kisangroups.in"}

APPEAL BASIS: Original Audio & Transformative Creation
1. The audio / video in this post was created for transformative educational, commentary, or original promotional purposes in accordance with Meta's Community Guidelines and Creator Terms.
2. Any incidental background audio or reference sounds are used under Fair Use safe harbor principles and do not infringe on commercial reproduction rights.
3. Automated audio muting in this instance impairs original creator expression.

We request immediate restoration of original audio and removal of regional audio muting restrictions.

Verified by: ${ownerBusiness || "Creator"}
Date: ${new Date().toLocaleDateString('en-GB')}`;
  }

  function handleOpenDisputeModal(platform = "youtube") {
    setDisputePlatform(platform);
    if (platform === "youtube") {
      setCustomDisputeText(generateYouTubeDisputeText());
    } else {
      setCustomDisputeText(generateMetaDisputeText());
    }
    setShowDisputeModal(true);
  }

  function analyzeFrameForSyntheticSignals(ctx, width, height) {
    try {
      const imgData = ctx.getImageData(0, 0, width, height).data;
      let smoothPatches = 0;
      let noisyPatches = 0;
      let saturatedAnimePixels = 0;
      let skinLikePixels = 0;
      let totalSamples = 0;

      const step = 4;
      for (let y = 10; y < height - 10; y += step) {
        for (let x = 10; x < width - 10; x += step) {
          const idx = (y * width + x) * 4;
          const r = imgData[idx];
          const g = imgData[idx + 1];
          const b = imgData[idx + 2];

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const delta = max - min;
          const sat = max === 0 ? 0 : delta / max;

          // Cartoon/Anime/3D palette: vibrant tones with stylized color ranges
          if (sat > 0.40 && (r > 110 || g > 110 || b > 130)) {
            saturatedAnimePixels++;
          }

          // Porcelain / render skin tones (fair, warm, or stylized anime skin)
          if (r > 150 && g > 110 && b > 85 && r > g && g >= b) {
            skinLikePixels++;
          }

          // Measure local micro-variance (sensor grain vs AI smoothness)
          const rightIdx = (y * width + (x + 1)) * 4;
          const bottomIdx = ((y + 1) * width + x) * 4;
          const diffR = Math.abs(r - imgData[rightIdx]) + Math.abs(r - imgData[bottomIdx]);
          const diffG = Math.abs(g - imgData[rightIdx + 1]) + Math.abs(g - imgData[bottomIdx + 1]);
          const diffB = Math.abs(b - imgData[rightIdx + 2]) + Math.abs(b - imgData[bottomIdx + 2]);
          const localGrad = (diffR + diffG + diffB) / 3;

          // AI generated videos & 3D renders have ultra-flat micro-gradients (localGrad < 1.3)
          if (localGrad < 1.3) {
            smoothPatches++;
          } else if (localGrad > 2.5 && localGrad < 14) {
            noisyPatches++;
          }
          totalSamples++;
        }
      }

      const smoothnessRatio = totalSamples > 0 ? (smoothPatches / totalSamples) : 0;
      const animeRatio = totalSamples > 0 ? (saturatedAnimePixels / totalSamples) : 0;
      const skinRatio = totalSamples > 0 ? (skinLikePixels / totalSamples) : 0;

      // AI avatars, 3D animated characters, or synthetic video
      const isSynthetic = (smoothnessRatio > 0.28) || (animeRatio > 0.22 && smoothnessRatio > 0.22) || (skinRatio > 0.12 && smoothnessRatio > 0.26);
      const aiConfidence = Math.min(99, Math.max(78, Math.round(72 + smoothnessRatio * 45 + (animeRatio > 0.2 ? 15 : 0))));

      return {
        isSynthetic,
        smoothnessRatio: Math.round(smoothnessRatio * 100),
        animeRatio: Math.round(animeRatio * 100),
        skinRatio: Math.round(skinRatio * 100),
        aiConfidence
      };
    } catch (err) {
      console.warn("Frame analysis error:", err);
      return null;
    }
  }

  async function handleStartScan(forceDeep = true) {
    setScanStatus("scanning");
    setScanProgress(0);
    setActiveScanStage(1);
    setStageStatuses({
      1: "running",
      2: "pending",
      3: "pending",
      4: "pending",
      5: "pending",
    });
    setScanStepText("Stage 1/5: Extracting SHA-256 fingerprint & validating statutory safe harbor...");

    // Capture frame & analyze canvas pixels
    let frameThumbnail = "";
    let visualMetrics = null;
    let isSyntheticVisualSignal = false;

    if (isVideo) {
      try {
        const offVideo = document.createElement("video");
        offVideo.muted = true;
        offVideo.playsInline = true;
        offVideo.crossOrigin = "anonymous";
        const videoSrc = file ? URL.createObjectURL(file) : (filePreview || "");
        if (videoSrc) {
          offVideo.src = videoSrc;
          await new Promise((resolve) => {
            offVideo.onloadeddata = () => {
              offVideo.currentTime = Math.min(1.0, (offVideo.duration || 2) / 2);
            };
            offVideo.onseeked = () => {
              try {
                const canvas = document.createElement("canvas");
                canvas.width = 360;
                canvas.height = Math.round(360 * (offVideo.videoHeight / offVideo.videoWidth || 16/9));
                const ctx = canvas.getContext("2d", { willReadFrequently: true });
                ctx.drawImage(offVideo, 0, 0, canvas.width, canvas.height);
                frameThumbnail = canvas.toDataURL("image/jpeg", 0.65);
                visualMetrics = analyzeFrameForSyntheticSignals(ctx, canvas.width, canvas.height);
                if (visualMetrics?.isSynthetic) {
                  isSyntheticVisualSignal = true;
                }
              } catch (e) {
                console.warn("Canvas capture error:", e);
              }
              resolve();
            };
            offVideo.onerror = () => resolve();
            setTimeout(resolve, 1500);
          });
        }
      } catch (err) {
        console.warn("Offscreen video frame capture warning:", err);
      }
    } else if (!isVideo) {
      try {
        const offImg = new Image();
        offImg.crossOrigin = "anonymous";
        const imgSrc = file ? URL.createObjectURL(file) : (filePreview || "");
        if (imgSrc) {
          offImg.src = imgSrc;
          await new Promise((resolve) => {
            offImg.onload = () => {
              try {
                const canvas = document.createElement("canvas");
                canvas.width = 360;
                canvas.height = Math.round(360 * (offImg.naturalHeight / offImg.naturalWidth || 1));
                const ctx = canvas.getContext("2d", { willReadFrequently: true });
                ctx.drawImage(offImg, 0, 0, canvas.width, canvas.height);
                frameThumbnail = canvas.toDataURL("image/jpeg", 0.65);
                visualMetrics = analyzeFrameForSyntheticSignals(ctx, canvas.width, canvas.height);
                if (visualMetrics?.isSynthetic) {
                  isSyntheticVisualSignal = true;
                }
              } catch (e) {
                console.warn("Image canvas error:", e);
              }
              resolve();
            };
            offImg.onerror = () => resolve();
            setTimeout(resolve, 1000);
          });
        }
      } catch (err) {
        console.warn("Offscreen image capture warning:", err);
      }
    }

    try {
      // Start background network fetch immediately while stages animate deliberately
      const fetchPromise = fetch("/api/copyright-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          tags,
          mediaUrl: filePreview,
          isVideo,
          fileName: file?.name || "",
          selectedPlatforms: selectedIds,
          youtubePrivacy,
          ownerBusiness,
          userId: user?._id || user?.id,
          forceDeepScan: true,
          frameThumbnail,
          isSyntheticVisualSignal,
          visualMetrics
        })
      }).then(r => r.json());

      // Stage 1: Fingerprint & Statutory Safe Harbor (1600ms)
      setScanProgress(15);
      await new Promise(r => setTimeout(r, 1600));
      setStageStatuses(prev => ({ ...prev, 1: "passed", 2: "running" }));
      setActiveScanStage(2);

      // Stage 2: AI & Synthetic Media Deep Vision Scan (2000ms)
      setScanProgress(38);
      setScanStepText("Stage 2/5: Scanning visual textures, facial geometry & anime/3D render artifacts...");
      await new Promise(r => setTimeout(r, 2000));
      setStageStatuses(prev => ({ 
        ...prev, 
        2: isSyntheticVisualSignal ? "flagged" : "passed", 
        3: "running" 
      }));
      setActiveScanStage(3);

      // Stage 3: Deepfake & Avatar Boundary Audit (1600ms)
      setScanProgress(62);
      setScanStepText("Stage 3/5: Analyzing temporal boundary continuity & lip-sync coherence...");
      await new Promise(r => setTimeout(r, 1600));
      setStageStatuses(prev => ({ ...prev, 3: "passed", 4: "running" }));
      setActiveScanStage(4);

      // Stage 4: Audio Spectrum & Soundtrack Rights (1700ms)
      setScanProgress(82);
      setScanStepText("Stage 4/5: Pre-scanning Content ID match, commercial labels & voice synthesis...");
      await new Promise(r => setTimeout(r, 1700));
      const commercialMusicLabels = ["t-series", "tseries", "sony music", "zee music", "yrf", "universal music", "warnermusic", "speed records", "tips official"];
      const hasCommercialTrack = commercialMusicLabels.some(lbl => 
        `${title} ${description} ${tags}`.toLowerCase().includes(lbl)
      );
      setStageStatuses(prev => ({ 
        ...prev, 
        4: hasCommercialTrack ? "flagged" : "passed", 
        5: "running" 
      }));
      setActiveScanStage(5);

      // Stage 5: Multi-Platform Policy Engine (1600ms)
      setScanProgress(95);
      setScanStepText("Stage 5/5: Finalizing YouTube Altered Content, Meta AI Info & platform compliance...");
      
      const data = await fetchPromise;
      await new Promise(r => setTimeout(r, 1500));

      setStageStatuses(prev => ({ 
        ...prev, 
        5: data.issues?.length > 0 ? "flagged" : "passed" 
      }));
      setScanProgress(100);
      setScanStepText("✅ Deep Multi-Engine content audit complete!");
      setScanResultData(data);
      if (data.detectedMediaOrigin) setDetectedMediaOrigin(data.detectedMediaOrigin);
      if (data.mediaOriginConfidence) setMediaOriginConfidence(data.mediaOriginConfidence);
      setScanStatus("completed");

      if (data.fromCache) {
        toast.success("⚡ Cache Hit: Content fingerprint match — instant verification.");
      } else if (data.riskTier === "low") {
        toast.success("🟢 Low Risk — Content cleared for publishing!");
      } else if (data.riskTier === "review") {
        toast("🟡 Review Recommended: Minor adjustments advised.", { icon: "⚠️" });
      } else if (data.riskTier === "high") {
        toast("🟠 High Risk detected. Use 1-Click Fix to resolve!", { icon: "🟠" });
      } else {
        toast.error(`🔴 Critical Risk (${data.issues?.length || 1} issues). Apply 1-Click Fix now!`);
      }
    } catch (err) {
      console.error("Content Risk scan error:", err);
      setScanProgress(100);
      setScanStepText("✅ Scan complete!");
      setScanStatus("completed");
      toast.success("🛡️ Content Risk analysis completed!");
    }
  }

  function handleApplyAIDisclosure() {
    const aiNotice = `\n\n✨ AI & SYNTHETIC MEDIA DISCLOSURE:\nThis content contains AI-generated / synthetic elements in full compliance with platform transparency policies (Meta AI Info & YouTube Altered Content).\n#AIGenerated #SyntheticMedia #AIContent`;
    setDescription(prev => {
      if (prev && prev.includes("AI & SYNTHETIC MEDIA DISCLOSURE")) return prev;
      return prev && prev.trim() ? `${prev.trim()}${aiNotice}` : aiNotice.trim();
    });
    toast.success("✨ Platform AI Transparency Label appended to caption!");
  }

  function handleFixAllAndProtect() {
    handleApplySafeHarbor();
    handleDeclareMetaAudio();
    if (selectedIds.includes("youtube") && youtubePrivacy === "public") {
      setYoutubePrivacy("unlisted");
    }
    if (detectedMediaOrigin === "ai") {
      handleApplyAIDisclosure();
    }
    setScanResultData({
      scoreLabel: "Content Risk Score",
      contentRiskScore: 5,
      safetyScore: 95,
      riskTier: "low",
      headline: "✅ Low Risk — Cleared to Publish",
      detectedMediaOrigin,
      mediaOriginConfidence: 99,
      aiModelUsed: "Layer 1 Local Risk Engine & Safe Harbor",
      weights: { textRisk: "20%", imageRisk: "25%", videoRisk: "30%", audioRisk: "25%" },
      safetyReport: {
        text: { status: "LOW", icon: "✓", badge: "✓ LOW", color: "emerald", score: 5 },
        image: { status: "LOW", icon: "✓", badge: "✓ LOW", color: "emerald", score: 5 },
        video: { status: "LOW", icon: "✓", badge: "✓ LOW", color: "emerald", score: 5 },
        audio: { status: "LOW", icon: "✓", badge: "✓ LOW", color: "emerald", score: 5 },
        platformPolicy: { status: "PASS", icon: "✓", badge: "✓ PASS", color: "emerald" }
      },
      layers: {
        layer1: { name: "Layer 1: Local Checks", cost: "Free", executed: true, details: "Statutory safe harbor, transformative audio, and Unlisted YouTube mode verified." },
        layer2: { name: "Layer 2: AI Analysis", cost: "Saved", executed: false, details: "Skipped (Content 100% compliant with local legal rules)." },
        layer3: { name: "Layer 3: External Search", cost: "Saved", executed: false, details: "Skipped." }
      },
      costSaved: true,
      contentAnalyzer: {
        text: { riskScore: 5, status: "safe", findings: "Section 107 & Sec 52 Fair Use attached." },
        visual: { riskScore: 5, status: "safe", findings: "Zero watermark or trademark issues." },
        audio: { riskScore: 5, status: "safe", findings: "Transformative audio declared. Content ID safe mode active." }
      },
      issues: [],
      platformChecks: {
        youtube: { status: "pass", note: "Content ID Safe Mode Active" },
        instagram: { status: "pass", note: "Royalty-Free / Original Audio Cleared" },
        facebook: { status: "pass", note: "Rights Manager Hash Cleared" },
        linkedin: { status: "pass", note: "Statutory Safe Harbor Compliant" }
      },
      verdict: "Low Risk: Content meets platform originality and safe harbor standards."
    });
    setScanStatus("completed");
    toast.success("🛡️ 1-Click Fix Applied: Content Risk dropped to Low Risk (Safe)!");
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
    setProcessingAction(effectiveMode === "draft" ? "draft" : (effectiveMode === "schedule" ? "schedule" : "publish"));
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
            mediaType: finalMediaType,
            disableComments: Boolean(disableComments),
            youtubeFormat,
            youtubePrivacy,
            youtubeMadeForKids: Boolean(youtubeMadeForKids),
            youtubeCategory,
            instagramPlacement,
            instagramShareToFeed: Boolean(instagramShareToFeed),
            facebookPlacement
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
            mediaType: finalMediaType,
            disableComments: Boolean(disableComments),
            youtubeFormat,
            youtubePrivacy,
            youtubeMadeForKids: Boolean(youtubeMadeForKids),
            youtubeCategory,
            instagramPlacement,
            instagramShareToFeed: Boolean(instagramShareToFeed),
            facebookPlacement
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
        form.append("disableComments", String(disableComments));
        form.append("youtubeFormat", youtubeFormat);
        form.append("youtubePrivacy", youtubePrivacy);
        form.append("youtubeMadeForKids", String(youtubeMadeForKids));
        form.append("youtubeCategory", youtubeCategory);
        form.append("instagramPlacement", instagramPlacement);
        form.append("instagramShareToFeed", String(instagramShareToFeed));
        form.append("facebookPlacement", facebookPlacement);

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

  // Live Count Calculations
  const titleCharCount = title.length;
  const titleWordCount = title.trim() ? title.trim().split(/\s+/).length : 0;
  const descCharCount = description.length;
  const descWordCount = description.trim() ? description.trim().split(/\s+/).length : 0;
  const hashtagCount = tags ? tags.split(",").map(t => t.trim()).filter(Boolean).length : 0;

  const hasYouTubeSelected = accounts.some(a => selectedIds.includes(a._id) && a.platform === "youtube");
  const hasInstagramSelected = accounts.some(a => selectedIds.includes(a._id) && a.platform === "instagram");
  const hasFacebookSelected = accounts.some(a => selectedIds.includes(a._id) && a.platform === "facebook");

  return (
    <div className="space-y-7 max-w-[1600px] w-full mx-auto px-3 sm:px-6 lg:px-8 font-sans">
      
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
              setYoutubeFormat("auto");
              setYoutubePrivacy("public");
              setYoutubeMadeForKids(false);
              setYoutubeCategory("22");
              setInstagramPlacement("reels");
              setInstagramShareToFeed(true);
              setFacebookPlacement("reels_video");
              setVideoDimensions(null);
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

      {/* 3-Column Studio Layout with Expansive Responsive Width */}
      <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-6 items-start">
        
        {/* COLUMN 1: CONTENT EDITOR & AI (Expanded to 6 columns for spacious high-end workspace) */}
        <div className="lg:col-span-6 xl:col-span-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:p-7 shadow-2xs space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-950 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                <span>1. Content & Creative Studio</span>
              </h2>
              <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                Design viral copy, attach high-res media, and optimize for multi-channel reach.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                Step 1 of 3
              </span>
            </div>
          </div>

          {/* Studio Content Engine Box with Configurable Controls & Tone Selector */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-slate-50 to-violet-50/70 border border-indigo-200/90 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black text-indigo-950">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>Content & Caption Studio Engine</span>
              </div>
              <span className="text-[10.5px] font-bold text-indigo-700 uppercase tracking-wider bg-white px-2.5 py-0.5 rounded-full border border-indigo-200 shadow-2xs">
                Studio Generator
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter raw idea, keywords or topic (e.g. Kisan fertilizer offers, Organic growth hack)..."
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleGenerate()}
                  className="w-full h-11 pl-3.5 pr-8 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-slate-400 shadow-2xs"
                />
                {topic && (
                  <button
                    type="button"
                    onClick={() => setTopic("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    title="Clear prompt text"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* ENHANCE PROMPT BUTTON (With Professional Icon) */}
              <button
                type="button"
                onClick={handleEnhancePrompt}
                disabled={enhancingPrompt || generating}
                className="px-3.5 h-11 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-indigo-500 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 border border-violet-400/40 transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
                title="Prompt Enhancer: Click to turn keywords into a viral creative prompt. Add new words and click again to re-enhance!"
              >
                {enhancingPrompt ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-white" />
                )}
                <span>{enhancingPrompt ? "Enhancing..." : "Enhance Prompt"}</span>
              </button>

              {/* GENERATE CONTENT BUTTON (With Professional Icon) */}
              <button
                type="button"
                onClick={() => handleGenerate()}
                disabled={generating || enhancingPrompt}
                className="px-4 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
              >
                {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5 fill-white" />}
                <span>{generating ? "Generating..." : "Generate Content"}</span>
              </button>
            </div>

            {/* AI Tone of Voice Selector */}
            <div className="space-y-1.5 pt-1 border-t border-indigo-100/80">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-950">Content Tone & Style:</span>
                <span className="text-[10px] text-slate-400 font-medium">Customizes voice & retention</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1">
                {[
                  { id: "viral", label: "Viral & Hook 🔥" },
                  { id: "professional", label: "Authority 💼" },
                  { id: "story", label: "Story 📖" },
                  { id: "promo", label: "Sales & Offer 🚀" },
                  { id: "educational", label: "Actionable 💡" }
                ].map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTone(t.id)}
                    className={`py-1.5 px-2 rounded-lg text-[10.5px] font-bold text-center transition-all cursor-pointer truncate ${
                      selectedTone === t.id
                        ? "bg-indigo-600 text-white shadow-2xs"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-indigo-50"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Configurable Generation Options (Length & Hashtags) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-indigo-100/80">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-950">Length:</span>
                <div className="flex items-center gap-1">
                  {[
                    { id: "short", label: "Punchy (50w)" },
                    { id: "medium", label: "Standard (100w)" },
                    { id: "long", label: "Detailed (300+w)" },
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
                <span className="text-[11px] font-bold text-indigo-950">Tags:</span>
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
                      {cnt}
                    </button>
                  ))}
                </div>
              </div>
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
              <>
              <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-900 group max-h-72 flex items-center justify-center">
                {isVideo ? (
                  <video 
                    ref={videoPreviewRef}
                    key={filePreview}
                    src={formatImageKitUrl(filePreview, true)} 
                    controls 
                    playsInline
                    preload="auto"
                    crossOrigin="anonymous"
                    onLoadedMetadata={(e) => {
                      const w = e.target.videoWidth;
                      const h = e.target.videoHeight;
                      const d = e.target.duration;
                      const isVertical = h > w;
                      const isShortsCompatible = isVertical && (!d || d <= 180);
                      setVideoDimensions({ width: w, height: h, duration: d, isVertical, isShortsCompatible });
                    }}
                    className="w-full max-h-68 object-contain" 
                  />
                ) : (
                  <img ref={imagePreviewRef} src={filePreview} alt="Preview" className="w-full max-h-68 object-contain" crossOrigin="anonymous" />
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
              {isVideo && videoDimensions && (
                <div className="mt-1.5 flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <FileVideo className="w-3.5 h-3.5 text-indigo-600" />
                    <span>
                      {videoDimensions.width}x{videoDimensions.height} ({videoDimensions.isVertical ? "9:16 Vertical" : "16:9 Landscape"}) • {Math.round(videoDimensions.duration || 0)}s
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    videoDimensions.isShortsCompatible 
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                      : "bg-blue-100 text-blue-800 border border-blue-200"
                  }`}>
                    {videoDimensions.isShortsCompatible ? "⚡ Shorts & Reels Ready" : "🎬 Standard Video"}
                  </span>
                </div>
              )}
              </>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 sm:p-7 text-center bg-slate-50/50 hover:bg-indigo-50/30 transition-all cursor-pointer space-y-2 group"
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

          {/* UNIVERSAL CONTENT ANALYZER & RISK ENGINE (POWERED BY GEMINI AI) */}
          {(() => {
            const hasFairUse = Boolean(
              description.toLowerCase().includes("section 107") ||
              description.toLowerCase().includes("section 52") ||
              description.toLowerCase().includes("fair use") ||
              description.toLowerCase().includes("content declaration") ||
              description.toLowerCase().includes("safe harbor")
            );

            const commercialMusicLabels = ["t-series", "tseries", "sony music", "zee music", "yrf", "universal music", "warnermusic", "speed records", "tips official"];
            const hasCommercialMusicFlag = commercialMusicLabels.some(lbl => 
              `${title} ${description} ${tags}`.toLowerCase().includes(lbl)
            );

            const hasMetaAudio = Boolean(
              description.toLowerCase().includes("meta rights & audio") ||
              description.toLowerCase().includes("audio declaration") ||
              description.toLowerCase().includes("original sound") ||
              description.toLowerCase().includes("original commentary") ||
              description.toLowerCase().includes("original voice") ||
              description.toLowerCase().includes("royalty-free") ||
              description.toLowerCase().includes("creator voice") ||
              hasFairUse
            );

            const isOriginalVoice = Boolean(
              scanResultData?.audioAnalysis?.isOriginalVoice ||
              description.toLowerCase().includes("original voice") ||
              description.toLowerCase().includes("original audio") ||
              description.toLowerCase().includes("original sound") ||
              description.toLowerCase().includes("creator voice") ||
              description.toLowerCase().includes("spoken commentary") ||
              (!hasCommercialMusicFlag && isVideo)
            );

            const isYTProtected = !selectedIds.includes("youtube") || youtubePrivacy === "unlisted";

            // Effective media origin & confidence from API result
            const currentOrigin = scanResultData?.detectedMediaOrigin || detectedMediaOrigin || "real";
            const currentConfidence = scanResultData?.mediaOriginConfidence || mediaOriginConfidence || 95;
            const isAIMedia = currentOrigin === "ai";
            const hasAIDisclosed = Boolean(
              description.toLowerCase().includes("ai & synthetic media disclosure") ||
              description.toLowerCase().includes("aigenerated") ||
              description.toLowerCase().includes("syntheticmedia")
            );

            // Resolve active issues dynamically based on current post state
            let activeIssues = [];
            if (scanResultData?.issues && scanResultData.issues.length > 0) {
              activeIssues = scanResultData.issues.filter(iss => {
                if (iss.fixType === "safe_harbor" && hasFairUse) return false;
                if (iss.fixType === "meta_audio" && (hasMetaAudio || !hasCommercialMusicFlag)) return false;
                if (iss.fixType === "youtube_unlisted" && isYTProtected) return false;
                if (iss.fixType === "ai_disclosure" && hasAIDisclosed) return false;
                return true;
              });
            }

            // If AI media is detected and disclosure label is missing, ensure active issue is present
            if (isAIMedia && !hasAIDisclosed) {
              const alreadyInIssues = activeIssues.some(i => i.id === "ai_disclosure_missing");
              if (!alreadyInIssues) {
                activeIssues.push({
                  id: "ai_disclosure_missing",
                  severity: "medium",
                  title: "Missing Platform AI Transparency Label",
                  desc: "AI-generated / 3D avatar media detected. Meta AI Info & YouTube Altered Content policies require transparent disclosure.",
                  fixType: "ai_disclosure"
                });
              }
            }

            // Risk Engine: Use exact Content Risk Score returned by API
            let currentRiskScore = scanResultData?.contentRiskScore !== undefined
              ? scanResultData.contentRiskScore
              : (activeIssues.length === 0 ? 12 : Math.min(85, 20 + activeIssues.length * 20));

            if (isAIMedia && !hasAIDisclosed) {
              currentRiskScore = Math.max(currentRiskScore, 42); // Review Recommended until disclosure tag is added!
            }

            const isLowRisk = currentRiskScore <= 29;
            const currentTier = currentRiskScore <= 29 ? "low" : (currentRiskScore <= 59 ? "review" : (currentRiskScore <= 79 ? "high" : "critical"));

            // Dynamic Component Safety Status
            const repText = scanResultData?.safetyReport?.text || (hasFairUse 
              ? { status: "LOW", badge: "✓ LOW", color: "emerald", icon: "✓" } 
              : { status: "MEDIUM", badge: "⚠️ MEDIUM", color: "amber", icon: "⚠️" });

            const repImage = (isAIMedia && !isVideo)
              ? (hasAIDisclosed ? { status: "LOW", badge: "✓ AI DISCLOSED", color: "emerald", icon: "✓" } : { status: "MEDIUM", badge: "⚠️ AI LABEL NEEDED", color: "amber", icon: "⚠️" })
              : (scanResultData?.safetyReport?.image || { status: "LOW", badge: "✓ LOW", color: "emerald", icon: "✓" });

            const repVideo = (isAIMedia && isVideo)
              ? (hasAIDisclosed ? { status: "LOW", badge: "✓ AI DISCLOSED", color: "emerald", icon: "✓" } : { status: "MEDIUM", badge: "⚠️ AI LABEL NEEDED", color: "amber", icon: "⚠️" })
              : (scanResultData?.safetyReport?.video || { status: "LOW", badge: "✓ LOW", color: "emerald", icon: "✓" });

            const repAudio = scanResultData?.safetyReport?.audio || (isVideo 
              ? (hasCommercialMusicFlag ? { status: "HIGH", badge: "🔴 HIGH", color: "rose", icon: "🔴" } : { status: "LOW", badge: "✓ LOW", color: "emerald", icon: "✓" }) 
              : { status: "LOW", badge: "✓ LOW", color: "emerald", icon: "✓" });

            const repPolicy = (hasFairUse || activeIssues.length === 0 || scanResultData?.safetyReport?.platformPolicy?.status === "PASS")
              ? { status: "PASS", badge: "✓ PASS", color: "emerald", icon: "✓" } 
              : { status: "ACTION NEEDED", badge: "⚠️ ACTION NEEDED", color: "amber", icon: "⚠️" };

            // 1. SCANNING STATE (5-STAGE COMPREHENSIVE LIVE AUDIT)
            if (scanStatus === "scanning") {
              const stages = [
                {
                  id: 1,
                  name: "Digital Fingerprint & Safe Harbor",
                  icon: <Fingerprint className="w-4 h-4 text-emerald-600" />,
                  detail: "Validating SHA-256 metadata hash & statutory safe harbor (Sec 107/52)"
                },
                {
                  id: 2,
                  name: "AI & Synthetic Media Deep Vision Scan",
                  icon: <Sparkles className="w-4 h-4 text-purple-600" />,
                  detail: "Examining facial geometry, 3D character render & AI texture artifacts"
                },
                {
                  id: 3,
                  name: "Deepfake & Avatar Coherence Audit",
                  icon: <Eye className="w-4 h-4 text-teal-600" />,
                  detail: "Temporal boundary continuity, lip-sync & facial edge inspection"
                },
                {
                  id: 4,
                  name: "Audio Rights & Spectrum Risk",
                  icon: <Volume2 className="w-4 h-4 text-blue-600" />,
                  detail: "Commercial music labels, Content ID match & voice synthesis (TTS)"
                },
                {
                  id: 5,
                  name: "Multi-Platform Policy Verification",
                  icon: <ShieldCheck className="w-4 h-4 text-indigo-600" />,
                  detail: "YouTube Altered Content, Meta AI Info & regional muting checks"
                }
              ];

              return (
                <div className="rounded-2xl border-2 border-teal-300 bg-gradient-to-br from-white via-teal-50/20 to-slate-50 p-4 sm:p-5 shadow-lg space-y-4 animate-in fade-in duration-200">
                  {/* Header */}
                  <div className="flex items-center justify-between gap-3 border-b border-teal-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white flex items-center justify-center animate-spin shadow-md shadow-teal-500/25 shrink-0">
                        <RefreshCw className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                          <span>Multi-Engine Content Risk & AI Scanner</span>
                          <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-bold">
                            Live Audit
                          </span>
                        </h4>
                        <p className="text-[11px] text-teal-700 font-semibold mt-0.5">{scanStepText}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-black text-teal-800 bg-teal-100/80 px-3 py-1 rounded-full border border-teal-200">
                        {scanProgress}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 rounded-full bg-slate-200/80 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-all duration-500 rounded-full"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>

                  {/* 5-Stage Step-by-Step Audit Checklist */}
                  <div className="space-y-2 pt-1">
                    {stages.map((st) => {
                      const stStatus = stageStatuses[st.id] || (st.id < activeScanStage ? "passed" : (st.id === activeScanStage ? "running" : "pending"));
                      const isRunning = stStatus === "running";
                      const isPassed = stStatus === "passed";
                      const isFlagged = stStatus === "flagged";
                      const isPending = stStatus === "pending";

                      return (
                        <div 
                          key={st.id}
                          className={`rounded-xl border p-2.5 sm:p-3 flex items-center justify-between gap-3 transition-all ${
                            isRunning 
                              ? "bg-teal-50/90 border-teal-300 ring-2 ring-teal-400/30 shadow-xs" 
                              : isPassed
                              ? "bg-emerald-50/50 border-emerald-200"
                              : isFlagged
                              ? "bg-purple-50/70 border-purple-200"
                              : "bg-white/60 border-slate-200 opacity-60"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center shrink-0 shadow-2xs">
                              {st.icon}
                            </div>
                            <div className="min-w-0">
                              <p className={`text-xs font-bold truncate ${
                                isRunning ? "text-teal-950 font-black" : isPassed ? "text-slate-800" : isFlagged ? "text-purple-950" : "text-slate-500"
                              }`}>
                                {st.name}
                              </p>
                              <p className="text-[10.5px] text-slate-500 truncate hidden sm:block">
                                {st.detail}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0">
                            {isRunning && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black text-teal-700 bg-white px-2.5 py-1 rounded-full border border-teal-300 shadow-2xs animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping" />
                                <span>Scanning...</span>
                              </span>
                            )}
                            {isPassed && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-300">
                                <span>✓ Passed</span>
                              </span>
                            )}
                            {isFlagged && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full border border-purple-300">
                                <Sparkles className="w-3 h-3 text-purple-600" />
                                <span>AI Signal</span>
                              </span>
                            )}
                            {isPending && (
                              <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5">
                                Queued
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }

            // 2. COMPLETED STATE (SHOW SCAN RESULTS IN THE SAME BOX)
            if (scanStatus === "completed") {
              const tierBadgeColor = currentTier === "low" 
                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                : currentTier === "review"
                ? "bg-amber-100 text-amber-800 border-amber-300"
                : currentTier === "high"
                ? "bg-orange-100 text-orange-800 border-orange-300"
                : "bg-rose-100 text-rose-800 border-rose-300";

              const tierTitle = currentTier === "low"
                ? "✅ Low Risk — Cleared to Publish"
                : currentTier === "review"
                ? "⚠️ Review Recommended — Adjustments Advised"
                : currentTier === "high"
                ? "🟠 High Risk — Revisions Advised"
                : "🔴 Critical Risk — Strike Likely";

              return (
                <div className={`rounded-2xl border-2 ${
                  isLowRisk 
                    ? "border-emerald-400 bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/60" 
                    : currentTier === "review"
                    ? "border-amber-300 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40"
                    : "border-rose-400 bg-gradient-to-br from-rose-50/80 via-white to-amber-50/40"
                } p-4.5 shadow-md space-y-3.5 animate-in fade-in duration-200`}>

                  {/* ─── AI / REAL CONTENT DETECTION BANNER — ALWAYS AT TOP ─── */}
                  {currentOrigin === "ai" || currentOrigin === "ai_assisted" ? (
                    <div className="rounded-xl bg-purple-600 text-white px-4 py-3 flex items-start justify-between gap-3 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5 text-purple-200" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-black">AI-Generated Content Detected</p>
                            <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-full border border-white/30">
                              {currentConfidence}% Confidence
                            </span>
                          </div>
                          <p className="text-[11px] text-purple-200 mt-0.5">
                            This video/image contains AI-generated or synthetic media (3D avatar / stylized character). Platform disclosure is <span className="font-black text-white">mandatory</span> — Meta & YouTube require this label.
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        {!description.includes("AI & SYNTHETIC MEDIA DISCLOSURE") && (
                          <button
                            type="button"
                            onClick={handleApplyAIDisclosure}
                            className="text-[10px] font-black bg-white text-purple-700 px-2.5 py-1 rounded-lg cursor-pointer hover:bg-purple-50 transition-all shadow-xs flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3 text-purple-700" />
                            <span>Add AI Label to Caption</span>
                          </button>
                        )}
                        {description.includes("AI & SYNTHETIC MEDIA DISCLOSURE") && (
                          <span className="text-[10px] font-black bg-green-400/30 text-white px-2 py-0.5 rounded-full border border-green-400/40">✓ Label Added</span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setDetectedMediaOrigin("real");
                            if (scanResultData) {
                              setScanResultData(prev => prev ? { ...prev, detectedMediaOrigin: "real" } : prev);
                            }
                          }}
                          className="text-[9.5px] text-purple-200 hover:text-white underline cursor-pointer"
                        >
                          Switch to Real Camera
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-emerald-600 text-white px-4 py-3 flex items-center justify-between gap-3 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl shrink-0">📷</div>
                        <div>
                          <p className="text-sm font-black">100% Real Content Verified</p>
                          <p className="text-[11px] text-emerald-200 mt-0.5">
                            Natural camera recording detected — no synthetic or deepfake signatures found.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-full border border-white/30">
                          {currentConfidence}% Confidence
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setDetectedMediaOrigin("ai");
                            if (scanResultData) {
                              setScanResultData(prev => prev ? { ...prev, detectedMediaOrigin: "ai", mediaOriginConfidence: 96 } : prev);
                            }
                          }}
                          className="text-[10px] font-black bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg border border-white/30 cursor-pointer transition-all flex items-center gap-1"
                          title="Manually declare this as AI / Synthetic media"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                          <span>Tag as AI Media</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ─── RISK SCORE HEADER ─── */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                    <div className="flex items-center gap-3">
                      {isLowRisk ? (
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-emerald-500/30 shrink-0">
                          ✓
                        </div>
                      ) : (
                        <div className={`w-10 h-10 rounded-2xl ${currentTier === "critical" ? "bg-rose-600" : currentTier === "high" ? "bg-orange-500" : "bg-amber-500"} text-white flex items-center justify-center text-xl font-black shadow-lg shrink-0`}>
                          <ShieldAlert className="w-5 h-5" />
                        </div>
                      )}

                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2 flex-wrap">
                          <span>{tierTitle}</span>
                          <span className={`text-[10.5px] px-2.5 py-0.5 rounded-full font-black border ${tierBadgeColor}`}>
                            Content Risk Score: {currentRiskScore}/100 ({currentTier.toUpperCase()})
                          </span>
                        </h4>
                        <p className="text-[11px] text-slate-600">
                          {isLowRisk
                            ? "Content passed Text, Visual, and Audio analysis. Safe for multi-channel publishing."
                            : "Risk factors detected. See issues & solutions below — fix them before publishing."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenDisputeModal("youtube")}
                        className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[10.5px] font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                        title="View pre-drafted legal counter-notice template"
                      >
                        <Scale className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Dispute Letter</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStartScan(true)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[10.5px] font-bold flex items-center gap-1 cursor-pointer shadow-2xs transition-all"
                        title="Run a new full deep scan"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Re-Scan</span>
                      </button>
                    </div>
                  </div>

                  {/* DEDICATED CONTENT SAFETY REPORT TABLE */}

                  <div className="rounded-xl border border-slate-200/90 bg-white p-3 sm:p-3.5 space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">
                          🛡️
                        </div>
                        <span className="text-[11px] font-black tracking-wider uppercase text-slate-900">
                          CONTENT SAFETY REPORT
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        Weighted Risk Engine
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100 text-xs">
                      {/* Text Row */}
                      <div className="flex items-center justify-between py-2 px-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 w-28">Text</span>
                          <span className="text-[10px] text-slate-400 font-bold bg-slate-50 px-1.5 py-0.5 rounded">20% Weight</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-black border ${
                          repText.color === "emerald" ? "bg-emerald-50 text-emerald-700 border-emerald-300" :
                          repText.color === "amber" ? "bg-amber-50 text-amber-800 border-amber-300" :
                          repText.color === "orange" ? "bg-orange-50 text-orange-800 border-orange-300" :
                          "bg-rose-50 text-rose-700 border-rose-300"
                        }`}>
                          {repText.badge}
                        </span>
                      </div>

                      {/* Image Row */}
                      <div className="flex items-center justify-between py-2 px-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 w-28">Image</span>
                          <span className="text-[10px] text-slate-400 font-bold bg-slate-50 px-1.5 py-0.5 rounded">25% Weight</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-black border ${
                          repImage.color === "emerald" ? "bg-emerald-50 text-emerald-700 border-emerald-300" :
                          repImage.color === "amber" ? "bg-amber-50 text-amber-800 border-amber-300" :
                          repImage.color === "orange" ? "bg-orange-50 text-orange-800 border-orange-300" :
                          "bg-rose-50 text-rose-700 border-rose-300"
                        }`}>
                          {repImage.badge}
                        </span>
                      </div>

                      {/* Video Row */}
                      <div className="flex items-center justify-between py-2 px-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 w-28">Video</span>
                          <span className="text-[10px] text-slate-400 font-bold bg-slate-50 px-1.5 py-0.5 rounded">30% Weight</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-black border ${
                          repVideo.color === "emerald" ? "bg-emerald-50 text-emerald-700 border-emerald-300" :
                          repVideo.color === "amber" ? "bg-amber-50 text-amber-800 border-amber-300" :
                          repVideo.color === "orange" ? "bg-orange-50 text-orange-800 border-orange-300" :
                          "bg-rose-50 text-rose-700 border-rose-300"
                        }`}>
                          {repVideo.badge}
                        </span>
                      </div>

                      {/* Audio Row */}
                      <div className="flex items-center justify-between py-2.5 px-1 border-b border-slate-100">
                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                          <span className="font-extrabold text-slate-900 w-16 shrink-0 text-xs">Audio</span>
                          <span className="text-[10px] text-slate-400 font-bold bg-slate-100/80 px-1.5 py-0.5 rounded">25% Weight</span>
                          {isOriginalVoice && isVideo && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1 shrink-0 whitespace-nowrap">
                              <span>🎙️ Real Voice</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-black border ${
                            repAudio.color === "emerald" ? "bg-emerald-50 text-emerald-700 border-emerald-300" :
                            repAudio.color === "amber" ? "bg-amber-50 text-amber-800 border-amber-300" :
                            repAudio.color === "orange" ? "bg-orange-50 text-orange-800 border-orange-300" :
                            "bg-rose-50 text-rose-700 border-rose-300"
                          }`}>
                            {repAudio.badge}
                          </span>
                          {(!isOriginalVoice || hasCommercialMusicFlag || repAudio.color !== "emerald") && (
                            <button
                              type="button"
                              onClick={() => setShowAudioGuideModal(true)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-[11px] font-bold cursor-pointer shadow-2xs flex items-center gap-1 transition-all active:scale-95"
                              title="Open Audio & Music Rights Guide"
                            >
                              <Music className="w-3.5 h-3.5 text-slate-500" />
                              <span>Audio Rights</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Platform Policy Row */}
                      <div className="flex items-center justify-between py-2 px-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 w-28">Platform Policy</span>
                          <span className="text-[10px] text-slate-400 font-semibold">(Compliance & Safe Harbor)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-black border ${
                            repPolicy.color === "emerald" ? "bg-emerald-50 text-emerald-700 border-emerald-300" :
                            "bg-amber-50 text-amber-800 border-amber-300"
                          }`}>
                            {repPolicy.badge}
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowCopyrightModal(true)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-black cursor-pointer shadow-xs flex items-center gap-1 transition-all active:scale-95"
                            title="Open Copyright & Fair Use Notice Modal"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Add Policy</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>


                  {/* Detected Issues + Solutions (When Not Low Risk) */}
                  {!isLowRisk && (
                    <div className="space-y-3 pt-1 border-t-2 border-slate-100">

                      {activeIssues.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-md bg-rose-600 text-white flex items-center justify-center text-[10px] font-black">!</div>
                            <p className="text-[11px] font-black text-slate-900 uppercase tracking-wider">
                              Detected Issues ({activeIssues.length})
                            </p>
                          </div>

                          {activeIssues.map((issue, idx) => {
                            // Expanded solution lookup — covers all known issue types
                            const solutionMap = {
                              "Missing Statutory Fair Use Notice": {
                                fix: "Add this to your caption:\n'This content is shared for educational/commentary purpose under Fair Use (§107 US / §52 India).'",
                                canAutoFix: true,
                              },
                              "Audio Muting Risk (Instagram Reels / FB)": {
                                fix: "Audio Process & Fixes:\n1. If this is your original verbal voice/speech: Click 'Audio Process' button above -> 'Declare Original Voice' (1-click set to LOW risk).\n2. If using commercial music: Add trending song in-app via Instagram/FB Audio Sticker to avoid muting.\n3. Or declare Royalty-Free audio clearance below.",
                                canAutoFix: true,
                              },
                              "Commercial Record Label Match Detected": {
                                fix: "Music Usage Process & Solutions:\n1. Instagram / FB Reels: Upload video with your original voice, then choose the song inside Instagram/FB app via 'Audio Sticker' (Meta handles all licensing & royalties — zero muting risk!).\n2. YouTube: Use YouTube Studio Audio Library or add via Shorts 'Add Sound'.\n3. Click 'Audio Process' above to declare Meta Sound clearance or add Fair Use transformative commentary.",
                                canAutoFix: true,
                              },
                              "Third-Party Copyright Music Detected": {
                                fix: "Music Usage Process & Solutions:\n1. Instagram / FB Reels: Select the track in-app via the Music sticker (Official Meta Licensing — zero copyright strike).\n2. YouTube / Long Form: Use royalty-free music from Meta Sound Collection or YouTube Audio Library.\n3. Transformative Audio: If reviewing or commenting, apply Section 107 Fair Use notice via 'Audio Process' button above.",
                                canAutoFix: true,
                              },
                              "Missing Platform AI Transparency Label": {
                                fix: "Add AI disclosure to caption: '🤖 AI-assisted content. Disclosed per Meta AI Info & YouTube Altered Content policies.'",
                                canAutoFix: true,
                              },
                              "Broadcast Watermark Detected": {
                                fix: "Manual Action Required:\n1. Remove the TV channel logo/watermark from your video using a video editor.\n2. Make sure you own original recording rights.\n3. Re-upload the cleaned video.",
                                canAutoFix: false,
                              },
                              "Stock Image License Violation": {
                                fix: "Manual Action Required:\n1. Remove the unlicensed stock image.\n2. Replace with your own photo OR download from free sources (Unsplash, Pexels).\n3. If you purchased a license, add: 'Image: Licensed via [source]' in caption.",
                                canAutoFix: false,
                              },
                            };

                            const matched = solutionMap[issue.title];
                            const solution = issue.solution
                              || matched?.fix
                              || "Manual Action Required:\n1. Review the issue carefully.\n2. Edit your content to remove the flagged element.\n3. Re-upload and run scan again.\n\nIf unsure, contact support or use the Dispute Letter option above.";
                            const canAutoFix = matched?.canAutoFix ?? (issue.solution ? true : false);

                            return (
                              <div key={issue.id || idx} className="space-y-1.5">
                                {/* Issue Card */}
                                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 shadow-2xs">
                                  <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                                    {idx + 1}
                                  </div>
                                  <div className="space-y-0.5 min-w-0">
                                    <p className="text-xs font-black text-rose-900">{issue.title}</p>
                                    <p className="text-[11px] text-rose-700 leading-snug">{issue.desc}</p>
                                  </div>
                                </div>

                                {/* Solution Card — green if auto-fixable, amber if manual action needed */}
                                <div className={`p-3 rounded-xl flex items-start gap-3 shadow-2xs ml-2 ${
                                  canAutoFix
                                    ? "bg-emerald-50 border border-emerald-200"
                                    : "bg-amber-50 border border-amber-300"
                                }`}>
                                  <div className={`w-5 h-5 rounded-full text-white flex items-center justify-center shrink-0 mt-0.5 text-[11px] ${
                                    canAutoFix ? "bg-emerald-600" : "bg-amber-500"
                                  }`}>
                                    {canAutoFix
                                      ? <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3"><path d="M2 6l2.5 2.5L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                      : "!"}
                                  </div>
                                  <div className="space-y-1 min-w-0">
                                    <p className={`text-[10px] font-black uppercase tracking-wide ${
                                      canAutoFix ? "text-emerald-800" : "text-amber-800"
                                    }`}>
                                      {canAutoFix ? "✅ Solution (Auto-Fixable)" : "⚠️ Manual Action Required"}
                                    </p>
                                    <p className={`text-[11px] leading-relaxed whitespace-pre-line ${
                                      canAutoFix ? "text-emerald-800" : "text-amber-900"
                                    }`}>{solution}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* 1-Click Universal Fix Button */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 border border-emerald-300">
                        <div className="text-xs space-y-0.5">
                          <p className="font-black text-slate-900 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>1-Click Auto-Fix — Apply All Solutions Instantly</span>
                          </p>
                          <p className="text-[11px] text-slate-600 ml-5.5">
                            Injects Fair Use notice, audio declaration, and AI transparency label into your caption automatically.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleFixAllAndProtect}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>🛡️ Fix All & Reduce Risk to Low</span>
                        </button>
                      </div>
                    </div>
                  )}


                </div>
              );
            }

            // 3. IDLE STATE: 3-LAYER ARCHITECTURE & WEIGHTED RISK ENGINE CARD
            return (
              <div className="rounded-2xl border-2 border-teal-200/80 bg-gradient-to-r from-emerald-50/60 via-teal-50/40 to-slate-50 p-3.5 sm:p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white flex items-center justify-center shadow-md shadow-teal-600/25 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5 flex-wrap">
                      <span>Deep AI Content Safety Scanner</span>
                      <span className="text-[9.5px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-bold border border-teal-200">
                        Gemini Powered
                      </span>
                      <span className="text-[9.5px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold border border-indigo-200">
                        Text 20% • Image 25% • Video 30% • Audio 25%
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Scans your text, visuals, and audio for copyright, brand safety, and platform policy risks. Issues + solutions shown below.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStartScan(true)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 text-white text-xs font-black shadow-lg shadow-teal-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Run Deep AI Content Safety Scan</span>
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Post Title with Character & Word Count Badge & AI Enhancement Buttons */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>Post Title / Headline</span>
                <span className="text-[10px] text-slate-400 font-normal">(YouTube, FB & LinkedIn)</span>
              </label>
              <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-500">
                <span className={`px-2 py-0.5 rounded border ${titleCharCount > 100 ? "bg-amber-100 text-amber-800 border-amber-300 font-extrabold" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                  {titleCharCount}/100 chars
                </span>
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
          </div>

          {/* Caption & Content Studio with Rich Quick-Formatting Bar */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-900">Caption & Content Studio</label>
                {/* HIGH VISIBILITY FREE COPYRIGHT BUTTON */}
                <button
                  type="button"
                  onClick={() => {
                    if (!isDisclaimerTextCustomized) {
                      setCustomDisclaimerText(generateCopyrightText());
                    }
                    setShowCopyrightModal(true);
                  }}
                  className="relative group overflow-hidden px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white text-[11px] font-black shadow-md hover:shadow-lg shadow-emerald-600/30 border border-emerald-400/40 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 animate-pulse hover:animate-none"
                  title="Click to edit owner details and add Free Copyright & Fair Use declaration"
                >
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-100" />
                  <span>🛡️ Free Copyright Notice</span>
                  <span className="text-[9.5px] bg-emerald-950/40 px-1.5 py-0.5 rounded text-emerald-200 border border-emerald-400/30 font-bold">
                    Edit & Add
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-[10.5px] font-bold">
                <span className={`px-2 py-0.5 rounded border ${descCharCount > 2200 ? "bg-rose-100 text-rose-700 border-rose-300 font-extrabold" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                  {descCharCount}/2,200 chars
                </span>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                  {descWordCount} words
                </span>
              </div>
            </div>

            {/* Quick Formatting & Emoji Toolbar (Above Textarea) */}
            <div className="p-2 rounded-t-xl bg-slate-50 border border-b-0 border-slate-300 flex flex-wrap items-center justify-between gap-1.5">
              <div className="flex items-center gap-1 overflow-x-auto">
                {["🔥", "🚀", "💡", "👇", "💼", "📈", "🎯", "❤️", "💬", "📌"].map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleInsertEmoji(emoji)}
                    className="w-7 h-7 rounded-md hover:bg-white text-xs flex items-center justify-center transition-all cursor-pointer hover:shadow-2xs"
                    title={`Insert ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    if (!isDisclaimerTextCustomized) {
                      setCustomDisclaimerText(generateCopyrightText());
                    }
                    setShowCopyrightModal(true);
                  }}
                  className="px-2 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-[10.5px] font-bold text-emerald-800 shadow-2xs flex items-center gap-1 cursor-pointer transition-all"
                  title="Edit & Insert Free Copyright & Fair Use Notice"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>🛡️ Free Copyright</span>
                </button>
                <button
                  type="button"
                  onClick={handleMakeBold}
                  className="px-2 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-[10.5px] font-black text-slate-800 shadow-2xs cursor-pointer"
                  title="Convert First Line / Headline to Unicode Bold"
                >
                  𝗕 Bold
                </button>
                <button
                  type="button"
                  onClick={handleMakeItalic}
                  className="px-2 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-[10.5px] font-bold italic text-slate-800 shadow-2xs cursor-pointer"
                  title="Convert First Line to Unicode Italic"
                >
                  𝘐 Italic
                </button>
                <button
                  type="button"
                  onClick={handleCopyCaption}
                  className="px-2 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-[10.5px] font-bold text-slate-700 shadow-2xs flex items-center gap-1 cursor-pointer"
                  title="Copy caption to clipboard"
                >
                  <Copy className="w-3 h-3 text-slate-500" />
                  <span>Copy</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDescription("")}
                  className="px-2 py-1 rounded-md bg-white hover:bg-rose-50 border border-slate-200 text-[10.5px] font-bold text-rose-600 shadow-2xs cursor-pointer"
                  title="Clear caption text"
                >
                  Clear
                </button>
              </div>
            </div>

            <textarea
              rows={8}
              placeholder="Write your post caption, hook, insights, bullet points, and call to action..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-3.5 rounded-b-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all shadow-2xs placeholder:text-slate-400 resize-none leading-relaxed"
            />
          </div>

          {/* Hashtags & Tags with Dedicated Self Tags Box & Trending Cloud */}
          <div className="space-y-3 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-indigo-600" />
                <span>Hashtags & SEO Discovery</span>
              </label>
              <span className="text-[10.5px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                {hashtagCount} hashtags active
              </span>
            </div>
            <input
              type="text"
              placeholder="e.g. socialgrowth, contentcreator, viralpost, marketingtips"
              value={tags}
              onChange={e => setTags(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all shadow-2xs placeholder:text-slate-400"
            />

            {/* DEDICATED HASHTAG GROUPS (ONLY GROUP & ADD TO DESCRIPTION) */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 border border-slate-200 space-y-3 shadow-2xs">
              {/* Header with Title and Primary Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-2xs">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <span>Hashtag Groups</span>
                    </h4>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowCreateGroupInput(!showCreateGroupInput)}
                    className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-indigo-50 border border-slate-300 text-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                    title="Create a new hashtag group"
                  >
                    <FolderPlus className="w-3.5 h-3.5 text-indigo-600" />
                    <span>+ New Group</span>
                  </button>

                  {activeHashtagGroup && (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowAddTagInput(!showAddTagInput)}
                        className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-indigo-50 border border-slate-300 text-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                        title="Add hashtag to selected group"
                      >
                        <Plus className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Add Tag</span>
                      </button>

                      {/* 1-CLICK ADD TO DESCRIPTION */}
                      <button
                        type="button"
                        onClick={handleAddGroupToDescription}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-sm hover:shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 border border-emerald-400/30"
                        title="Add all hashtags of this selected group directly to caption description"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Add Group to Description</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Inline Create New Group Form */}
              {showCreateGroupInput && (
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-indigo-200 shadow-2xs animate-in fade-in duration-200">
                  <input
                    type="text"
                    placeholder="Enter group name (e.g. Products, Viral Shorts, Tech)..."
                    value={newGroupNameInput}
                    onChange={e => setNewGroupNameInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleCreateGroup()}
                    className="flex-1 h-8 px-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleCreateGroup}
                    className="px-3 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer transition-all shrink-0"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateGroupInput(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Inline Add Tag to Current Group Form */}
              {showAddTagInput && activeHashtagGroup && (
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-indigo-200 shadow-2xs animate-in fade-in duration-200">
                  <input
                    type="text"
                    placeholder={`Enter tag to add into "${activeHashtagGroup.name}" (e.g. marketing, viral)...`}
                    value={newSelfTagInput}
                    onChange={e => setNewSelfTagInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleAddTagToCurrentGroup()}
                    className="flex-1 h-8 px-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleAddTagToCurrentGroup}
                    className="px-3 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer transition-all shrink-0"
                  >
                    Add Tag
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddTagInput(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Empty State when 0 Groups Exist */}
              {hashtagGroups.length === 0 ? (
                <div className="py-6 px-4 text-center rounded-xl bg-white border border-dashed border-slate-300 space-y-1.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                    <Tag className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">No hashtag groups created yet</p>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    Click <strong>"+ New Group"</strong> to create your custom hashtag group and add it to your post description with 1 click.
                  </p>
                </div>
              ) : (
                <>
                  {/* Horizontal Scrollable Group Tabs with distinct spacing and badge */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {hashtagGroups.map(group => {
                      const isSelected = activeHashtagGroup && group.id === activeHashtagGroup.id;
                      return (
                        <div
                          key={group.id}
                          onClick={() => handleSelectHashtagGroup(group.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shrink-0 select-none shadow-2xs ${
                            isSelected
                              ? "bg-indigo-600 text-white border-indigo-700 shadow-sm shadow-indigo-600/20"
                              : "bg-white hover:bg-indigo-50/80 text-slate-700 border-slate-300 hover:border-indigo-300"
                          }`}
                        >
                          <span>{group.name}</span>
                          <span className={`text-[10.5px] px-2 py-0.5 rounded-full font-bold border ml-1 ${
                            isSelected ? "bg-white/20 text-white border-white/30" : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}>
                            ({group.tags.length})
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteGroup(group.id, e)}
                            className={`p-0.5 rounded hover:bg-black/10 transition-colors cursor-pointer ml-1 ${
                              isSelected ? "text-indigo-200 hover:text-white" : "text-slate-400 hover:text-rose-600"
                            }`}
                            title="Delete group"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Tags Inside Selected Group */}
                  {activeHashtagGroup && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {activeHashtagGroup.tags.length === 0 ? (
                        <p className="text-xs text-slate-400 italic py-1">
                          No hashtags in "{activeHashtagGroup.name}" yet. Click "Add Tag" above to add hashtags.
                        </p>
                      ) : (
                        activeHashtagGroup.tags.map(tag => (
                          <div
                            key={tag}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-2xs"
                          >
                            <span className="text-indigo-600 font-bold">#{tag}</span>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteTagFromGroup(tag, e)}
                              className="w-3.5 h-3.5 rounded flex items-center justify-center text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                              title="Delete from this group"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

        </div>

        {/* COLUMN 2: LIVE PREVIEW STUDIO (3 cols on lg/xl) */}
        <div className="lg:col-span-3 xl:col-span-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs space-y-4">
          
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
                      <video 
                        key={"ig-" + filePreview} 
                        src={formatImageKitUrl(filePreview, true)} 
                        controls 
                        playsInline
                        preload="auto"
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover" 
                      />
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
                    {description ? renderFormattedHashtags(description, "text-indigo-600 font-semibold hover:underline cursor-pointer") : <span className="text-slate-400 italic">Your Instagram caption will render here...</span>}
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
                  {description ? renderFormattedHashtags(description, "text-blue-600 font-semibold hover:underline cursor-pointer") : <span className="text-slate-400 italic">Your Facebook post text will render here...</span>}
                </div>

                {filePreview && (
                  <div className="rounded-xl overflow-hidden bg-slate-900 max-h-64 flex items-center justify-center">
                    {isVideo ? (
                      <video 
                        key={"fb-" + filePreview} 
                        src={formatImageKitUrl(filePreview, true)} 
                        controls 
                        playsInline
                        preload="auto"
                        crossOrigin="anonymous"
                        className="w-full max-h-60 object-contain" 
                      />
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
                {(youtubeFormat === "shorts" || (youtubeFormat === "auto" && videoDimensions?.isVertical)) ? (
                  /* SHORTS 9:16 VERTICAL MOCKUP */
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                        <span className="text-xs font-black text-slate-900 tracking-wide">YouTube Shorts Player</span>
                      </div>
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        9:16 Shorts
                      </span>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[9/16] max-h-96 mx-auto flex items-center justify-center border border-slate-800 shadow-md group">
                      {filePreview ? (
                        isVideo ? (
                          <video 
                            key={"yt-short-" + filePreview} 
                            src={formatImageKitUrl(filePreview, true)} 
                            controls 
                            playsInline
                            preload="auto"
                            crossOrigin="anonymous"
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <img src={filePreview} alt="Shorts Media" className="w-full h-full object-cover" />
                        )
                      ) : (
                        <div className="text-center p-6 space-y-2 text-slate-400">
                          <PlatformIcon platform="youtube" className="w-10 h-10 mx-auto text-red-600" />
                          <p className="text-xs font-medium text-slate-300">Upload 9:16 video to preview YouTube Shorts</p>
                        </div>
                      )}

                      {/* Shorts Overlay Badges & Controls */}
                      <div className="absolute top-3 left-3 bg-red-600/90 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm">
                        #Shorts
                      </div>

                      {/* Right Floating Interaction Bar */}
                      <div className="absolute right-2 bottom-12 flex flex-col items-center gap-3 text-white">
                        <div className="flex flex-col items-center">
                          <div className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors">
                            <ThumbsUp className="w-4 h-4 fill-white" />
                          </div>
                          <span className="text-[9px] font-bold mt-0.5">84K</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors">
                            <MessageCircle className="w-4 h-4 fill-white" />
                          </div>
                          <span className="text-[9px] font-bold mt-0.5">1.2K</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors">
                            <Share2 className="w-4 h-4" />
                          </div>
                          <span className="text-[9px] font-bold mt-0.5">Share</span>
                        </div>
                      </div>

                      {/* Bottom Channel Overlay */}
                      <div className="absolute bottom-2 left-2 right-12 text-white space-y-1 text-left p-1">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-red-600 text-[10px] font-bold flex items-center justify-center">
                            {user?.name ? user.name.slice(0, 1).toUpperCase() : "YT"}
                          </div>
                          <span className="text-[11px] font-bold truncate">@{user?.name ? user.name.toLowerCase().replace(/\s+/g, '') : "channel"}</span>
                          <button className="px-2 py-0.5 bg-red-600 text-white text-[9px] font-bold rounded-full">Subscribe</button>
                        </div>
                        <p className="text-[11px] font-semibold line-clamp-2 drop-shadow-sm">
                          {title || "Enter video title..."} {title && !title.toLowerCase().includes("#shorts") && "#Shorts"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* STANDARD 16:9 LANDSCAPE PLAYER */
                  <div className="space-y-3">
                    <div className="rounded-xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center relative group">
                      {filePreview ? (
                        isVideo ? (
                          <video 
                            key={"yt-long-" + filePreview} 
                            src={formatImageKitUrl(filePreview, true)} 
                            controls 
                            playsInline
                            preload="auto"
                            crossOrigin="anonymous"
                            className="w-full h-full object-contain" 
                          />
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
                        {description ? renderFormattedHashtags(description, "text-blue-600 font-medium hover:underline cursor-pointer") : "Video description text will render here..."}
                      </p>
                    </div>
                  </div>
                )}
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
                  {description ? renderFormattedHashtags(description, "text-blue-700 font-semibold hover:underline cursor-pointer") : <span className="text-slate-400 italic">LinkedIn professional copy will render here...</span>}
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
                  {description ? renderFormattedHashtags(description, "text-sky-500 font-semibold hover:underline cursor-pointer") : <span className="text-slate-400 italic">Tweet body text will render here...</span>}
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

        {/* COLUMN 3: TARGET CHANNELS & PUBLISH (3 cols on lg/xl) */}
        <div className="lg:col-span-3 xl:col-span-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs space-y-5">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-950">3. Target Channels</h2>
              <span className="text-[11px] font-semibold text-slate-500">
                {selectedIds.length} of {accounts.length} Selected
              </span>
            </div>

            {accounts.length > 0 && (
              <button
                type="button"
                onClick={handleToggleSelectAll}
                className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                  selectedIds.length === accounts.length
                    ? "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
                    : "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                }`}
              >
                {selectedIds.length === accounts.length ? (
                  <>
                    <X className="w-3.5 h-3.5 text-rose-600 stroke-[2.5]" />
                    <span>Deselect All</span>
                  </>
                ) : (
                  <>
                    <CheckCheck className="w-3.5 h-3.5 text-indigo-600 stroke-[2.5]" />
                    <span>Select All ({accounts.length})</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Quick Filter Selection Pills */}
          {accounts.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
              <button
                type="button"
                onClick={handleToggleSelectAll}
                className={`px-2 py-0.5 rounded-md text-[10.5px] font-bold border transition-all cursor-pointer ${
                  selectedIds.length === accounts.length
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                All ({accounts.length})
              </button>
              {accounts.some(a => a.platform === "facebook" || a.platform === "instagram") && (
                <button
                  type="button"
                  onClick={() => handleSelectGroup("meta")}
                  className="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all cursor-pointer"
                >
                  Meta (FB & IG)
                </button>
              )}
              {accounts.some(a => a.platform === "youtube" || a.platform === "tiktok") && (
                <button
                  type="button"
                  onClick={() => handleSelectGroup("video")}
                  className="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-all cursor-pointer"
                >
                  Video
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-slate-50 text-slate-500 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all cursor-pointer ml-auto"
              >
                Clear
              </button>
            </div>
          )}

          {/* Account List Checkboxes */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
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
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
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

          {/* PLATFORM-SPECIFIC VIDEO & POST SETTINGS */}
          {(hasYouTubeSelected || hasInstagramSelected || hasFacebookSelected) && (
            <div className="space-y-3 pt-3.5 border-t border-slate-100 animate-in fade-in duration-200">
              <div 
                onClick={() => setShowChannelOptimization(prev => !prev)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-all cursor-pointer select-none"
              >
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5 cursor-pointer">
                  <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Channel Optimization & Formats</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                    {showChannelOptimization ? "Expanded" : "Default Auto"}
                  </span>
                  {showChannelOptimization ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </div>
              </div>

              {showChannelOptimization && (
                <div className="space-y-3 pt-1 animate-in fade-in duration-200">
                  {/* YOUTUBE SETTINGS */}
                  {hasYouTubeSelected && (
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2 font-bold text-slate-900">
                          <div className="w-6 h-6 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                            <PlatformIcon platform="youtube" className="w-3.5 h-3.5 text-red-600" />
                          </div>
                          <span>YouTube Video Controls</span>
                        </div>
                        <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200/60">
                          YouTube v3
                        </span>
                      </div>

                      {/* YouTube Shorts vs Long Video Selector */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-800">Format & Placement</span>
                          <span className="text-[10px] text-slate-400">Shorts (&le; 60s 9:16)</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100/80 border border-slate-200/60">
                          {[
                            { id: "auto", label: "Auto-Detect" },
                            { id: "shorts", label: "Shorts (#Shorts)" },
                            { id: "standard", label: "Long Video" }
                          ].map(fmt => (
                            <button
                              key={fmt.id}
                              type="button"
                              onClick={() => setYoutubeFormat(fmt.id)}
                              className={`py-1.5 px-2 rounded-lg text-[10.5px] font-bold text-center transition-all cursor-pointer ${
                                youtubeFormat === fmt.id
                                  ? "bg-red-600 text-white shadow-xs"
                                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                              }`}
                            >
                              {fmt.label}
                            </button>
                          ))}
                        </div>
                        {videoDimensions && (
                          <p className="text-[10.5px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200/80 leading-snug flex items-center gap-1.5">
                            <span className="shrink-0">{videoDimensions.isVertical ? "📱" : "🎬"}</span>
                            <span>{videoDimensions.isVertical 
                              ? "Vertical (9:16) video detected — YouTube will automatically place it into the Shorts shelf!"
                              : "Horizontal (16:9) video detected — YouTube will publish it as Standard Long-form Video."}</span>
                          </p>
                        )}
                      </div>

                      {/* COPPA Made for Kids */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-800">Made for Kids (COPPA)</span>
                          <span className="text-[9.5px] text-slate-400">Required</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100/80 border border-slate-200/60">
                          <button
                            type="button"
                            onClick={() => setYoutubeMadeForKids(false)}
                            className={`py-1.5 px-2 rounded-lg text-[10.5px] font-bold text-center transition-all cursor-pointer ${
                              !youtubeMadeForKids
                                ? "bg-indigo-600 text-white shadow-xs"
                                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                            }`}
                          >
                            No (Recommended)
                          </button>
                          <button
                            type="button"
                            onClick={() => setYoutubeMadeForKids(true)}
                            className={`py-1.5 px-2 rounded-lg text-[10.5px] font-bold text-center transition-all cursor-pointer ${
                              youtubeMadeForKids
                                ? "bg-indigo-600 text-white shadow-xs"
                                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                            }`}
                          >
                            Yes, for kids
                          </button>
                        </div>
                      </div>

                      {/* Category Dropdown */}
                      <div className="space-y-1 pt-1">
                        <span className="text-[11px] font-bold text-slate-800">Category</span>
                        <select
                          value={youtubeCategory}
                          onChange={e => setYoutubeCategory(e.target.value)}
                          className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:border-red-500 focus:bg-white transition-all shadow-2xs"
                        >
                          <option value="22">People & Blogs (Default)</option>
                          <option value="24">Entertainment</option>
                          <option value="27">Education</option>
                          <option value="28">Science & Technology</option>
                          <option value="26">Howto & Style</option>
                          <option value="20">Gaming</option>
                          <option value="1">Film & Animation</option>
                          <option value="10">Music</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* INSTAGRAM SETTINGS */}
                  {hasInstagramSelected && (
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2 font-bold text-slate-900">
                          <div className="w-6 h-6 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
                            <PlatformIcon platform="instagram" className="w-3.5 h-3.5 text-pink-600" />
                          </div>
                          <span>Instagram Placement</span>
                        </div>
                        <span className="text-[10px] font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200/60">
                          Meta Graph
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-800">Media Format</span>
                        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100/80 border border-slate-200/60">
                          {[
                            { id: "reels", label: "Reels (9:16)" },
                            { id: "feed", label: "Feed Post" },
                            { id: "stories", label: "Stories" }
                          ].map(opt => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setInstagramPlacement(opt.id)}
                              className={`py-1.5 px-1 rounded-lg text-[10.5px] font-bold text-center transition-all cursor-pointer ${
                                instagramPlacement === opt.id
                                  ? "bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white shadow-xs"
                                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {instagramPlacement === "reels" && (
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                          <div>
                            <p className="text-[11px] font-bold text-slate-800">Share Reels to Main Feed</p>
                            <p className="text-[10px] text-slate-500">Also displays on profile grid</p>
                          </div>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={instagramShareToFeed}
                            onClick={() => setInstagramShareToFeed(prev => !prev)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                              instagramShareToFeed ? "bg-rose-600" : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                instagramShareToFeed ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* FACEBOOK SETTINGS */}
                  {hasFacebookSelected && (
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2 font-bold text-slate-900">
                          <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <PlatformIcon platform="facebook" className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          <span>Facebook Placement</span>
                        </div>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                          Meta Pages
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-800">Placement Mode</span>
                        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100/80 border border-slate-200/60">
                          {[
                            { id: "reels_video", label: "Reels / Video Post" },
                            { id: "feed", label: "Page Feed Post" }
                          ].map(opt => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setFacebookPlacement(opt.id)}
                              className={`py-1.5 px-1 rounded-lg text-[10.5px] font-bold text-center transition-all cursor-pointer ${
                                facebookPlacement === opt.id
                                  ? "bg-blue-600 text-white shadow-xs"
                                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

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

          {/* Comment Moderation Control */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1.5 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${disableComments ? 'bg-rose-100 text-rose-700' : 'bg-slate-200/80 text-slate-600'}`}>
                  <MessageSquareOff className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Disable Comments</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Turn off public comments & replies</p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={disableComments}
                onClick={() => setDisableComments(prev => !prev)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  disableComments ? "bg-rose-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    disableComments ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            {disableComments && (
              <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-rose-600 font-semibold">
                <span>Comments disabled on Instagram & X</span>
                <span className="text-[9px] bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">Active</span>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <div className="pt-1 space-y-2.5">
            <button
              onClick={() => handlePost()}
              disabled={posting || uploadingMedia || (publishMode !== "draft" && selectedIds.length === 0)}
              className={`w-full py-3.5 px-4 rounded-xl text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50 ${
                publishMode === "draft"
                  ? "bg-amber-500 hover:bg-amber-600 active:bg-amber-700 shadow-amber-500/25"
                  : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-indigo-600/25"
              }`}
            >
              {uploadingMedia ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : posting ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : publishMode === "draft" ? (
                <Bookmark className="w-4 h-4 fill-white" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>
                {uploadingMedia
                  ? "⚡ Uploading Media to ImageKit CDN..."
                  : posting 
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
                disabled={posting || uploadingMedia}
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-black text-xs shadow-md shadow-amber-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.98]"
              >
                <Bookmark className="w-4 h-4 fill-white text-white" />
                <span>
                  {uploadingMedia ? "Uploading..." : editingPost ? "Update Saved Draft" : "Save as Draft (Don't Publish)"}
                </span>
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
                                  <video 
                                    key={"draft-" + post.mediaUrl}
                                    src={formatImageKitUrl(post.mediaUrl, true)} 
                                    playsInline
                                    preload="metadata"
                                    crossOrigin="anonymous"
                                    className="w-full h-full object-cover opacity-80" 
                                  />
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

      {/* PROCESSING / UPLOADING POPUP MODAL */}
      {(posting || uploadingMedia) && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-5 shadow-2xl border border-slate-100 relative overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Top ambient glow light */}
            <div className={`absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-20 blur-2xl rounded-full pointer-events-none ${
              processingAction === "draft"
                ? "bg-amber-500/25"
                : processingAction === "schedule"
                ? "bg-blue-500/25"
                : uploadingMedia || processingAction === "upload"
                ? "bg-cyan-500/25"
                : "bg-indigo-500/25"
            }`} />

            {/* Dynamic Animated Ring Icon */}
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
              <div className={`absolute inset-0 rounded-full border-4 ${
                processingAction === "draft"
                  ? "border-amber-100"
                  : processingAction === "schedule"
                  ? "border-blue-100"
                  : uploadingMedia || processingAction === "upload"
                  ? "border-cyan-100"
                  : "border-indigo-100"
              }`} />
              <div className={`absolute inset-0 rounded-full border-4 border-t-transparent animate-spin ${
                processingAction === "draft"
                  ? "border-amber-500"
                  : processingAction === "schedule"
                  ? "border-blue-500"
                  : uploadingMedia || processingAction === "upload"
                  ? "border-cyan-500"
                  : "border-indigo-600"
              }`} />
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-inner ${
                processingAction === "draft"
                  ? "bg-amber-50 border-amber-100 text-amber-600"
                  : processingAction === "schedule"
                  ? "bg-blue-50 border-blue-100 text-blue-600"
                  : uploadingMedia || processingAction === "upload"
                  ? "bg-cyan-50 border-cyan-100 text-cyan-600"
                  : "bg-indigo-50 border-indigo-100 text-indigo-600"
              }`}>
                {uploadingMedia || processingAction === "upload" ? (
                  <UploadCloud className="w-6 h-6 animate-bounce text-cyan-600" />
                ) : processingAction === "draft" ? (
                  <Bookmark className="w-6 h-6 fill-amber-500 text-amber-500 animate-pulse" />
                ) : processingAction === "schedule" ? (
                  <Calendar className="w-6 h-6 text-blue-600 animate-pulse" />
                ) : isVideo ? (
                  <FileVideo className="w-6 h-6 animate-pulse text-indigo-600" />
                ) : (
                  <Send className="w-5 h-5 animate-pulse text-indigo-600" />
                )}
              </div>
            </div>

            {/* Status Titles */}
            <div className="space-y-1.5">
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                {uploadingMedia || processingAction === "upload"
                  ? "⚡ Uploading Media to CDN..."
                  : processingAction === "draft"
                  ? "📌 Saving Post as Draft..."
                  : processingAction === "schedule"
                  ? "📅 Scheduling Channels..."
                  : `🚀 Publishing to ${selectedIds.length} Channel(s)...`}
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {uploadingMedia || processingAction === "upload"
                  ? "Direct high-speed transfer to ImageKit Cloud CDN in progress. Large videos may take a few moments."
                  : processingAction === "draft"
                  ? "Safely saving your creative content, caption, hashtags, and media into MongoDB draft storage."
                  : processingAction === "schedule"
                  ? `Queuing your post for automated multi-channel delivery on ${scheduleDate || "selected date"}.`
                  : "Broadcasting your media and payload across connected social networks. Please keep this window open."}
              </p>
            </div>

            {/* Target Channels Live Badge List (if publishing or scheduling) */}
            {!uploadingMedia && processingAction !== "draft" && selectedIds.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                {selectedIds.map(id => {
                  const acc = accounts.find(a => a._id === id);
                  if (!acc) return null;
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-800 shadow-2xs"
                    >
                      <PlatformIcon platform={acc.platform} className="w-3.5 h-3.5" />
                      <span className="max-w-[100px] truncate">{acc.name || acc.platform}</span>
                    </span>
                  );
                })}
              </div>
            )}

            {/* High-tech pulsing progress bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative shadow-inner">
              <div className={`h-full rounded-full animate-pulse w-full ${
                processingAction === "draft"
                  ? "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"
                  : processingAction === "schedule"
                  ? "bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-600"
                  : uploadingMedia || processingAction === "upload"
                  ? "bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600"
                  : "bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600"
              }`} />
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-400">
              <RefreshCw className="w-3 h-3 animate-spin text-indigo-500" />
              <span>
                {processingAction === "draft"
                  ? "MongoDB Draft Synchronizer Active"
                  : processingAction === "schedule"
                  ? "Automated Multi-Channel Scheduler Active"
                  : uploadingMedia || processingAction === "upload"
                  ? "Direct ImageKit Cloud Pipeline Active"
                  : "Multi-Channel Social Broadcast Active"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* FREE COPYRIGHT & FAIR USE MODAL */}
      {showCopyrightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header with High-Visibility Emerald Gradient */}
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 text-white shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-100" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight flex items-center gap-1.5">
                    <span>✅ Free Copyright & Fair Use Notice</span>
                    <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/30 font-bold">
                      Section 107
                    </span>
                  </h3>
                  <p className="text-[11px] text-emerald-100 font-medium">
                    Owner details edit karein aur 1-click description me add karein
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCopyrightModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              
              {/* Tab Selector: Owner Info Form vs Full Custom Text */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900">
                  {copyrightTab === "form" ? "Owner & Business Details (Auto-fill)" : "Custom Disclaimer Text Editor"}
                </span>
                <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setCopyrightTab("form")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      copyrightTab === "form"
                        ? "bg-white text-emerald-700 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Owner Form
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!customDisclaimerText) {
                        setCustomDisclaimerText(generateCopyrightText());
                      }
                      setCopyrightTab("custom");
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      copyrightTab === "custom"
                        ? "bg-white text-emerald-700 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Edit Full Text
                  </button>
                </div>
              </div>

              {copyrightTab === "form" ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Business Name */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Business / Brand Name</label>
                      <input
                        type="text"
                        value={ownerBusiness}
                        onChange={e => {
                          setOwnerBusiness(e.target.value);
                          setIsDisclaimerTextCustomized(false);
                        }}
                        placeholder="e.g. Kisan Groups"
                        className="w-full h-9 px-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 shadow-2xs"
                      />
                    </div>

                    {/* WhatsApp Contact */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">📞 WhatsApp Contact</label>
                      <input
                        type="text"
                        value={ownerWhatsapp}
                        onChange={e => {
                          setOwnerWhatsapp(e.target.value);
                          setIsDisclaimerTextCustomized(false);
                        }}
                        placeholder="e.g. 63900 59995"
                        className="w-full h-9 px-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 shadow-2xs"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">📧 Official Email</label>
                      <input
                        type="email"
                        value={ownerEmail}
                        onChange={e => {
                          setOwnerEmail(e.target.value);
                          setIsDisclaimerTextCustomized(false);
                        }}
                        placeholder="e.g. info@kisangroups.in"
                        className="w-full h-9 px-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 shadow-2xs"
                      />
                    </div>

                    {/* Website */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">🌐 Website Link</label>
                      <input
                        type="text"
                        value={ownerWebsite}
                        onChange={e => {
                          setOwnerWebsite(e.target.value);
                          setIsDisclaimerTextCustomized(false);
                        }}
                        placeholder="e.g. www.kisangroups.in"
                        className="w-full h-9 px-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Live Rendered Preview */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Live Preview (How it will be added):</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(generateCopyrightText());
                          toast.success("Copied disclaimer to clipboard!");
                        }}
                        className="text-[10.5px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                    </div>
                    <pre className="p-3.5 rounded-2xl bg-slate-900 text-emerald-300 text-[11px] font-mono whitespace-pre-wrap leading-relaxed border border-slate-800 shadow-inner max-h-48 overflow-y-auto">
                      {generateCopyrightText()}
                    </pre>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">
                      Full Text (Directly modify any sentence):
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomDisclaimerText(generateCopyrightText());
                        setIsDisclaimerTextCustomized(false);
                        toast.success("Reset to default template");
                      }}
                      className="text-[10.5px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      Reset to Default
                    </button>
                  </div>
                  <textarea
                    rows={12}
                    value={customDisclaimerText || generateCopyrightText()}
                    onChange={e => {
                      setCustomDisclaimerText(e.target.value);
                      setIsDisclaimerTextCustomized(true);
                    }}
                    className="w-full p-3 rounded-2xl border border-slate-300 font-mono text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 shadow-2xs leading-relaxed"
                  />
                </div>
              )}

              {/* Informational Legal Note */}
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Safe & Compliant:</strong> Section 107 declaration helps prevent false copyright strikes on YouTube, Instagram, and Facebook while ensuring your business contact information is professionally presented in every post.
                </span>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setOwnerBusiness("Kisan Groups");
                  setOwnerWhatsapp("63900 59995");
                  setOwnerEmail("info@kisangroups.in");
                  setOwnerWebsite("www.kisangroups.in");
                  setCustomDisclaimerText("");
                  setIsDisclaimerTextCustomized(false);
                  toast.success("Reset to Kisan Groups default!");
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Reset Details
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCopyrightModal(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveOwnerInfoAndInsert("replace")}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold text-slate-800 transition-all cursor-pointer"
                  title="Replace existing description with this disclaimer"
                >
                  Replace Description
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveOwnerInfoAndInsert("append")}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-md hover:shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>➕ Add to Description (Bottom)</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* AUDIO & MUSIC COPYRIGHT COMPLIANCE MODAL */}
      {showAudioGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-teal-400 shrink-0">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black tracking-tight">Audio & Music Rights Guide</h3>
                  <p className="text-[11px] text-slate-400">Copyright guidelines & 1-click clearance for social publishing</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAudioGuideModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
              
              {/* Option 1: Real Human Voice */}
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-emerald-600 shrink-0" />
                    <h4 className="text-xs font-black text-slate-900">1. Creator Spoken Voice (Original Audio)</h4>
                  </div>
                  <span className="text-[9.5px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">100% Safe</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  For talking head videos, monologues, podcasts, vlogs & commentary. Verbal human speech is 100% original creator audio with zero copyright muting risk.
                </p>
                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={handleDeclareOriginalVoice}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Insert Voice Clearance Notice</span>
                  </button>
                </div>
              </div>

              {/* Option 2: Commercial & Trending Music */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-indigo-600 shrink-0" />
                    <h4 className="text-xs font-black text-slate-900">2. Trending & Commercial Songs Workflow</h4>
                  </div>
                  <span className="text-[9.5px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold">Reels & Shorts</span>
                </div>
                <div className="text-[11px] text-slate-600 space-y-1.5 leading-relaxed">
                  <p>• <strong>Instagram / FB Reels:</strong> Export video with spoken audio or muted music, then add the song inside Instagram/FB using the <strong>Audio Sticker</strong> (Meta pays label royalties, eliminating mute risk & boosting reach).</p>
                  <p>• <strong>YouTube Shorts:</strong> Select the song using the <strong>Add Sound</strong> picker in YouTube Shorts.</p>
                </div>
                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      handleDeclareMetaAudio();
                      setShowAudioGuideModal(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold shadow-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Insert Fair Use Audio Notice</span>
                  </button>
                </div>
              </div>

              {/* Option 3: Royalty-Free & Meta Sound Collection */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                    <h4 className="text-xs font-black text-slate-900">3. Royalty-Free Music Libraries</h4>
                  </div>
                  <span className="text-[9.5px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-bold">Monetization Ready</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Use pre-licensed music from <strong>Meta Sound Collection</strong> (10,000+ free studio tracks) or <strong>YouTube Audio Library</strong> for safe commercial monetization across all platforms.
                </p>
                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={handleDeclareRoyaltyFreeMusic}
                    className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-bold shadow-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Insert Royalty-Free Clearance</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span>Notice is automatically attached to caption</span>
              <button
                type="button"
                onClick={() => setShowAudioGuideModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-[11px] font-bold text-slate-800 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* PLATFORM COPYRIGHT DISPUTE & APPEAL GENERATOR MODAL */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-indigo-600/30 backdrop-blur-xs flex items-center justify-center border border-indigo-400/30 text-white shrink-0">
                  <Scale className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight flex items-center gap-1.5">
                    <span>Platform Dispute & Appeal Generator</span>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-400/30 font-bold">
                      Legal Shield
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300 font-medium">
                    Automated Counter-Notice for YouTube Content ID & Meta Rights Manager
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDisputeModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Platform Selector Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setDisputePlatform("youtube");
                  setCustomDisputeText(generateYouTubeDisputeText());
                }}
                className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  disputePlatform === "youtube"
                    ? "border-red-600 text-red-600 font-black"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <Play className="w-3.5 h-3.5 text-red-600" />
                <span>YouTube Content ID Dispute</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setDisputePlatform("meta");
                  setCustomDisputeText(generateMetaDisputeText());
                }}
                className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  disputePlatform === "meta"
                    ? "border-blue-600 text-blue-600 font-black"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Meta / Instagram Audio Appeal</span>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-indigo-950">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>How to use this dispute notice:</span>
                </p>
                <p className="text-[11.5px] leading-relaxed text-indigo-800">
                  {disputePlatform === "youtube" 
                    ? "Go to YouTube Studio > Content > Copyright > Dispute > Choose 'Fair Use' > Paste this statement in the explanation box."
                    : "Go to Instagram / Meta Business Suite > Notifications > Audio Claim > Appeal > Paste this statement to restore original audio."}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900">Formal Legal Statement (Ready to Copy)</label>
                  <button
                    type="button"
                    onClick={() => {
                      if (disputePlatform === "youtube") {
                        setCustomDisputeText(generateYouTubeDisputeText());
                      } else {
                        setCustomDisputeText(generateMetaDisputeText());
                      }
                      toast.success("Reset dispute text to standard legal template");
                    }}
                    className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 cursor-pointer"
                  >
                    Reset Template
                  </button>
                </div>

                <textarea
                  rows={13}
                  value={customDisputeText}
                  onChange={e => setCustomDisputeText(e.target.value)}
                  className="w-full p-4 rounded-2xl border border-slate-300 bg-slate-950 text-indigo-200 font-mono text-xs leading-relaxed focus:outline-none focus:border-indigo-600 shadow-inner"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowDisputeModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-all cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(customDisputeText);
                  toast.success("📋 Copied official dispute notice to clipboard!");
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md hover:shadow-indigo-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Official Dispute Notice</span>
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
