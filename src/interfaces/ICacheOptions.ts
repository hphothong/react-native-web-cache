import { ICacheStore } from "./ICacheStore";

export interface ICacheOptions {
  /**
   * The maximum number of cache keys that can be held.
   */
  capacity: number;

  /**
   * The number of seconds that the cache entry is valid (Time-To-Live).
   * If the TTL value is not provided, or is set to undefined, then the cache entries will never expire.
   */
  ttl?: number;

  /**
   * The namespace to that the cache key will be appended to.
   */
  namespace?: string;

  /**
   * The store that will be used for the cache.
   */
  store?: ICacheStore;

  /**
   * The key used to access the cache LRU list of cache keys. This key will be appended to the namespace if one is provided.
   */
  entriesKey?: string;
}
