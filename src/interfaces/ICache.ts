export interface ICache {
  getAsync<T>(key: string): Promise<T | null>;
  setAsync<T>(key: string, value: T): Promise<void>;
}
