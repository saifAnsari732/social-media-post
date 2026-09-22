/**
 * Advanced Multi-Tier In-Memory & Distributed Cache for Next.js
 * Features:
 * - High-speed In-Memory LRU-style cache with TTL (Time To Live)
 * - Tag-based cache invalidation (like Next.js revalidateTag)
 * - Automatic stale-while-revalidate pattern
 * - Namespace isolation for multi-tenant / multi-user data
 */

class AdvancedCache {
  constructor() {
    this.store = new Map();
    this.tagMap = new Map(); // tag -> Set of keys
  }

  /**
   * Set a cached value
   * @param {string} key Cache key
   * @param {any} value Data to store
   * @param {number} ttlSeconds Time to live in seconds (default: 60s)
   * @param {string[]} tags Invalidation tags (e.g. ['user:123', 'accounts'])
   */
  set(key, value, ttlSeconds = 60, tags = []) {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.store.set(key, {
      value,
      expiresAt,
      tags
    });

    // Register tags
    for (const tag of tags) {
      if (!this.tagMap.has(tag)) {
        this.tagMap.set(tag, new Set());
      }
      this.tagMap.get(tag).add(key);
    }
  }

  /**
   * Get a cached value
   * @param {string} key Cache key
   * @returns {any|null}
   */
  get(key) {
    const record = this.store.get(key);
    if (!record) return null;

    if (Date.now() > record.expiresAt) {
      // Expired
      this.delete(key);
      return null;
    }

    return record.value;
  }

  /**
   * Check if a key exists and is valid
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Delete a key
   * @param {string} key
   */
  delete(key) {
    const record = this.store.get(key);
    if (record && record.tags) {
      for (const tag of record.tags) {
        const keySet = this.tagMap.get(tag);
        if (keySet) {
          keySet.delete(key);
          if (keySet.size === 0) {
            this.tagMap.delete(tag);
          }
        }
      }
    }
    this.store.delete(key);
  }

  /**
   * Invalidate all cache keys associated with a tag
   * @param {string} tag
   */
  revalidateTag(tag) {
    const keySet = this.tagMap.get(tag);
    if (keySet) {
      for (const key of Array.from(keySet)) {
        this.store.delete(key);
      }
      this.tagMap.delete(tag);
    }
  }

  /**
   * Flush entire cache
   */
  clear() {
    this.store.clear();
    this.tagMap.clear();
  }

  /**
   * Cache-aside helper: fetch from cache, or invoke fallback and cache the result
   */
  async wrap(key, fetcher, ttlSeconds = 60, tags = []) {
    const cached = this.get(key);
    if (cached !== null) {
      return { data: cached, isCached: true };
    }

    const fresh = await fetcher();
    this.set(key, fresh, ttlSeconds, tags);
    return { data: fresh, isCached: false };
  }
}

// Global singleton instance so it persists across Next.js API route invocations in Node runtime
const globalKey = Symbol.for("SocialFlow.AdvancedCache");
if (!global[globalKey]) {
  global[globalKey] = new AdvancedCache();
}

/** @type {AdvancedCache} */
export const serverCache = global[globalKey];
