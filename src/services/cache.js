/**
 * PNG cache service
 */

const { CACHE_TTL } = require("../config/constants");

/** Maximum number of entries in the cache to prevent memory exhaustion */
const MAX_CACHE_SIZE = 1000;

/** In-memory cache for PNG images */
const pngCache = new Map();

/**
 * Generate a cache key from request query parameters
 * @param {Object} req - Express request object
 * @returns {string} Cache key
 */
function getCacheKey(req) {
  const params = new URLSearchParams(req.query);
  params.sort();
  return params.toString();
}

/**
 * Get cached PNG buffer if valid
 * @param {string} key - Cache key
 * @returns {Buffer|null} Cached buffer or null
 */
function getFromCache(key) {
  const cached = pngCache.get(key);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.buffer;
  }
  return null;
}

/**
 * Store PNG buffer in cache with LRU eviction
 * @param {string} key - Cache key
 * @param {Buffer} buffer - PNG buffer
 */
function setInCache(key, buffer) {
  // Evict oldest entries if cache is full
  if (pngCache.size >= MAX_CACHE_SIZE) {
    // Find and delete oldest entry
    let oldestKey = null;
    let oldestTime = Infinity;

    for (const [k, v] of pngCache.entries()) {
      if (v.timestamp < oldestTime) {
        oldestTime = v.timestamp;
        oldestKey = k;
      }
    }

    if (oldestKey) {
      pngCache.delete(oldestKey);
    }
  }

  pngCache.set(key, {
    buffer,
    timestamp: Date.now(),
  });
}

/**
 * Cleanup expired cache entries
 */
function cleanupCache() {
  const now = Date.now();
  for (const [key, value] of pngCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      pngCache.delete(key);
    }
  }
}

/**
 * Start the cache cleanup interval
 * @returns {NodeJS.Timer} Interval handle
 */
function startCacheCleanup() {
  return setInterval(cleanupCache, CACHE_TTL);
}

/**
 * Get cache statistics
 * @returns {Object} Cache stats
 */
function getCacheStats() {
  return {
    size: pngCache.size,
    maxSize: MAX_CACHE_SIZE,
    ttl: CACHE_TTL,
  };
}

module.exports = {
  getCacheKey,
  getFromCache,
  setInCache,
  cleanupCache,
  startCacheCleanup,
  getCacheStats,
  MAX_CACHE_SIZE,
};
