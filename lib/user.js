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

  if (isAdmin) {
    return {
      maxAccounts: Infinity,
      hasAI: true,
      hasInbox: true,
      hasAutomation: true,
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
    ((planName.includes("starter") || planName.includes("growth") || planName.includes("pro") || planName.includes("agency") || planName.includes("unlimited")) &&
    !planName.includes("trial"));

  const isExpired = !isPaidPlan && (trialDaysLeft === 0 || diffDays >= 5 || planName.includes("expired") || planName.includes("no active"));

  if (isPaidPlan) {
    if (planName.includes("pro") || planName.includes("agency") || planName.includes("unlimited")) {
      return {
        maxAccounts: Infinity,
        hasAI: true,
        hasInbox: true,
        hasAutomation: true,
        isExpired: false,
        isPaid: true,
        trialDaysLeft: 0,
        planTitle: u.plan || "Pro Unlimited"
      };
    }

    if (planName.includes("growth")) {
      return {
        maxAccounts: 6,
        hasAI: true,
        hasInbox: true,
        hasAutomation: false,
        isExpired: false,
        isPaid: true,
        trialDaysLeft: 0,
        planTitle: "Growth"
      };
    }

    if (planName.includes("starter")) {
      return {
        maxAccounts: 3,
        hasAI: false, // ❌ NO AI Support in Starter
        hasInbox: false,
        hasAutomation: false,
        isExpired: false,
        isPaid: true,
        trialDaysLeft: 0,
        planTitle: "Starter"
      };
    }
  }

  // Default: 5-Day Free Trial (Active vs Expired)
  if (!isPaidPlan) {
    if (isExpired) {
      return {
        maxAccounts: 0,
        hasAI: false,
        hasInbox: false,
        hasAutomation: false,
        canPost: false,
        canConnect: false,
        isExpired: true,
        isPaid: false,
        trialDaysLeft: 0,
        planTitle: "5-Day Trial Expired (Access Blocked)"
      };
    }

    // ACTIVE 5-DAY PRO TRIAL: ALL ACCESS PERMISSION UNLOCKED!
    return {
      maxAccounts: Infinity, // Connect all channels during trial
      hasAI: true,           // Full AI Caption Assistant
      hasInbox: true,        // Full Social Inbox
      hasAutomation: true,   // Full Auto-Reply Automation
      canPost: true,         // Publish and Schedule Posts
      canConnect: true,      // Link Instagram, Facebook, YouTube, LinkedIn, Twitter, etc.
      isExpired: false,
      isPaid: false,
      trialDaysLeft,
      planTitle: `5-Day Pro Trial (All Access — ${trialDaysLeft}d left)`
    };
  }

  return {
    maxAccounts: 3,
    hasAI: false,
    hasInbox: false,
    hasAutomation: false,
    isExpired: false,
    isPaid: true,
    trialDaysLeft: 0,
    planTitle: "Starter"
  };
}

/**
 * Guard function to enforce plan limits on any user action
 * - During 5-Day Trial: ALL permissions unlocked.
 * - After 5-Day Trial (Expired): ALL permissions BLOCKED until plan purchased.
 */
export function checkPlanAccess({ action, currentAccountCount = 0, router, toast }) {
  const user = getStoredUser();
  const limits = getUserPlanLimits(user);

  // 1. STRICT LOCK: If trial has expired, block ALL actions immediately!
  if (limits.isExpired) {
    if (toast) toast.error("⚠️ Your 5-Day Free Trial has ended. All permissions (posting, connecting channels, AI, automations) are blocked. Please select a plan to continue!");
    if (router) router.push("/billing");
    return false;
  }

  // 2. ACTIVE 5-DAY TRIAL: Full unrestricted access granted for all features!
  if (!limits.isPaid && !limits.isExpired) {
    return true;
  }

  // 3. Paid Tier Limits enforcement
  if (action === "connect_channel") {
    if (currentAccountCount >= limits.maxAccounts) {
      const msg = limits.maxAccounts === 3 
        ? "⚠️ Starter plan allows max 3 accounts. Upgrade to Growth for 6 accounts!"
        : "⚠️ Growth plan allows max 6 accounts. Upgrade to Pro Unlimited for Unlimited accounts!";
      if (toast) toast.error(msg);
      if (router) router.push("/billing");
      return false;
    }
  }

  if (action === "publish_post") {
    if (limits.isExpired) {
      if (toast) toast.error("⚠️ 5-Day trial expired. Please choose a plan to publish posts!");
      if (router) router.push("/billing");
      return false;
    }
  }

  if (action === "ai_generator") {
    if (!limits.hasAI) {
      if (toast) toast.error("⚠️ AI Assistant requires Growth or Pro Unlimited plan. Upgrade to unlock!");
      if (router) router.push("/billing");
      return false;
    }
  }

  if (action === "social_inbox") {
    if (!limits.hasInbox) {
      if (toast) toast.error("⚠️ Social Inbox requires Growth or Pro plan. Upgrade to unlock!");
      if (router) router.push("/billing");
      return false;
    }
  }

  if (action === "automation") {
    if (!limits.hasAutomation) {
      if (toast) toast.error("⚠️ Auto-Reply Bot rules require Pro Unlimited plan. Upgrade to unlock!");
      if (router) router.push("/billing");
      return false;
    }
  }

  return true;
}
