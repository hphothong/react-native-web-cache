export interface ICacheEntry<T> {
  /**
   * The time value in milliseconds
   */
  expiration: number | undefined;

  /**
   * The value to add to the cache.
   */
  value: T;
}
