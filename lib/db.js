import clientPromise from "./mongodb";

async function getDb() {
  const client = await clientPromise;
  return client.db();
}

export async function getAccounts() {
  const db = await getDb();
  return db.collection("accounts").find({}).toArray();
}

export async function upsertAccount(account) {
  const db = await getDb();
  
  if (!account.providerAccountId) {
    account.providerAccountId = `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  await db.collection("accounts").updateOne(
    { platform: account.platform, providerAccountId: account.providerAccountId },
    { $set: account },
    { upsert: true }
  );
  return account;
}

export async function removeAccount(id) {
  const db = await getDb();
  const { ObjectId } = require("mongodb");
  try {
    await db.collection("accounts").deleteOne({ _id: new ObjectId(id) });
  } catch(e) {
    await db.collection("accounts").deleteOne({ platform: id });
  }
}

export async function addPost(post) {
  const db = await getDb();
  await db.collection("posts").insertOne(post);
  return post;
}
