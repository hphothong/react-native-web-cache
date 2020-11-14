import { ICacheStore } from "../interfaces";

export class MockCacheStore implements ICacheStore {
  private cache: { [key: string]: string };

  public constructor() {
    this.cache = {};
  }

  public getItem(key: string): string | null {
    return this.cache[key] ?? null;
  }

  public setItem(key: string, value: string): void {
    this.cache[key] = value;
  }

  public removeItem(key: string): void {
    delete this.cache[key];
  }

  public getAllKeys(): string[] {
    return Object.keys(this.cache);
  }

  public multiGet(keys: string[]): Array<[string, string]> {
    const results: Array<[string, string]> = [];
    for (const key in keys) {
      results.push([key, this.cache[key] ?? null]);
    }
    return results;
  }

  public multiSet(keyValuePairs: Array<[string, string]>): void {
    for (const tuple in keyValuePairs) {
      this.cache[tuple[0]] = tuple[1];
    }
  }

  public multiRemove(keys: string[]): void {
    for (const key in keys) {
      delete this.cache[key];
    }
  }
}
