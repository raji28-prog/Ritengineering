/**
 * RITW CMS - In-Memory Cache Service with Instant Invalidation
 */
class MemoryCache {
    constructor() {
        this.cache = new Map();
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        if (Date.now() > item.expiresAt) {
            this.cache.delete(key);
            return null;
        }
        return item.value;
    }

    set(key, value, ttlMs = 60000) { // Default 60 seconds
        this.cache.set(key, {
            value,
            expiresAt: Date.now() + ttlMs
        });
    }

    delete(key) {
        this.cache.delete(key);
    }

    clear() {
        this.cache.clear();
        console.log('[RITW CMS Cache] Cache invalidated. New changes will be served fresh.');
    }
}

const cache = new MemoryCache();
module.exports = cache;
