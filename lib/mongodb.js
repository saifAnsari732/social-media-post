import { MongoClient } from "mongodb";

const fallbackStore = {
  accounts: [
    {
      _id: "mock_meta_1",
      userId: "saif@example.com",
      platform: "instagram",
      name: "Saif Studio",
      accessToken: "demo-token",
      connectedAt: new Date().toISOString(),
      providerAccountId: "mock_meta_1"
    },
    {
      _id: "mock_fb_1",
      userId: "saif@example.com",
      platform: "facebook",
      name: "Saif Business Page",
      accessToken: "demo-token",
      connectedAt: new Date().toISOString(),
      providerAccountId: "mock_fb_1"
    }
  ],
  rules: [],
  conversations: [],
  posts: [],
  webhook_logs: [],
  settings: [{ _id: "default", geminiApiKey: "", theme: "dark" }]
};

const isMongoAvailable = Boolean(process.env.DATABASE_URL);

const matchesFilter = (item, filter = {}) => {
  return Object.entries(filter).every(([key, value]) => {
    const itemValue = item?.[key];

    if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
      if (value.$ne !== undefined) return itemValue !== value.$ne;
      if (value.$in && Array.isArray(value.$in)) return value.$in.includes(itemValue);
    }

    if (itemValue && typeof itemValue === "object" && typeof itemValue.toString === "function" && value && typeof value.toString === "function") {
      return itemValue.toString() === value.toString();
    }

    return itemValue === value;
  });
};

const toArrayFromCollection = (name, filter = {}, options = {}) => {
  const items = (fallbackStore[name] || []).filter((item) => matchesFilter(item, filter));
  if (options.sort) {
    const [[sortKey, direction]] = Object.entries(options.sort);
    items.sort((a, b) => {
      const av = a?.[sortKey];
      const bv = b?.[sortKey];
      const result = (av || "") > (bv || "") ? 1 : -1;
      return direction === -1 ? -result : result;
    });
  }
  return items;
};

const fallbackDb = {
  collection(name) {
    const list = fallbackStore[name] || [];
    return {
      async find(filter = {}) {
        const items = toArrayFromCollection(name, filter);
        return {
          sort(sortValue = {}) {
            return {
              async toArray() {
                return toArrayFromCollection(name, filter, { sort: sortValue });
              }
            };
          },
          async toArray() {
            return items;
          }
        };
      },
      async findOne(filter = {}) {
        return (fallbackStore[name] || []).find((item) => matchesFilter(item, filter)) || null;
      },
      async insertOne(doc) {
        const nextDoc = { ...doc, _id: doc._id || `mock_${name}_${Date.now()}_${Math.random().toString(16).slice(2)}` };
        fallbackStore[name] = [...(fallbackStore[name] || []), nextDoc];
        return { insertedId: nextDoc._id };
      },
      async updateOne(filter, update, options = {}) {
        const current = (fallbackStore[name] || []).find((item) => matchesFilter(item, filter));
        if (current) {
          const merged = { ...current };
          const sets = update?.$set || {};
          const pushOps = update?.$push || {};
          const next = { ...merged, ...sets };
          Object.entries(pushOps).forEach(([key, value]) => {
            const source = next[key] || [];
            next[key] = Array.isArray(value) ? [...source, ...value] : [...source, value];
          });
          fallbackStore[name] = (fallbackStore[name] || []).map((item) => matchesFilter(item, filter) ? next : item);
          return { matchedCount: 1, modifiedCount: 1, upsertedId: null };
        }

        if (options.upsert) {
          const upserted = { ...filter, ...update?.$set };
          fallbackStore[name] = [...(fallbackStore[name] || []), upserted];
          return { matchedCount: 0, modifiedCount: 1, upsertedId: upserted._id || `mock_${name}_${Date.now()}` };
        }

        return { matchedCount: 0, modifiedCount: 0, upsertedId: null };
      },
      async deleteOne(filter = {}) {
        const before = (fallbackStore[name] || []).length;
        fallbackStore[name] = (fallbackStore[name] || []).filter((item) => !matchesFilter(item, filter));
        return { deletedCount: before - (fallbackStore[name] || []).length };
      },
      async countDocuments(filter = {}) {
        return toArrayFromCollection(name, filter).length;
      }
    };
  },
  async db() {
    return this;
  }
};

let clientPromise;

if (isMongoAvailable) {
  const uri = process.env.DATABASE_URL;
  const client = new MongoClient(uri, {});
  clientPromise = client.connect();
} else {
  clientPromise = Promise.resolve(fallbackDb);
}

export default clientPromise;
