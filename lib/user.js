/**
 * Client-side User Identity & Plan Permission Helper
 * Enforces 5-Day Trial limits, plan-based feature permissions, and redirects unpaid users to /billing.
 */

export const DEFAULT_USER = {
  userId: "eb994f0c8e6f7fb4c2629561",
  name: "Saif Ansari",
  email: "saif@me.com",
  role: "user",
  plan: "5-Day Trial",
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

  // Set initial 5-day trial user if clean storage
  try {
    localStorage.setItem("socialflow_user", JSON.stringify(DEFAULT_USER));
    localStorage.setItem("yt_user", JSON.stringify(DEFAULT_USER));
  } catch (e) {}

  return DEFAULT_USER;
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
  
  // Calculate 5-Day Trial status
  const createdAt = new Date(u.createdAt || Date.now());
  const now = new Date();
  const diffDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
  const trialDaysLeft = Math.max(0, 5 - diffDays);
  
  const isPaidPlan = planName.includes("starter") || planName.includes("growth") || planName.includes("pro") || planName.includes("agency") || planName.includes("unlimited");
  const isExpired = !isPaidPlan && trialDaysLeft === 0;

  if (planName.includes("pro") || planName.includes("agency") || planName.includes("unlimited")) {
    return {
      maxAccounts: Infinity,
      hasAI: true,
      hasInbox: true,
      hasAutomation: true,
      isExpired: false,
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
      trialDaysLeft: 0,
      planTitle: "Starter"
    };
  }

  // Default: 5-Day Trial or Expired No Plan
  return {
    maxAccounts: isExpired ? 0 : 3,
    hasAI: false,
    hasInbox: !isExpired,
    hasAutomation: false,
    isExpired,
    trialDaysLeft,
    planTitle: isExpired ? "No Active Plan" : `5-Day Trial (${trialDaysLeft}d left)`
  };
}

/**
 * Guard function to enforce plan limits on any user action
 * If unauthorized, redirects user to /billing immediately.
 */
export function checkPlanAccess({ action, currentAccountCount = 0, router, toast }) {
  const user = getStoredUser();
  const limits = getUserPlanLimits(user);

  // 1. If trial expired or no active plan
  if (limits.isExpired) {
    if (toast) toast.error("⚠️ Your 5-Day trial has expired. Please select a plan to continue.");
    if (router) router.push("/billing");
    return false;
  }

  // 2. Connecting Channel Action
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

  // 3. AI Assistant Feature Action
  if (action === "ai_generator") {
    if (!limits.hasAI) {
      if (toast) toast.error("⚠️ AI Assistant requires Growth or Pro Unlimited plan. Upgrade to unlock!");
      if (router) router.push("/billing");
      return false;
    }
  }

  // 4. Social Inbox & Comments Action
  if (action === "social_inbox") {
    if (!limits.hasInbox) {
      if (toast) toast.error("⚠️ Social Inbox requires Growth or Pro plan. Upgrade to unlock!");
      if (router) router.push("/billing");
      return false;
    }
  }

  // 5. Auto-Reply Automation Action
  if (action === "automation") {
    if (!limits.hasAutomation) {
      if (toast) toast.error("⚠️ Auto-Reply Bot rules require Pro Unlimited plan. Upgrade to unlock!");
      if (router) router.push("/billing");
      return false;
    }
  }

  return true;
}
