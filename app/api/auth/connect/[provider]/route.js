import { NextResponse } from "next/server";
// OAuth connection router for social platforms

const AUTH_URLS = {
  youtube: () =>
    `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.YOUTUBE_CLIENT_ID}&redirect_uri=${process.env.YOUTUBE_REDIRECT_URI}&response_type=code&access_type=offline&scope=${encodeURIComponent(
      "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly"
    )}`,
  facebook: () =>
    `https://www.facebook.com/v20.0/dialog/oauth?client_id=${process.env.META_APP_ID}&redirect_uri=${process.env.META_REDIRECT_URI}&auth_type=rerequest&scope=${encodeURIComponent(
      "pages_manage_posts,pages_read_engagement,instagram_content_publish,pages_show_list"
    )}`,
  instagram: () =>
    `https://www.facebook.com/v20.0/dialog/oauth?client_id=${process.env.META_APP_ID}&redirect_uri=${process.env.META_REDIRECT_URI}&auth_type=rerequest&scope=${encodeURIComponent(
      "instagram_content_publish,pages_show_list"
    )}`,
  twitter: () => {
    const state = Math.random().toString(36).substring(7);
    return `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.TWITTER_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.TWITTER_REDIRECT_URI)}&scope=${encodeURIComponent(
      "tweet.read tweet.write users.read offline.access"
    )}&state=${state}&code_challenge=yDiyogOBAhICYCLz2kezunB7Mo0MdVRIQMs7tRbJmLE&code_challenge_method=S256`;
  },
  linkedin: () =>
    `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.LINKEDIN_REDIRECT_URI}&scope=${encodeURIComponent(
      "w_member_social"
    )}`,
  tiktok: () =>
    `https://www.tiktok.com/v2/auth/authorize?client_key=${process.env.TIKTOK_CLIENT_KEY}&redirect_uri=${process.env.TIKTOK_REDIRECT_URI}&response_type=code&scope=video.publish`
};

export async function GET(req, { params }) {
  const { provider } = params;
  const builder = AUTH_URLS[provider];
  if (!builder) return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
  return NextResponse.redirect(builder());
}
