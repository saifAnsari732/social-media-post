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
  const selectedPlatforms = JSON.parse(formData.get("platforms") || "[]");

  if (!file) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const isVideo = file.type.startsWith("video");

  const accounts = getAccounts();
  const results = {};

  for (const platform of selectedPlatforms) {
    const account = accounts.find((a) => a.platform === platform);
    if (!account) {
      results[platform] = { success: false, error: "Not connected" };
      continue;
    }

    try {
      switch (platform) {
        case "youtube":
          if (!isVideo) throw new Error("YouTube requires a video file");
          results.youtube = await postToYouTube({
            accessToken: account.accessToken,
            videoBuffer: buffer,
            title,
            description
          });
          break;

        case "facebook":
          results.facebook = await postToFacebook({
            pageId: account.pageId,
            pageAccessToken: account.accessToken,
            videoBuffer: buffer,
            title,
            description
          });
          break;

        case "instagram":
          // Note: Instagram ko ek publicly hosted video_url chahiye,
          // production me pehle apne CDN/S3 par upload karke woh URL yahan pass karo.
          results.instagram = await postToInstagram({
            igUserId: account.igUserId,
            accessToken: account.accessToken,
            videoUrl: account.tempVideoUrl,
            caption: `${title}\n\n${description}`
          });
          break;

        case "twitter":
          results.twitter = await postToTwitter({
            accessToken: account.accessToken,
            videoBuffer: buffer,
            text: `${title}\n\n${description}`
          });
          break;

        case "linkedin":
          results.linkedin = await postToLinkedIn({
            accessToken: account.accessToken,
            personUrn: account.personUrn,
            videoBuffer: buffer,
            title,
            description
          });
          break;

        case "tiktok":
          results.tiktok = await postToTikTok({
            accessToken: account.accessToken,
            videoBuffer: buffer,
            title
          });
          break;

        default:
          results[platform] = { success: false, error: "Unsupported platform" };
      }
    } catch (err) {
      results[platform] = { success: false, error: err.message };
    }
  }

  addPost({
    id: Date.now().toString(),
    title,
    description,
    platforms: selectedPlatforms,
    results,
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({ results });
}
