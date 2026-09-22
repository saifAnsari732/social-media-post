/**
 * Client-side User Storage Helper
 * Ensures reliable user identity & valid x-user-id header across all dashboard pages.
 */

export const DEFAULT_USER = {
  userId: "eb994f0c8e6f7fb4c2629561",
  name: "Saif Ansari",
  email: "saif@me.com",
  role: "admin",
  plan: "Enterprise Agency"
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
          userId: validUserId
        };

        // Resync localStorage to ensure valid stored state
        localStorage.setItem("socialflow_user", JSON.stringify(validUser));
        localStorage.setItem("yt_user", JSON.stringify(validUser));
        return validUser;
      }
    }
  } catch (e) {
    console.error("Error reading stored user:", e);
  }

  // Fallback if localStorage is empty or corrupt
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
