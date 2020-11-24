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
    if (entry.expiration && entry.expiration < new Date()) {
      await this.remove;
    }

    await this.updateEntry(cacheKey);
    await this.setAsync(cacheKey, entry.value);
    return entry.value;
  }

  public async setAsync<T>(key: string, value: T): Promise<void> {
    const cacheKey: string = this.convert(key).toCacheKey();

    let expiration: Date | undefined;
    if (this.ttl) {
      expiration = new Date();
      expiration.setSeconds(expiration.getSeconds() + this.ttl);
    }

    const cacheEntry: ICacheEntry<T> = { value, expiration };
    await this.store.setItem(cacheKey, JSON.stringify(cacheEntry));
    return this.addEntry(cacheKey);
  }

  private async getEntries(): Promise<Array<string>> {
    const cacheKey: string = this.convert(this.entriesKey).toCacheKey();
    const entries: string | null = await this.store.getItem(cacheKey);
    return entries === null ? [] : JSON.parse(entries);
  }

  private async setEntries(entries: Array<string>): Promise<void> {
    const cacheKey: string = this.convert(this.entriesKey).toCacheKey();
    return this.store.setItem(cacheKey, JSON.stringify(entries));
  }

  private async addEntry(entry: string): Promise<void> {
    let entries: Array<string> = await this.getEntries();
    entries = entries.filter((value: string): boolean => value !== entry);
    entries.push(entry);

    if (entries.length > this.capacity) {
      const entriesToRemoveCount: number = entries.length - this.capacity;
      const entriesToRemove: Array<string> = entries.splice(0, entriesToRemoveCount);

      const entryRemovals: Array<Promise<void>> = [];
      entriesToRemove.forEach((entry: string) => entryRemovals.push(this.store.removeItem(entry)));

      await Promise.all(entryRemovals);
    }

    return this.setEntries(entries);
  }

  private async updateEntry(key: string): Promise<void> {
    const entries: Array<string> = await this.getEntries();
    const updatedEntries: Array<string> = entries.filter((entryKey: string): boolean => entryKey !== key);
    updatedEntries.push(key);
    return this.setEntries(updatedEntries);
  }

  private convert(value: string) {
    return {
      toCacheKey: (): string => (this.namespace ? `${this.namespace}:${value}` : value),
      toKey: (): string => value.replace(`${this.namespace}:`, ""),
    };
  }
}
