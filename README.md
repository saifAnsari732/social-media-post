# Broadcast — One Video, Every Channel

Next.js app to connect multiple social media accounts (YouTube, Facebook,
Instagram, X/Twitter, LinkedIn, TikTok) and publish one video/image post to
all of them at once. Includes an optional "Generate with Gemini" button that
auto-writes a title, description, and hashtags for your post.

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env` with:

1. **GEMINI_API_KEY** — get one free at https://aistudio.google.com/app/apikey
2. Credentials for whichever platforms you want to support:
   - **YouTube**: Google Cloud Console → OAuth client (YouTube Data API v3 enabled)
   - **Facebook / Instagram**: Meta for Developers → create an App, add
     Facebook Login + Instagram Graph API products (Instagram account must be
     a Business/Creator account linked to a Facebook Page)
   - **X/Twitter**: developer.twitter.com → create App with OAuth 2.0
   - **LinkedIn**: developer.linkedin.com → create App, request
     "Share on LinkedIn" + "Sign In" products
   - **TikTok**: developers.tiktok.com → register App, request Content
     Posting API scope

You don't need every platform's keys — only connect the ones you leave filled in.

## Run

```bash
npm run dev
```

Open http://localhost:3000, click "Connect" under each channel you want,
authorize, then come back and upload your video with title/description
(or click "Generate" to have Gemini write it for you), select channels,
and hit Publish.

## How it works

- `app/api/auth/connect/[provider]` — redirects to each platform's OAuth screen
- `app/api/auth/callback/[provider]` — exchanges the returned code for an
  access token and saves it to `data/db.json`
- `lib/platforms/*.js` — one file per platform with the actual posting logic
  against that platform's real API (YouTube resumable upload, Meta Graph API,
  X v2 media upload, LinkedIn UGC posts, TikTok Content Posting API)
- `app/api/post` — reads your uploaded file once, loops through every
  selected + connected platform, and posts to each in parallel
- `lib/gemini.js` — calls Gemini to generate title/description/hashtags
  from a short text prompt you give it

## Notes / next steps for production

- `data/db.json` is a simple file-based store for demo purposes — swap in
  Postgres + Prisma (or any DB) for real usage, especially multi-user.
- Instagram's API requires the video to already be hosted at a public URL
  before publishing — wire up an S3/Cloudinary upload step before calling
  `postToInstagram`.
- Add token refresh logic for providers whose access tokens expire
  (YouTube/Google refresh tokens are already being stored).
- Add auth/login if this will be used by more than one person, since
  right now all connected accounts are shared globally.
