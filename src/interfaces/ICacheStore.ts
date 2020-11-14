export interface ICacheStore {
  /**
   * Get the corresponding value for the key.
   * @param key the cache key
   */
  getItem(key: string): Promise<string | null> | string | null;

  /**
   * Store the value with the corresponding key.
   * @param key the cache key
   * @param value the serialized value
   */
  setItem(key: string, value: string): Promise<void> | void;

  /**
   * Remove the corresponding key/value pair from the store.
   * @param key the cache key
   */
  removeItem(key: string): Promise<void> | void;

  /**
   * Retrieve all of the keys from the store.
   */
  getAllKeys(): Promise<Array<string>> | Array<string>;

  /**
   * Retrieve all of the key/value pairs that correspond to the cache keys.
   * @param keys the array of cache keys
   */
  multiGet(keys: Array<string>): Promise<Array<[string, string]>> | Array<[string, string]>;

  /**
   * Add the key/value pairs to the store.
   * @param keyValuePairs the array of key/value pairs to set
   */
  multiSet(keyValuePairs: Array<[string, string]>): Promise<void> | void;

  /**
   * Remove the key/value pairs that correspond to the array of cache keys.
   * @param keys the array of cache keys
   */
  multiRemove(keys: Array<string>): Promise<void> | void;
}
