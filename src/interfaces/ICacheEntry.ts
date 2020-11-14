export interface ICacheEntry<T> {
  /**
   * The date that the cache value will expire.
   */
  expiration: Date | undefined;

  /**
   * The value to add to the cache.
   */
  value: T;
}
