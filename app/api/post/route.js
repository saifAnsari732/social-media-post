import { NextResponse } from "next/server";
import { getAccounts, addPost } from "@/lib/db";
import { postToYouTube } from "@/lib/platforms/youtube";
import { postToFacebook } from "@/lib/platforms/facebook";
import { postToInstagram } from "@/lib/platforms/instagram";
import { postToTwitter } from "@/lib/platforms/twitter";
import { postToLinkedIn } from "@/lib/platforms/linkedin";
import { postToTikTok } from "@/lib/platforms/tiktok";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");
  const title = formData.get("title") || "";
  const description = formData.get("description") || "";
  const tagsString = formData.get("tags") || "";
  const tags = tagsString.split(",").map(t => t.trim()).filter(Boolean);
  const selectedAccountIds = JSON.parse(formData.get("accountIds") || "[]");

  if (!file) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const isVideo = file.type.startsWith("video");

  const accounts = await getAccounts();
  const results = {};

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
            tags
          });
          break;

        case "facebook":
          results[accountId] = await postToFacebook({
            pageId: account.pageId,
            pageAccessToken: account.accessToken,
            videoBuffer: buffer,
            title,
            description
          });
          break;

        case "instagram": {
          if (!isVideo) throw new Error("Instagram Reels require a video file");
          
          // Upload to tmpfiles.org to get a public URL for Instagram to download the video
          const uploadForm = new FormData();
          uploadForm.append("file", new Blob([buffer]), file.name || "video.mp4");
          
          const uploadRes = await fetch("https://tmpfiles.org/api/v1/upload", {
            method: "POST",
            body: uploadForm
          });
          
          const uploadData = await uploadRes.json();
          if (!uploadRes.ok || !uploadData.data || !uploadData.data.url) {
            throw new Error(`Temporary video hosting failed: ${JSON.stringify(uploadData)}`);
          }
          
          // Convert viewer URL to direct download URL (required by Instagram)
          const directUrl = uploadData.data.url.replace("https://tmpfiles.org/", "https://tmpfiles.org/dl/");
          
          results[accountId] = await postToInstagram({
            igUserId: account.igUserId,
            accessToken: account.accessToken,
            videoUrl: directUrl,
            caption: `${title}\n\n${description}`
          });
          break;
        }

        case "twitter":
          results[accountId] = await postToTwitter({
            accessToken: account.accessToken,
            videoBuffer: buffer,
            text: `${title}\n\n${description}`
          });
          break;

        case "linkedin":
          results[accountId] = await postToLinkedIn({
            accessToken: account.accessToken,
            personUrn: account.personUrn,
            videoBuffer: buffer,
            title,
            description
          });
          break;

        case "tiktok":
          results[accountId] = await postToTikTok({
            accessToken: account.accessToken,
            videoBuffer: buffer,
            title
          });
          break;

        default:
          results[accountId] = { success: false, error: "Unsupported platform" };
      }
    } catch (err) {
      results[accountId] = { success: false, error: err.message };
    }
  }

  await addPost({
    id: Date.now().toString(),
    title,
    description,
    accountIds: selectedAccountIds,
    results,
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({ results });
}
