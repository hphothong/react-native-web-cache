export interface ICache {
  getAsync<T>(key: string, dataFallback?: () => Promise<T>): Promise<T | null>;
  setAsync<T>(key: string, value: T): Promise<void>;
  removeAsync(key: string): Promise<void>;
  removeAllAsync(): Promise<void>;
}
