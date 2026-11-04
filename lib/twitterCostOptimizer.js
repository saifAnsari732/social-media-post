/**
 * 🛡️ X (Twitter) $0.015 Cost-Protection & Optimization Engine
 * 
 * Twitter / X charges $0.200 per tweet (13x higher rate) when a tweet contains ANY URL/link.
 * When publishing as a Standard Tweet (Text + native Media attachments), Twitter only charges $0.015 (~₹1.25).
 * 
 * This engine guarantees that every tweet posted through Postflyr qualifies for the lowest
 * $0.015 Standard Post tier by:
 * 1. Sanitizing text to eliminate all direct hyperlinked URLs (http://, https://, ftp://, www.)
 * 2. Defanging naked domains (e.g., example.com -> example [dot] com) so Twitter's entity
 *    parser does NOT wrap them in t.co links, while preserving readability for humans.
 * 3. Cleaning dangling colons/dashes from removed URLs.
 * 4. Guaranteeing a valid fallback caption if the user only entered a link.
 * 5. Strictly enforcing the 280-character boundary.
 */

export function sanitizeForStandardTweetTier(text, fallbackTitle = "") {
  let cleaned = (text || "").trim();

  // Remove trailing colon before URL like "website: https://..." -> "website"
  cleaned = cleaned.replace(/:\s*https?:\/\/\S+/gi, "");
  cleaned = cleaned.replace(/:\s*www\.\S+/gi, "");

  // Remove all explicit URLs
  cleaned = cleaned.replace(/https?:\/\/\S+/gi, "");
  cleaned = cleaned.replace(/ftp:\/\/\S+/gi, "");
  cleaned = cleaned.replace(/www\.\S+/gi, "");

  // Defang naked domains so Twitter regex doesn't wrap them in t.co links
  cleaned = cleaned.replace(/\b([a-zA-Z0-9-]+)\.([a-zA-Z]{2,10}(?:\.[a-zA-Z]{2,6})?)\b/gi, (match, p1, p2) => {
    return `${p1} [dot] ${p2}`;
  });

  // Clean dangling colons or dashes at line ends
  cleaned = cleaned.replace(/[:\-–—]\s*$/gm, "");

  // Clean multiple spaces and excessive line breaks
  cleaned = cleaned.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();

  // If text became empty because it was only a link, fall back gracefully
  if (!cleaned) {
    const cleanTitle = (fallbackTitle || "")
      .replace(/https?:\/\/\S+/gi, "")
      .replace(/www\.\S+/gi, "")
      .trim();
    cleaned = cleanTitle || "✨ New Post";
  }

  // Twitter 280-char limit
  if (cleaned.length > 280) {
    cleaned = cleaned.slice(0, 277) + "...";
  }

  return cleaned;
}
