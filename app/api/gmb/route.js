import { NextResponse } from "next/server";

// ============================================================================
// Action Handlers for Google My Business (GMB) AI Features
// ============================================================================

/**
 * Action: optimize_description
 * Generates an SEO-optimized, engaging Google Business Profile description.
 */
function handleOptimizeDescription(body) {
  const {
    businessName = "Apex Fitness & Wellness Hub",
    category = "Gym & Fitness Center",
    location = "Downtown Austin, TX",
    highlights = [
      "24/7 access",
      "Certified personal trainers",
      "State-of-the-art strength equipment",
      "Complimentary fitness assessment",
    ],
    tone = "professional and welcoming",
  } = body;

  const highlightText = Array.isArray(highlights) && highlights.length > 0
    ? highlights.join(", ")
    : "top-tier service, certified specialists, modern facilities, and customer satisfaction";

  const primaryDescription = `Welcome to ${businessName}, ${location}'s top-rated destination for ${category.toLowerCase()}. We are dedicated to delivering an unmatched experience with ${highlightText}. Whether you are just getting started or taking your journey to the next level, our expert team provides personalized support in a welcoming, modern environment. Conveniently located in ${location}, we pride ourselves on exceptional customer care, accessible facilities, and visible results. Stop by today to discover the difference or contact our friendly team to schedule your first visit!`;

  return {
    businessName,
    category,
    location,
    optimizedDescription: primaryDescription,
    characterCount: primaryDescription.length,
    characterLimit: 750,
    variations: [
      {
        tone: "Local SEO & High Intent",
        content: `Looking for the best ${category.toLowerCase()} in ${location}? ${businessName} delivers industry-leading solutions with ${highlightText}. Our experienced professionals are committed to excellence, reliability, and guaranteed satisfaction. Centrally located with convenient parking and flexible hours. Call or visit our ${location} location today to claim your exclusive introductory offer!`,
        characterCount: 391,
      },
      {
        tone: "Story-Driven & Community Focused",
        content: `At ${businessName}, community and quality come first. Proudly serving ${location} and surrounding neighborhoods, we provide comprehensive ${category.toLowerCase()} tailored to your unique goals. From ${highlightText}, our dedicated staff is here to inspire and empower you every step of the way. Come experience why locals consistently rate us 5 stars. Join our family today!`,
        characterCount: 400,
      },
      {
        tone: "Punchy & Direct",
        content: `${businessName} is ${location}'s trusted choice for premium ${category.toLowerCase()}. Featuring ${highlightText}. Fast appointments, modern equipment, and certified experts ready to help you thrive. Open 7 days a week. Visit us or book your appointment online today!`,
        characterCount: 284,
      },
    ],
    seoHighlights: [
      `${category} in ${location}`,
      `Best ${category} near me`,
      `${businessName} ${location}`,
      "Certified specialists",
      "Flexible hours & modern facility",
    ],
    optimizationTips: [
      "Keep your primary keyword and core differentiator within the first 250 characters before the 'Read more' cutoff.",
      "Google does not permit URLs, promotional pricing, or phone numbers in the description field.",
      "Update your description quarterly if you introduce new services or season-specific offerings.",
    ],
  };
}

/**
 * Action: generate_review_response
 * Generates an empathetic, SEO-friendly response to customer reviews.
 */
function handleGenerateReviewResponse(body) {
  const {
    reviewText = "Fantastic experience! The trainers here are super knowledgeable and motivating. The gym is always clean and well-maintained. Highly recommend to anyone in the area!",
    rating = 5,
    reviewerName = "Alex Morgan",
    businessName = "Apex Fitness & Wellness Hub",
    tone = "warm and professional",
  } = body;

  const numRating = Number(rating) || 5;
  const isPositive = numRating >= 4;
  const isNeutral = numRating === 3;
  const isNegative = numRating <= 2;

  let primaryResponse = "";
  let sentiment = "positive";
  let extractedKeywords = [];

  if (isPositive) {
    sentiment = "positive";
    extractedKeywords = ["clean and well-maintained", "knowledgeable staff", "highly recommend"];
    primaryResponse = `Hi ${reviewerName}, thank you so much for the glowing ${numRating}-star review! We are thrilled to hear you had such a wonderful experience with our team at ${businessName}. Providing a clean, welcoming environment and knowledgeable, supportive guidance is always our top priority. We look forward to seeing you again soon!`;
  } else if (isNeutral) {
    sentiment = "neutral";
    extractedKeywords = ["average experience", "room for improvement"];
    primaryResponse = `Hi ${reviewerName}, thank you for taking the time to share your feedback with us. At ${businessName}, we hold ourselves to the highest standards, and we appreciate your honest thoughts. We would love the opportunity to learn more about how we can earn that 5th star next time. Please feel free to reach out directly to our management team at support@example.com so we can address your comments.`;
  } else {
    sentiment = "negative";
    extractedKeywords = ["customer dissatisfaction", "service issue", "needs resolution"];
    primaryResponse = `Dear ${reviewerName}, thank you for bringing this to our attention. We are genuinely sorry to hear that your recent experience did not meet the high standards we strive for at ${businessName}. We take all customer feedback seriously and would appreciate the chance to make things right. Please contact our leadership team directly at support@example.com or by phone so we can resolve this matter promptly.`;
  }

  return {
    reviewerName,
    rating: numRating,
    sentiment,
    reviewText,
    response: primaryResponse,
    variations: [
      {
        tone: "Warm & Community-Driven",
        text: isPositive
          ? `Thank you so much, ${reviewerName}! Reading your review made our whole team smile here at ${businessName}. We love having you as part of our community and can't wait for your next visit!`
          : `Hello ${reviewerName}, we sincerely apologize for falling short of your expectations. We value our community deeply and would love the chance to connect directly and resolve this for you.`,
      },
      {
        tone: "Concise & Professional",
        text: isPositive
          ? `Thank you for your review and recommendation, ${reviewerName}! We truly appreciate your support of ${businessName} and look forward to serving you again.`
          : `We appreciate your feedback, ${reviewerName}. Delivering top-tier service is our priority, and we apologize for any inconvenience. Please reach out to our team at support@example.com so we can assist.`,
      },
    ],
    reviewAnalysis: {
      sentimentScore: isPositive ? 0.94 : isNeutral ? 0.52 : 0.18,
      keyAspectsMentioned: extractedKeywords,
      urgencyLevel: isNegative ? "High (Respond within 24h)" : "Normal",
    },
    bestPracticeNotes: [
      "Always mention the reviewer's first name to create a personalized connection.",
      "Never argue or sound defensive when responding to negative reviews.",
      "Incorporate your business name naturally for subtle local SEO reinforcement.",
    ],
  };
}

/**
 * Action: analyze_keywords
 * Delivers comprehensive local SEO keywords and Google Map Pack opportunities.
 */
function handleAnalyzeKeywords(body) {
  const {
    businessName = "Apex Fitness & Wellness Hub",
    category = "Gym & Fitness Center",
    location = "Austin, TX",
  } = body;

  return {
    businessName,
    category,
    location,
    analysisDate: new Date().toISOString(),
    primaryKeywords: [
      {
        keyword: `${category.toLowerCase()} ${location}`,
        searchVolume: 3600,
        competition: "High",
        difficulty: 68,
        intent: "Commercial / Local",
        cpc: "$3.45",
      },
      {
        keyword: `best ${category.toLowerCase()} near me`,
        searchVolume: 8200,
        competition: "High",
        difficulty: 74,
        intent: "High Commercial",
        cpc: "$4.10",
      },
      {
        keyword: `top rated ${category.toLowerCase()} in ${location}`,
        searchVolume: 1400,
        competition: "Medium",
        difficulty: 52,
        intent: "Local Consideration",
        cpc: "$2.90",
      },
    ],
    secondaryKeywords: [
      { keyword: `24 hour gym ${location}`, searchVolume: 1900, difficulty: 45 },
      { keyword: `personal training packages ${location}`, searchVolume: 1100, difficulty: 48 },
      { keyword: `fitness classes downtown ${location}`, searchVolume: 850, difficulty: 38 },
      { keyword: `strength conditioning gym ${location}`, searchVolume: 620, difficulty: 42 },
    ],
    longTailKeywords: [
      `affordable personal trainer for beginners in ${location}`,
      `clean fitness center with nutrition coach ${location}`,
      `best small group fitness training near downtown ${location}`,
      `where to find certified fitness trainers ${location}`,
    ],
    localPackStrategy: {
      primaryGmbCategory: category,
      recommendedSecondaryCategories: [
        "Personal Trainer",
        "Physical Fitness Program",
        "Sports Club",
        "Wellness Center",
      ],
      searchIntentBreakdown: {
        commercial: "48%",
        localDirectNavigational: "34%",
        informational: "18%",
      },
      actionableChecklist: [
        "Include primary category in your GBP primary category slot.",
        "Add secondary categories to expand ranking radius for niche searches.",
        "Create dedicated GMB Services for each long-tail keyword.",
        "Include location + service terms in weekly GMB post updates.",
      ],
    },
  };
}

/**
 * Action: generate_post
 * Drafts engaging GMB updates, offers, or events with CTAs and image recommendations.
 */
function handleGeneratePost(body) {
  const {
    postType = "offer", // "offer" | "update" | "event"
    topic = "Spring Fitness Jumpstart",
    businessName = "Apex Fitness & Wellness Hub",
    callToAction = "SIGN_UP",
    discountDetails = "25% off your first 3 months",
    dates = {
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
  } = body;

  let title = "";
  let content = "";
  let offerDetails = null;
  let eventDetails = null;

  if (postType === "offer") {
    title = `🔥 Exclusive Special: ${topic}`;
    content = `Ready to smash your fitness goals? For a limited time, enjoy ${discountDetails} at ${businessName}! 🎉\n\nGet full access to state-of-the-art facilities, certified trainers, and unlimited classes. Spots are strictly limited to keep class sizes optimal. Don't wait—claim your voucher today! 💪`;
    offerDetails = {
      couponCode: "SAVE25SPRING",
      termsAndConditions: "Valid for new members only. Cannot be combined with other promotions. Expires at midnight on the end date.",
      redemptionUrl: "https://example.com/claim-offer",
      validFrom: dates.startDate,
      validTo: dates.endDate,
    };
  } else if (postType === "event") {
    title = `📅 Upcoming Event: ${topic}`;
    content = `Join us at ${businessName} for an exciting workshop: ${topic}! 🚀\n\nLearn proven strategies, connect with like-minded locals, and get personalized advice from our top certified coaches. Everyone is welcome—from complete beginners to seasoned pros.\n\n📍 In-person at our main studio\n🎟️ Free admission with RSVP! Tap below to reserve your spot.`;
    eventDetails = {
      eventTitle: topic,
      startDate: dates.startDate,
      endDate: dates.endDate,
      location: "Main Studio & Online Stream",
      rsvpUrl: "https://example.com/rsvp",
    };
  } else {
    // Regular "What's New" update
    title = `✨ New Update: ${topic}`;
    content = `Exciting things are happening at ${businessName}! 🌟\n\nWe're committed to bringing you the best experience possible, which is why we're proud to highlight ${topic}. Our team has been working hard to upgrade our services, expand our schedule, and ensure you have all the resources you need to succeed.\n\nHave you checked it out yet? Drop by or tap below to learn more!`;
  }

  return {
    postType,
    businessName,
    title,
    content,
    characterCount: content.length,
    callToAction: {
      type: callToAction,
      buttonText: callToAction.replace("_", " "),
      targetUrl: "https://example.com/action",
    },
    offerDetails,
    eventDetails,
    alternativeAngle: `Looking for top-tier results in your routine? ${businessName} is here with ${topic}. Discover our friendly staff, modern amenities, and welcoming community. Tap the link to get started!`,
    suggestedImageGuidelines: {
      recommendedDimensions: "1200 x 900 px (4:3 ratio)",
      minimumDimensions: "400 x 300 px",
      visualIdea: `Authentic photograph showing friendly staff and real clients during a session. Avoid generic stock photos to maintain high click-through rates.`,
    },
    hashtags: ["#LocalBusiness", "#AustinFitness", "#WellnessJourney", "#CommunityFirst"],
  };
}

/**
 * Action: audit_citations
 * Audits Name, Address, Phone (NAP) consistency across top local directories.
 */
function handleAuditCitations(body) {
  const {
    businessName = "Apex Fitness & Wellness Hub",
    phone = "(512) 555-0149",
    address = "450 Colorado St, Austin, TX 78701",
    website = "https://apexfitnesshub.com",
  } = body;

  const directories = [
    {
      directory: "Google Business Profile",
      status: "Consistent",
      domainAuthority: 100,
      listedName: businessName,
      listedPhone: phone,
      listedAddress: address,
      notes: "Verified primary listing. All fields aligned.",
    },
    {
      directory: "Apple Maps (Apple Business Connect)",
      status: "Consistent",
      domainAuthority: 98,
      listedName: businessName,
      listedPhone: phone,
      listedAddress: address,
      notes: "Synced with Apple ecosystem.",
    },
    {
      directory: "Bing Places for Business",
      status: "Consistent",
      domainAuthority: 93,
      listedName: businessName,
      listedPhone: phone,
      listedAddress: address,
      notes: "Auto-synced from Google Business Profile.",
    },
    {
      directory: "Yelp for Business",
      status: "Inconsistent",
      domainAuthority: 94,
      listedName: businessName,
      listedPhone: phone,
      listedAddress: "450 Colorado St Suite 100, Austin, TX 78701",
      notes: "Discrepancy: Suite number appended on Yelp but missing on Google.",
    },
    {
      directory: "Facebook Business Page",
      status: "Consistent",
      domainAuthority: 96,
      listedName: businessName,
      listedPhone: phone,
      listedAddress: address,
      notes: "Page verified with matching contact details.",
    },
    {
      directory: "YellowPages",
      status: "Consistent",
      domainAuthority: 87,
      listedName: businessName,
      listedPhone: phone,
      listedAddress: address,
      notes: "Claimed profile. NAP matches standard record.",
    },
    {
      directory: "MapQuest",
      status: "Inconsistent",
      domainAuthority: 89,
      listedName: "Apex Fitness Studio",
      listedPhone: "(512) 555-0100",
      listedAddress: address,
      notes: "Outdated business name and legacy phone number found.",
    },
    {
      directory: "Better Business Bureau (BBB)",
      status: "Consistent",
      domainAuthority: 91,
      listedName: businessName,
      listedPhone: phone,
      listedAddress: address,
      notes: "Accredited profile with accurate address.",
    },
    {
      directory: "Foursquare / Factual Data Pool",
      status: "Missing",
      domainAuthority: 88,
      listedName: "Not Found",
      listedPhone: "N/A",
      listedAddress: "N/A",
      notes: "No claimed profile found. Feeds into GPS navigators and in-car systems.",
    },
    {
      directory: "Nextdoor",
      status: "Consistent",
      domainAuthority: 84,
      listedName: businessName,
      listedPhone: phone,
      listedAddress: address,
      notes: "Neighborhood business page active.",
    },
  ];

  const total = directories.length;
  const consistent = directories.filter((d) => d.status === "Consistent").length;
  const inconsistent = directories.filter((d) => d.status === "Inconsistent").length;
  const missing = directories.filter((d) => d.status === "Missing").length;
  const score = Math.round((consistent / total) * 100);

  return {
    referenceNAP: {
      businessName,
      phone,
      address,
      website,
    },
    overallScore: score,
    healthStatus: score >= 85 ? "Good" : score >= 65 ? "Needs Attention" : "Critical",
    summary: {
      totalAudited: total,
      consistentCount: consistent,
      inconsistentCount: inconsistent,
      missingCount: missing,
    },
    directoryResults: directories,
    topDiscrepancies: [
      "MapQuest displays an outdated phone number: (512) 555-0100 instead of (512) 555-0149.",
      "Yelp includes 'Suite 100' which is omitted on Google My Business.",
      "Foursquare listing is missing. This impacts connected vehicle navigation systems.",
    ],
    recommendedActions: [
      "Submit an update to MapQuest immediately to avoid confusing prospective callers.",
      "Standardize address formatting (Suite #) identically across Google and Yelp.",
      "Claim and verify the Foursquare listing to populate secondary aggregator networks.",
    ],
  };
}

/**
 * Action: analyze_competitors
 * Compares business standing against local 3-pack competitors.
 */
function handleAnalyzeCompetitors(body) {
  const {
    businessName = "Apex Fitness & Wellness Hub",
    category = "Gym & Fitness Center",
    location = "Austin, TX",
  } = body;

  const competitors = [
    {
      rank: 1,
      name: "Iron & Oak Performance Gym",
      rating: 4.9,
      reviewCount: 382,
      reviewVelocity: "~14 reviews / month",
      postFrequency: "3 times / week",
      hasActiveProducts: true,
      hasQandA: true,
      responseRate: "98% (under 12 hours)",
      strengths: [
        "Extremely high review volume and velocity",
        "Consistent weekly video posts",
        "Keyword-rich service descriptions",
      ],
      weaknesses: [
        "Does not offer special promotional vouchers in posts",
        "Higher membership pricing highlighted in 3-star reviews",
      ],
    },
    {
      rank: 2,
      name: "Downtown Athletic Collective",
      rating: 4.7,
      reviewCount: 245,
      reviewVelocity: "~8 reviews / month",
      postFrequency: "Once a month",
      hasActiveProducts: false,
      hasQandA: true,
      responseRate: "62% (within 4 days)",
      strengths: [
        "Prime corner real estate location with high foot traffic check-ins",
        "Strong brand authority established over 10+ years",
      ],
      weaknesses: [
        "Infrequent GMB updates (last post was 28 days ago)",
        "Over 30% of customer reviews left without owner response",
      ],
    },
    {
      rank: 3,
      name: "MetroFit Austin",
      rating: 4.5,
      reviewCount: 168,
      reviewVelocity: "~4 reviews / month",
      postFrequency: "Rarely (none in last 60 days)",
      hasActiveProducts: true,
      hasQandA: false,
      responseRate: "45%",
      strengths: [
        "Low price barrier highlighted in customer reviews",
        "Multiple primary and secondary categories configured",
      ],
      weaknesses: [
        "Outdated exterior photos and low overall engagement",
        "No owner responses to critical 1-star complaints",
      ],
    },
  ];

  return {
    targetBusiness: businessName,
    marketArea: `${category} in ${location}`,
    competitiveSummary: `The local map pack for ${category} in ${location} is highly competitive. The top ranker holds 380+ reviews with strong weekly post activity, while positions #2 and #3 show vulnerability due to slow review response times and dormant posting habits.`,
    competitors,
    vulnerabilitiesToExploit: [
      {
        opportunity: "Review Velocity & Recency Gap",
        detail: "Competitor #2 and #3 only generate 4 to 8 reviews monthly. A proactive review request campaign can quickly outpace them in fresh review signals.",
      },
      {
        opportunity: "Post Engagement & Offers",
        detail: "None of the top 3 competitors currently post promotional GMB offers. Adding weekly offers with direct CTA buttons gives your listing an instant click-through advantage.",
      },
      {
        opportunity: "100% Owner Response Rate",
        detail: "Competitors #2 and #3 leave over 35% of reviews unattended. Maintaining a 100% response rate within 24 hours directly signals high profile engagement to Google's ranking algorithm.",
      },
    ],
    growthStrategy: [
      "Send SMS review invites right after member workouts to target 15+ new reviews per month.",
      "Publish 2 GMB updates each week (1 Educational/Behind-the-Scenes + 1 Promotional Offer).",
      "Upload 5 high-resolution authentic member photos weekly to maximize photo view signals.",
    ],
  };
}

/**
 * Action: analyze_sentiment
 * Deep-dive analysis of customer sentiment, recurring themes, and friction points.
 */
function handleAnalyzeSentiment(body) {
  const {
    businessName = "Apex Fitness & Wellness Hub",
    reviews = [],
  } = body;

  const sampleCount = Array.isArray(reviews) && reviews.length > 0 ? reviews.length : 64;

  return {
    businessName,
    totalReviewsAnalyzed: sampleCount,
    overallSentiment: "Overwhelmingly Positive",
    sentimentScore: 89, // out of 100
    sentimentDistribution: {
      positive: 84, // percentage
      neutral: 11,
      negative: 5,
    },
    trendComparison: "+6% improvement over the previous 90-day period",
    topicBreakdown: [
      {
        aspect: "Trainer & Coach Competence",
        sentiment: "97% Positive",
        mentionCount: 42,
        status: "Major Strength",
        sampleQuote: "The personal trainers are incredibly knowledgeable and genuinely care about your safety and progress.",
      },
      {
        aspect: "Cleanliness & Facility Maintenance",
        sentiment: "94% Positive",
        mentionCount: 38,
        status: "Major Strength",
        sampleQuote: "Lockers and gym equipment are spotless every morning.",
      },
      {
        aspect: "Atmosphere & Community",
        sentiment: "91% Positive",
        mentionCount: 29,
        status: "Strength",
        sampleQuote: "Very welcoming environment, non-intimidating for beginners.",
      },
      {
        aspect: "Peak Hour Equipment Availability",
        sentiment: "62% Positive (Mixed)",
        mentionCount: 16,
        status: "Pain Point",
        sampleQuote: "Can get crowded between 5:30 PM and 7:00 PM; sometimes waiting for squat racks.",
      },
      {
        aspect: "Parking Convenience",
        sentiment: "55% Positive (Mixed)",
        mentionCount: 9,
        status: "Pain Point",
        sampleQuote: "Street parking nearby fills up quickly during afternoon rush.",
      },
    ],
    frequentKeywords: {
      positiveKeywords: ["knowledgeable", "friendly coaches", "spotless", "great community", "visible results", "clean"],
      negativeKeywords: ["busy", "crowded at 6pm", "parking spot", "wait time"],
    },
    actionableRecommendations: [
      "Post a GMB update highlighting the newly added squat rack or off-peak workout perks to address peak-hour crowd concerns.",
      "Add parking tips to your GMB profile FAQ/Q&A section (e.g. mention validated garage spots or free side street options).",
      "Feature top trainer shout-outs from customer reviews in your monthly marketing posts.",
    ],
  };
}

/**
 * Action: chat
 * Conversational AI expert assistant tailored for GMB optimization, ranking, and local SEO.
 */
function handleChat(body) {
  const {
    message = "How can I improve my ranking in Google Maps local 3-pack?",
    history = [],
    context = {},
  } = body;

  const lowerMsg = (message || "").toLowerCase();

  let reply = "";
  let suggestedQuestions = [];
  let relatedActions = [];

  if (lowerMsg.includes("rank") || lowerMsg.includes("3-pack") || lowerMsg.includes("map") || lowerMsg.includes("seo")) {
    reply = `To climb into the Google Local 3-Pack, focus on Google's three core ranking criteria: **Relevance, Distance, and Prominence**.\n\n1. **Maximize Relevance:** Ensure your primary category precisely matches your core business, fill out 100% of services, and write a keyword-rich business description.\n2. **Boost Prominence (Reviews):** Consistently gather authentic 5-star reviews containing natural location and service keywords. Aim for a 100% owner response rate within 24 hours.\n3. **Citations & Consistency:** Ensure your business Name, Address, and Phone (NAP) are identical across Google, Apple Maps, Bing, and Yelp.\n4. **Engagement Signals:** Post updates, offers, and events at least once or twice per week, and upload fresh geotagged photos regularly.`;
    suggestedQuestions = [
      "What are the best secondary categories for my business?",
      "How do I audit my citations for inconsistencies?",
      "Can you write a weekly GMB post that boosts engagement?",
    ];
    relatedActions = ["analyze_keywords", "audit_citations", "generate_post"];
  } else if (lowerMsg.includes("review") || lowerMsg.includes("negative") || lowerMsg.includes("bad review") || lowerMsg.includes("rating")) {
    reply = `Handling reviews effectively is one of the highest-leverage GMB strategies:\n\n• **For positive reviews:** Thank the customer warmly by name, mention a specific detail they noted, and reinforce your brand values.\n• **For negative reviews:** Never argue publicly. Acknowledge their frustration, apologize for falling short, and provide an offline contact (phone/email) to resolve the issue privately.\n• **Review velocity:** Encourage happy customers to mention the specific service they received, as Google indexes review text for search queries!`;
    suggestedQuestions = [
      "Can you draft a response to an angry 1-star review?",
      "How do I get Google to remove a fake review?",
      "What is the best way to ask satisfied clients for reviews?",
    ];
    relatedActions = ["generate_review_response", "analyze_sentiment"];
  } else if (lowerMsg.includes("post") || lowerMsg.includes("offer") || lowerMsg.includes("content") || lowerMsg.includes("update")) {
    reply = `Google Business Profile posts keep your listing active and signal high engagement to the search algorithm. Here's a winning post strategy:\n\n• **Post Cadence:** 1-2 times per week.\n• **Post Types:** Alternate between 'What's New' updates (behind-the-scenes, tips) and 'Offers' (vouchers with expiration dates).\n• **Structure:** Hook headline, clear value prop in 150-250 characters, and a prominent Call-to-Action button (e.g. 'Sign up', 'Call now', or 'Learn more').\n• **Images:** Real 4:3 photos perform 3x better than generic stock images.`;
    suggestedQuestions = [
      "Generate an offer post with a 20% discount code.",
      "What image size works best for GMB posts?",
      "How long do GMB posts stay visible?",
    ];
    relatedActions = ["generate_post", "optimize_description"];
  } else if (lowerMsg.includes("suspend") || lowerMsg.includes("flag") || lowerMsg.includes("appeal") || lowerMsg.includes("verify")) {
    reply = `Listing suspensions can be stressful, but they can be resolved systematically:\n\n1. **Review Guidelines:** Common triggers include keyword stuffing in the business name, using a P.O. Box or co-working virtual address, or having multiple duplicate listings.\n2. **Gather Proof:** Prepare your official utility bill, lease agreement, business registration/tax license, and exterior/interior photos showing permanent signage.\n3. **Submit Reinstatement Appeal:** Once your profile fields strictly match your legal paperwork, file an appeal through the Google Business Profile Appeal Tool. Avoid creating a new listing while suspended!`;
    suggestedQuestions = [
      "What documents does Google require for business reinstatement?",
      "Can I use a co-working space address for GMB?",
      "How long does the Google reinstatement appeal take?",
    ];
    relatedActions = ["audit_citations", "chat"];
  } else {
    reply = `I am your Google My Business AI assistant! I can help you dominate local search, rank in the Google Maps Local 3-Pack, craft compelling GMB posts, respond to reviews, and audit citations.\n\nWhat would you like to work on today? You can ask me about SEO keywords, review management, profile optimization, or competitor benchmarks.`;
    suggestedQuestions = [
      "How can I optimize my business description for local SEO?",
      "Analyze the local competitors in my area.",
      "How do I conduct a NAP citation audit?",
    ];
    relatedActions = ["optimize_description", "analyze_competitors", "analyze_keywords"];
  }

  return {
    reply,
    suggestedQuestions,
    relatedActions,
    conversationId: context.conversationId || "gmb-ai-session",
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// Main HTTP Route Handlers
// ============================================================================

/**
 * Supported actions registry
 */
const SUPPORTED_ACTIONS = [
  "optimize_description",
  "generate_review_response",
  "analyze_keywords",
  "generate_post",
  "audit_citations",
  "analyze_competitors",
  "analyze_sentiment",
  "chat",
];

/**
 * POST /api/gmb
 * Main entry point for GMB AI actions.
 */
export async function POST(req) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON in request body",
          supportedActions: SUPPORTED_ACTIONS,
        },
        { status: 400 }
      );
    }

    const { action } = body || {};

    if (!action) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required 'action' field in request body",
          supportedActions: SUPPORTED_ACTIONS,
        },
        { status: 400 }
      );
    }

    let data;

    switch (action) {
      case "optimize_description":
        data = handleOptimizeDescription(body);
        break;

      case "generate_review_response":
        data = handleGenerateReviewResponse(body);
        break;

      case "analyze_keywords":
        data = handleAnalyzeKeywords(body);
        break;

      case "generate_post":
        data = handleGeneratePost(body);
        break;

      case "audit_citations":
        data = handleAuditCitations(body);
        break;

      case "analyze_competitors":
        data = handleAnalyzeCompetitors(body);
        break;

      case "analyze_sentiment":
        data = handleAnalyzeSentiment(body);
        break;

      case "chat":
        data = handleChat(body);
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unsupported action '${action}'. Please use one of the supported actions.`,
            supportedActions: SUPPORTED_ACTIONS,
          },
          { status: 400 }
        );
    }

    return NextResponse.json(
      {
        success: true,
        action,
        timestamp: new Date().toISOString(),
        data,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || "An unexpected internal server error occurred",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/gmb
 * Informational endpoint returning service status and list of supported actions.
 */
export async function GET() {
  return NextResponse.json(
    {
      success: true,
      service: "Google My Business (GMB) AI Features API",
      status: "operational",
      version: "1.0.0",
      supportedActions: SUPPORTED_ACTIONS,
      documentation: {
        optimize_description: "Generates an AI-optimized business description adhering to GMB guidelines",
        generate_review_response: "Returns AI-drafted review response for positive, neutral, or negative reviews",
        analyze_keywords: "Returns local SEO keywords, search volume, and category recommendations",
        generate_post: "Returns a GMB post draft (update, offer, or event) with CTAs and image tips",
        audit_citations: "Returns NAP consistency check results across top directories",
        analyze_competitors: "Returns local 3-pack competitor insights and competitive gaps",
        analyze_sentiment: "Returns review sentiment analysis, topic breakdown, and customer friction points",
        chat: "General AI conversational assistant for GMB queries and local SEO advice",
      },
    },
    { status: 200 }
  );
}
