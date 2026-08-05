import clientPromise from "./mongodb";

async function getDb() {
  const client = await clientPromise;
  return client.db();
}

export async function getAccounts(userId) {
  const db = await getDb();
  const filter = userId ? { userId } : {};
  return db.collection("accounts").find(filter).toArray();
}

export async function upsertAccount(account) {
  const db = await getDb();

  if (!account.providerAccountId) {
    account.providerAccountId = `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  const filter = { platform: account.platform, providerAccountId: account.providerAccountId };
  // If userId provided, scope to that user to avoid overwriting another user's account
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

export async function addPost(post) {
  const db = await getDb();
  await db.collection("posts").insertOne(post);
  return post;
}
