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
  await db.collection("accounts").updateOne(
    { platform: account.platform },
    { $set: account },
    { upsert: true }
  );
  return account;
}

export async function removeAccount(platform) {
  const db = await getDb();
  await db.collection("accounts").deleteOne({ platform });
}

export async function addPost(post) {
  const db = await getDb();
  await db.collection("posts").insertOne(post);
  return post;
}
