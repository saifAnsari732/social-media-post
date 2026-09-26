# Postfly SaaS — Complete System Context & Feature Architecture

> **Project Name:** Postfly (All-in-One Social Media Management & Automation SaaS)  
> **Tech Stack:** Next.js 14 (App Router), React 18, Tailwind CSS, MongoDB, Razorpay INR Payment Gateway, Google Gemini AI, Meta Graph API v20, YouTube API v3, Twitter/X API v2, LinkedIn API v2, Pinterest API v5, Threads API v1.0.  
> **Last Updated:** September 2026  

---

## 📑 Table of Contents
1. [Executive Overview & Vision](#1-executive-overview--vision)
2. [Full System Architecture & Folder Layout](#2-full-system-architecture--folder-layout)
3. [Authentication, User Roles & Security](#3-authentication-user-roles--security)
4. [5-Day Free Trial & SaaS Paywall Engine](#4-5-day-free-trial--saas-paywall-engine)
5. [Social Channels Integration (7 Supported Platforms)](#5-social-channels-integration-7-supported-platforms)
6. [Post Publisher & AI Content Studio](#6-post-publisher--ai-content-studio)
7. [Visual Content Calendar & Scheduling Queue](#7-visual-content-calendar--scheduling-queue)
8. [Unified Social Inbox & Automated Comment Bot](#8-unified-social-inbox--automated-comment-bot)
9. [Automation Rules Engine](#9-automation-rules-engine)
10. [Analytics & Growth Reporting](#10-analytics--growth-reporting)
11. [Billing, Razorpay INR & Coupon System](#11-billing-razorpay-inr--coupon-system)
12. [Super Admin Control Hub](#12-super-admin-control-hub)
13. [Database Schemas & Collections](#13-database-schemas--collections)
14. [API Endpoints Directory](#14-api-endpoints-directory)
15. [Meta Ads Manager & AI Post Booster Hub (Pro Unlimited Exclusive)](#15-meta-ads-manager--ai-post-booster-hub-pro-unlimited-exclusive)
16. [ImageKit CDN, AI Studio Expansion & UI Improvements](#16-imagekit-cdn-ai-studio-expansion--ui-improvements)
17. [Threads Multi-Channel Auto-Connect & Automated Invoice Email System](#17-threads-multi-channel-auto-connect--automated-invoice-email-system)
18. [Meta Ads AI Chat Assistant, Real-time Metrics & Creative Generator](#18-meta-ads-ai-chat-assistant-real-time-metrics--creative-generator)
19. [Facebook Multi-Strategy Video/Photo Dispatcher & Dynamic Error Reporting](#19-facebook-multi-strategy-videophoto-dispatcher--dynamic-error-reporting)
20. [Video & Post Comment Moderation Controls (Turn Off Comments)](#20-video--post-comment-moderation-controls-turn-off-comments)
21. [Multi-Platform Publishing Resilience Engine & Token Auto-Refresh](#21-multi-platform-publishing-resilience-engine--token-auto-refresh)
22. [ImageKit Direct Client-to-CDN Media Pipeline & Publishing Verification](#22-imagekit-direct-client-to-cdn-media-pipeline--publishing-verification)
23. [Custom Hashtag Groups & 1-Click Description Append Engine](#23-custom-hashtag-groups--1-click-description-append-engine)

---

## 1. Executive Overview & Vision

**Postfly** is a next-generation SaaS application designed for brands, e-commerce stores, digital agencies, and creators in India and globally. It allows users to link multiple social media channels into a single unified dashboard to compose, schedule, and auto-publish content, manage customer conversations, and run automated marketing workflows.

### Core Capabilities:
* **Multi-Platform Publishing:** Instant and scheduled publishing across 7 major networks (Facebook, Instagram, YouTube, Threads, Twitter/X, LinkedIn, Pinterest).
* **Multi-Account Discovery:** Automatic discovery and batch-connection of all managed Facebook Pages and linked Instagram Business Accounts from a single Meta login.
* **AI Content Generation:** Built-in Gemini AI generator for copywriting captions, hashtags, and marketing hooks.
* **Unified Social Inbox:** Centralized DM and comment stream with auto-response bots.
* **Native Indian Billing:** Razorpay checkout in Indian Rupees (₹) with monthly and annual subscriptions (10% discount).

---

## 2. Full System Architecture & Folder Layout

```
social-media-post/
├── app/
│   ├── (dashboard)/               # Protected SaaS App Layout & Pages
│   │   ├── layout.jsx             # Global Sidebar, Header, Paywall Modal Mount
│   │   ├── accounts/page.jsx      # Social Channels Directory & 1-Click Connect
│   │   ├── publisher/page.jsx     # Post Composer & AI Studio
│   │   ├── posts/page.jsx         # Post History & Published Feeds
│   │   ├── calendar/page.jsx      # Interactive Content Calendar
│   │   ├── inbox/page.jsx         # Unified Social Inbox (DMs & Comments)
│   │   ├── comments/page.jsx      # Comment Manager
│   │   ├── rules/page.jsx         # Automation Triggers & Bot Rules
│   │   ├── analytics/page.jsx     # Analytics & Reach Metrics
│   │   ├── ads/page.jsx           # Meta Ads Command Hub & Post Booster (Pro Unlimited Exclusive)
│   │   ├── billing/page.jsx       # Razorpay Plans, Coupons & History
│   │   ├── dashboard/page.jsx     # Super Admin Overview & Metrics
│   │   ├── tenants/page.jsx       # Super Admin Tenant Management & Blocking
│   │   ├── revenue/page.jsx       # Super Admin Financial Ledger & MRR
│   │   ├── coupons/page.jsx       # Super Admin Promo Code Creator
│   │   └── webhook-logs/page.jsx  # Meta & Platform Webhook Audit Trail
│   ├── api/                       # Backend API Routes (Serverless)
│   │   ├── auth/                  # Login, Signup, Reset Password & OAuth Handlers
│   │   ├── accounts/              # Fetch, Sync & Disconnect Channels
│   │   ├── post/                  # Post Publishing & Scheduling Dispatcher
│   │   ├── generate-content/      # Gemini AI Copywriting API
│   │   ├── rules/                 # Automation Rules CRUD
│   │   ├── razorpay/              # Razorpay Order Creation & Payment Verification
│   │   └── admin/                 # Super Admin APIs (Users, Logs, Subscriptions)
│   ├── landing/page.jsx           # Public High-Converting Landing Page
│   ├── login/page.jsx             # User Authentication Page
│   ├── privacy/page.jsx           # Meta & Pinterest Compliant Privacy Policy
│   └── terms/page.jsx             # Terms of Service Page
├── components/
│   ├── landing/                   # Landing Page Sections (Smooth Client Reviews, Pricing)
│   ├── modals/                    # ConnectModal, PostDetailsModal, AddRuleModal
│   └── ui/                        # TrialPaywallModal, SocialIcons, Skeletons
├── lib/
│   ├── db.js                      # MongoDB Client, Database Operations, Trial Security
│   ├── user.js                    # User Sessions, Tier Limits & Permission Guards
│   └── platforms/                 # Platform API Dispatchers (facebook, instagram, threads, etc.)
```

---

## 3. Authentication, User Roles & Security

* **Multi-Tenant Architecture:** Every user receives an isolated workspace identified by `userId`. All accounts, scheduled posts, and rules are filtered strictly by `userId`.
* **Roles:**
  1. `admin` / `super_admin`: Full system access, unrestricted access bypassing trial limits, tenant management, financial ledger, and webhook monitoring.
  2. `user`: Standard tenant governed by active plan limits and 5-Day Free Trial.
* **Security Controls:**
  - **Account Blocking:** Super Admins can toggle "Block / Unblock Tenant" in the admin dashboard. Blocked users are immediately prevented from logging in via `authenticateUser()`.
  - **Environment Variables:** API secrets (Meta App Secret, Razorpay Secret, Google API Key) reside purely server-side.

---

## 4. 5-Day Free Trial & SaaS Paywall Engine

### Working Logic:
1. **New User Signup:** When a user registers, `trialStartDate` is set to `new Date().toISOString()`.
2. **Active Trial (Days 1 to 5):**
   - User receives **Full Pro Access** to all features (unlimited channel connections, post scheduler, AI assistant, social inbox, and automation bot rules).
   - Top navigation bar displays a live countdown timer showing remaining days, hours, and minutes.
3. **Expired Trial (After 5 Days):**
   - `getUserPlanLimits()` and `isUserTrialExpired()` evaluate to `true`.
   - **Global Paywall Modal (`TrialPaywallModal.jsx`):** Renders over the dashboard layout, locking user interactions and displaying the 3 upgrade plans (Starter, Growth, Pro Unlimited) with quick checkout.
   - **Backend Route Guards:** Server-side checks in `/api/post`, `/api/generate-content`, and `/api/rules` return HTTP 403 Forbidden if an expired user attempts API bypasses.

---

## 5. Social Channels Integration (7 Supported Platforms)

| Platform | Authentication Flow | API Version | Supported Actions |
| :--- | :--- | :--- | :--- |
| **Facebook** | OAuth 2.0 (Meta Dialog) | Graph API v20.0 | Auto-fetch all Pages, publish photo/video/text, track page likes & reach |
| **Instagram** | Meta Graph OAuth (Linked Business) | Graph API v20.0 | Direct Reels & image publishing, comment tracking, automated DM replies |
| **YouTube** | Google OAuth 2.0 | YouTube API v3 | Auto-publish Shorts & long-form videos, subscriber count sync |
| **Threads** | Threads API / Meta OAuth | Threads API v1.0 | Publish text threads, images, video clips |
| **Twitter / X** | OAuth 2.0 with PKCE | Twitter API v2 | Publish tweets & threads, user metrics sync |
| **LinkedIn** | LinkedIn OAuth 2.0 | REST API v2 | Publish articles, images, and company updates |
| **Pinterest** | Pinterest OAuth 2.0 | Pinterest API v5 | Create pins with title, description, and board linking |

### ⚡ 1-Click Direct Connect:
Clicking **"+ Connect Channel"** on any platform card initiates direct OAuth authentication without redundant intermediate dialogs.

### 🔄 Multi-Page Batch Discovery:
When a user authorizes Meta, the backend queries `me/accounts` with `&limit=100` and automated pagination. Every single Facebook Page and linked Instagram Business Account is imported as an individual card in the channels directory.

---

## 6. Post Publisher & AI Content Studio

* **Unified Composer:** Compose a single post and dispatch it simultaneously across multiple selected channels.
* **Media Zone:** Drag-and-drop file upload supporting JPEG, PNG, MP4, and MOV with instant live previews.
* **High-Contrast Design:** Solid Amber/Gold **"Save as Draft"** button and Indigo **"Publish Now / Schedule"** button.
* **AI Copywriting Assistant:**
  - Integrated with **Google Gemini AI** (`/api/generate-content`).
  - Generates platform-tailored captions, trending hashtags, engaging hooks, and emojis based on user prompts.

---

## 7. Visual Content Calendar & Scheduling Queue

* **Calendar Modes:** Switch between Month View, Week Grid, and Day Agenda.
* **Color-Coded Badges:** Posts show distinct platform branding icons and status pills (`Scheduled`, `Draft`, `Published`).
* **Interactive Editing:** Click any scheduled item on the calendar to open a modal, modify content, or re-schedule publishing time.

---

## 8. Unified Social Inbox & Automated Comment Bot

* **Central Stream:** Collects incoming DMs and comments from Facebook and Instagram in real-time.
* **Instant Replies:** Respond to user queries directly from the dashboard without opening individual social media apps.
* **AI Quick Replies:** One-click generation of contextual, professional answers for customer inquiries.

---

## 9. Automation Rules Engine

* **Trigger & Action Matrix:**
  - *Trigger:* Incoming comment contains specific keywords (e.g., "price", "buy", "info", "discount").
  - *Action:* Automatically reply to comment + Send direct message (DM) with pricing/link.
* **Custom Rules Builder:** Create, toggle, edit, and delete rules per social channel.

---

## 10. Analytics & Growth Reporting

* **KPI Summary Cards:** Total Posts Published, Total Reach, Average Engagement Rate, and Active Audience Count.
* **Platform Breakdown:** Performance charts comparing engagement across Facebook, Instagram, YouTube, and Twitter.
* **Top Performing Content:** Highlights best-performing posts by likes, comments, and shares.

---

## 11. Billing, Razorpay INR & Coupon System

### Subscription Tiers:

| Plan Name | Monthly Price | Annual Price (10% OFF) | Features Included |
| :--- | :--- | :--- | :--- |
| **Starter** | ₹999 / mo | ₹899 / mo (₹10,788/yr) | 3 Social Accounts, 50 Posts/mo, No AI Assistant |
| **Growth** *(Most Popular)* | ₹1,999 / mo | ₹1,799 / mo (₹21,588/yr) | 6 Social Accounts, 500 AI Credits, Unlimited Posts, Inbox & DMs |
| **Pro Unlimited** | ₹3,999 / mo | ₹3,599 / mo (₹43,188/yr) | Unlimited Accounts, Unlimited AI, Bot Rules, Meta Ads Manager & 1-Click Post Booster, Multi-Tenant Workspaces |

### Payment Engine:
* **Razorpay Gateway:** Native INR (₹) checkout supporting UPI, Cards, NetBanking, and Wallets.
* **Coupon Validation:** Real-time coupon validator supporting percentage-off (e.g. `POSTFLY20` for 20% OFF) and flat-amount discounts.

---

## 12. Super Admin Control Hub

Accessible strictly by `role: "admin"` / Super Admin account:
1. **System Health & Metrics:** Active tenants count, total revenue generated, posts processed today, server cache hit rates.
2. **Tenant Directory (`/tenants`):**
   - Search and inspect any registered user.
   - Change user subscription plans manually.
   - **Block / Unblock Tenant:** Prevent compromised or malicious accounts from logging in.
3. **Financial Ledger (`/revenue`):** Monthly Recurring Revenue (MRR), Annual Recurring Revenue (ARR), and transaction logs.
4. **Promo Codes Manager (`/coupons`):** Create and distribute discount coupons.
5. **Webhook Inspector (`/webhook-logs`):** Inspect raw payload events delivered from Meta Graph API.

---

## 13. Database Schemas & Collections

* **`users`:** `userId`, `name`, `email`, `password`, `role`, `plan`, `trialStartDate`, `status`, `createdAt`, `updatedAt`
* **`accounts`:** `_id`, `platform`, `providerAccountId`, `pageId`, `igUserId`, `userId`, `accessToken`, `refreshToken`, `name`, `followers`, `connectedAt`, `raw`
* **`posts`:** `id`, `userId`, `title`, `description`, `accountIds`, `status`, `scheduledAt`, `results`, `createdAt`
* **`rules`:** `id`, `userId`, `platform`, `keywords`, `actionType`, `responseMessage`, `active`, `createdAt`
* **`conversations`:** `id`, `userId`, `platform`, `senderName`, `messages`, `status`, `updatedAt`
* **`coupons`:** `code`, `discountPercent`, `discountAmount`, `type`, `expiresAt`, `active`
* **`subscriptions`:** `orderId`, `paymentId`, `userId`, `planName`, `amount`, `currency`, `status`, `paidAt`

---

## 14. API Endpoints Directory

```
POST   /api/auth/signup               # User registration & trial assignment
POST   /api/auth/login                # User authentication & JWT session
GET    /api/auth/connect/[provider]   # OAuth redirection builder
GET    /api/auth/callback/[provider]  # OAuth token exchange & multi-page import
GET    /api/accounts                  # Get all connected channels for active user
DELETE /api/accounts                  # Disconnect a connected channel
POST   /api/post                      # Multi-channel instant publishing & scheduling
GET    /api/post                      # Fetch post feed and history
POST   /api/ads/chat                  # Meta Ads Copilot intelligent contextual chat API
POST   /api/generate-content          # Gemini AI caption & hashtag generator
GET    /api/rules                     # Fetch automation rules
POST   /api/rules                     # Create new bot rule
POST   /api/razorpay/order            # Create Razorpay checkout order
POST   /api/razorpay/verify           # Verify payment signature & activate plan
POST   /api/coupons/validate          # Verify promo coupon codes
GET    /api/admin/users               # Super Admin tenant listing
POST   /api/admin/system              # System health & reset actions
```

---

## 15. Meta Ads Manager & AI Post Booster Hub (Pro Unlimited Exclusive)

* **Access Control & Plan Gating:**
  - Strictly exclusive to **Pro Unlimited** subscribers (`plan === "pro"`) and Super Admins (`role === "admin"`).
  - Gated for Starter, Growth, and 5-Day Free Trial users via an interactive upgrade modal (`TrialPaywallModal.jsx`).
  - Feature listed explicitly across Pricing cards on Landing Page, Billing Page, and Trial Paywall Modal.

* **UI Theme & Visual Guidelines:**
  - **Full-Width Edge Coverage:** Main dashboard container spans 100% full width to the right edge (`w-full`) for high-density analytics.
  - **Rose Color Theme:** Clean solid rose accents (`rose-600`, `rose-950`, `rose-50`, `border-rose-200`).
  - **Design Constraints:** Zero gradient background colors, zero black background cards, zero playful AI robot/sparkle icons.
  - **Corporate Icons:** Clean, professional Lucide icons (`Compass`, `Target`, `Zap`, `Users`, `FileText`, `PieChart`, `SlidersHorizontal`).
  - **Sticky Left Panel Meta Ads Copilot:** Sticky AI Chatbot sidebar with live Meta context, quick command chips (⚡ Audit ROAS, 💰 Budget Split, 🎯 Audience, ✍️ Write Copy), real-time Gemini generation, and intelligent contextual fallback engine.
  - **Top Header Action:** Top-right header fixed placement for 1-Click "Connect Ad Account" button, Ad Account switcher, and Create Campaign modal.

* **Advanced Gemini AI Capabilities:**
  - 🧭 **Meta Ads Copilot Chat (`/api/ads/chat`):** Interactive AI strategist with live account context (Total spend, impressions, clicks, CTR, conversions, active campaigns). Supports quick one-click commands and custom questions.
  - 📊 **AI Campaign Copilot & ROAS Strategist:** Performs live campaign performance audits, provides budget reallocation suggestions, CTR/ROAS improvement tactics, and visual performance scorecards.
  - 🎯 **AI Audience Blueprint Generator:** Automatically generates high-converting target audience specifications (Demographics, Behaviors, Interests, Exclusions, Lookalike recommendations) tailored to specific industry niches.
  - ✍️ **Multi-Framework AI Ad Copy Studio:** Instantly generates ad copy across proven marketing frameworks including PAS (Problem-Agitate-Solution), AIDA (Attention-Interest-Desire-Action), Social Proof, and Urgency/FOMO.
  - ⚡ **1-Click Post Booster with Viral Predictor:** Evaluates organic posts with an AI Viral Predictor Score before converting them into high-ROI sponsored Meta Ad campaigns.

* **Full Campaign CRUD Operations:**
  - **Create:** 3-step Ad Campaign Wizard with integrated AI copy generator & audience target builder.
  - **Read:** Deep Campaign Inspector with AI Campaign Auditor.
  - **Update:** Inline status toggle (ACTIVE / PAUSED) and modal editing for daily budget and schedule.
  - **Delete:** Archive campaign modal with permanent deletion safety.

---

## 16. ImageKit CDN, AI Studio Expansion & UI Improvements

* **ImageKit Cloud Media & Video CDN Pipeline:**
  - Integrated ImageKit Node SDK (`lib/imagekit.js` and `/api/upload`) for high-speed global CDN media hosting (`https://ik.imagekit.io/saifdeveloper`).
  - Supports automatic draft saving, media re-population in Publisher edit mode, and CDN URL propagation to all social platform dispatchers.

* **Advanced AI Content Studio (Configurable Length & Bullet Points):**
  - **Customizable Generation Lengths:** Selectable output tiers: *Short (~50 words)*, *Medium (~150 words)*, *Long (~300 words)*, and *Epic Deep Dive (500+ words)*.
  - **Dynamic Hashtag Controls:** Tailor hashtag count from 5 to 30 trending niche tags.
  - **Enhanced Copywriting Format:** Prompts are heavily expanded into structured marketing concepts featuring clean bullet points and zero arbitrary emojis.

* **Multi-Platform Live Previews & Content Library Redesign:**
  - Real-time previews for Instagram, Facebook, Threads, YouTube Shorts, X/Twitter, LinkedIn, TikTok, and Pinterest.
  - Fixed YouTube preview video player overlap issue.
  - Redesigned Target Channels column in Content Library (`/posts`) with compact badges and hover popovers.
  - Highlighted Meta Ads button in Sidebar navigation with a rose border and animated PRO badge.

---

## 17. Threads Multi-Channel Auto-Connect & Automated Invoice Email System

* **Threads OAuth 2.0 Authorization Fix:**
  - Fixed Threads OAuth `error_code: 4476002` ("No app ID was sent with the request") by supplying both `app_id=${threadsAppId}` and `client_id=${threadsAppId}` in `/api/auth/connect/[provider]`.
  - Fallback logic configured across `THREADS_APP_ID`, `NEXT_PUBLIC_THREADS_APP_ID`, and `META_APP_ID`.

* **Batch Multi-Channel Auto-Connect:**
  - During Meta authentication (`/api/auth/callback/[provider]`), the system now automatically imports and stores all Facebook Pages, Instagram Business Accounts, and **all associated Threads profiles** (`platform: "threads"`) in a single batch.

* **Unified SaaS Tax Invoice Modal (`InvoiceModal.jsx`):**
  - Displays full subscriber info (*User Name, Email, User ID, Billing Address*).
  - Displays platform metadata (*Postfly Social Automation Platform, Payment ID, Order ID, Date, Renewal Date*).
  - Itemized pricing breakdown showing Subtotal, Promo Discounts, and Net Amount Charged.
  - Direct actions for **Print / Download PDF** and **Send Email Receipt**.

* **Automated Welcome & Tax Invoice Email Delivery (`lib/email.js`):**
  - Configured with Nodemailer for automated HTML email delivery upon Razorpay plan purchase verification (`/api/razorpay/verify`).
  - Contains a personalized welcome banner (*"🎉 Welcome to Postfly, [User Name]!"*), platform highlights, and an official tax invoice receipt.
  - Dedicated API endpoint `/api/admin/send-invoice-email` allowing manual email dispatch at any time.

---

## 18. Multi-System Post Publishing, Threads Unified OAuth & LinkedIn Organization Pages Sync

* **Multi-System User Sanitization & Safe Fallbacks (`/api/post`, `/publisher`):**
  - Sanitized incoming `x-user-id` headers to handle `null`, `undefined`, or empty string scenarios gracefully across remote devices.
  - Implemented exact real-time backend error toasts on the frontend (`data.error` / trial expiry alerts) instead of silent/generic failures.

* **Save Draft Resilience & Publishing Controls:**
  - Decoupled social channel selection requirements when saving drafts (`publishMode === "draft"`), allowing draft creation with zero connected channels.
  - Enabled instant draft saving, full composer re-population on draft edit, and 1-click publishing from the bottom recent posts list.

* **Threads Direct Meta OAuth Auto-Linking:**
  - Updated `/api/auth/connect/threads` to route directly through Meta OAuth Dialog, discovering Instagram accounts and automatically registering linked Threads profiles without standalone Threads App ID mismatch errors.
  - Enabled instant server cache invalidation (`serverCache.delete` and `serverCache.invalidateTag("accounts")`) on OAuth callback completion.

## 19. Facebook Multi-Strategy Video/Photo Dispatcher & Dynamic Error Reporting

* **Facebook Multi-Strategy Upload Pipeline (`lib/platforms/facebook.js`):**
  - **Strategy 1 (`file_url` CDN Direct):** Passes ImageKit CDN HTTPS URL directly to Facebook Graph Video (`/videos`) or Graph Photo (`/photos`) API, eliminating payload timeouts and Vercel limits.
  - **Strategy 2 (`videoBuffer` Binary Fallback):** If `file_url` returns an error or CDN access times out, automatically falls back to binary chunk buffer (`source: Blob([videoBuffer])`).
  - **Strategy 3 (`feed` Text Fallback):** In the event of media-less posts, dispatches standard Graph `/feed` message.
  - **Safe Page ID Resolution:** Automatically falls back across `account.pageId || account.providerAccountId` in `/api/post`.

* **Publish Confirmation UI Diagnostics (`publisher/page.jsx`):**
  - Rendered detailed per-channel error message blocks under channel names in the Publish Confirmation summary box whenever a platform returns an error, giving the user immediate real-time visibility into exact API rejection causes.

---

## 20. Video & Post Comment Moderation Controls (Turn Off Comments)

* **Interactive Frontend Toggle (`publisher/page.jsx`):**
  - Added a dedicated "Disable Comments" switch in Column 3 right above the Primary Action button.
  - Controls public engagement and reply permissions before publishing.
  - Automatically preserves and restores the `disableComments` state when loading/editing drafts.

* **API & Database Integration (`app/api/post/route.js`):**
  - Accepts `disableComments: Boolean` in both JSON and FormData payloads.
  - Persists `disableComments` in MongoDB post documents for drafts, scheduled posts, and published posts.

* **Platform-Level Comment Disabling:**
  - **Instagram (`lib/platforms/instagram.js`):** Calls `POST /v20.0/{ig-media-id}` with `comment_enabled: false` immediately upon container publication to disable comments programmatically.
  - **Twitter / X (`lib/platforms/twitter.js`):** Injects `reply_settings: "mentionedUsers"` into the tweet creation payload so only mentioned users can reply, effectively turning off public comments on the post.

---

## 21. Multi-Platform Publishing Resilience Engine & Token Auto-Refresh

* **Facebook Video/Photo Success:**
  - Confirmed live: Facebook (`Newcretae`) successfully published via direct `file_url` CDN pipeline and automatic fallback engine.

* **Instagram Transient Code 2 Auto-Retry (`lib/platforms/instagram.js`):**
  - Added a 3-second replication buffer after container processing finishes to allow Meta distribution nodes to replicate video assets.
  - Implemented an automatic retry loop (up to 4 attempts with exponential backoff) for Meta's transient code 2 errors (`is_transient: true`), eliminating random container publishing rejections.

* **Twitter (X) Multi-Tier Fallback (`lib/platforms/twitter.js`):**
  - If chunked v1.1 upload returns an error, the system automatically falls back to an API v2 direct tweet with caption, hashtags, and media link preview so the tweet never fails.

* **Google & YouTube Permanent Refresh Token (`/api/auth/connect/[provider]`):**
  - Injected `prompt=consent` into Google OAuth URL, guaranteeing that Google always issues a persistent `refresh_token` upon connecting, enabling automatic background token renewal forever without expiration errors.

* **Threads Diagnostic Guard (`lib/platforms/threads.js`):**
  - Added explicit code 190 detection and guidance to guide users to connect Threads via official OAuth instead of mismatched Page tokens.

## 22. ImageKit Direct Client-to-CDN Media Pipeline & Publishing Verification

* **Direct Client-to-CDN Upload Architecture (`app/(dashboard)/publisher/page.jsx`):**
  - **Bypasses Vercel 4.5MB Limit:** Media files (photos and large video files) upload directly from the user's browser straight to the ImageKit CDN endpoint (`https://upload.imagekit.io/api/v1/files/upload`).
  - **Dynamic Auth Generation (`app/api/upload/auth/route.js`):** Generates time-sensitive HMAC-SHA1 cryptographic signatures and tokens using `imagekit.getAuthenticationParameters()`.
  - **Dual-Mode Upload Security:** If browser-direct CDN upload encounters CORS or network issues, the system automatically falls back to server-side multipart stream via `app/api/upload/route.js`.
  - **Live Verification Status:** Verified active and functional with endpoint `https://ik.imagekit.io/saifdeveloper/social_posts/`.
  - **Upload Guards on Action Buttons:** Primary Publish and "Save as Draft" buttons are automatically disabled while media is actively uploading (`uploadingMedia`), displaying a real-time progress indicator (`⚡ Uploading Media to ImageKit CDN...`) to guarantee 100% complete CDN uploads before post submission.

* **Save Draft & Multi-Channel Publish Integration (`app/api/post/route.js`):**
  - **Lightweight JSON Payloads:** Once uploaded to ImageKit, posts submit as instant, lightweight JSON (`Content-Type: application/json`) containing the clean CDN `mediaUrl` instead of heavy binary multipart payloads.
  - **Buffer Re-hydration for YouTube:** For platforms requiring binary buffers (like YouTube API v3), the server streams the buffer directly from ImageKit CDN in memory without hitting disk or payload limits.
  - **Save / Draft Reliability:** Drafts are stored in MongoDB with full media CDN URLs, platform placements, formatting tags, and comment moderation flags. Instant cache invalidation ensures newly saved drafts appear in the Recent Posts table immediately.

---

## 23. Custom Hashtag Groups & 1-Click Description Append Engine

* **Clean User-Driven Presets (`app/(dashboard)/publisher/page.jsx`):**
  - Completely removed hardcoded demo groups (`🌾 Kisan & Agriculture`, `🔥 Viral Reels & Growth`, `💼 Business & Brand`) in favor of a clean, user-controlled preset engine.
  - Automatically migrates and cleans legacy cached demo presets from browser `localStorage` on initial load.
  - Friendly empty state guides creators to build their first custom group via `+ New Group`.

* **1-Click Description Insertion:**
  - Selected active group's hashtags are aggregated and cleanly formatted (`#tag1 #tag2 #tag3`) and appended to the post description/caption with 1 click (`Add Group to Description`).
  - Every group and every tag can be independently created, edited, and deleted with full persistence.

---

*This document serves as the single source of truth for Postfly's system architecture, business logic, and feature set.*
