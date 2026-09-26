import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { provider } = params;
  const userId = req.nextUrl.searchParams.get("userId") || "anonymous";
  const returnTo = req.nextUrl.searchParams.get("returnTo") || null;
  const state = Buffer.from(JSON.stringify({ userId, provider, returnTo })).toString("base64url");

  const metaAppId = process.env.META_APP_ID || "1401279338528045";
  const threadsAppId = process.env.THREADS_APP_ID || process.env.NEXT_PUBLIC_THREADS_APP_ID || process.env.META_APP_ID || "1401279338528045";
  const metaRedirectUri = process.env.META_REDIRECT_URI || "https://social-media-post-eta.vercel.app/api/auth/callback/facebook";
  const threadsRedirectUri = process.env.THREADS_REDIRECT_URI || "https://social-media-post-eta.vercel.app/api/auth/callback/threads";

  const AUTH_URLS = {
    youtube: () =>
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.YOUTUBE_CLIENT_ID}&redirect_uri=${process.env.YOUTUBE_REDIRECT_URI}&response_type=code&access_type=offline&prompt=consent&state=${state}&scope=${encodeURIComponent(
        "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly"
      )}`,
    facebook: () =>
      `https://www.facebook.com/v20.0/dialog/oauth?client_id=${metaAppId}&redirect_uri=${encodeURIComponent(metaRedirectUri)}&state=${state}&auth_type=rerequest&scope=${encodeURIComponent(
        "pages_show_list,pages_read_engagement,pages_manage_posts,pages_manage_metadata,pages_read_user_content,business_management"
      )}`,
    meta_ads: () =>
      `https://www.facebook.com/v20.0/dialog/oauth?client_id=${metaAppId}&redirect_uri=${encodeURIComponent(metaRedirectUri)}&state=${state}&auth_type=rerequest&scope=${encodeURIComponent(
        "ads_management,ads_read,business_management,pages_show_list,pages_read_engagement"
      )}`,
    facebook_ads: () =>
      `https://www.facebook.com/v20.0/dialog/oauth?client_id=${metaAppId}&redirect_uri=${encodeURIComponent(metaRedirectUri)}&state=${state}&auth_type=rerequest&scope=${encodeURIComponent(
        "ads_management,ads_read,business_management,pages_show_list,pages_read_engagement"
      )}`,
    instagram: () =>
      `https://www.facebook.com/v20.0/dialog/oauth?client_id=${metaAppId}&redirect_uri=${encodeURIComponent(metaRedirectUri)}&state=${state}&auth_type=rerequest&scope=${encodeURIComponent(
        "pages_show_list,pages_read_engagement,pages_manage_posts,pages_manage_metadata,instagram_basic,instagram_content_publish,instagram_manage_messages,instagram_manage_comments,instagram_manage_insights,business_management"
      )}`,
    twitter: () => {
      return `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.TWITTER_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.TWITTER_REDIRECT_URI)}&scope=${encodeURIComponent(
        "tweet.read tweet.write users.read offline.access"
      )}&state=${state}&code_challenge=yDiyogOBAhICYCLz2kezunB7Mo0MdVRIQMs7tRbJmLE&code_challenge_method=S256`;
    },
    linkedin: () => {
      // By default use approved personal scopes (openid, profile, email, w_member_social)
      // If organization approval is active, set LINKEDIN_SCOPES or LINKEDIN_ENABLE_ORG_SCOPES=true in env
      const defaultScopes = process.env.LINKEDIN_ENABLE_ORG_SCOPES === "true"
        ? "openid profile email w_member_social w_organization_social rw_organization_admin"
        : "openid profile email w_member_social";
      const customScopes = process.env.LINKEDIN_SCOPES || process.env.LINKEDIN_SCOPE;
      const linkedinScope = customScopes || defaultScopes;
      return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(
        process.env.LINKEDIN_REDIRECT_URI || "https://social-media-post-eta.vercel.app/api/auth/callback/linkedin"
      )}&state=${state}&scope=${encodeURIComponent(linkedinScope)}`;
    },
    threads: () => {
      // Direct Meta Connection -> Redirects to Meta OAuth Dialog and automatically discovers Instagram & Threads!
      return `https://www.facebook.com/v20.0/dialog/oauth?client_id=${metaAppId}&redirect_uri=${encodeURIComponent(
        metaRedirectUri
      )}&state=${state}&auth_type=rerequest&scope=${encodeURIComponent(
        "pages_show_list,pages_read_engagement,pages_manage_posts,pages_manage_metadata,instagram_basic,instagram_content_publish,instagram_manage_messages,instagram_manage_comments,instagram_manage_insights,business_management"
      )}`;
    },
    pinterest: () =>
      `https://www.pinterest.com/oauth/?client_id=${process.env.PINTEREST_CLIENT_ID}&redirect_uri=${encodeURIComponent(
        process.env.PINTEREST_REDIRECT_URI
      )}&response_type=code&scope=${encodeURIComponent(
        "boards:read,boards:write,pins:read,pins:write,user_accounts:read"
      )}&state=${state}`,
    tiktok: () =>
      `https://www.tiktok.com/v2/auth/authorize?client_key=${process.env.TIKTOK_CLIENT_KEY}&redirect_uri=${process.env.TIKTOK_REDIRECT_URI}&response_type=code&state=${state}&scope=video.publish`,
  };

  const builder = AUTH_URLS[provider];
  if (!builder) return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
  return NextResponse.redirect(builder());
}
