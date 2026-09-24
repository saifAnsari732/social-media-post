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
| **Pro Unlimited** | ₹3,999 / mo | ₹3,599 / mo (₹43,188/yr) | Unlimited Accounts, Unlimited AI, Bot Rules, Multi-Tenant Workspaces |

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

*This document serves as the single source of truth for Postfly's system architecture, business logic, and feature set.*
