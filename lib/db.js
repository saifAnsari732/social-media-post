import clientPromise from "./mongodb";

async function getDb() {
  const client = await clientPromise;
  return client.db();
}

// ── ACCOUNTS ──

export async function getAccounts(userId) {
  const db = await getDb();
  const filter = userId ? { userId } : {};
  return db.collection("accounts").find(filter).toArray();
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
  return db.collection("rules").find({ user: userId }).toArray();
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
  // Simple fetch for now. In real app, we'd filter by accounts belonging to user
  const db = await getDb();
  return db.collection("conversations").find({}).sort({ lastMessageAt: -1 }).toArray();
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

// Keep old method for backward compatibility if needed
export async function addPost(post) {
  const db = await getDb();
  await db.collection("posts").insertOne(post);
  return post;
}
