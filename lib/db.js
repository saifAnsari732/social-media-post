import clientPromise from "./mongodb";

async function getDb() {
  const client = await clientPromise;
  return client.db();
}

// ── USERS ──
export async function upsertUser(user) {
  const db = await getDb();
  
  // Set role: Saif is Admin, everyone else is User
  const emailLower = (user.email || "").toLowerCase().trim();
  const isAdminUser = 
    emailLower.includes("ansari") || 
    emailLower.includes("saif") || 
    emailLower === "ansarisaifuddin732@gmail.com" ||
    emailLower.includes("admin");

  const existingUser = await db.collection("users").findOne({ email: emailLower });
  const role = existingUser?.role || (isAdminUser ? "admin" : "user");
  const plan = existingUser?.plan || user.plan || "Starter";

  const userDoc = {
    ...user,
    email: emailLower,
    role,
    plan,
    updatedAt: new Date().toISOString()
  };

  await db.collection("users").updateOne(
    { email: emailLower },
    { $set: userDoc },
    { upsert: true }
  );
  return db.collection("users").findOne({ email: emailLower });
}

export async function getUserById(userId) {
  const db = await getDb();
  return db.collection("users").findOne({ userId });
}

export async function updateUserPlan(userId, planName, transactionDetails = {}) {
  const db = await getDb();
  await db.collection("users").updateOne(
    { userId },
    { 
      $set: { 
        plan: planName,
        planUpdatedAt: new Date().toISOString()
      } 
    }
  );

  // Record transaction in billing_history collection
  if (transactionDetails.orderId || transactionDetails.paymentId) {
    await db.collection("billing_history").insertOne({
      userId,
      planName,
      ...transactionDetails,
      createdAt: new Date().toISOString()
    });
  }

  return db.collection("users").findOne({ userId });
}

export async function getUserBillingHistory(userId) {
  const db = await getDb();
  return db.collection("billing_history").find({ userId }).sort({ createdAt: -1 }).toArray();
}

export async function getAllUsers() {
  const db = await getDb();
  return db.collection("users").find({}).sort({ createdAt: -1 }).toArray();
}

export async function getAdminStats() {
  const db = await getDb();
  const [totalUsers, totalPosts, totalAccounts, totalRules] = await Promise.all([
    db.collection("users").countDocuments(),
    db.collection("posts").countDocuments(),
    db.collection("accounts").countDocuments(),
    db.collection("rules").countDocuments()
  ]);

  return {
    totalUsers,
    totalPosts,
    totalAccounts,
    totalRules
  };
}

// ── ACCOUNTS ──

export async function getAccounts(userId) {
  const db = await getDb();
  let accounts = [];
  if (!userId) {
    accounts = await db.collection("accounts").find({}).toArray();
  } else {
    accounts = await db.collection("accounts").find({ userId }).toArray();
    if (accounts.length === 0) {
      const userDoc = await db.collection("users").findOne({ userId });
      const isAdmin = userDoc?.role === "admin" || (userDoc?.email && (userDoc.email.includes("ansari") || userDoc.email.includes("saif")));
      if (isAdmin) {
        accounts = await db.collection("accounts").find({
          $or: [
            { userId: "eb994f0c8e6f7fb4c2629561" },
            { userId: "f4ec583336e491d21d8f7f55" },
            { userId: { $exists: false } }
          ]
        }).toArray();
      }
    }
  }

  // Deduplicate by platform + account name
  const uniqueMap = new Map();
  accounts.forEach(acc => {
    const key = `${acc.platform || ''}:${(acc.name || acc.providerAccountId || '').toLowerCase().trim()}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, acc);
    }
  });

  return Array.from(uniqueMap.values());
}

export async function getAccountById(id) {
  const db = await getDb();
  const { ObjectId } = await import("mongodb");
  return db.collection("accounts").findOne({ _id: new ObjectId(id) });
}

export async function upsertAccount(account) {
  const db = await getDb();

  if (!account.providerAccountId) {
    account.providerAccountId = `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  const filter = { platform: account.platform, providerAccountId: account.providerAccountId };
  if (account.userId) {
    filter.userId = account.userId;
  }

  await db.collection("accounts").updateOne(
    filter,
    { $set: account },
    { upsert: true }
  );
  return account;
}

export async function removeAccount(id, userId) {
  const db = await getDb();
  const { ObjectId } = await import("mongodb");
  try {
    const filter = { _id: new ObjectId(id) };
    if (userId) filter.userId = userId;
    await db.collection("accounts").deleteOne(filter);
  } catch (e) {
    const filter = { platform: id };
    if (userId) filter.userId = userId;
    await db.collection("accounts").deleteOne(filter);
  }
}

// ── RULES ──

export async function getRules(userId) {
  const db = await getDb();
  if (!userId) return db.collection("rules").find({}).toArray();
  let rules = await db.collection("rules").find({
    $or: [{ user: userId }, { userId: userId }]
  }).toArray();

  if (rules.length === 0) {
    const userDoc = await db.collection("users").findOne({ userId });
    const isAdmin = userDoc?.role === "admin" || (userDoc?.email && (userDoc.email.includes("ansari") || userDoc.email.includes("saif")));
    if (isAdmin) {
      rules = await db.collection("rules").find({}).toArray();
    }
  }
  return rules;
}

export async function getRuleById(id) {
  const db = await getDb();
  const { ObjectId } = await import("mongodb");
  return db.collection("rules").findOne({ _id: new ObjectId(id) });
}

export async function createRule(ruleData) {
  const db = await getDb();
  ruleData.createdAt = new Date().toISOString();
  ruleData.updatedAt = new Date().toISOString();
  if (!ruleData.stats) {
    ruleData.stats = { totalTriggered: 0, totalRepliesSent: 0, totalFailed: 0 };
  }
  const result = await db.collection("rules").insertOne(ruleData);
  return { ...ruleData, _id: result.insertedId };
}

export async function updateRule(id, updates) {
  const db = await getDb();
  const { ObjectId } = await import("mongodb");
  updates.updatedAt = new Date().toISOString();
  await db.collection("rules").updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );
  return getRuleById(id);
}

export async function deleteRule(id) {
  const db = await getDb();
  const { ObjectId } = await import("mongodb");
  await db.collection("rules").deleteOne({ _id: new ObjectId(id) });
}

// ── INBOX & CONVERSATIONS ──

export async function getConversations(userId) {
  const db = await getDb();
  return db.collection("conversations").find(userId ? { userId } : {}).sort({ lastMessageAt: -1 }).toArray();
}

export async function upsertConversation(convData) {
  const db = await getDb();
  const filter = { externalId: convData.externalId }; // Meta thread ID
  
  // If no externalId (e.g. manual creation), insert new
  if (!convData.externalId) {
     convData.createdAt = new Date().toISOString();
     const res = await db.collection("conversations").insertOne(convData);
     return { ...convData, _id: res.insertedId };
  }

  const existing = await db.collection("conversations").findOne(filter);
  if (existing) {
    // Append new messages, update lastMessageAt
    await db.collection("conversations").updateOne(filter, { 
      $set: { 
        lastMessageAt: convData.lastMessageAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      $push: { messages: { $each: convData.messages || [] } }
    });
    return await db.collection("conversations").findOne(filter);
  } else {
    convData.createdAt = new Date().toISOString();
    convData.updatedAt = new Date().toISOString();
    await db.collection("conversations").insertOne(convData);
    return convData;
  }
}

// ── LOGS & WEBHOOKS ──

export async function logWebhookEvent(logData) {
  const db = await getDb();
  logData.receivedAt = new Date().toISOString();
  await db.collection("webhook_logs").insertOne(logData);
}

export async function getPosts(userId) {
  const db = await getDb();
  if (!userId) return db.collection("posts").find({}).sort({ createdAt: -1 }).toArray();
  
  let posts = await db.collection("posts").find({ userId }).sort({ createdAt: -1 }).toArray();
  if (posts.length === 0) {
    const userDoc = await db.collection("users").findOne({ userId });
    const isAdmin = userDoc?.role === "admin" || (userDoc?.email && (userDoc.email.includes("ansari") || userDoc.email.includes("saif")));
    if (isAdmin) {
      posts = await db.collection("posts").find({
        $or: [
          { userId: "eb994f0c8e6f7fb4c2629561" },
          { userId: "f4ec583336e491d21d8f7f55" },
          { userId: { $exists: false } }
        ]
      }).sort({ createdAt: -1 }).toArray();
    }
  }
  return posts;
}

export async function addPost(post) {
  const db = await getDb();
  await db.collection("posts").insertOne(post);
  return post;
}

export async function updatePost(id, updates) {
  const db = await getDb();
  const { ObjectId } = await import("mongodb");
  let filter = { id: id };
  try {
    if (ObjectId.isValid(id)) {
      filter = { $or: [{ _id: new ObjectId(id) }, { id: id }] };
    }
  } catch (e) {}

  await db.collection("posts").updateOne(
    filter,
    { $set: updates }
  );
  return db.collection("posts").findOne(filter);
}

export async function deletePost(id, userId) {
  const db = await getDb();
  const { ObjectId } = await import("mongodb");
  let filter = { id: id };
  try {
    if (ObjectId.isValid(id)) {
      filter = { $or: [{ _id: new ObjectId(id) }, { id: id }] };
    }
  } catch (e) {}
  if (userId) filter.userId = userId;
  await db.collection("posts").deleteOne(filter);
}
