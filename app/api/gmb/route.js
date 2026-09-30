import { NextResponse } from "next/server";
import * as gmbTools from "@/lib/gmb-agent/tools";
import { runGmbAgent, SYSTEM_PROMPT } from "@/lib/gmb-agent/agent";

// All 38 Tools in Registry
const ALL_38_TOOLS = [
  // ACCOUNT
  "get_google_accounts", "get_locations", "get_location", "get_location_status",
  // PROFILE
  "get_business_profile", "update_business_information", "update_business_description", "update_contact_information", "update_business_category",
  // HOURS
  "get_business_hours", "get_special_hours", "update_business_hours", "update_special_hours",
  // CATEGORY
  "get_categories", "get_primary_category", "update_categories",
  // REVIEWS
  "get_reviews", "get_review", "get_unanswered_reviews", "get_reviews_by_rating", "analyze_review", "generate_review_reply", "publish_review_reply",
  // POSTS
  "get_posts", "get_post", "create_post", "update_post", "delete_post", "publish_post",
  // MEDIA
  "get_media", "add_media", "delete_media",
  // AI
  "audit_business_profile", "analyze_reviews", "generate_post", "rewrite_content", "translate_content", "generate_action_plan"
];

export async function POST(req) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
    }

    const { action, query, locationId, userConfirmed, confirmedAction, language, ...params } = body || {};

    // 1. AGENT CHAT COMMAND CENTER
    if (action === "agent_chat") {
      if (!query && !userConfirmed) {
        return NextResponse.json({ success: false, error: "Query is required for agent chat" }, { status: 400 });
      }
      const agentResult = await runGmbAgent({
        query: query || "Proceed with confirmed action",
        locationId,
        userConfirmed: Boolean(userConfirmed),
        confirmedAction,
        language: language || "English"
      });
      return NextResponse.json({
        success: true,
        action: "agent_chat",
        agentResult
      });
    }

    // 2. AUDIT LOGS RETRIEVAL
    if (action === "get_audit_logs") {
      const logs = gmbTools.getAuditLogs();
      return NextResponse.json({
        success: true,
        action: "get_audit_logs",
        auditLogs: logs
      });
    }

    // CREATE BUSINESS LOCATION / PROFILE
    if (action === "create_business_location" || action === "create_location") {
      const { title, category, address, city, phone, website, description, googleEmail } = params;
      if (!title || !category) {
        return NextResponse.json({ success: false, error: "Business name and category are required" }, { status: 400 });
      }

      const newLocId = `locations/${Math.floor(100000000000000 + Math.random() * 900000000000000)}`;
      const newAccount = `accounts/${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`;
      const location = {
        locationId: newLocId,
        accountId: newAccount,
        googleEmail: googleEmail || "postfly.official@gmail.com",
        storeCode: `PF-${(city || "LOC").toUpperCase().slice(0, 4)}-${Math.floor(10 + Math.random() * 90)}`,
        title,
        category,
        secondaryCategories: [],
        description: description || `Official Google Business Profile listing for ${title} in ${city || "India"}.`,
        phone: phone || "+91 9511450914",
        website: website || "https://postfly.in",
        address: {
          addressLines: [address || "Main Market Road"],
          locality: city || "Pune",
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
        specialHours: [],
        status: { verified: true, suspended: false, hasPendingEdits: false, duplicate: false },
        rating: 5.0,
        reviewCount: 1,
        placeId: `ChIJ_${Math.random().toString(36).substring(2, 12)}`,
        mapsUrl: `https://maps.google.com/?cid=${newLocId}`
      };

      gmbTools.addLocationToStore(location);
      gmbTools.recordAuditLog(newLocId, "create_business_location", { title, category, googleEmail });

      return NextResponse.json({
        success: true,
        action: "create_business_location",
        data: { location }
      });
    }

    // 3. BACKWARD COMPATIBILITY / DIRECT ACTION EXECUTION
    if (action === "optimize_description") {
      const res = await gmbTools.generate_post({ locationId, topic: "Description Optimization", language: language || "English" });
      return NextResponse.json({
        success: true,
        action,
        data: {
          optimizedDescription: res.generatedPostContent,
          characterCount: res.generatedPostContent.length,
          characterLimit: 750
        }
      });
    }

    if (action === "generate_review_response") {
      const res = await gmbTools.generate_review_reply({
        reviewText: params.reviewText,
        rating: params.rating,
        reviewerName: params.reviewerName,
        businessName: params.businessName,
        language: language || "English"
      });
      return NextResponse.json({ success: true, action, data: res });
    }

    if (action === "generate_post") {
      const res = await gmbTools.generate_post({ locationId, topic: params.topic, postType: params.postType, language: language || "English" });
      return NextResponse.json({ success: true, action, data: { postContent: res.generatedPostContent, hashtags: ["#GMB", "#LocalSEO"] } });
    }

    if (action === "analyze_keywords") {
      return NextResponse.json({
        success: true,
        action,
        data: {
          keywords: [
            { keyword: "digital marketing agency in pune", monthlySearches: 4400, difficulty: "Low" },
            { keyword: "best social media agency near me", monthlySearches: 3200, difficulty: "Medium" },
            { keyword: "local gmb optimization expert", monthlySearches: 1900, difficulty: "Low" }
          ]
        }
      });
    }

    if (action === "audit_citations") {
      const res = await gmbTools.audit_business_profile({ locationId });
      return NextResponse.json({ success: true, action, data: { overallScore: res.auditScore, directories: [{ name: "Google Maps", status: "Consistent" }] } });
    }

    if (action === "analyze_competitors") {
      return NextResponse.json({
        success: true,
        action,
        data: {
          competitors: [
            { name: "Apex Local Marketing", rating: 4.6, reviewCount: 110, strengths: ["High post frequency"], weaknesses: ["Unanswered negative reviews"] }
          ]
        }
      });
    }

    if (action === "analyze_sentiment") {
      const res = await gmbTools.analyze_reviews({ locationId });
      return NextResponse.json({ success: true, action, data: res });
    }

    if (action === "chat") {
      const agentResult = await runGmbAgent({ query: params.message || query || "Audit GMB Profile", locationId, language: language || "English" });
      return NextResponse.json({
        success: true,
        action,
        data: {
          reply: agentResult.responseText || "Task completed successfully",
          steps: agentResult.steps
        }
      });
    }

    // 4. DIRECT TOOL EXECUTION (If action matches any of the 38 tools)
    if (typeof gmbTools[action] === "function") {
      const result = await gmbTools[action]({ locationId, ...params });
      return NextResponse.json({
        success: true,
        tool: action,
        data: result
      });
    }

    return NextResponse.json({
      success: false,
      error: `Unsupported action '${action}'. Please use one of the registered 38 tools.`,
      supportedTools: ALL_38_TOOLS
    }, { status: 400 });

  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err.message || "Internal server error"
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    service: "Google Business Profile AI Agent API",
    status: "operational",
    version: "2.0.0",
    registryCount: ALL_38_TOOLS.length,
    systemPromptRulesCount: 15,
    registryCategories: {
      ACCOUNT: ["get_google_accounts", "get_locations", "get_location", "get_location_status"],
      PROFILE: ["get_business_profile", "update_business_information", "update_business_description", "update_contact_information", "update_business_category"],
      HOURS: ["get_business_hours", "get_special_hours", "update_business_hours", "update_special_hours"],
      CATEGORY: ["get_categories", "get_primary_category", "update_categories"],
      REVIEWS: ["get_reviews", "get_review", "get_unanswered_reviews", "get_reviews_by_rating", "analyze_review", "generate_review_reply", "publish_review_reply"],
      POSTS: ["get_posts", "get_post", "create_post", "update_post", "delete_post", "publish_post"],
      MEDIA: ["get_media", "add_media", "delete_media"],
      AI: ["audit_business_profile", "analyze_reviews", "generate_post", "rewrite_content", "translate_content", "generate_action_plan"]
    }
  });
}
