import { getDb } from "../db"; // Need to export getDb from db.js or re-implement

export async function matchRule(accountId, platform, type, text) {
  const { MongoClient } = await import("mongodb");
  // Temporary workaround: connect directly since getDb isn't exported from db.js
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();

  try {
    // 1. Get all active rules for this account
    const rules = await db.collection("rules").find({ 
      account: accountId, 
      status: "active",
      $or: [{ type: type }, { type: "both" }],
      $or: [{ platform: platform }, { platform: "both" }]
    }).toArray();

    if (!rules || rules.length === 0) return null;

    const lowerText = text ? text.toLowerCase() : "";

    // 2. Filter matching rules
    const matchedRules = rules.filter(rule => {
      const trigger = rule.trigger;
      
      // If "any_message", it always matches
      if (!trigger.keywords || trigger.keywords.length === 0) return true;

      // Check keywords
      if (trigger.keywordMatchType === 'any') {
        return trigger.keywords.some(kw => 
          trigger.caseSensitive ? text.includes(kw) : lowerText.includes(kw.toLowerCase())
        );
      } else if (trigger.keywordMatchType === 'all') {
        return trigger.keywords.every(kw => 
          trigger.caseSensitive ? text.includes(kw) : lowerText.includes(kw.toLowerCase())
        );
      } else if (trigger.keywordMatchType === 'exact') {
         return trigger.caseSensitive ? text === trigger.keywords[0] : lowerText === trigger.keywords[0].toLowerCase();
      }

      return false;
    });

    if (matchedRules.length === 0) return null;

    // 3. Sort by priority (if we had it, for now just return the first one)
    // matchedRules.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    return matchedRules[0];
  } finally {
    await client.close();
  }
}
