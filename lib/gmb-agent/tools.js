/**
 * Google Business Profile (GMB) Agent Tool Registry
 * Implementation of all 38 tools across 8 categories as per Agent Specification.
 *
 * ACCOUNT:  get_google_accounts, get_locations, get_location, get_location_status
 * PROFILE:  get_business_profile, update_business_information, update_business_description, update_contact_information, update_business_category
 * HOURS:    get_business_hours, get_special_hours, update_business_hours, update_special_hours
 * CATEGORY: get_categories, get_primary_category, update_categories
 * REVIEWS:  get_reviews, get_review, get_unanswered_reviews, get_reviews_by_rating, analyze_review, generate_review_reply, publish_review_reply
 * POSTS:    get_posts, get_post, create_post, update_post, delete_post, publish_post
 * MEDIA:    get_media, add_media, delete_media
 * AI:       audit_business_profile, analyze_reviews, generate_post, rewrite_content, translate_content, generate_action_plan
 */

// ─────────────────────────────────────────────────────────────────────
// IN-MEMORY / DB STORE FOR LOCATIONS & ACTIONS
// ─────────────────────────────────────────────────────────────────────
const MOCK_LOCATIONS_STORE = [
  {
    locationId: "locations/492018374928174",
    accountId: "accounts/1092847102938471",
    googleEmail: "postfly.official@gmail.com",
    storeCode: "PF-PUNE-01",
    title: "Postfly Digital Agency",
    category: "Digital Marketing Agency",
    secondaryCategories: ["Social Media Agency", "SEO Consultant", "Advertising Agency"],
    description: "Welcome to Postfly Digital Agency, Pune's premier destination for social media automation, Google Business Profile management, and AI-driven performance marketing. We help businesses rank #1 on Google Maps and drive 3x more local inquiries.",
    phone: "+91 9511450914",
    website: "https://postfly.in",
    address: {
      addressLines: ["102 Landmark Tower", "Senapati Bapat Road"],
      locality: "Pune",
      administrativeArea: "Maharashtra",
      postalCode: "411016",
      countryCode: "IN"
    },
    regularHours: [
      { day: "MONDAY", openTime: "09:00", closeTime: "19:00" },
      { day: "TUESDAY", openTime: "09:00", closeTime: "19:00" },
      { day: "WEDNESDAY", openTime: "09:00", closeTime: "19:00" },
      { day: "THURSDAY", openTime: "09:00", closeTime: "19:00" },
      { day: "FRIDAY", openTime: "09:00", closeTime: "19:00" },
      { day: "SATURDAY", openTime: "09:00", closeTime: "19:00" },
      { day: "SUNDAY", openTime: "CLOSED", closeTime: "CLOSED" }
    ],
    specialHours: [
      { startDate: "2026-11-01", endDate: "2026-11-01", isClosed: true, comment: "Diwali Festival" },
      { startDate: "2026-12-25", endDate: "2026-12-25", isClosed: true, comment: "Christmas Holiday" }
    ],
    status: { verified: true, suspended: false, hasPendingEdits: false, duplicate: false },
    rating: 4.8,
    reviewCount: 142,
    placeId: "ChIJN1t_t_xZwokR0eCpLL1x",
    mapsUrl: "https://maps.google.com/?cid=1092847102938471"
  },
  {
    locationId: "locations/582910482019482",
    accountId: "accounts/2048172930491823",
    googleEmail: "saif.ansari.tech@gmail.com",
    storeCode: "PF-MUMBAI-02",
    title: "Postfly Media Hub & Tech",
    category: "Software Company",
    secondaryCategories: ["Web Design Agency", "AI Services"],
    description: "Postfly Media Hub & Tech in Mumbai delivers cutting-edge software solutions, custom AI agents, and full-stack web platforms for high-growth enterprises across India.",
    phone: "+91 9823019284",
    website: "https://postfly.in/hub",
    address: {
      addressLines: ["B-404 Horizon Tech Park", "BKC Bandra East"],
      locality: "Mumbai",
      administrativeArea: "Maharashtra",
      postalCode: "400051",
      countryCode: "IN"
    },
    regularHours: [
      { day: "MONDAY", openTime: "09:30", closeTime: "18:30" },
      { day: "TUESDAY", openTime: "09:30", closeTime: "18:30" },
      { day: "WEDNESDAY", openTime: "09:30", closeTime: "18:30" },
      { day: "THURSDAY", openTime: "09:30", closeTime: "18:30" },
      { day: "FRIDAY", openTime: "09:30", closeTime: "18:30" },
      { day: "SATURDAY", openTime: "CLOSED", closeTime: "CLOSED" },
      { day: "SUNDAY", openTime: "CLOSED", closeTime: "CLOSED" }
    ],
    specialHours: [],
    status: { verified: true, suspended: false, hasPendingEdits: false, duplicate: false },
    rating: 4.9,
    reviewCount: 98,
    placeId: "ChIJ8v1w9_yXwokR3bDxMM2y",
    mapsUrl: "https://maps.google.com/?cid=2048172930491823"
  }
];

const MOCK_REVIEWS_STORE = [
  {
    reviewId: "rev_001",
    locationId: "locations/492018374928174",
    reviewer: { displayName: "Rahul Sharma", profilePhotoUrl: "" },
    starRating: 5,
    comment: "Absolutely fantastic service! The team managed our local GMB listing and social media perfectly. Our foot traffic increased by 300% in 2 months. Highly recommend Postfly to any business.",
    createTime: "2026-09-28T10:15:00Z",
    updateTime: "2026-09-28T10:15:00Z",
    reviewReply: null,
    sentiment: "positive",
    topics: ["service", "foot traffic", "GMB listing"]
  },
  {
    reviewId: "rev_002",
    locationId: "locations/492018374928174",
    reviewer: { displayName: "Priya Mehta", profilePhotoUrl: "" },
    starRating: 4,
    comment: "Very professional team. Content quality is top-notch. Fast response to all customer inquiries. Great local SEO guidance!",
    createTime: "2026-09-25T14:30:00Z",
    updateTime: "2026-09-25T14:30:00Z",
    reviewReply: {
      comment: "Hi Priya! Thank you so much for the 4-star review. We're thrilled you appreciate our content quality and local SEO guidance!",
      updateTime: "2026-09-25T16:00:00Z"
    },
    sentiment: "positive",
    topics: ["professionalism", "content quality", "SEO"]
  },
  {
    reviewId: "rev_003",
    locationId: "locations/492018374928174",
    reviewer: { displayName: "Amit Desai", profilePhotoUrl: "" },
    starRating: 5,
    comment: "Best digital marketing agency in Pune! They helped us rank #1 on Google Maps 3-Pack. Gemini AI tools are super helpful.",
    createTime: "2026-09-23T09:00:00Z",
    updateTime: "2026-09-23T09:00:00Z",
    reviewReply: null,
    sentiment: "positive",
    topics: ["google maps rank", "AI tools", "agency"]
  },
  {
    reviewId: "rev_004",
    locationId: "locations/492018374928174",
    reviewer: { displayName: "Sneha Kulkarni", profilePhotoUrl: "" },
    starRating: 3,
    comment: "Decent results. Would appreciate even more weekly Google posts. Otherwise, overall team support is good.",
    createTime: "2026-09-16T11:20:00Z",
    updateTime: "2026-09-16T11:20:00Z",
    reviewReply: null,
    sentiment: "neutral",
    topics: ["posts frequency", "support"]
  }
];

const MOCK_POSTS_STORE = [
  {
    postId: "post_101",
    locationId: "locations/492018374928174",
    topicType: "LOCAL_POST_TOPIC_TYPE_UNSPECIFIED",
    languageCode: "en-US",
    summary: "🚀 Boost your business visibility with Postfly's AI-Powered GMB Suite! Get automated review responses, local SEO keyword tracking, and weekly Google Post updates.",
    callToAction: { actionType: "LEARN_MORE", url: "https://postfly.in/gmb" },
    media: [{ mediaFormat: "PHOTO", googleUrl: "https://postfly.in/postflyLOGO.png" }],
    state: "LIVE",
    createTime: "2026-09-20T08:00:00Z"
  }
];

const MOCK_MEDIA_STORE = [
  {
    mediaId: "media_201",
    locationId: "locations/492018374928174",
    mediaFormat: "PHOTO",
    locationAssociation: { category: "EXTERIOR" },
    googleUrl: "https://postfly.in/postflyLOGO.png",
    thumbnailUrl: "https://postfly.in/postflyLOGO.png",
    createTime: "2026-09-01T12:00:00Z"
  }
];

const AUDIT_LOGS = [];

// Helper to record write audit logs
export function recordAuditLog(locationId, action, details) {
  const entry = {
    timestamp: new Date().toISOString(),
    locationId,
    action,
    details,
  };
  AUDIT_LOGS.unshift(entry);
  return entry;
}

// Helper to find location strictly
function findLocation(locationId) {
  if (!locationId) return MOCK_LOCATIONS_STORE[0];
  const loc = MOCK_LOCATIONS_STORE.find(l => l.locationId === locationId || l.storeCode === locationId);
  return loc || MOCK_LOCATIONS_STORE[0];
}

// ─────────────────────────────────────────────────────────────────────
// 1. ACCOUNT TOOLS
// ─────────────────────────────────────────────────────────────────────
export async function get_google_accounts() {
  return {
    accounts: [
      { accountId: "accounts/1092847102938471", googleEmail: "postfly.official@gmail.com", role: "Primary Owner", locationCount: 1 },
      { accountId: "accounts/2048172930491823", googleEmail: "saif.ansari.tech@gmail.com", role: "Owner", locationCount: 1 }
    ]
  };
}

export async function get_locations({ accountId } = {}) {
  let locs = MOCK_LOCATIONS_STORE;
  if (accountId) {
    locs = locs.filter(l => l.accountId === accountId);
  }
  return { locations: locs, totalCount: locs.length };
}

export async function get_location({ locationId }) {
  const loc = findLocation(locationId);
  return { location: loc };
}

export async function get_location_status({ locationId }) {
  const loc = findLocation(locationId);
  return { locationId: loc.locationId, status: loc.status };
}

export async function connect_google_account({ googleEmail, accountId }) {
  if (!googleEmail) throw new Error("googleEmail is required for Google OAuth connection");
  const accId = accountId || `accounts/${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`;
  const connectedAcc = {
    accountId: accId,
    googleEmail,
    role: "Primary Owner",
    tokenStatus: "Active & Healthy",
    scope: "https://www.googleapis.com/auth/business.manage",
    connectedAt: new Date().toISOString()
  };
  recordAuditLog("ALL_LOCATIONS", "connect_google_account", { googleEmail, accountId: accId });
  return { success: true, account: connectedAcc };
}

export async function create_business_location({ title, category, address, phone, website, hours, description, googleEmail }) {
  if (!title || title.trim().length === 0) throw new Error("Business Title is required");
  if (!category || category.trim().length === 0) throw new Error("Primary Business Category is required");

  const newLocId = `locations/${Math.floor(100000000000000 + Math.random() * 900000000000000)}`;
  const storeCode = `PF-LOC-${Math.floor(100 + Math.random() * 900)}`;

  const newLocation = {
    locationId: newLocId,
    accountId: "accounts/1092847102938471",
    googleEmail: googleEmail || "postfly.official@gmail.com",
    storeCode,
    title,
    category,
    secondaryCategories: ["Local Service"],
    description: description || `Welcome to ${title}, your top-rated provider for ${category}.`,
    phone: phone || "+91 9511450914",
    website: website || "https://postfly.in",
    address: address || {
      addressLines: ["Main Street"],
      locality: "Pune",
      administrativeArea: "Maharashtra",
      postalCode: "411001",
      countryCode: "IN"
    },
    regularHours: hours || [
      { day: "MONDAY", openTime: "09:00", closeTime: "18:00" },
      { day: "TUESDAY", openTime: "09:00", closeTime: "18:00" },
      { day: "WEDNESDAY", openTime: "09:00", closeTime: "18:00" },
      { day: "THURSDAY", openTime: "09:00", closeTime: "18:00" },
      { day: "FRIDAY", openTime: "09:00", closeTime: "18:00" },
      { day: "SATURDAY", openTime: "09:00", closeTime: "18:00" },
      { day: "SUNDAY", openTime: "CLOSED", closeTime: "CLOSED" }
    ],
    specialHours: [],
    status: { verified: true, suspended: false, hasPendingEdits: false, duplicate: false },
    rating: 5.0,
    reviewCount: 1,
    placeId: `ChIJ_${Math.random().toString(36).substring(2, 10)}`,
    mapsUrl: `https://maps.google.com/?cid=${newLocId.replace("locations/", "")}`
  };

  MOCK_LOCATIONS_STORE.unshift(newLocation);
  recordAuditLog(newLocation.locationId, "create_business_location", { title, category, storeCode });
  return { success: true, location: newLocation };
}

// ─────────────────────────────────────────────────────────────────────
// 2. PROFILE TOOLS
// ─────────────────────────────────────────────────────────────────────
export async function get_business_profile({ locationId }) {
  const loc = findLocation(locationId);
  return {
    locationId: loc.locationId,
    title: loc.title,
    category: loc.category,
    secondaryCategories: loc.secondaryCategories,
    description: loc.description,
    phone: loc.phone,
    website: loc.website,
    address: loc.address,
    rating: loc.rating,
    reviewCount: loc.reviewCount
  };
}

export async function update_business_information({ locationId, title, category, description, phone, website, address }) {
  const loc = findLocation(locationId);
  if (title) loc.title = title;
  if (category) loc.category = category;
  if (description) loc.description = description;
  if (phone) loc.phone = phone;
  if (website) loc.website = website;
  if (address) loc.address = { ...loc.address, ...address };

  recordAuditLog(loc.locationId, "update_business_information", { title, category, description, phone, website });
  return { success: true, location: loc, updatedFields: Object.keys({ title, category, description, phone, website }).filter(k => arguments[0][k] !== undefined) };
}

export async function update_business_description({ locationId, description }) {
  if (!description || description.trim().length === 0) {
    throw new Error("Description cannot be empty");
  }
  if (description.length > 750) {
    throw new Error("Google Business Profile description cannot exceed 750 characters");
  }
  const loc = findLocation(locationId);
  loc.description = description;
  recordAuditLog(loc.locationId, "update_business_description", { descriptionLength: description.length });
  return { success: true, locationId: loc.locationId, description: loc.description, characterCount: loc.description.length };
}

export async function update_contact_information({ locationId, phone, website }) {
  const loc = findLocation(locationId);
  if (phone) loc.phone = phone;
  if (website) loc.website = website;
  recordAuditLog(loc.locationId, "update_contact_information", { phone, website });
  return { success: true, locationId: loc.locationId, phone: loc.phone, website: loc.website };
}

export async function update_business_category({ locationId, primaryCategory, secondaryCategories }) {
  const loc = findLocation(locationId);
  if (primaryCategory) loc.category = primaryCategory;
  if (Array.isArray(secondaryCategories)) loc.secondaryCategories = secondaryCategories;
  recordAuditLog(loc.locationId, "update_business_category", { primaryCategory, secondaryCategories });
  return { success: true, locationId: loc.locationId, category: loc.category, secondaryCategories: loc.secondaryCategories };
}

// ─────────────────────────────────────────────────────────────────────
// 3. HOURS TOOLS
// ─────────────────────────────────────────────────────────────────────
export async function get_business_hours({ locationId }) {
  const loc = findLocation(locationId);
  return { locationId: loc.locationId, regularHours: loc.regularHours };
}

export async function get_special_hours({ locationId }) {
  const loc = findLocation(locationId);
  return { locationId: loc.locationId, specialHours: loc.specialHours };
}

export async function update_business_hours({ locationId, regularHours }) {
  const loc = findLocation(locationId);
  if (!Array.isArray(regularHours)) throw new Error("regularHours must be an array of day objects");
  loc.regularHours = regularHours;
  recordAuditLog(loc.locationId, "update_business_hours", { count: regularHours.length });
  return { success: true, locationId: loc.locationId, regularHours: loc.regularHours };
}

export async function update_special_hours({ locationId, specialHours }) {
  const loc = findLocation(locationId);
  if (!Array.isArray(specialHours)) throw new Error("specialHours must be an array of holiday objects");
  loc.specialHours = specialHours;
  recordAuditLog(loc.locationId, "update_special_hours", { count: specialHours.length });
  return { success: true, locationId: loc.locationId, specialHours: loc.specialHours };
}

// ─────────────────────────────────────────────────────────────────────
// 4. CATEGORY TOOLS
// ─────────────────────────────────────────────────────────────────────
export async function get_categories() {
  return {
    categories: [
      "Digital Marketing Agency", "Social Media Agency", "SEO Consultant", "Advertising Agency",
      "Software Company", "Web Design Agency", "AI Services", "Gym & Fitness Center",
      "Restaurant", "Cafe", "Retail Store", "Real Estate Agency"
    ]
  };
}

export async function get_primary_category({ locationId }) {
  const loc = findLocation(locationId);
  return { locationId: loc.locationId, primaryCategory: loc.category, secondaryCategories: loc.secondaryCategories };
}

export async function update_categories({ locationId, primaryCategory, secondaryCategories }) {
  return update_business_category({ locationId, primaryCategory, secondaryCategories });
}

// ─────────────────────────────────────────────────────────────────────
// 5. REVIEWS TOOLS
// ─────────────────────────────────────────────────────────────────────
export async function get_reviews({ locationId, pageSize = 10 } = {}) {
  const loc = findLocation(locationId);
  const reviews = MOCK_REVIEWS_STORE.filter(r => r.locationId === loc.locationId);
  return { locationId: loc.locationId, reviews: reviews.slice(0, pageSize), totalCount: reviews.length };
}

export async function get_review({ reviewId }) {
  const rev = MOCK_REVIEWS_STORE.find(r => r.reviewId === reviewId);
  if (!rev) throw new Error(`Review with ID '${reviewId}' not found`);
  return { review: rev };
}

export async function get_unanswered_reviews({ locationId }) {
  const loc = findLocation(locationId);
  const unanswered = MOCK_REVIEWS_STORE.filter(r => r.locationId === loc.locationId && !r.reviewReply);
  return { locationId: loc.locationId, unansweredReviews: unanswered, count: unanswered.length };
}

export async function get_reviews_by_rating({ locationId, minRating = 1, maxRating = 5 }) {
  const loc = findLocation(locationId);
  const filtered = MOCK_REVIEWS_STORE.filter(r => r.locationId === loc.locationId && r.starRating >= minRating && r.starRating <= maxRating);
  return { locationId: loc.locationId, reviews: filtered, count: filtered.length, minRating, maxRating };
}

export async function analyze_review({ reviewText, rating }) {
  const numRating = Number(rating) || 5;
  const sentiment = numRating >= 4 ? "positive" : numRating === 3 ? "neutral" : "negative";
  const topics = numRating >= 4
    ? ["customer satisfaction", "quality service", "recommendation"]
    : numRating === 3
    ? ["service consistency", "speed"]
    : ["customer friction", "response time", "pricing"];

  return {
    sentiment,
    starRating: numRating,
    topics,
    suggestedTone: sentiment === "positive" ? "grateful and warm" : sentiment === "neutral" ? "appreciative and constructive" : "empathetic and corrective"
  };
}

export async function generate_review_reply({ reviewText, rating, reviewerName, businessName, language = "English" }) {
  const numRating = Number(rating) || 5;
  const name = reviewerName || "Customer";
  const biz = businessName || "Postfly Digital Agency";

  let primaryReply = "";
  if (language === "Hinglish") {
    primaryReply = `Hi ${name}! Thank you so much for the ${numRating}-star review on Google! Glad to hear aapko humari service achi lagi. ${biz} team aapke support ke liye hamesha ready hai!`;
  } else if (language === "Hindi") {
    primaryReply = `नमस्कार ${name}! ${numRating}-स्टार समीक्षा के लिए आपका बहुत-बहुत धन्यवाद। ${biz} की टीम आपकी सेवा करके अत्यंत प्रसन्न है।`;
  } else {
    primaryReply = `Dear ${name}, thank you so much for taking the time to leave a ${numRating}-star review for ${biz}! We are thrilled to serve you and look forward to welcoming you back again soon.`;
  }

  return {
    reviewerName: name,
    rating: numRating,
    language,
    reply: primaryReply,
    alternateReplies: [
      `Hi ${name}, we appreciate your ${numRating}-star rating! Thank you for choosing ${biz}.`,
      `Thank you ${name}! Our team at ${biz} is delighted by your feedback.`
    ]
  };
}

export async function publish_review_reply({ reviewId, replyComment }) {
  if (!replyComment || replyComment.trim().length === 0) {
    throw new Error("Reply comment cannot be empty");
  }
  const rev = MOCK_REVIEWS_STORE.find(r => r.reviewId === reviewId);
  if (rev) {
    rev.reviewReply = { comment: replyComment, updateTime: new Date().toISOString() };
    recordAuditLog(rev.locationId, "publish_review_reply", { reviewId, replyComment });
  }
  return { success: true, reviewId, publishedReply: replyComment, timestamp: new Date().toISOString() };
}

// ─────────────────────────────────────────────────────────────────────
// 6. POSTS TOOLS
// ─────────────────────────────────────────────────────────────────────
export async function get_posts({ locationId, pageSize = 10 } = {}) {
  const loc = findLocation(locationId);
  const posts = MOCK_POSTS_STORE.filter(p => p.locationId === loc.locationId);
  return { locationId: loc.locationId, posts: posts.slice(0, pageSize), totalCount: posts.length };
}

export async function get_post({ postId }) {
  const p = MOCK_POSTS_STORE.find(post => post.postId === postId);
  if (!p) throw new Error(`Post with ID '${postId}' not found`);
  return { post: p };
}

export async function create_post({ locationId, summary, postType = "update", callToAction, mediaUrl }) {
  if (!summary || summary.trim().length === 0) throw new Error("Post summary is required");
  const loc = findLocation(locationId);
  const newPost = {
    postId: `post_${Date.now()}`,
    locationId: loc.locationId,
    topicType: postType === "offer" ? "OFFER" : postType === "event" ? "EVENT" : "STANDARD",
    summary,
    callToAction: callToAction || { actionType: "LEARN_MORE", url: loc.website },
    media: mediaUrl ? [{ mediaFormat: "PHOTO", googleUrl: mediaUrl }] : [],
    state: "DRAFT",
    createTime: new Date().toISOString()
  };
  MOCK_POSTS_STORE.unshift(newPost);
  recordAuditLog(loc.locationId, "create_post", { postId: newPost.postId, summarySnippet: summary.slice(0, 50) });
  return { success: true, post: newPost };
}

export async function update_post({ postId, summary, callToAction }) {
  const p = MOCK_POSTS_STORE.find(post => post.postId === postId);
  if (!p) throw new Error(`Post '${postId}' not found`);
  if (summary) p.summary = summary;
  if (callToAction) p.callToAction = callToAction;
  recordAuditLog(p.locationId, "update_post", { postId });
  return { success: true, post: p };
}

export async function delete_post({ postId }) {
  const idx = MOCK_POSTS_STORE.findIndex(post => post.postId === postId);
  if (idx === -1) throw new Error(`Post '${postId}' not found`);
  const deleted = MOCK_POSTS_STORE.splice(idx, 1)[0];
  recordAuditLog(deleted.locationId, "delete_post", { postId });
  return { success: true, deletedPostId: postId };
}

export async function publish_post({ postId }) {
  const p = MOCK_POSTS_STORE.find(post => post.postId === postId);
  if (!p) throw new Error(`Post '${postId}' not found`);
  p.state = "LIVE";
  recordAuditLog(p.locationId, "publish_post", { postId });
  return { success: true, postId: p.postId, state: "LIVE", publishedAt: new Date().toISOString() };
}

// ─────────────────────────────────────────────────────────────────────
// 7. MEDIA TOOLS
// ─────────────────────────────────────────────────────────────────────
export async function get_media({ locationId }) {
  const loc = findLocation(locationId);
  const media = MOCK_MEDIA_STORE.filter(m => m.locationId === loc.locationId);
  return { locationId: loc.locationId, media, totalCount: media.length };
}

export async function add_media({ locationId, mediaFormat = "PHOTO", category = "EXTERIOR", mediaUrl }) {
  if (!mediaUrl) throw new Error("mediaUrl is required");
  const loc = findLocation(locationId);
  const item = {
    mediaId: `media_${Date.now()}`,
    locationId: loc.locationId,
    mediaFormat,
    locationAssociation: { category },
    googleUrl: mediaUrl,
    thumbnailUrl: mediaUrl,
    createTime: new Date().toISOString()
  };
  MOCK_MEDIA_STORE.unshift(item);
  recordAuditLog(loc.locationId, "add_media", { mediaId: item.mediaId, category });
  return { success: true, media: item };
}

export async function delete_media({ mediaId }) {
  const idx = MOCK_MEDIA_STORE.findIndex(m => m.mediaId === mediaId);
  if (idx === -1) throw new Error(`Media '${mediaId}' not found`);
  const deleted = MOCK_MEDIA_STORE.splice(idx, 1)[0];
  recordAuditLog(deleted.locationId, "delete_media", { mediaId });
  return { success: true, deletedMediaId: mediaId };
}

// ─────────────────────────────────────────────────────────────────────
// 8. AI & INTELLIGENCE TOOLS
// ─────────────────────────────────────────────────────────────────────
export async function audit_business_profile({ locationId }) {
  const loc = findLocation(locationId);
  const missingFields = [];
  if (!loc.description || loc.description.length < 150) missingFields.push("Comprehensive SEO Business Description (>150 chars)");
  if (!loc.specialHours || loc.specialHours.length === 0) missingFields.push("Upcoming Holiday Special Hours");
  if (loc.reviewCount < 150) missingFields.push("Target 200+ Reviews for Local 3-Pack Supremacy");

  const score = loc.description ? 88 : 70;
  return {
    locationId: loc.locationId,
    businessTitle: loc.title,
    auditScore: score,
    verificationStatus: loc.status.verified ? "VERIFIED" : "UNVERIFIED",
    missingFields,
    recommendations: [
      "Add 5 recent high-resolution exterior and interior business photos",
      "Post weekly Google Updates with direct Call-to-Action buttons",
      "Respond to all pending customer reviews within 24 hours"
    ]
  };
}

export async function analyze_reviews({ locationId }) {
  const loc = findLocation(locationId);
  const reviews = MOCK_REVIEWS_STORE.filter(r => r.locationId === loc.locationId);
  const positive = reviews.filter(r => r.starRating >= 4).length;
  const neutral = reviews.filter(r => r.starRating === 3).length;
  const negative = reviews.filter(r => r.starRating <= 2).length;

  return {
    locationId: loc.locationId,
    totalReviews: reviews.length,
    sentimentBreakdown: { positive, neutral, negative },
    commonTopics: ["Service Speed", "Staff Professionalism", "Local SEO Results", "Google Maps Ranking"],
    unansweredCount: reviews.filter(r => !r.reviewReply).length
  };
}

export async function generate_post({ locationId, topic = "General Update", postType = "update", language = "English" }) {
  const loc = findLocation(locationId);

  let postText = "";
  if (language === "Hinglish") {
    postText = `🚀 ${loc.title} ke saath apne business ki visibility 3x karein! Top-rated ${loc.category} in ${loc.address.locality}. Call us today at ${loc.phone} for an exclusive local SEO audit!`;
  } else if (language === "Hindi") {
    postText = `🚀 ${loc.title} के साथ अपने व्यवसाय की ग्रोथ बढ़ाएं! ${loc.address.locality} का नंबर #1 ${loc.category}। आज ही संपर्क करें ${loc.phone} पर!`;
  } else {
    postText = `🚀 Accelerate your local business growth with ${loc.title}! As the premier ${loc.category} in ${loc.address.locality}, we deliver verified results and AI automation. Contact our team at ${loc.phone} to get started!`;
  }

  return {
    locationId: loc.locationId,
    postType,
    language,
    generatedPostContent: postText,
    recommendedCta: "LEARN_MORE",
    targetUrl: loc.website
  };
}

export async function rewrite_content({ content, tone = "professional", lengthOption = "keep" }) {
  if (!content) throw new Error("Content is required for rewriting");
  let rewritten = content;
  if (tone === "punchy") {
    rewritten = `⚡ ${content.replace(/\b(welcome to|we are dedicated to)\b/gi, "").trim()}`;
  } else if (tone === "warm") {
    rewritten = `❤️ At our core, ${content}`;
  }
  return { originalContent: content, tone, lengthOption, rewrittenContent: rewritten };
}

export async function translate_content({ content, targetLanguage = "Hindi" }) {
  if (!content) throw new Error("Content is required for translation");
  let translated = content;
  if (targetLanguage === "Hindi") {
    translated = `[हिंदी अनुवाद]: ${content}`;
  } else if (targetLanguage === "Hinglish") {
    translated = `[Hinglish]: ${content}`;
  }
  return { originalContent: content, targetLanguage, translatedContent: translated };
}

export async function generate_action_plan({ locationId, goal }) {
  const loc = findLocation(locationId);
  return {
    locationId: loc.locationId,
    goal: goal || "Boost Google Maps Ranking to #1",
    executionPlan: [
      { step: 1, action: "audit_business_profile", description: "Inspect NAP consistency & description quality" },
      { step: 2, action: "get_unanswered_reviews", description: "Retrieve all un-replied reviews" },
      { step: 3, action: "generate_review_reply", description: "Draft empathetic AI replies for customer reviews" },
      { step: 4, action: "generate_post", description: "Create weekly offer post with CTA button" },
      { step: 5, action: "publish_post", description: "Publish approved post to Google Business Profile" }
    ],
    estimatedTime: "2 minutes",
    safetyCheck: "High-risk write actions require explicit user confirmation before execution."
  };
}

export function getAuditLogs() {
  return AUDIT_LOGS;
}

export function addLocationToStore(location) {
  MOCK_LOCATIONS_STORE.unshift(location);
  return location;
}


