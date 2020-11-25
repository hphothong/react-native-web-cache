import { ICache, ICacheEntry, ICacheOptions, ICacheStore } from "../interfaces";
import { MemoryCacheStore } from "./memory-cache-store";

const DEFAULT_ENTRIES_KEY = "__CACHE_KEY__";

export class Cache implements ICache {
  private readonly capacity: number;
  private readonly store: ICacheStore;
  private readonly ttl: number | undefined;
  private readonly namespace: string | undefined;
  private readonly entriesKey: string;

  public constructor({ capacity, store, ttl, namespace, entriesKey }: ICacheOptions) {
    this.capacity = capacity;
    this.store = store ?? new MemoryCacheStore();
    this.ttl = ttl;
    this.namespace = namespace;
    this.entriesKey = entriesKey ?? DEFAULT_ENTRIES_KEY;
  }

  public async getAsync<T>(key: string): Promise<T | null> {
    const cacheKey: string = this.convert(key).toCacheKey();
    const serializedEntry: string | null = await this.store.getItem(cacheKey);

    if (serializedEntry === null) {
      return null;
    }

    const entry: ICacheEntry<T> = JSON.parse(serializedEntry);
    if (entry.expiration && entry.expiration < new Date().getTime()) {
      const removePromise: Promise<void> = this.removeAsync(key);
      const removeEntryPromise: Promise<void> = this.removeEntryAsync(cacheKey);
      await Promise.all([removePromise, removeEntryPromise]);
      return null;
    }

    const updatePromise: Promise<void> = this.updateEntryAsync(cacheKey);
    const setPromise: Promise<void> = this.setAsync(cacheKey, entry.value);
    await Promise.all([updatePromise, setPromise]);

    return entry.value;
  }

  public async removeAsync(key: string): Promise<void> {
    const cacheKey: string = this.convert(key).toCacheKey();
    return this.store.removeItem(cacheKey);
  }

  public async setAsync<T>(key: string, value: T): Promise<void> {
    const cacheKey: string = this.convert(key).toCacheKey();

    let expiration: number | undefined;
    if (this.ttl) {
      expiration = new Date().getTime() + this.ttl;
    }

    const cacheEntry: ICacheEntry<T> = { value, expiration };
    await this.store.setItem(cacheKey, JSON.stringify(cacheEntry));
    return this.addEntryAsync(cacheKey);
  }

  private async getEntriesAsync(): Promise<Array<string>> {
    const cacheKey: string = this.convert(this.entriesKey).toCacheKey();
    const entries: string | null = await this.store.getItem(cacheKey);
    return entries === null ? [] : JSON.parse(entries);
  }

  private async setEntriesAsync(entries: Array<string>): Promise<void> {
    const cacheKey: string = this.convert(this.entriesKey).toCacheKey();
    return this.store.setItem(cacheKey, JSON.stringify(entries));
  }

  private async addEntryAsync(entry: string): Promise<void> {
    let entries: Array<string> = await this.getEntriesAsync();
    entries = entries.filter((value: string): boolean => value !== entry);
    entries.push(entry);

    if (entries.length > this.capacity) {
      const entriesToRemoveCount: number = entries.length - this.capacity;
      const entriesToRemove: Array<string> = entries.splice(0, entriesToRemoveCount);

      const entryRemovals: Array<Promise<void>> = [];
      entriesToRemove.forEach((entry: string) => entryRemovals.push(this.store.removeItem(entry)));

      await Promise.all(entryRemovals);
    }

    return this.setEntriesAsync(entries);
  }

  private async removeEntryAsync(key: string): Promise<void> {
    let entries: Array<string> = await this.getEntriesAsync();
    entries = entries.filter((entryKey: string): boolean => entryKey !== key);
    return this.setEntriesAsync(entries);
  }

  private async updateEntryAsync(key: string): Promise<void> {
    let entries: Array<string> = await this.getEntriesAsync();
    entries = entries.filter((entryKey: string): boolean => entryKey !== key);
    entries.push(key);
    return this.setEntriesAsync(entries);
  }

  private convert(value: string) {
    return {
      toCacheKey: (): string => (this.namespace ? `${this.namespace}:${value}` : value),
    };
  }
}
