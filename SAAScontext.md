# PostFly (Social Media SaaS) — System Context & Architecture Knowledgebase

> **Author**: Saifuddin Ansari (Super Admin & Lead Architect)  
> **Last Updated**: October 4, 2026  
> **Primary Domains**:  
> - Custom Production Domain: `https://postflyr.kisandigital.org/`  
> - Vercel Endpoint: `https://social-media-post-eta.vercel.app/`  
> **Stack**: Next.js 14 (App Router), React 18, Tailwind CSS, MongoDB, ImageKit CDN, Google Gemini AI (2.5 & Flash), Meta Graph API v20.0, Google Business Profile API, Razorpay Payment Gateway.

---

## 🚀 1. Executive Summary & Core Platform Purpose

**PostFly** is an enterprise-grade multi-tenant SaaS application designed for social media automation, cross-platform content publishing, automated community management, AI content generation & copyright risk analysis, and Meta Ads management.

### Key Capabilities:
1. **Multi-Channel Social Publishing**: Schedule and publish posts, Reels, Shorts, and carousels across **7 Major Networks**:
   - Facebook Pages
   - Instagram Professional / Business Accounts
   - YouTube Channels & Shorts
   - Threads
   - Google Business Profile (GMB) Locations
   - Twitter / X
   - LinkedIn (Personal & Company Pages)
   - Pinterest (Idea Pins & Boards)
2. **Deep AI Content Safety & Copyright Scanner**: Powered by Google Gemini 2.5 Flash with multi-vector visual/audio/text analysis:
   - Deep scanning for AI-generated visual markers (Synthesia, HeyGen, Midjourney, DALL-E, Sora).
   - Audio spectrogram & voice synthesis analysis.
   - Text copyright risk scoring (0–100 scale) with non-gradient solid teal UI indicators.
3. **Zero-Lag ImageKit CDN Upload Pipeline**:
   - Instant local blob preview (`URL.createObjectURL`) on file drop.
   - Quiet background CDN sync via ImageKit authentication endpoints (`/api/upload/auth`).
   - Seamless media attachment without full-screen overlays or artificial delays.
4. **Meta App Review & Compliance Suite**:
   - Built to pass Meta App Review for 6 permissions: `Page Public Metadata Access`, `pages_show_list`, `pages_manage_posts`, `instagram_basic`, `instagram_content_publish`, `pages_read_engagement`.
   - Aggregated public Page metadata display (`category`, `verification_status`, `location`, `operating_hours`, `picture`) labeled with `Source: Meta Graph API`.
5. **Multi-Tenant Subscription & Monetization**:
   - 5-Day Free Trial enforcement with automatic locks upon expiration.
   - Tiered plans: Starter, Growth, Pro Unlimited, Super Admin.
   - Razorpay Webhooks & Invoicing with Coupon discount validation.

---

## 🏗️ 2. Core Architecture & Folder Structure

```
i:/socialmedia-agent/social-media-post/
├── app/                             # Next.js 14 App Router
│   ├── (dashboard)/                 # Authenticated SaaS Dashboard Layout
│   │   ├── accounts/                # Social Channels Hub & Meta Page Metadata
│   │   ├── admin/                   # Super Admin Controls (Coupons, Users, Logs)
│   │   ├── ads/                     # Meta Ads Campaign & Budget Manager
│   │   ├── analytics/               # Aggregated Performance Insights
│   │   ├── billing/                 # Plan Subscription & Razorpay Checkout
│   │   ├── copyright-scan/          # AI Content Risk & Copyright Deep Scanner
│   │   ├── dashboard/               # Overview KPI Widgets
│   │   ├── gmb/                     # Google Business Profile Manager
│   │   ├── media/                   # ImageKit Cloud Asset Library
│   │   ├── publisher/               # Social Post Composer & Scheduler
│   │   └── rules/                   # Auto-Comment & DM Automation Engine
│   ├── api/                         # Backend API Routes
│   │   ├── accounts/                # GET/DELETE Social Channels
│   │   ├── ads/                     # Ad Accounts & Campaign Management
│   │   ├── auth/                    # OAuth Connect & Callback Handlers
│   │   ├── copyright-scan/          # Gemini AI Deep Scanning Route
│   │   ├── gmb/                     # Google Locations Sync
│   │   ├── post/                    # Cross-Platform Post Dispatcher
│   │   ├── razorpay/                # Order Creation & Signature Verification
│   │   ├── rules/                   # Automation Rules CRUD
│   │   └── upload/                  # ImageKit Client Auth Tokens
│   └── layout.jsx                   # Root App Layout & Toast Provider
├── lib/                             # Utility & Database Layer
│   ├── db.js                        # MongoDB Database Access & Helper Functions
│   ├── gemini.js                    # Google Gemini AI Client & Prompt Templates
│   ├── user.js                      # User Auth, Plan Access & Billing Sync
│   └── cache.js                     # In-Memory Server Cache Engine
├── components/                      # Shared UI Components
│   ├── modals/                      # ConnectModal, BillingModal, ScannerModal
│   └── ui/                          # Skeletons, Icons, Badges
├── .env.local                       # Environment Variables & API Keys
└── SAAScontext.md                   # System Architecture Knowledgebase (This File)
```

---

## 🔐 3. Meta Graph API (v20.0) Integration & App Review Setup

### Meta App ID: `1401279338528045`

### Requested Permissions & Functional Scope:
1. **`Page Public Metadata Access`**:
   - Used to read public Page information (Page Name, Category, Verification Status, Cover/Profile picture, Location, Operating Hours).
   - Displayed on `/accounts` in an aggregated Page Metadata box with explicit attribution label: `Source: Meta Graph API`.
2. **`pages_show_list`**:
   - Allows users to discover and select which Facebook Pages they manage to connect to PostFly.
3. **`pages_manage_posts`**:
   - Enables direct scheduling and publishing of text, photos, and videos to Facebook Pages.
4. **`instagram_basic`**:
   - Fetches Instagram Professional profile data (username, profile picture, follower count).
5. **`instagram_content_publish`**:
   - Publishes photos, videos, carousels, and Reels to connected Instagram Business/Creator accounts.
6. **`pages_read_engagement`**:
   - Reads post likes, comments, and engagement analytics to display performance graphs in `/analytics`.

### OAuth Redirect URIs (Dynamic Resolution):
- Production: `https://postflyr.kisandigital.org/api/auth/callback/facebook`
- Vercel Fallback: `https://social-media-post-eta.vercel.app/api/auth/callback/facebook`
- Connect Flow: Handled in `app/api/auth/connect/[provider]/route.js` using dynamic `req.nextUrl.origin`.

---

## 🤖 4. AI Content Risk & Copyright Deep Scanner Engine

Located in `app/api/copyright-scan/route.js` and `lib/gemini.js`:

### Analysis Pipeline:
1. **Multi-Frame Visual Extraction**: Converts uploaded video/image into frame samples.
2. **Gemini 2.5 Flash Multimodal Prompting**:
   - **Deep Provenance Detection**: Detects synthetic facial features, temporal jitter, lip-sync mismatch, diffusion artifacts.
   - **Audio Spectrogram & Voice Synthesis**: Identifies AI voice clones (ElevenLabs, Bark, Tortoise).
   - **Origin Classification**: Flags `AI Generated` vs `Real / Human Created`.
3. **UI Representation**:
   - Highlighting banners styled in **solid teal background** (`bg-teal-600`) as per design guidelines.
   - Displays Risk Score (0-100), AI Origin Confidence %, and actionable remediation tips.

---

## 🌩️ 5. ImageKit CDN Upload Architecture

Located in `app/api/upload/auth/route.js` and `app/(dashboard)/publisher/page.jsx`:

1. **Instant UI Feedback**:
   - User drops file ➔ UI immediately creates local object URL (`URL.createObjectURL(file)`) and displays media thumbnail.
2. **Quiet Background Sync**:
   - Fetches signed auth token from `/api/upload/auth`.
   - Uploads directly to ImageKit endpoint (`https://ik.imagekit.io/saifdeveloper`).
   - Updates post draft with CDN URL (`https://ik.imagekit.io/...`) seamlessly without blocking user interaction.

---

## 🌐 6. Website Monitoring & Mobile App Integration (Roadmap & Context)

### Website Monitoring Module (`website_monitoring`):
- **Health Check Endpoint**: `/api/admin/system`
- **Uptime Monitoring**: Pings production domain `https://postflyr.kisandigital.org/` every 5 minutes.
- **Metrics Tracked**: HTTP status codes, response latency (ms), MongoDB connection pool health, Vercel edge status.

### Mobile App Integration (`mobile_app`):
- **Architecture**: React Native / Expo cross-mobile client sharing the same Next.js API endpoints.
- **Authentication**: JWT / Bearer tokens issued via `/api/auth/login`.
- **Push Notifications**: Firebase Cloud Messaging (FCM) triggered via webhook events for post publication status and auto-reply alerts.

---

## 📊 7. Database Schemas (MongoDB `postfly` Database)

### 1. `users` Collection:
```json
{
  "userId": "usr_123456",
  "name": "Saifuddin Ansari",
  "email": "ansarisaifuddin732@gmail.com",
  "role": "admin",
  "plan": "Super Admin (Unrestricted)",
  "status": "Active",
  "trialStartDate": "2026-09-20T10:00:00.000Z",
  "createdAt": "2026-09-20T10:00:00.000Z"
}
```

### 2. `accounts` Collection:
```json
{
  "_id": "66f4e...",
  "userId": "usr_123456",
  "platform": "facebook",
  "providerAccountId": "10054892019482",
  "name": "KisanChoice",
  "category": "Agricultural Services",
  "isVerified": true,
  "location": "Lucknow, UP, India",
  "operatingHours": "Open 24/7",
  "accessToken": "EAA...",
  "followers": 15400,
  "followersFormatted": "15.4K",
  "connectedAt": "2026-10-04T12:00:00.000Z"
}
```

### 3. `posts` Collection:
```json
{
  "postId": "post_78910",
  "userId": "usr_123456",
  "title": "New Season Produce Update",
  "caption": "Check out our organic harvest options for this month! 🌾",
  "mediaUrls": ["https://ik.imagekit.io/saifdeveloper/harvest.jpg"],
  "platforms": ["facebook", "instagram"],
  "status": "published",
  "publishedAt": "2026-10-04T14:30:00.000Z"
}
```

---

## 🔑 8. Essential Environment Variables

| Variable Key | Purpose | Example Value |
|---|---|---|
| `META_APP_ID` | Meta App Registration ID | `1401279338528045` |
| `META_APP_SECRET` | Meta OAuth Client Secret | *(Configured in Vercel)* |
| `META_REDIRECT_URI` | Custom OAuth Callback URL | `https://postflyr.kisandigital.org/api/auth/callback/facebook` |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit Public Token | `public_zA/OEOHQn+iEQFNIGyzHV7g3e+s=` |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit Secret Token | `private_P/VswEdAMxmdciTFQVqqOCn8qMk=` |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit CDN Endpoint | `https://ik.imagekit.io/saifdeveloper` |
| `GEMINI_API_KEY` | Google Gemini AI Key | `AQ.Ab8RN6KFTw7ukg95...` |
| `RAZORPAY_KEY_ID` | Razorpay Gateway Key ID | `rzp_live_TNdSmDOKSX2g6I` |
| `MONGODB_URI` | MongoDB Connection URI | *(Configured in Vercel)* |

---

## 💡 9. Summary for Future Maintenance & Knowledge Transfer

- All UI components strictly follow **UI/UX Pro Max** design guidelines (high-contrast semantic tokens, 8pt spacing grid, Lucide icons, responsive layout).
- Production build commands: `npm run build` (verified clean static page generation `48/48`).
- For Meta App Review resubmissions, always ensure screencasts are recorded in English showing live OAuth flow, Page metadata on `/accounts` labeled with `Source: Meta Graph API`, live publishing, and analytics.
