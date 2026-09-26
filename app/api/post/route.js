import { NextResponse } from "next/server";
import { getAccounts, addPost, getPosts, updatePost, deletePost, getUserById, isUserTrialExpired } from "@/lib/db";
import { serverCache } from "@/lib/cache";
import { postToYouTube } from "@/lib/platforms/youtube";
import { postToFacebook } from "@/lib/platforms/facebook";
import { postToInstagram } from "@/lib/platforms/instagram";
import { postToTwitter } from "@/lib/platforms/twitter";
import { postToLinkedIn } from "@/lib/platforms/linkedin";
import { postToTikTok } from "@/lib/platforms/tiktok";
import { postToThreads } from "@/lib/platforms/threads";
import { postToPinterest } from "@/lib/platforms/pinterest";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET(req) {
  try {
    let userId = req.headers.get("x-user-id");
    if (!userId || userId === "undefined" || userId === "null") {
      userId = null;
    }

    const url = new URL(req.url);
    const forceFresh = url.searchParams.has("t") || url.searchParams.has("fresh");
    const cacheKey = `posts:${userId || 'all'}`;

    if (!forceFresh) {
      const cachedPosts = serverCache.get(cacheKey);
      if (cachedPosts) {
        return NextResponse.json(cachedPosts, {
          headers: {
            "Cache-Control": "private, no-cache, no-store, must-revalidate",
            "X-Cache-Status": "HIT"
          }
        });
      }
    }

    const [posts, accounts] = await Promise.all([
      getPosts(userId),
      getAccounts(userId)
    ]);
    
    // Map account details (name, platform) onto posts
    const accountMap = {};
    accounts.forEach(acc => {
      const idStr = acc._id ? acc._id.toString() : "";
      const pId = acc.providerAccountId || "";
      const nameKey = (acc.name || "").toLowerCase().trim();
      const platKey = (acc.platform || "").toLowerCase().trim();

      const details = {
        id: idStr,
        name: acc.name || acc.platform || "Social Channel",
        platform: acc.platform || "general"
      };

      if (idStr) accountMap[idStr] = details;
      if (pId) accountMap[pId] = details;
      if (nameKey) accountMap[nameKey] = details;
      if (platKey && !accountMap[platKey]) accountMap[platKey] = details;
    });

    const enrichedPosts = posts.map(post => {
      let channelDetails = (post.accountIds || []).map(id => {
        const idStr = String(id).trim();
        if (accountMap[idStr]) return accountMap[idStr];
        const found = accounts.find(a => 
          a._id?.toString() === idStr || 
          a._id?.toString().endsWith(idStr) ||
          a.platform?.toLowerCase() === idStr.toLowerCase() ||
          a.name?.toLowerCase().includes(idStr.toLowerCase())
        );
        if (found) {
          return { name: found.name || found.platform, platform: found.platform };
        }
        return null;
      }).filter(Boolean);

      // If post has results object (e.g. { accId: { success: true } }), extract platform details
      if (channelDetails.length === 0 && post.results) {
        Object.keys(post.results).forEach(accId => {
          if (accountMap[accId]) channelDetails.push(accountMap[accId]);
        });
      }

      // Fallback to active accounts if empty
      if (channelDetails.length === 0 && accounts.length > 0) {
        channelDetails = accounts.slice(0, 2).map(a => ({ name: a.name || a.platform, platform: a.platform }));
      }

      return {
        ...post,
        channelDetails
      };
    });

    const responsePayload = { posts: enrichedPosts, accounts, cached: false };
    serverCache.set(cacheKey, responsePayload, 20, [`user:${userId}`, "posts"]);

    return NextResponse.json(responsePayload, {
      headers: {
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "X-Cache-Status": "MISS"
      }
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  let file = null;
  let title = "";
  let description = "";
  let tags = [];
  let selectedAccountIds = [];
  let publishMode = "now";
  let scheduledAt = null;
  let mediaUrl = null;
  let mediaType = null;
  let disableComments = false;
  let youtubeFormat = "auto";
  let youtubePrivacy = "public";
  let youtubeMadeForKids = false;
  let youtubeCategory = "22";
  let instagramPlacement = "reels";
  let instagramShareToFeed = true;
  let facebookPlacement = "reels_video";
  let rawUserId = req.headers.get("x-user-id");
  let userId = (rawUserId && rawUserId !== "undefined" && rawUserId !== "null" && rawUserId.trim() !== "") 
    ? rawUserId.trim() 
    : "eb994f0c8e6f7fb4c2629561";

  // SaaS Subscription Guard: Block posting if trial has expired
  if (userId) {
    const user = await getUserById(userId);
    if (user && isUserTrialExpired(user)) {
      return NextResponse.json(
        { error: "Your 5-Day Free Trial has expired. All posting permissions are blocked until you upgrade to a plan.", isExpired: true },
        { status: 403 }
      );
    }
  }

  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const json = await req.json();
    title = json.title || "";
    description = json.content || json.description || "";
    const rawTags = json.tags || [];
    tags = Array.isArray(rawTags)
      ? rawTags
      : String(rawTags).split(",").map(t => t.trim().replace(/^#/, '')).filter(Boolean);
    selectedAccountIds = json.accountIds || json.platforms || [];
    publishMode = json.publishMode || (json.scheduledAt ? "schedule" : "draft");
    scheduledAt = json.scheduledAt || null;
    disableComments = Boolean(json.disableComments);
    youtubeFormat = json.youtubeFormat || "auto";
    youtubePrivacy = json.youtubePrivacy || "public";
    youtubeMadeForKids = Boolean(json.youtubeMadeForKids);
    youtubeCategory = json.youtubeCategory || "22";
    instagramPlacement = json.instagramPlacement || "reels";
    instagramShareToFeed = json.instagramShareToFeed !== false;
    facebookPlacement = json.facebookPlacement || "reels_video";
    if (json.mediaUrl) {
      mediaUrl = json.mediaUrl;
      mediaType = json.mediaType || (json.mediaUrl.includes("video") ? "video" : "image");
    }
  } else {
    const formData = await req.formData();
    file = formData.get("file");
    title = formData.get("title") || "";
    description = formData.get("description") || "";
    const tagsString = formData.get("tags") || "";
    tags = tagsString.split(",").map(t => t.trim()).filter(Boolean);
    try {
      selectedAccountIds = JSON.parse(formData.get("accountIds") || "[]");
    } catch {
      selectedAccountIds = [];
    }
    const mediaUrlFromForm = formData.get("mediaUrl") || "";
    const mediaTypeFromForm = formData.get("mediaType") || "";
    publishMode = formData.get("publishMode") || "now";
    scheduledAt = formData.get("scheduledAt") || null;
    disableComments = formData.get("disableComments") === "true";
    youtubeFormat = formData.get("youtubeFormat") || "auto";
    youtubePrivacy = formData.get("youtubePrivacy") || "public";
    youtubeMadeForKids = formData.get("youtubeMadeForKids") === "true";
    youtubeCategory = formData.get("youtubeCategory") || "22";
    instagramPlacement = formData.get("instagramPlacement") || "reels";
    instagramShareToFeed = formData.get("instagramShareToFeed") !== "false";
    facebookPlacement = formData.get("facebookPlacement") || "reels_video";
    if (!file && mediaUrlFromForm) {
      mediaUrl = mediaUrlFromForm;
      mediaType = mediaTypeFromForm || (mediaUrlFromForm.includes("video") ? "video" : "image");
    }
  }

  const accounts = await getAccounts(userId);
  const results = {};

  // Upload file or base64 to ImageKit to store clean CDN URL
  if (file && typeof file === "object" && file.size > 0) {
    const isVideoFile = file.type?.startsWith("video") || Boolean(file.name?.match(/\.(mp4|mov|webm|avi|m4v|mkv)$/i));
    mediaType = isVideoFile ? "video" : "image";
    try {
      const { default: imagekit } = await import("@/lib/imagekit");
      const arrayBuf = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuf);
      const ikRes = await new Promise((resolve, reject) => {
        imagekit.upload(
          {
            file: buffer,
            fileName: (file.name || `post_${Date.now()}`).replace(/[^a-zA-Z0-9_.-]/g, "_"),
            folder: isVideoFile ? "/social_posts/videos" : "/social_posts/images",
            useUniqueFileName: true
          },
          (err, res) => (err ? reject(err) : resolve(res))
        );
      });
      if (ikRes && ikRes.url) {
        mediaUrl = ikRes.url;
      }
    } catch (e) {
      console.error("ImageKit upload error in post route:", e);
    }
  } else if (mediaUrl && mediaUrl.startsWith("data:")) {
    try {
      const { default: imagekit } = await import("@/lib/imagekit");
      const ikRes = await new Promise((resolve, reject) => {
        imagekit.upload(
          {
            file: mediaUrl,
            fileName: `post_${Date.now()}`,
            folder: "/social_posts",
            useUniqueFileName: true
          },
          (err, res) => (err ? reject(err) : resolve(res))
        );
      });
      if (ikRes && ikRes.url) {
        mediaUrl = ikRes.url;
      }
    } catch (e) {
      console.error("ImageKit base64 upload error in post route:", e);
    }
  }

  // If user is saving as draft or scheduling for future
  if (publishMode === "schedule" || publishMode === "draft") {
    for (const accountId of selectedAccountIds) {
      const account = accounts.find((a) => a._id.toString() === accountId);
      results[accountId] = { 
        success: true, 
        status: publishMode === "schedule" ? "Scheduled" : "Draft",
        scheduledAt 
      };
    }

    const newPost = await addPost({
      id: Date.now().toString(),
      userId,
      title,
      description,
      tags,
      mediaUrl,
      mediaType,
      disableComments: !!disableComments,
      youtubeFormat,
      youtubePrivacy,
      youtubeMadeForKids: Boolean(youtubeMadeForKids),
      youtubeCategory,
      instagramPlacement,
      instagramShareToFeed: Boolean(instagramShareToFeed),
      facebookPlacement,
      accountIds: selectedAccountIds,
      status: publishMode === "schedule" ? "Scheduled" : "Draft",
      scheduledAt: scheduledAt || new Date().toISOString(),
      results,
      createdAt: new Date().toISOString()
    });

    // Invalidate server cache so GET /api/post returns new post/draft instantly
    try {
      serverCache.delete(`posts:${userId || 'all'}`);
      serverCache.invalidateTag("posts");
    } catch (e) {}

    return NextResponse.json({ success: true, post: newPost, results });
  }

  if (!file && !mediaUrl) {
    return NextResponse.json({ error: "Media file is required for publishing" }, { status: 400 });
  }

  let buffer = null;
  let isVideo = mediaType === "video";
  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
    isVideo = file.type?.startsWith("video");
  } else if (mediaUrl && (mediaUrl.startsWith("http://") || mediaUrl.startsWith("https://"))) {
    // If client uploaded directly to ImageKit CDN, fetch buffer for platforms that require binary buffer
    try {
      const mediaRes = await fetch(mediaUrl);
      if (mediaRes.ok) {
        const arrayBuffer = await mediaRes.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
        const fetchedContentType = mediaRes.headers.get("content-type") || "";
        if (fetchedContentType.startsWith("video/") || mediaType === "video" || mediaUrl.match(/\.(mp4|mov|webm|avi|m4v|mkv)/i)) {
          isVideo = true;
          mediaType = "video";
        }
      }
    } catch (fetchErr) {
      console.error("Error fetching media buffer from CDN:", fetchErr);
    }
  }

  for (const accountId of selectedAccountIds) {
    const account = accounts.find((a) => a._id.toString() === accountId);
    if (!account) {
      results[accountId] = { success: false, error: "Account not found" };
      continue;
    }

    const platform = account.platform;

    try {
      switch (platform) {
        case "youtube":
          if (!isVideo) throw new Error("YouTube requires a video file");
          results[accountId] = await postToYouTube({
            accessToken: account.accessToken,
            refreshToken: account.refreshToken,
            accountId: account._id,
            platform: account.platform,
            providerAccountId: account.providerAccountId,
            name: account.name,
            videoBuffer: buffer,
            title,
            description,
            tags,
            youtubeFormat,
            privacyStatus: youtubePrivacy,
            madeForKids: youtubeMadeForKids,
            categoryId: youtubeCategory
          });
          break;

        case "facebook":
          results[accountId] = await postToFacebook({
            pageId: account.pageId || account.providerAccountId,
            pageAccessToken: account.accessToken,
            videoBuffer: buffer,
            mediaUrl: mediaUrl,
            title,
            description,
            isVideo,
            placement: facebookPlacement
          });
          break;

        case "instagram": {
          const directUrl = mediaUrl || "https://ik.imagekit.io/saifdeveloper/sample.mp4";
          results[accountId] = await postToInstagram({
            igUserId: account.igUserId,
            accessToken: account.accessToken,
            mediaUrl: directUrl,
            caption: `${title}\n\n${description}`,
            isVideo,
            disableComments,
            placement: instagramPlacement,
            shareToFeed: instagramShareToFeed
          });
          break;
        }

        case "twitter":
          results[accountId] = await postToTwitter({
            accessToken: account.accessToken,
            videoBuffer: buffer,
            mediaUrl: mediaUrl,
            text: `${title}\n\n${description}`,
            isVideo,
            mimeType: isVideo ? "video/mp4" : "image/jpeg",
            disableComments
          });
          break;

        case "linkedin": {
          const authorUrn =
            account.authorUrn ||
            account.orgUrn ||
            account.personUrn ||
            (account.isOrganization || account.accountType === "Company Page"
              ? `urn:li:organization:${account.organizationId || account.providerAccountId.replace("org_", "")}`
              : `urn:li:person:${account.providerAccountId}`);

          results[accountId] = await postToLinkedIn({
            accessToken: account.accessToken,
            personUrn: authorUrn,
            authorUrn: authorUrn,
            videoBuffer: buffer,
            title,
            description,
            isVideo
          });
          break;
        }

        case "tiktok":
          if (!isVideo) throw new Error("TikTok requires a video file");
          results[accountId] = await postToTikTok({
            accessToken: account.accessToken,
            videoBuffer: buffer,
            title
          });
          break;

        case "threads": {
          results[accountId] = await postToThreads({
            threadsUserId: account.providerAccountId,
            accessToken: account.accessToken,
            text: `${title}\n\n${description}`,
            mediaUrl: mediaUrl,
            isVideo
          });
          break;
        }

        case "pinterest": {
          results[accountId] = await postToPinterest({
            accessToken: account.accessToken,
            title,
            description,
            mediaUrl: mediaUrl,
            boardId: account.boardId
          });
          break;
        }

        default:
          results[accountId] = { success: false, error: "Unsupported platform" };
      }
    } catch (err) {
      results[accountId] = { success: false, error: err.message };
    }
  }

  const allFailed = selectedAccountIds.length > 0 && selectedAccountIds.every(id => results[id] && !results[id].success);
  const someFailed = selectedAccountIds.some(id => results[id] && !results[id].success);
  const postStatus = allFailed ? "Failed" : (someFailed ? "Partial" : "Published");

  await addPost({
    id: Date.now().toString(),
    userId,
    title,
    description,
    tags,
    mediaUrl,
    mediaType,
    disableComments: !!disableComments,
    youtubeFormat,
    youtubePrivacy,
    youtubeMadeForKids: Boolean(youtubeMadeForKids),
    youtubeCategory,
    instagramPlacement,
    instagramShareToFeed: Boolean(instagramShareToFeed),
    facebookPlacement,
    accountIds: selectedAccountIds,
    status: postStatus,
    results,
    createdAt: new Date().toISOString()
  });

  // Invalidate cache immediately on new post
  serverCache.revalidateTag(`user:${userId}`);
  serverCache.revalidateTag("posts");

  return NextResponse.json({ results });
}

export async function PUT(req) {
  try {
    let rawUserId = req.headers.get("x-user-id");
    let userId = (rawUserId && rawUserId !== "undefined" && rawUserId !== "null" && rawUserId.trim() !== "") 
      ? rawUserId.trim() 
      : "eb994f0c8e6f7fb4c2629561";

    const user = await getUserById(userId);
    if (user && isUserTrialExpired(user)) {
      return NextResponse.json(
        { error: "Your 5-Day Free Trial has expired. Please upgrade your plan to publish drafts.", isExpired: true },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { postId, action } = body;

    if (!postId) return NextResponse.json({ error: "Post ID is required" }, { status: 400 });

    if (action === "publish_now") {
      const updated = await updatePost(postId, {
        status: "Published",
        publishedAt: new Date().toISOString()
      });

      // Invalidate cache immediately on post status change
      try {
        serverCache.delete(`posts:${userId || 'all'}`);
        serverCache.invalidateTag("posts");
      } catch (e) {}

      return NextResponse.json({ success: true, post: updated });
    }

    if (action === "update_draft") {
      const updatePayload = {
        updatedAt: new Date().toISOString()
      };
      if (body.title !== undefined) updatePayload.title = body.title;
      if (body.description !== undefined) updatePayload.description = body.description;
      if (body.tags !== undefined) updatePayload.tags = body.tags;
      if (body.accountIds !== undefined) updatePayload.accountIds = body.accountIds;
      if (body.status !== undefined) updatePayload.status = body.status;
      if (body.mediaUrl !== undefined) updatePayload.mediaUrl = body.mediaUrl;
      if (body.mediaType !== undefined) updatePayload.mediaType = body.mediaType;
      if (body.disableComments !== undefined) updatePayload.disableComments = !!body.disableComments;
      if (body.youtubeFormat !== undefined) updatePayload.youtubeFormat = body.youtubeFormat;
      if (body.youtubePrivacy !== undefined) updatePayload.youtubePrivacy = body.youtubePrivacy;
      if (body.youtubeMadeForKids !== undefined) updatePayload.youtubeMadeForKids = Boolean(body.youtubeMadeForKids);
      if (body.youtubeCategory !== undefined) updatePayload.youtubeCategory = body.youtubeCategory;
      if (body.instagramPlacement !== undefined) updatePayload.instagramPlacement = body.instagramPlacement;
      if (body.instagramShareToFeed !== undefined) updatePayload.instagramShareToFeed = Boolean(body.instagramShareToFeed);
      if (body.facebookPlacement !== undefined) updatePayload.facebookPlacement = body.facebookPlacement;

      const updated = await updatePost(postId, updatePayload);
      try {
        serverCache.delete(`posts:${userId || 'all'}`);
        serverCache.invalidateTag("posts");
      } catch (e) {}

      return NextResponse.json({ success: true, post: updated });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("id");

    if (!postId) return NextResponse.json({ error: "Post ID is required" }, { status: 400 });

    await deletePost(postId, userId);

    // Invalidate cache immediately on post deletion
    serverCache.revalidateTag(`user:${userId}`);
    serverCache.revalidateTag("posts");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
