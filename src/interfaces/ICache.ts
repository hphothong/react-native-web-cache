export interface ICache {
  /**
   * Retrieve the value corresponding to the key provided. If there is no value
   * that corresponds to the key provided, then the result will be null.
   * @param key the cache key to fetch
   */
  getAsync<T>(key: string): Promise<T | null>;

  /**
   * Retrieve the value corresponding to the key provided. If there is no value
   * that corresponds to the key provided, then the dataFallback function will
   * be called to populate the cache.
   * @param key the cache key to fetch
   * @param dataFallback the callback used to populate the cache if the key does not exist
   */
  getAsync<T>(key: string, dataFallback: () => Promise<T>): Promise<T>;

  /**
   * Retrieve all of the cache values for the keys provided.
   * @param keys the list of cache keys to retrieve
   */
  getAllAsync<T>(keys: Array<string>): Promise<{ [cacheKey: string]: T | null }>;

  /**
   * Add the value to the cache with the provided key.
   * @param key the cache key to use to index the value
   * @param value the value to store in the cache
   */
  setAsync<T>(key: string, value: T): Promise<void>;

  /**
   * Add all of the values to the cache using their current keys.
   * @param values the object to iterate through to store values
   */
  setAllAsync<T>(values: { [cacheKey: string]: T }): Promise<void>;

  /**
   * Remove a key/value pair from the cache.
   * @param key the cache key to remove from the store
   */
  removeAsync(key: string): Promise<void>;

  /**
   * Remove all of the key/value pairs from the cache.
   */
  removeAllAsync(): Promise<void>;
}
