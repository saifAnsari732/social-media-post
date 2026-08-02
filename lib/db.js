import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

function ensureDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ accounts: [], posts: [] }, null, 2));
  }
}

export function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

export function writeDb(data) {
  ensureDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function getAccounts() {
  return readDb().accounts;
}

export function upsertAccount(account) {
  const db = readDb();
  const idx = db.accounts.findIndex((a) => a.platform === account.platform);
  if (idx >= 0) db.accounts[idx] = { ...db.accounts[idx], ...account };
  else db.accounts.push(account);
  writeDb(db);
  return account;
}

export function removeAccount(platform) {
  const db = readDb();
  db.accounts = db.accounts.filter((a) => a.platform !== platform);
  writeDb(db);
}

export function addPost(post) {
  const db = readDb();
  db.posts.unshift(post);
  writeDb(db);
  return post;
}
