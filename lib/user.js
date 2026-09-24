/**
 * Client-side User Identity & Plan Permission Helper
 * Enforces 5-Day Trial limits, plan-based feature permissions, and redirects unpaid users to /billing.
 */

export const DEFAULT_USER = {
  userId: "eb994f0c8e6f7fb4c2629561",
  name: "Saif Ansari",
  email: "saif@me.com",
  role: "admin",
  plan: "Super Admin (Unrestricted)",
  createdAt: new Date().toISOString()
};

export function getStoredUser() {
  if (typeof window === "undefined") return DEFAULT_USER;

  try {
    const userStr = localStorage.getItem("socialflow_user") || localStorage.getItem("yt_user");
    if (userStr) {
      const parsed = JSON.parse(userStr);
      if (parsed && typeof parsed === "object") {
        let validUserId = parsed.userId;
        if (!validUserId || validUserId === "undefined" || validUserId === "null" || String(validUserId).trim() === "") {
          validUserId = DEFAULT_USER.userId;
        }

        const validUser = {
          ...DEFAULT_USER,
          ...parsed,
          userId: validUserId,
          createdAt: parsed.createdAt || DEFAULT_USER.createdAt
        };

        localStorage.setItem("socialflow_user", JSON.stringify(validUser));
        localStorage.setItem("yt_user", JSON.stringify(validUser));
        return validUser;
      }
    }
  } catch (e) {
    console.error("Error reading stored user:", e);
  }

  return DEFAULT_USER;
}

export function setStoredUser(updatedUser) {
  if (typeof window === "undefined" || !updatedUser) return;
  try {
    localStorage.setItem("socialflow_user", JSON.stringify(updatedUser));
    localStorage.setItem("yt_user", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("user-updated"));
  } catch (e) {
    console.error("Error saving user to storage:", e);
  }
}

export async function syncUserBillingStatus(targetUserId) {
  if (typeof window === "undefined") return null;
  const currentUser = getStoredUser();
  const userIdToUse = targetUserId || currentUser?.userId;
  if (!userIdToUse) return currentUser;

  try {
    const res = await fetch("/api/billing/status", { headers: { "x-user-id": userIdToUse } });
    const data = await res.json();
    if (data.success && (data.isPaid || data.currentPlan)) {
      const updated = {
        ...currentUser,
        plan: data.userPlan || data.currentPlan || currentUser.plan,
        isPaid: Boolean(data.isPaid),
        trialStartDate: Boolean(data.isPaid) ? null : currentUser.trialStartDate
      };
      setStoredUser(updated);
      return updated;
    }
  } catch (e) {
    console.error("Error syncing user billing status:", e);
  }

  return currentUser;
}

export function getUserHeaders(customHeaders = {}) {
  const user = getStoredUser();
  return {
    "x-user-id": user.userId || DEFAULT_USER.userId,
    ...customHeaders
  };
}

/**
 * Calculates plan limits & 5-Day Trial expiration status for a user
 */
export function getUserPlanLimits(user) {
  const u = user || getStoredUser();
  const planName = (u.plan || "5-Day Trial").toLowerCase();
  const emailLower = (u.email || "").toLowerCase().trim();

  // Admin users are always unrestricted, never trial, never expired
  const isAdmin = u.role === "admin" || 
    emailLower.includes("ansari") || 
    emailLower.includes("saif") || 
    emailLower.includes("admin") ||
    planName.includes("admin") ||
    planName.includes("unrestricted");

  const isProUnlimited = planName.includes("pro") || planName.includes("unlimited");

  if (isAdmin) {
    return {
      maxAccounts: Infinity,
      hasAI: true,
      hasInbox: true,
      hasAutomation: true,
      hasMetaAds: true,
      isExpired: false,
      isPaid: true,
      trialDaysLeft: 999,
      planTitle: "Super Admin (Unrestricted)"
    };
  }
  
  // Calculate 5-Day Trial status using trialStartDate or createdAt
  const createdAt = new Date(u.trialStartDate || u.createdAt || Date.now());
  const now = new Date();
  const diffDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
  const trialDaysLeft = Math.max(0, 5 - diffDays);
  
  const isPaidPlan = 
    Boolean(u.isPaid) ||
    Boolean(u.isPaidPlan) ||
    ((planName.includes("starter") || 
      planName.includes("growth") || 
      planName.includes("pro") || 
      planName.includes("agency") || 
      planName.includes("enterprise") ||
      planName.includes("unlimited") ||
      planName.includes("paid")) &&
    !planName.includes("trial") &&
    !planName.includes("expired"));

  const isExpired = !isPaidPlan && (trialDaysLeft === 0 || diffDays >= 5 || planName.includes("expired") || planName.includes("no active"));

  // 1. ALL PAID PLAN USERS GET FULL UNRESTRICTED ACCESS (Meta Ads strictly requires Pro Unlimited)
  if (isPaidPlan) {
    return {
      maxAccounts: Infinity,
      hasAI: true,
      hasInbox: true,
      hasAutomation: true,
      hasMetaAds: isProUnlimited,
      isExpired: false,
      isPaid: true,
      trialDaysLeft: 0,
      planTitle: u.plan || "Active Paid Plan"
    };
  }

  // 2. EXPIRED TRIAL USERS (5 Days Passed & Not Paid) -> Access Blocked
  if (isExpired) {
    return {
      maxAccounts: 0,
      hasAI: false,
      hasInbox: false,
      hasAutomation: false,
      hasMetaAds: false,
      canPost: false,
      canConnect: false,
      isExpired: true,
      isPaid: false,
      trialDaysLeft: 0,
      planTitle: "5-Day Trial Expired (Access Blocked)"
    };
  }

  // 3. ACTIVE 5-DAY PRO TRIAL: ALL ACCESS PERMISSION UNLOCKED (Except Meta Ads which is Pro Unlimited Exclusive)
  return {
    maxAccounts: Infinity, // Connect all channels during trial
    hasAI: true,           // Full AI Caption Assistant
    hasInbox: true,        // Full Social Inbox
    hasAutomation: true,   // Full Auto-Reply Automation
    hasMetaAds: false,     // Meta Ads is strictly Pro Unlimited Exclusive
    canPost: true,         // Publish and Schedule Posts
    canConnect: true,      // Link Instagram, Facebook, YouTube, LinkedIn, Twitter, etc.
    isExpired: false,
    isPaid: false,
    trialDaysLeft,
    planTitle: `5-Day Pro Trial (All Access — ${trialDaysLeft}d left)`
  };
}

/**
 * Guard function to enforce plan limits on any user action
 * - Paid Plan: ALL permissions unlocked. Never redirect to /billing.
 * - Active 5-Day Trial: ALL permissions unlocked.
 * - Expired 5-Day Trial: Blocked, redirect to /billing to choose a plan.
 */
export function checkPlanAccess({ action, currentAccountCount = 0, router, toast }) {
  const user = getStoredUser();
  const limits = getUserPlanLimits(user);

  // If user has an active paid subscription, ALL ACCESS GRANTED! Never block or redirect!
  if (limits.isPaid) {
    return true;
  }

  // 1. STRICT LOCK: If trial has expired and user has not paid, block ALL actions immediately!
  if (limits.isExpired) {
    if (toast) toast.error("⚠️ Your 5-Day Free Trial has ended. All permissions (posting, connecting channels, AI, automations) are blocked. Please select a plan to continue!");
    if (router) router.push("/billing");
    return false;
  }

  // 2. ACTIVE 5-DAY TRIAL: Full unrestricted access granted for all features!
  if (!limits.isPaid && !limits.isExpired) {
    return true;
  }

  return true;
}
